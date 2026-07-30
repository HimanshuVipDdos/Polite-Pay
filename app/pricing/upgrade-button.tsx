"use client";

import { useState, useTransition } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { createCheckoutSession } from "@/app/lib/stripe-actions";

export default function UpgradeButton({
  userId,
  isPro,
}: {
  userId: string | null;
  isPro: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (isPro) {
    return (
      <span className="block w-full text-center px-5 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-500 cursor-default">
        Current Plan
      </span>
    );
  }

  function handleClick() {
    setError(null);
    if (!userId) {
      window.location.href = "/auth/login?next=/pricing";
      return;
    }
    startTransition(async () => {
      const result = await createCheckoutSession(userId);
      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        setError(result.error ?? "Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isPending}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
      >
        {isPending ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting to Stripe...</>
        ) : (
          <><Sparkles className="w-4 h-4" /> Upgrade to Pro</>
        )}
      </button>
      {error && <p className="text-xs text-red-600 mt-2 text-center">{error}</p>}
    </div>
  );
}
