import { useMemo } from "react";
import { Layers } from "lucide-react";
import type { Invoice, Payment } from "../../../types/fees";
import { allocatePaymentToLines, computeLinePaidAmounts } from "../../../lib/allocatePayment";
import { formatInrInput } from "../../../lib/currencyInput";
import { Button } from "../../ui/Button";
import { Modal } from "../../ui/Modal";

interface PaymentSplitterModalProps {
  open: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  paymentAmount: number;
  allPayments: Payment[];
  onConfirm: () => void;
}

export function PaymentSplitterModal({
  open,
  onClose,
  invoice,
  paymentAmount,
  allPayments,
  onConfirm,
}: PaymentSplitterModalProps) {
  const paidPerLine = useMemo(
    () => (invoice ? computeLinePaidAmounts(invoice, allPayments) : {}),
    [invoice, allPayments]
  );

  const allocation = useMemo(() => {
    if (!invoice || paymentAmount <= 0) return [];
    return allocatePaymentToLines(paymentAmount, invoice.lines, paidPerLine);
  }, [invoice, paymentAmount, paidPerLine]);

  if (!invoice) return null;

  const totalAllocated = allocation.reduce((s, a) => s + a.allocated, 0);

  return (
    <Modal isOpen={open} onClose={onClose} title="Payment allocation preview">
      <div className="space-y-5">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Priority order
          </p>
          <p className="mt-1 text-sm font-medium text-slate-600">
            Lower priority numbers are covered first (e.g. Tuition before Lab).
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="px-4 py-3">Fee</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3 text-right">This payment</th>
              </tr>
            </thead>
            <tbody>
              {allocation.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-400">
                    Enter an amount greater than zero to see the split.
                  </td>
                </tr>
              ) : (
                allocation.map((row) => (
                  <tr key={row.lineId} className="border-b border-slate-50 last:border-0">
                    <td className="px-4 py-3 font-bold text-slate-800">{row.category}</td>
                    <td className="px-4 py-3 text-slate-500">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-700">
                        <Layers className="h-3 w-3" />
                        P
                        {invoice.lines.find((l) => l.id === row.lineId)?.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-black text-emerald-700">
                      ₹{formatInrInput(row.allocated)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-emerald-50/50 px-4 py-3 text-sm">
          <span className="font-bold text-slate-600">Applied from this payment</span>
          <span className="font-black text-emerald-800">₹{formatInrInput(totalAllocated)}</span>
        </div>

        {paymentAmount > totalAllocated && paymentAmount > 0 && (
          <p className="text-xs font-medium text-amber-700">
            ₹{formatInrInput(paymentAmount - totalAllocated)} exceeds remaining line items — surplus
            would remain unallocated in a strict ledger (demo caps at line balances).
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button type="button" variant="primary" className="flex-1" onClick={onConfirm}>
            Acknowledge
          </Button>
        </div>
      </div>
    </Modal>
  );
}
