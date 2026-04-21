import { Receipt } from "lucide-react";
import { Button } from "../../ui/Button";

interface EmptyFeeStateProps {
  onPay?: () => void;
  title?: string;
  description?: string;
}

export function EmptyFeeState({
  onPay,
  title = "No transactions found",
  description = "There are no fee records matching your filters. Start a payment or adjust search.",
}: EmptyFeeStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-white px-8 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
        <Receipt className="h-8 w-8" />
      </div>
      <h3 className="mt-6 text-lg font-black text-slate-800">{title}</h3>
      <p className="mt-2 max-w-sm text-sm font-medium text-slate-500">{description}</p>
      {onPay && (
        <Button variant="primary" className="mt-8 rounded-2xl px-8 shadow-lg shadow-blue-100" onClick={onPay}>
          Pay now
        </Button>
      )}
    </div>
  );
}
