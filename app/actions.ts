"use server";

// TODO: once Supabase project is connected, swap mocks below for real queries via:
//   import { createServerActionClient } from "@/lib/supabase/server";

export type FollowUpTone = "gentle" | "standard" | "firm";
export type InvoiceStatus = "Overdue" | "Pending" | "Paid";

export interface Invoice {
  id: string;
  client: string;
  amount: string;
  dueDate: string;
  status: InvoiceStatus;
  nextAction: string;
}

export interface AddInvoiceResult {
  success: boolean;
  invoice?: Invoice;
  error?: string;
}

export interface DashboardMetrics {
  totalOutstanding: string;
  activeReminders: number;
  paidThisMonth: string;
}

function simulateDelay(ms = 800) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const mockInvoices: Invoice[] = [
  { id: "INV-2023-001", client: "Acme Corp", amount: "$2,450.00", dueDate: "Oct 15, 2023", status: "Overdue", nextAction: "Send Firm Warning" },
  { id: "INV-2023-002", client: "Globex Inc", amount: "$1,120.00", dueDate: "Oct 20, 2023", status: "Pending", nextAction: "Send Gentle Nudge" },
  { id: "INV-2023-003", client: "Soylent Corp", amount: "$4,500.00", dueDate: "Oct 22, 2023", status: "Pending", nextAction: "None (Too Early)" },
  { id: "INV-2023-004", client: "Initech", amount: "$850.00", dueDate: "Oct 10, 2023", status: "Paid", nextAction: "Send Thank You" },
];

/**
 * addInvoice
 * TODO: replace mock logic with:
 *   const supabase = createServerActionClient();
 *   const { data: { user } } = await supabase.auth.getUser();
 *   await supabase.from("invoices").insert({ user_id: user.id, ... });
 */
export async function addInvoice(
  formData: FormData
): Promise<AddInvoiceResult> {
  await simulateDelay();

  const client = formData.get("clientName") as string;
  const email = formData.get("clientEmail") as string;
  const amount = formData.get("invoiceLink") as string; // placeholder field per UI
  const tone = formData.get("tone") as FollowUpTone;

  if (!client || !email || !tone) {
    return { success: false, error: "Missing required fields." };
  }

  const invoice: Invoice = {
    id: `INV-${Date.now()}`,
    client,
    amount: amount || "$0.00",
    dueDate: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    status: "Pending",
    nextAction:
      tone === "gentle"
        ? "Send Gentle Nudge"
        : tone === "firm"
          ? "Send Firm Warning"
          : "Send Standard Reminder",
  };

  return { success: true, invoice };
}

/**
 * getDashboardMetrics
 * TODO: replace with actual Supabase aggregate query, e.g.:
 *   const { data } = await supabase
 *     .from("invoices")
 *     .select("amount, status")
 *     .eq("user_id", user.id);
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  await simulateDelay(500);

  return {
    totalOutstanding: "$12,450.00",
    activeReminders: 24,
    paidThisMonth: "$8,230.00",
  };
}

/**
 * getInvoices
 * TODO: replace with:
 *   const { data } = await supabase.from("invoices").select("*, clients(name)").eq("user_id", user.id);
 */
export async function getInvoices(): Promise<Invoice[]> {
  await simulateDelay(500);
  return mockInvoices;
}
