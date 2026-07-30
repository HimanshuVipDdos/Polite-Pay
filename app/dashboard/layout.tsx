import {
  LayoutDashboard,
  FileText,
  Settings,
  Wind,
  LogOut,
  Sparkles,
} from "lucide-react";
import { getCurrentUser, getInvoiceCount } from "@/app/actions";
import Link from "next/link";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getSubscriptionBadge(status: string | null): {
  label: string;
  classes: string;
} {
  switch (status) {
    case "active":
    case "trialing":
      return {
        label: status === "trialing" ? "Trial" : "Pro",
        classes:
          "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20",
      };
    case "past_due":
      return {
        label: "Past Due",
        classes: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10",
      };
    default:
      return {
        label: "Free",
        classes:
          "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/10",
      };
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const invoiceCount = await getInvoiceCount();

  const badge = getSubscriptionBadge(user?.subscription_status ?? null);
  const isPro =
    user?.subscription_status === "active" ||
    user?.subscription_status === "trialing";

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* --- Sidebar Navigation --- */}
      <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-200">
            <Wind className="w-6 h-6 text-indigo-600 mr-2" />
            <span className="font-semibold text-lg tracking-tight">
              PolitePay
            </span>
          </div>
          <nav className="p-4 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-white text-indigo-600 shadow-sm border border-slate-200"
            >
              <LayoutDashboard className="w-4 h-4 mr-3" />
              Dashboard
            </Link>
            <Link
              href="#"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <FileText className="w-4 h-4 mr-3 text-slate-400" />
              Invoices
              <span className="ml-auto text-xs text-slate-400">
                {invoiceCount}
              </span>
            </Link>
            <Link
              href="#"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Settings className="w-4 h-4 mr-3 text-slate-400" />
              Settings
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200 space-y-3">
          {!isPro && (
            <Link
              href="/pricing"
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              Upgrade to Pro
            </Link>
          )}

          <div className="flex items-center justify-between group cursor-pointer hover:bg-slate-100 p-2 rounded-md transition-colors -mx-2">
            <div className="flex items-center min-w-0">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm shrink-0">
                {user ? getInitials(user.name) : "?"}
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user?.name ?? "User"}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email ?? ""}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${badge.classes}`}
            >
              {badge.label}
            </span>
            <Link
              href="/auth/logout"
              className="text-slate-400 hover:text-red-500 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {children}
      </main>
    </div>
  );
}
