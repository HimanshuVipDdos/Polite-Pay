"use server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

interface CheckoutSessionResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * createCheckoutSession
 * Initiates a Stripe Checkout session in SUBSCRIPTION mode
 * for the $12/month PolitePay plan.
 */
export async function createCheckoutSession(
  userId: string
): Promise<CheckoutSessionResult> {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          // PASTE YOUR STRIPE_PRICE_ID HERE (Stripe Dashboard > Products) —
          // set it as the STRIPE_PRICE_ID env var, don't hardcode it.
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      client_reference_id: userId,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?checkout=canceled`,
    });

    if (!session.url) {
      return { success: false, error: "Failed to create checkout session." };
    }

    return { success: true, url: session.url };
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return { success: false, error: "Something went wrong with Stripe." };
  }
}
