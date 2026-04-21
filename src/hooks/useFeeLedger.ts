import { useMemo } from "react";
import type { EnrichedInvoice, Invoice, Payment } from "../types/fees";

export interface FeeLedgerMetrics {
  totalBilled: number;
  totalPaid: number;
  totalPendingVerification: number;
  currentBalance: number;
  overdueAmount: number;
}

function isOverdue(dueDateIso: string, now: Date): boolean {
  const d = new Date(dueDateIso + "T23:59:59");
  return d < now;
}

export function deriveInvoiceSettlement(
  invoice: Invoice,
  payments: Payment[]
): Pick<
  EnrichedInvoice,
  | "paidFromSuccess"
  | "paidPendingVerification"
  | "balance"
  | "settlement"
  | "isOverdue"
> {
  const forInv = payments.filter((p) => p.invoiceId === invoice.id);
  const paidFromSuccess = forInv
    .filter((p) => p.status === "success")
    .reduce((s, p) => s + p.amount, 0);
  const paidPendingVerification = forInv
    .filter((p) => p.status === "pending_verification")
    .reduce((s, p) => s + p.amount, 0);

  const balance = Math.max(0, invoice.totalAmount - paidFromSuccess);

  let settlement: EnrichedInvoice["settlement"] = "unpaid";
  if (paidFromSuccess >= invoice.totalAmount && invoice.totalAmount > 0) {
    settlement = "full";
  } else if (paidFromSuccess > 0) {
    settlement = "partial";
  }

  const now = new Date();
  const overdue = isOverdue(invoice.dueDate, now) && balance > 0;

  return {
    paidFromSuccess,
    paidPendingVerification,
    balance,
    settlement,
    isOverdue: overdue,
  };
}

export function computeLedgerMetrics(
  invoices: Invoice[],
  payments: Payment[]
): FeeLedgerMetrics {
  const totalBilled = invoices.reduce((s, i) => s + i.totalAmount, 0);
  const totalPaid = payments
    .filter((p) => p.status === "success")
    .reduce((s, p) => s + p.amount, 0);
  const totalPendingVerification = payments
    .filter((p) => p.status === "pending_verification")
    .reduce((s, p) => s + p.amount, 0);

  const currentBalance = Math.max(0, totalBilled - totalPaid);

  const now = new Date();
  let overdueAmount = 0;
  for (const inv of invoices) {
    const { balance } = deriveInvoiceSettlement(inv, payments);
    if (balance <= 0) continue;
    if (isOverdue(inv.dueDate, now)) {
      overdueAmount += balance;
    }
  }

  return {
    totalBilled,
    totalPaid,
    totalPendingVerification,
    currentBalance,
    overdueAmount,
  };
}

export function enrichInvoices(invoices: Invoice[], payments: Payment[]): EnrichedInvoice[] {
  return invoices.map((inv) => {
    const d = deriveInvoiceSettlement(inv, payments);
    return { ...inv, ...d };
  });
}

export function useFeeLedger(invoices: Invoice[], payments: Payment[]) {
  return useMemo(() => {
    const metrics = computeLedgerMetrics(invoices, payments);
    const enriched = enrichInvoices(invoices, payments);
    return { metrics, enriched };
  }, [invoices, payments]);
}
