"use server";

import { prisma } from "@/lib/prisma";
import APIError from "@/types/api";
import { getStripe } from "@/utils/utils";
import { headers } from "next/headers";

export interface CheckoutSessionParams {
  userId: string;
  orderId: string;
}

export async function createCheckoutSession({ userId, orderId }: CheckoutSessionParams) {
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const origin = headersList.get("origin") || process.env.NEXTAUTH_URL || `${protocol}://${host}`;

  const cartItems = await prisma.cartItem.findMany({
    where: { cart: { userId } },
    include: { product: true }
  });

  if (!cartItems || cartItems.length === 0) {
    throw new APIError('Your cart is empty', 400, 'EMPTY_CART');
  }

  // Format valid absolute image URLs for Stripe (Stripe rejects relative paths like "/assets/...")
  const formatStripeImages = (imageUrl: string | null | undefined): string[] | undefined => {
    if (!imageUrl) return undefined;
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return [imageUrl];
    }
    if (imageUrl.startsWith("/") && origin.startsWith("https://") && !origin.includes("localhost")) {
      return [`${origin}${imageUrl}`];
    }
    return undefined;
  };

  const lineItems = cartItems.map((item) => {
    const images = formatStripeImages(item.product.imageUrl);
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          ...(images && { images }),
          description: item.product.description || undefined,
        },
        unit_amount: Math.round(Number(item.product.price) * 100),
      },
      quantity: item.quantity,
    };
  });

  const stripe = getStripe();
  if (!stripe) {
    throw new APIError('Stripe client initialization failed', 500, 'STRIPE_INIT_ERROR');
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded_page',
    line_items: lineItems,
    mode: 'payment',
    return_url: `${origin}/checkout/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      userId,
      orderId
    }
  });

  return { clientSecret: session.client_secret };
}