import { Building2, Layers, Users } from "lucide-react";
import {
  BATCHES,
  DEPARTMENTS,
  SECTIONS,
} from "../../../data/teacherWorkspaceSeed";
import { useTeacherWorkspaceStore } from "../../../stores/teacherWorkspaceStore";
import { cn } from "../../../lib/utils";

export function ContextBar() {
  const departmentId = useTeacherWorkspaceStore((s) => s.departmentId);
  const batchId = useTeacherWorkspaceStore((s) => s.batchId);
  const sectionId = useTeacherWorkspaceStore((s) => s.sectionId);
  const setContext = useTeacherWorkspaceStore((s) => s.setContext);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <span className="hidden sm:inline">Context</span>
        <span className="text-slate-300">/</span>
        <span className="text-blue-600">No page reload</span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Building2 className="h-3.5 w-3.5" />
            Department
          </span>
          <select
            value={departmentId}
            onChange={(e) => setContext({ departmentId: e.target.value })}
            className={cn(
              "min-w-[200px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-800",
              "outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            )}
          >
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Layers className="h-3.5 w-3.5" />
            Batch
          </span>
          <select
            value={batchId}
            onChange={(e) => setContext({ batchId: e.target.value })}
            className={cn(
              "min-w-[120px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-800",
              "outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            )}
          >
            {BATCHES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Users className="h-3.5 w-3.5" />
            Section
          </span>
          <select
            value={sectionId}
            onChange={(e) => setContext({ sectionId: e.target.value })}
            className={cn(
              "min-w-[120px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-800",
              "outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            )}
          >
            {SECTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
