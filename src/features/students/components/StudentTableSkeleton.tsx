import { Card } from "../../../components/ui";

export function StudentTableSkeleton() {
  return (
    <Card noPadding className="overflow-hidden rounded-2xl">
      <div className="border-b border-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300">
        Loading students...
      </div>
      <div className="space-y-1 p-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[28px_2fr_1fr_1fr_1fr_1fr] items-center gap-3 rounded-lg px-2 py-2"
          >
            <div className="h-3 w-3 rounded bg-slate-200 animate-pulse" />
            <div className="h-3 w-32 rounded bg-slate-200 animate-pulse" />
            <div className="h-3 w-20 rounded bg-slate-200 animate-pulse" />
            <div className="h-3 w-16 rounded bg-slate-200 animate-pulse" />
            <div className="h-3 w-16 rounded bg-slate-200 animate-pulse" />
            <div className="h-3 w-10 rounded bg-slate-200 animate-pulse" />
          </div>
        ))}
      </div>
    </Card>
  );
}
