import type { Invoice, InvoiceLineItem, Payment } from "../types/fees";

export interface LineAllocation {
  lineId: string;
  category: string;
  allocated: number;
}

/**
 * Apply a payment amount to invoice lines in priority order (1 before 2…).
 * Each line’s “remaining” is its full amount (caller should subtract prior payments per line if modeling history).
 */
export function allocatePaymentToLines(
  paymentAmount: number,
  lines: InvoiceLineItem[],
  amountAlreadyPaidPerLine: Record<string, number> = {}
): LineAllocation[] {
  if (paymentAmount <= 0 || lines.length === 0) return [];

  const sorted = [...lines].sort((a, b) => a.priority - b.priority);
  let remaining = paymentAmount;
  const out: LineAllocation[] = [];

  for (const line of sorted) {
    if (remaining <= 0) break;
    const already = amountAlreadyPaidPerLine[line.id] ?? 0;
    const lineRemaining = Math.max(0, line.amount - already);
    if (lineRemaining <= 0) continue;
    const take = Math.min(lineRemaining, remaining);
    out.push({ lineId: line.id, category: line.category, allocated: take });
    remaining -= take;
  }

  return out;
}

/** Successful payments applied in order; returns cumulative amount paid per line id. */
export function computeLinePaidAmounts(invoice: Invoice, payments: Payment[]): Record<string, number> {
  const paid = payments
    .filter((p) => p.invoiceId === invoice.id && p.status === "success")
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const state: Record<string, number> = {};
  for (const line of invoice.lines) state[line.id] = 0;
  for (const p of paid) {
    const alloc = allocatePaymentToLines(p.amount, invoice.lines, state);
    for (const a of alloc) {
      state[a.lineId] = (state[a.lineId] ?? 0) + a.allocated;
    }
  }
  return state;
}
