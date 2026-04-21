import { Search } from "lucide-react";
import { Card } from "../../ui";

export function ParentMetricSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className={`grid grid-cols-1 gap-4 ${cards >= 4 ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-3"}`}>
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

export function ParentTableSkeleton({ rows = 4 }: { rows?: number }) {
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

export function ParentCalendarSkeleton() {
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

export function ParentCardGridSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: cards }).map((_, idx) => (
        <Card key={idx} className="border-slate-200">
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-4 w-40 rounded bg-slate-200" />
            <div className="h-3 w-full rounded bg-slate-100" />
            <div className="h-3 w-4/5 rounded bg-slate-100" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function ParentEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="border-slate-200 py-10 text-center">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Search size={20} />
      </div>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </Card>
  );
}
