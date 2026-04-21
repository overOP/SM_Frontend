import { cn } from "../../../lib/utils";
import { feeStatusBadgeVariants, type FeeBadgeVariant } from "./feeBadgeVariants";

const LABELS: Record<FeeBadgeVariant, string> = {
  settled: "Settled",
  pending_verification: "Pending Verification",
  overdue: "Overdue",
  disputed: "Disputed",
  partial: "Partially Paid",
  outstanding: "Outstanding",
};

export type { FeeBadgeVariant };

export function FeeStatusBadge({
  variant,
  className,
  children,
}: {
  variant: FeeBadgeVariant;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <span className={cn(feeStatusBadgeVariants({ variant }), className)}>
      {children ?? LABELS[variant]}
    </span>
  );
}
