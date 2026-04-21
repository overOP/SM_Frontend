import { useMemo, useState } from "react";
import { Calendar, Check, Cloud, Moon, Users, X } from "lucide-react";
import { filterStudents } from "../../../data/teacherWorkspaceSeed";
import {
  buildSessionKey,
  useTeacherAttendanceStore,
  type AttendanceMark,
} from "../../../stores/teacherAttendanceStore";
import { useTeacherWorkspaceStore } from "../../../stores/teacherWorkspaceStore";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/Button";

const MARK_ORDER: AttendanceMark[] = ["present", "absent", "late"];

const LABEL: Record<AttendanceMark, string> = {
  present: "P",
  absent: "A",
  late: "L",
};

export function AttendanceGrid() {
  const departmentId = useTeacherWorkspaceStore((s) => s.departmentId);
  const batchId = useTeacherWorkspaceStore((s) => s.batchId);
  const sectionId = useTeacherWorkspaceStore((s) => s.sectionId);
  const bySession = useTeacherAttendanceStore((s) => s.bySession);
  const setMark = useTeacherAttendanceStore((s) => s.setMark);
  const bulkSet = useTeacherAttendanceStore((s) => s.bulkSet);

  const [dateIso, setDateIso] = useState(() => new Date().toISOString().slice(0, 10));

  const students = useMemo(
    () => filterStudents(departmentId, batchId, sectionId),
    [departmentId, batchId, sectionId]
  );

  const sessionKey = useMemo(
    () => buildSessionKey(departmentId, batchId, sectionId, dateIso),
    [departmentId, batchId, sectionId, dateIso]
  );

  const rowMap = bySession[sessionKey] ?? {};

  const bulk = (mark: AttendanceMark) => {
    bulkSet(
      sessionKey,
      students.map((s) => s.id),
      mark
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <Calendar className="h-4 w-4 text-slate-400" />
            <input
              type="date"
              value={dateIso}
              onChange={(e) => setDateIso(e.target.value)}
              title="Select attendance date"
              aria-label="Select attendance date"
              className="bg-transparent text-sm font-bold text-slate-800 outline-none"
            />
          </div>
          <p className="text-xs font-medium text-slate-500">
            Session <span className="font-mono text-[10px] text-slate-600">{sessionKey}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Bulk
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 gap-1 rounded-lg px-2 text-[10px] font-black uppercase"
            onClick={() => bulk("present")}
          >
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            All present
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 gap-1 rounded-lg px-2 text-[10px] font-black uppercase"
            onClick={() => bulk("absent")}
          >
            <X className="h-3.5 w-3.5 text-rose-600" />
            All absent
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 gap-1 rounded-lg px-2 text-[10px] font-black uppercase"
            onClick={() => bulk("late")}
          >
            <Moon className="h-3.5 w-3.5 text-amber-600" />
            All late
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2 text-xs font-medium text-emerald-900">
        <Cloud className="h-4 w-4 shrink-0" />
        Optimistic UI: changes save locally immediately; background sync runs after edits (see console).
      </div>

      {students.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm font-medium text-slate-500">
          No students for this Department / Batch / Section. Change the context bar above.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[720px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Roll</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2 text-center">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Status
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => {
                const current = (rowMap[s.id] ?? "present") as AttendanceMark;
                return (
                  <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/80">
                    <td className="px-3 py-1.5 font-mono text-[10px] text-slate-400">{idx + 1}</td>
                    <td className="px-3 py-1.5 font-mono font-bold text-slate-700">{s.roll}</td>
                    <td className="px-3 py-1.5 font-semibold text-slate-800">{s.name}</td>
                    <td className="px-3 py-1.5">
                      <div className="flex justify-center gap-1">
                        {MARK_ORDER.map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setMark(sessionKey, s.id, m)}
                            className={cn(
                              "h-8 min-w-[2.25rem] rounded-lg border text-[10px] font-black uppercase transition",
                              current === m
                                ? m === "present"
                                  ? "border-emerald-500 bg-emerald-600 text-white shadow-sm"
                                  : m === "absent"
                                    ? "border-rose-500 bg-rose-600 text-white shadow-sm"
                                    : "border-amber-500 bg-amber-500 text-white shadow-sm"
                                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                            )}
                          >
                            {LABEL[m]}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
