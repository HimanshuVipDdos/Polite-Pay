"use client";

import { useState, useEffect, useTransition } from "react";
import { Bell, Search, X, CheckCircle } from "lucide-react";
import { getDashboardMetrics, getInvoices } from "@/app/actions";
import type { Invoice, DashboardMetrics } from "@/app/actions";
import AddInvoiceModal from "./add-invoice-modal";
import InvoiceRow from "./invoice-row";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalOutstanding: "...",
    activeReminders: 0,
    paidThisMonth: "...",
  });
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");
  const [showBell, setShowBell] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const [m, inv] = await Promise.all([getDashboardMetrics(), getInvoices()]);
      setMetrics(m);
      setInvoices(inv);
    });
  }, []);

  const filtered = invoices.filter(
    (inv) =>
      inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.status.toLowerCase().includes(search.toLowerCase())
  );

  const overdueInvoices = invoices.filter((i) => i.status === "Overdue");

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowBell((b) => !b)}
              className="text-slate-400 hover:text-slate-600 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {overdueInvoices.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {overdueInvoices.length}
                </span>
              )}
            </button>

            {showBell && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowBell(false)} />
                <div className="absolute right-0 top-8 z-20 bg-white border border-slate-200 rounded-xl shadow-lg w-72 text-left overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">Notifications</p>
                    <button onClick={() => setShowBell(false)}>
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  {overdueInvoices.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-slate-400">
                      No overdue invoices
                    </div>
                  ) : (
                    overdueInvoices.map((inv) => (
                      <div key={inv.id} className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50">
                        <p className="text-sm font-medium text-slate-900">
                          {inv.client} is overdue
                        </p>
                        <p className="text-xs text-slate-500">
                          {inv.amount} · due {inv.dueDate}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
          <AddInvoiceModal />
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-1">
              Total Outstanding
            </p>
            <p className={`text-3xl font-semibold tracking-tight text-slate-900 ${isPending ? "opacity-40" : ""}`}>
              {metrics.totalOutstanding}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-1">
              Reminders Active
            </p>
            <p className={`text-3xl font-semibold tracking-tight text-slate-900 ${isPending ? "opacity-40" : ""}`}>
              {metrics.activeReminders}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-1">
              Paid This Month
            </p>
            <p className={`text-3xl font-semibold tracking-tight text-slate-900 ${isPending ? "opacity-40" : ""}`}>
              {metrics.paidThisMonth}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 tracking-tight">
              Active Invoices
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search client, ID, status..."
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 w-64"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Client
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Next Action
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isPending ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                      Loading invoices...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                      {search ? `No results for "${search}"` : "No invoices yet. Add one above!"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((invoice) => (
                    <InvoiceRow key={invoice.id} invoice={invoice} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
