import type { EnrichedInvoice, Payment } from "../../../types/fees";
import type { FeeBadgeVariant } from "./feeBadgeVariants";

export function resolveInvoiceBadgeVariant(inv: EnrichedInvoice, payments: Payment[]): FeeBadgeVariant {
  if (inv.disputed) return "disputed";
  if (inv.balance <= 0 && inv.settlement === "full") return "settled";
  const hasPending = payments.some(
    (p) => p.invoiceId === inv.id && p.status === "pending_verification"
  );
  if (hasPending) return "pending_verification";
  if (inv.settlement === "partial") return "partial";
  if (inv.isOverdue && inv.balance > 0) return "overdue";
  if (inv.balance > 0) return "outstanding";
  return "settled";
}
