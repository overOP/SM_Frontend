import { cva, type VariantProps } from "class-variance-authority";

export const feeStatusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest transition-colors",
  {
    variants: {
      variant: {
        settled: "border-emerald-200 bg-emerald-50 text-emerald-800",
        pending_verification: "border-amber-200 bg-amber-50 text-amber-900",
        overdue: "border-rose-200 bg-rose-50 text-rose-800",
        disputed: "border-violet-200 bg-violet-50 text-violet-900",
        partial: "border-sky-200 bg-sky-50 text-sky-900",
        outstanding: "border-slate-200 bg-slate-50 text-slate-700",
      },
    },
    defaultVariants: {
      variant: "settled",
    },
  }
);

export type FeeBadgeVariant = NonNullable<VariantProps<typeof feeStatusBadgeVariants>["variant"]>;
