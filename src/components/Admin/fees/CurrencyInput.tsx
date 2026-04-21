import { useCallback, useId } from "react";
import { IndianRupee } from "lucide-react";
import { cn } from "../../../lib/utils";
import { formatInrInput, parseCurrencyDigits } from "../../../lib/currencyInput";

interface CurrencyInputProps {
  id?: string;
  label?: string;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function CurrencyInput({
  id: propId,
  label,
  value,
  onChange,
  className,
  placeholder = "0",
  disabled,
}: CurrencyInputProps) {
  const genId = useId();
  const id = propId ?? genId;
  const display = value > 0 ? formatInrInput(value) : "";

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(parseCurrencyDigits(e.target.value));
    },
    [onChange]
  );

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="ml-1 text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <IndianRupee
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          value={display}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50"
        />
      </div>
    </div>
  );
}
