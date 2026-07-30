import { createServerActionClient } from "@/lib/supabase/server";
import { Wind, Check } from "lucide-react";
import UpgradeButton from "./upgrade-button";

async function getUser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return null;

  const supabase = await createServerActionClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("subscription_status")
    .eq("id", user.id)
    .single();

  return { ...user, subscription_status: profile?.subscription_status ?? null };
}

export default async function PricingPage() {
  const user = await getUser();
  const isPro = user?.subscription_status === "active" || user?.subscription_status === "trialing";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/dashboard" className="flex items-center">
            <Wind className="w-6 h-6 text-indigo-600 mr-2" />
            <span className="font-semibold text-lg tracking-tight text-slate-900">PolitePay</span>
          </a>
          <div className="flex items-center gap-4">
            <span className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full font-medium">Showcase Mode</span>
            <a href="/dashboard" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Back to Dashboard</a>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Simple, transparent pricing</h1>
          <p className="text-slate-500 mt-3 text-lg">Start free, upgrade when you grow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 flex flex-col">
            <h2 className="text-lg font-semibold text-slate-900">Free</h2>
            <p className="text-3xl font-bold tracking-tight text-slate-900 mt-4">
              $0<span className="text-base font-normal text-slate-500">/month</span>
            </p>
            <p className="text-sm text-slate-500 mt-1">For freelancers just getting started.</p>
            <ul className="mt-6 space-y-3 flex-1">
              {["Up to 5 active invoices", "Basic email reminders", "Gentle & Standard tones", "Email support"].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-slate-600">{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <span className="block w-full text-center px-5 py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-500 cursor-default">
                Current Plan
              </span>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-xl border-2 border-indigo-600 shadow-md p-8 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              POPULAR
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Pro</h2>
            <p className="text-3xl font-bold tracking-tight text-slate-900 mt-4">
              $12<span className="text-base font-normal text-slate-500">/month</span>
            </p>
            <p className="text-sm text-slate-500 mt-1">For serious freelancers and small teams.</p>
            <ul className="mt-6 space-y-3 flex-1">
              {["Unlimited invoices", "Advanced automated reminders", "All tones (incl. Firm Warning)", "Priority email support", "Detailed analytics", "Cancel anytime"].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-slate-600">{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <UpgradeButton userId={user?.id ?? null} isPro={isPro} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
