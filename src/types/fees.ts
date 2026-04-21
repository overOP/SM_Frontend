/** Payment lifecycle — optimistic “pending” rows appear before server ack. */
export type PaymentRecordStatus = "success" | "pending_verification" | "disputed";

export interface InvoiceLineItem {
  id: string;
  /** Lower number = paid first when splitting a payment. */
  priority: number;
  category: string;
  amount: number;
}

export interface Invoice {
  id: string;
  studentId: string;
  studentName: string;
  roll: string;
  className: string;
  /** ISO date (yyyy-mm-dd) */
  dueDate: string;
  lines: InvoiceLineItem[];
  /** Sum of lines — denormalized for quick checks */
  totalAmount: number;
  disputed?: boolean;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  status: PaymentRecordStatus;
  method: string;
  reference?: string;
  /** ISO timestamp */
  createdAt: string;
  /** Stable client key for optimistic UI + deduping */
  clientId?: string;
}

export type InvoicePaymentStatus = "unpaid" | "partial" | "full";

export interface EnrichedInvoice extends Invoice {
  paidFromSuccess: number;
  paidPendingVerification: number;
  balance: number;
  settlement: InvoicePaymentStatus;
  isOverdue: boolean;
}
