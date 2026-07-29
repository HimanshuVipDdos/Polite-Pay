"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  X,
  Clock,
  Briefcase,
  AlertOctagon,
  CheckCircle2,
} from "lucide-react";
import { addInvoice, type FollowUpTone } from "@/app/actions";

const toneOptions: {
  value: FollowUpTone;
  icon: typeof Clock;
  title: string;
  description: string;
  activeClasses: string;
}[] = [
  {
    value: "gentle",
    icon: Clock,
    title: "Gentle Nudge",
    description: "A polite reminder, perfect for the first follow-up.",
    activeClasses:
      "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 shadow-sm",
  },
  {
    value: "standard",
    icon: Briefcase,
    title: "Standard Professional",
    description: "Firm but polite, suitable for overdue invoices.",
    activeClasses:
      "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 shadow-sm",
  },
  {
    value: "firm",
    icon: AlertOctagon,
    title: "Firm Warning",
    description: "Direct and urgent, for significantly late payments.",
    activeClasses:
      "border-red-600 bg-red-50/50 ring-1 ring-red-600 shadow-sm",
  },
];

export default function AddInvoiceModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTone, setSelectedTone] = useState<FollowUpTone>("standard");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("tone", selectedTone);
    startTransition(async () => {
      const result = await addInvoice(formData);
      if (result.success) {
        setIsModalOpen(false);
      } else {
        setError(result.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Invoice
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          <form
            action={handleSubmit}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200"
          >
            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
              <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
                Add New Invoice
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors rounded-full p-1.5 hover:bg-slate-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-8 py-6 space-y-8 bg-white">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Client Name
                  </label>
                  <input
                    name="clientName"
                    type="text"
                    required
                    placeholder="e.g. Acme Corp"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Client Email
                  </label>
                  <input
                    name="clientEmail"
                    type="email"
                    required
                    placeholder="billing@acme.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Invoice Link / URL
                  </label>
                  <input
                    name="invoiceLink"
                    type="url"
                    placeholder="https://pay.stripe.com/..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-900">
                    Follow-up Tone
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    Select the personality for automated reminders.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {toneOptions.map((tone) => {
                    const Icon = tone.icon;
                    const isActive = selectedTone === tone.value;
                    return (
                      <div
                        key={tone.value}
                        onClick={() => setSelectedTone(tone.value)}
                        className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                          isActive
                            ? tone.activeClasses
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <Icon
                            className={`w-5 h-5 ${
                              isActive
                                ? tone.value === "firm"
                                  ? "text-red-600"
                                  : "text-indigo-600"
                                : "text-slate-400"
                            }`}
                          />
                          {isActive && (
                            <CheckCircle2
                              className={`w-4 h-4 ${
                                tone.value === "firm"
                                  ? "text-red-600"
                                  : "text-indigo-600"
                              }`}
                            />
                          )}
                        </div>
                        <div
                          className={`text-sm font-semibold mb-1 tracking-tight ${
                            isActive
                              ? tone.value === "firm"
                                ? "text-red-900"
                                : "text-indigo-900"
                              : "text-slate-900"
                          }`}
                        >
                          {tone.title}
                        </div>
                        <div className="text-xs text-slate-500 leading-relaxed">
                          {tone.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>

            <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm flex items-center disabled:opacity-60"
              >
                {isPending ? "Saving..." : "Save Invoice"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
