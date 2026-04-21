import { Printer } from "lucide-react";
import type { Invoice, Payment } from "../../../types/fees";
import { Button } from "../../ui/Button";
import { cn } from "../../../lib/utils";

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

interface FeeReceiptPrintProps {
  payment: Payment;
  invoice: Invoice;
  className?: string;
}

export function FeeReceiptPrint({ payment, invoice, className }: FeeReceiptPrintProps) {
  const print = () => window.print();

  return (
    <div className={cn("space-y-4", className)}>
      <Button type="button" variant="outline" className="gap-2 print:hidden" onClick={print}>
        <Printer className="h-4 w-4" />
        Print receipt
      </Button>

      <div
        id={`fee-receipt-${payment.id}`}
        className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm print:shadow-none print:border-none"
      >
        <div className="border-b border-slate-100 pb-6 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Sikshyanetra</p>
          <h2 className="mt-2 text-xl font-black text-slate-900">Payment receipt</h2>
          <p className="mt-1 text-xs text-slate-500">Official record (demo)</p>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-[10px] font-black uppercase tracking-widest text-slate-400">Student</dt>
            <dd className="mt-1 font-bold text-slate-900">{invoice.studentName}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-black uppercase tracking-widest text-slate-400">Roll / Class</dt>
            <dd className="mt-1 font-semibold text-slate-700">
              {invoice.roll} · {invoice.className}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-black uppercase tracking-widest text-slate-400">Invoice</dt>
            <dd className="mt-1 font-mono text-xs text-slate-800">{invoice.id}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date</dt>
            <dd className="mt-1 text-slate-700">
              {new Date(payment.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-black uppercase tracking-widest text-slate-400">Method</dt>
            <dd className="mt-1 font-semibold text-slate-800">{payment.method}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reference</dt>
            <dd className="mt-1 font-mono text-xs text-slate-600">{payment.reference ?? "—"}</dd>
          </div>
        </dl>

        <div className="mt-8 flex items-end justify-between border-t border-dashed border-slate-200 pt-6">
          <span className="text-sm font-bold text-slate-600">Amount received</span>
          <span className="text-3xl font-black tracking-tight text-emerald-700">
            {formatMoney(payment.amount)}
          </span>
        </div>

        <p className="mt-8 text-center text-[10px] text-slate-400">
          This document was generated for demonstration. Verify with the finance office.
        </p>
      </div>
    </div>
  );
}
