import { AlertTriangle } from "lucide-react";
import { Card } from "../../../components/ui";

export function AdminTableSkeleton({
  title = "Loading data...",
  rows = 8,
}: {
  title?: string;
  rows?: number;
}) {
  return (
    <Card noPadding className="rounded-2xl">
      <div className="border-b border-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300">
        {title}
      </div>
      <div className="space-y-1 overflow-x-auto p-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="grid min-w-[720px] grid-cols-[28px_2fr_1fr_1fr_1fr_1fr] items-center gap-3 rounded-lg px-2 py-2"
          >
            <div className="h-3 w-3 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-10 animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function AdminDetailEmpty({
  message,
}: {
  message: string;
}) {
  return (
    <Card className="rounded-2xl p-8 text-center text-sm text-slate-500">
      {message}
    </Card>
  );
}

export function AdminFilterHint({ params }: { params: string[] }) {
  return (
    <Card className="mt-3 border border-slate-200 bg-slate-50 px-4 py-2">
      <p className="text-xs text-slate-500">
        URL filters in use:{" "}
        {params.map((param, idx) => (
          <span key={param}>
            <code className="rounded bg-white px-1.5 py-0.5">{param}</code>
            {idx < params.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>
    </Card>
  );
}

export function AdminWarningPill({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
      <AlertTriangle className="h-3.5 w-3.5" />
      {text}
    </div>
  );
}
