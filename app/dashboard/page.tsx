import { Bell, Search } from "lucide-react";
import { getDashboardMetrics, getInvoices } from "@/app/actions";
import AddInvoiceModal from "./add-invoice-modal";
import InvoiceRow from "./invoice-row";

export default async function DashboardPage() {
  const [metrics, invoices] = await Promise.all([
    getDashboardMetrics(),
    getInvoices(),
  ]);

  return (
    <>
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <AddInvoiceModal />
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-1">
              Total Outstanding
            </p>
            <p className="text-3xl font-semibold tracking-tight text-slate-900">
              {metrics.totalOutstanding}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-1">
              Reminders Active
            </p>
            <p className="text-3xl font-semibold tracking-tight text-slate-900">
              {metrics.activeReminders}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-1">
              Paid This Month
            </p>
            <p className="text-3xl font-semibold tracking-tight text-slate-900">
              {metrics.paidThisMonth}
            </p>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 tracking-tight">
              Active Invoices
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">Client</th>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">Next Action</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((invoice) => (
                  <InvoiceRow key={invoice.id} invoice={invoice} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
