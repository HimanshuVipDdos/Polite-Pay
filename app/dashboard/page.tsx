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
              {invoices.filter((i) => i.status === "Overdue").length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {invoices.filter((i) => i.status === "Overdue").length}
                </span>
              )}
            </button>

            {showBell && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowBell(false)} />
                <div className="absolute right-0 top-8 z-20 bg-white border border-slate-200 rounded-xl shadow-lg w-72 text-left overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">Notifications</p>
                    <button onClick={() => setShowBell(false)}><X className="w-4 h-4 text-slate-400" /></button>
                  </div>
                  {invoices.filter((i) => i.status === "Overdue").length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-slate-400">No overdue invoices 🎉</div>
                  ) : (
                    invoices.filter((i) => i.status === "Overdue").map((inv) => (
                      <div key={inv.id} className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50">
                        <p className="text-sm font-medium
