import Link from "next/link";
import { Check, Wind } from "lucide-react";
import { getCurrentUser } from "@/app/actions";
import UpgradeButton from "./upgrade-button";

const freeFeatures = [
  "Up to 5 active invoices",
  "Gentle & standard reminder tones",
  "Manual reminder sending",
];

const proFeatures = [
  "Unlimited invoices",
  "Gentle, standard & firm reminder tones",
  "Automated follow-up scheduling",
  "Priority email deliverability",
  "Priority support",
];

export default async function PricingPage() {
  const user = await getCurrentUser();
  const isPro =
    user?.subscription_status === "active" ||
    user?.subscription_status === "trialing";

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="h-16 flex items-center px-6 border-b border-slate-200 bg-white">
        <Link href="/" className="flex items-center">
          <Wind className="w-6 h-6 text-indigo-600 mr-2" />
          <span className="font-semibold text-lg tracking-tight">PolitePay</span>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Simple, transparent pricing
          </h1>
          <p className="mt-3 text-slate-500">
            Stop chasing payments. Automate it for less than a coffee a week.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Free
            </h2>
            <p className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-semibold tracking-tight text-slate-900">$0</span>
              <span className="text-sm text-slate-500">/month</span>
            </p>
            <ul className="mt-6 space-y-3">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <span className="mt-8 block w-full text-center px-5 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-500">
              {isPro ? "Included in Pro" : "Current Plan"}
            </span>
          </div>

          <div className="bg-white rounded-xl border-2 border-indigo-600 shadow-sm p-8 relative">
            <span className="absolute -top-3 left-8 bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full">
              Most Popular
            </span>
            <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
              Pro
            </h2>
            <p className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-semibold tracking-tight text-slate-900">$12</span>
              <span className="text-sm text-slate-500">/month</span>
            </p>
            <ul className="mt-6 space-y-3">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <UpgradeButton userId={user?.id ?? null} isPro={isPro} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
