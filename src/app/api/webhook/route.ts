import { prisma } from "@/lib/prisma";
import { getStripe } from "@/utils/utils";
import { headers } from "next/headers";

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
        return Response.json(
            { message: "Missing stripe-signature header", code: "MISSING_SIGNATURE" },
            { status: 400 }
        );
    }

    const stripe = getStripe();
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        return Response.json(
            { message: `Webhook Error: ${err.message}`, code: 'WEBHOOK_PAYMENT_ERROR' },
            { status: 400 }
        );
    }

    // 1. Strict Idempotency Check: Prevent duplicate processing on Stripe retries
    try {
        const existingEvent = await prisma.processedWebhookEvent.findUnique({
            where: { eventId: event.id }
        });

        if (existingEvent) {
            console.log(`[Webhook] Duplicate event ${event.id} received, returning 200 OK without re-processing.`);
            return Response.json({ received: true, duplicate: true }, { status: 200 });
        }
    } catch (err) {
        console.warn(`[Webhook] Idempotency table lookup skipped:`, err);
    }

    // 2. Handle Payment Success Events
    if (
        event.type === 'charge.succeeded' ||
        event.type === 'checkout.session.completed' ||
        event.type === 'payment_intent.succeeded' ||
        event.type === 'checkout.session.async_payment_succeeded'
    ) {
        const sessionOrIntent = event.data.object as any;
        const userId = sessionOrIntent.metadata?.userId;
        const orderId = sessionOrIntent.metadata?.orderId;

        if (!userId || !orderId) {
            return Response.json(
                { message: "Missing metadata tags in session/intent context", code: 'METADATA_ERROR' },
                { status: 400 }
            );
        }

        try {
            // Atomic transaction: Mark event processed + decrement inventory + complete order + clear cart
            await prisma.$transaction(async (tx) => {
                // Record event ID for idempotency
                await tx.processedWebhookEvent.create({
                    data: {
                        eventId: event.id,
                        eventType: event.type
                    }
                });

                // Fetch order with line items to decrement stock
                const order = await tx.order.findUnique({
                    where: { id: orderId },
                    include: { items: true }
                });

                if (order && order.status === 'UNPAID') {
                    // Update Order status
                    await tx.order.update({
                        where: { id: orderId },
                        data: {
                            status: 'PROCESSING',
                            stripeSessionId: sessionOrIntent.id
                        }
                    });

                    // Decrement stock for purchased items
                    for (const item of order.items) {
                        await tx.product.update({
                            where: { id: item.productId },
                            data: {
                                stock: {
                                    decrement: item.quantity
                                }
                            }
                        });
                    }

                    // Clear user cart
                    await tx.cartItem.deleteMany({
                        where: { cart: { userId: userId } }
                    });
                }
            });

            console.log(`[Webhook] Order ${orderId} successfully completed & inventory adjusted via event: ${event.type}`);
        } catch (err: unknown) {
            console.error(`[Webhook] Database fulfillment failed for event ${event.id}:`, err);
            return Response.json(
                { message: "Internal fulfillment error", code: 'SERVER_FULFILLMENT_ERROR' },
                { status: 500 }
            );
        }

        return Response.json({ received: true }, { status: 200 });
    }

    return Response.json({ received: true }, { status: 200 });
}