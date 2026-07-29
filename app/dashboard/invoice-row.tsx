import { MoreHorizontal } from "lucide-react";
import type { Invoice } from "@/app/actions";

const statusStyles: Record<Invoice["status"], string> = {
  Overdue: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10",
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10",
  Paid: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10",
};

export default function InvoiceRow({ invoice }: { invoice: Invoice }) {
  return (
    <tr className="hover:bg-slate-50 transition-colors group">
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
        <span
          className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${statusStyles[invoice.status]}`}
        >
          {invoice.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        {invoice.nextAction}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
}
