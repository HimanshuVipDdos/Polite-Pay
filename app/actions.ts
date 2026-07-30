"use server";

import { createServerActionClient } from "@/lib/supabase/server";

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

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  subscription_status: "trialing" | "active" | "past_due" | "canceled" | null;
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const supabase = await createServerActionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("subscription_status")
    .eq("id", user.id)
    .single();

  if (!profile) {
    await supabase.from("users").upsert({
      id: user.id,
      email: user.email!,
      subscription_status: "trialing",
    });
  }

  return {
    id: user.id,
    email: user.email ?? "",
    name: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "",
    subscription_status: profile?.subscription_status ?? "trialing",
  };
}

export async function addInvoice(
  formData: FormData
): Promise<AddInvoiceResult> {
  const supabase = await createServerActionClient();
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "You must be signed in." };
  }

  const clientName = formData.get("clientName") as string;
  const clientEmail = formData.get("clientEmail") as string;
  const amountStr = formData.get("amount") as string;
  const tone = formData.get("tone") as FollowUpTone;

  if (!clientName || !clientEmail || !amountStr || !tone) {
    return { success: false, error: "Missing required fields." };
  }

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return { success: false, error: "Invalid amount." };
  }

  if (user.subscription_status !== "active" && user.subscription_status !== "trialing") {
    const { count } = await supabase
      .from("invoices")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (count !== null && count >= 5) {
      return {
        success: false,
        error:
          "Free plan limited to 5 invoices. Upgrade to Pro for unlimited invoices.",
      };
    }
  }

  if (
    user.subscription_status !== "active" &&
    user.subscription_status !== "trialing" &&
    tone === "firm"
  ) {
    return {
      success: false,
      error: "Firm tone is a Pro feature. Upgrade to use it.",
    };
  }

  let { data: existingClient } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", user.id)
    .eq("email", clientEmail)
    .single();

  if (!existingClient) {
    const { data: newClient, error: clientError } = await supabase
      .from("clients")
      .insert({
        user_id: user.id,
        name: clientName,
        email: clientEmail,
      })
      .select("id")
      .single();

    if (clientError || !newClient) {
      return { success: false, error: "Failed to create client." };
    }
    existingClient = newClient;
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);

  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      user_id: user.id,
      client_id: existingClient.id,
      amount,
      due_date: dueDate.toISOString().split("T")[0],
      follow_up_tone: tone,
      status: "pending",
    })
    .select("id, amount, due_date, status, follow_up_tone, clients(name)")
    .single();

  if (invoiceError || !invoice) {
    return { success: false, error: "Failed to create invoice." };
  }

  const nextActionMap: Record<FollowUpTone, string> = {
    gentle: "Send Gentle Nudge",
    standard: "Send Standard Reminder",
    firm: "Send Firm Warning",
  };

  const clientsData = invoice.clients as unknown as { name: string } | null;
  return {
    success: true,
    invoice: {
      id: invoice.id.slice(0, 8).toUpperCase(),
      client: clientsData?.name ?? "Unknown",
      amount: `$${parseFloat(invoice.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      dueDate: new Date(invoice.due_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: invoice.status === "paid" ? "Paid" : invoice.status === "overdue" ? "Overdue" : "Pending",
      nextAction: nextActionMap[invoice.follow_up_tone as FollowUpTone],
    },
  };
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createServerActionClient();
  const user = await getCurrentUser();
  if (!user) {
    return { totalOutstanding: "$0.00", activeReminders: 0, paidThisMonth: "$0.00" };
  }

  const { data: pendingInvoices } = await supabase
    .from("invoices")
    .select("amount")
    .eq("user_id", user.id)
    .in("status", ["pending", "overdue"]);

  const totalOutstanding =
    pendingInvoices?.reduce(
      (sum, inv) => sum + parseFloat(inv.amount),
      0
    ) ?? 0;

  const { count: activeReminders } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .in("status", ["pending", "overdue"]);

  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const { data: paidThisMonth } = await supabase
    .from("invoices")
    .select("amount")
    .eq("user_id", user.id)
    .eq("status", "paid")
    .gte("created_at", firstOfMonth);

  const paidTotal =
    paidThisMonth?.reduce((sum, inv) => sum + parseFloat(inv.amount), 0) ?? 0;

  return {
    totalOutstanding: `$${totalOutstanding.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    activeReminders: activeReminders ?? 0,
    paidThisMonth: `$${paidTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
  };
}

export async function getInvoices(): Promise<Invoice[]> {
  const supabase = await createServerActionClient();
  const user = await getCurrentUser();
  if (!user) return [];

  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, amount, due_date, status, follow_up_tone, created_at, clients(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!invoices) return [];

  const nextActionMap: Record<string, string> = {
    friendly: "Send Gentle Nudge",
    gentle: "Send Gentle Nudge",
    standard: "Send Standard Reminder",
    firm: "Send Firm Warning",
    formal: "Send Formal Reminder",
  };

  return invoices.map((inv) => {
    const clientsData = inv.clients as unknown as { name: string } | null;
    return {
      id: inv.id.slice(0, 8).toUpperCase(),
      client: clientsData?.name ?? "Unknown",
      amount: `$${parseFloat(inv.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      dueDate: new Date(inv.due_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status:
        inv.status === "paid"
          ? "Paid"
          : inv.status === "overdue"
            ? "Overdue"
            : "Pending",
      nextAction:
        inv.status === "paid"
          ? "Send Thank You"
          : inv.status === "overdue"
            ? nextActionMap[inv.follow_up_tone] ?? "Send Reminder"
            : inv.status === "pending"
              ? nextActionMap[inv.follow_up_tone] ?? "Send Reminder"
              : "None",
    };
  });
}

export async function getInvoiceCount(): Promise<number> {
  const supabase = await createServerActionClient();
  const user = await getCurrentUser();
  if (!user) return 0;

  const { count } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  return count ?? 0;
}
