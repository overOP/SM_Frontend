import type { LucideIcon } from "lucide-react";
import { Search } from "lucide-react";
import { Card } from "../../ui";

export function StudentMetricSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {Array.from({ length: cards }).map((_, idx) => (
        <Card key={idx} className="border-slate-200">
          <div className="animate-pulse space-y-3">
            <div className="h-3 w-24 rounded bg-slate-200" />
            <div className="h-8 w-20 rounded bg-slate-200" />
            <div className="h-3 w-28 rounded bg-slate-100" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function StudentTableSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <Card className="border-slate-200">
      <div className="animate-pulse space-y-3">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="h-14 rounded-xl bg-slate-100" />
        ))}
      </div>
    </Card>
  );
}

export function StudentCalendarSkeleton() {
  return (
    <Card className="border-slate-200">
      <div className="animate-pulse space-y-4">
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, idx) => (
            <div key={idx} className="h-3 rounded bg-slate-200" />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, idx) => (
            <div key={idx} className="h-16 rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
    </Card>
  );
}

export function StudentCardGridSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: cards }).map((_, idx) => (
        <Card key={idx} className="border-slate-200">
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="h-5 w-52 rounded bg-slate-200" />
            <div className="h-3 w-full rounded bg-slate-100" />
            <div className="h-3 w-4/5 rounded bg-slate-100" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function StudentEmptyState({
  title,
  description,
  icon: Icon = Search,
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
}) {
  return (
    <Card className="border-slate-200 py-10 text-center">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Icon size={22} />
      </div>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </Card>
  );
}

export function StudentFilterHint({ params }: { params: string[] }) {
  return (
    <Card className="border-slate-200 bg-slate-50">
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
