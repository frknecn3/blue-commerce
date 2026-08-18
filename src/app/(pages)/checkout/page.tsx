import CheckoutForm from '@/components/Checkout/CheckoutForm';
import { prisma } from '@/lib/prisma';
import { getCustomServerSession } from '@/utils/serverUtils';
import { redirect } from 'next/navigation';
import React from 'react'

export const dynamic = 'force-dynamic';

type Props = {}

export default async function CheckoutPage(props: Props) {
    const session = await getCustomServerSession();
    const userId = session?.user.id;

    if (!userId) {
        console.log('No user, redirect to login.')
        console.log('SESSION: \n', session)
        redirect('/login');
    }

    const cart = await prisma.cart.findFirst({
        where: { userId: userId },
        include: {
            items: {
                include: { product: true }
            }
        },
    });

    if (!cart || cart.items.length === 0) {
        console.log('No cart, redirect to cart page.')
        redirect("/cart"); // Can't checkout without any items
    }

    const totalAmount = cart.items.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
    );

    const activeOrder = await prisma.$transaction(async (tx) => {
        // Delete any stale, unpaid pending orders to prevent processing wrong items/prices
        // await tx.order.deleteMany({
        //     where: {
        //         ownerId: userId,
        //         status: "UNPAID"
        //     }
        // });

        // Create the new accurate order mirror matching the current cart items precisely
        const newOrder = await tx.order.create({
            data: {
                ownerId: userId,
                totalAmount: totalAmount,
                status: "UNPAID",
                items: {
                    create: cart.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                },
            },
        });

        return newOrder;
    });


    return (
        <main className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Secure Checkout</h1>
            <CheckoutForm
                userId={userId}
                orderId={activeOrder.id}
            />
        </main>
    )
}