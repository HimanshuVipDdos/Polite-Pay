"use client";

import { useState } from "react";
import { MoreHorizontal, Send, CheckCircle, Trash2, X } from "lucide-react";
import type { Invoice } from "@/app/actions";

const statusStyles: Record<Invoice["status"], string> = {
  Overdue: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10",
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10",
  Paid: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10",
};

export default function InvoiceRow({ invoice }: { invoice: Invoice }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <tr className="hover:bg-slate-50 transition-colors group relative">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-slate-900">{invoice.client}</div>
        <div className="text-xs text-slate-500 mt-0.5">{invoice.id}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
        {invoice.amount}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
        {invoice.dueDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${statusStyles[invoice.status]}`}>
          {invoice.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        {invoice.nextAction}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-4 top-10 z-20 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-44 text-left">
              <button
                onClick={() => { showToast(`Reminder sent to ${invoice.client}!`); setMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <Send className="w-4 h-4 text-indigo-500" /> Send Reminder
              </button>
              <button
                onClick={() => { showToast(`${invoice.id} marked as Paid ✓`); setMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Mark as Paid
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={() => { showToast(`${invoice.id} deleted.`); setMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </>
        )}
      </td>

      {toast && (
        <td className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-30 pointer-events-none" colSpan={6}>
          <div className="flex items-center gap-2 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            {toast}
          </div>
        </td>
      )}
    </tr>
  );
}
