import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PolitePay — Automated Invoice Reminders",
  description: "Polite, automated follow-ups for freelancer invoices.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
