import { useMemo, useState } from "react";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, Select } from "../../../components/ui";
import type { AttendanceStatus, AttendanceStudent } from "../types";
import {
  fetchAttendanceHistory,
  updateAttendanceStatus,
} from "../services/attendanceService";

interface AttendanceDetailViewProps {
  student: AttendanceStudent;
  onPatched: (next: AttendanceStudent) => void;
}

function Dot({ status }: { status: AttendanceStatus }) {
  if (status === "Present") {
    return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  }
  if (status === "Absent") return <XCircle className="h-4 w-4 text-rose-600" />;
  return <Clock3 className="h-4 w-4 text-amber-600" />;
}

export function AttendanceDetailView({ student, onPatched }: AttendanceDetailViewProps) {
  const [toast, setToast] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const historyQuery = useQuery({
    queryKey: ["attendance-history", student.id],
    queryFn: () => fetchAttendanceHistory(student.id),
    staleTime: 30000,
  });

  const statusMutation = useMutation({
    mutationFn: (status: AttendanceStatus) => updateAttendanceStatus(student.id, status),
    onMutate: async (next) => {
      const prev = student.status;
      onPatched({ ...student, status: next });
      return { prev };
    },
    onError: (error, _next, context) => {
      onPatched({ ...student, status: context?.prev ?? student.status });
      setToast({
        type: "err",
        text: error instanceof Error ? error.message : "Failed to update attendance.",
      });
    },
    onSuccess: (next) => {
      if (next) onPatched(next);
      setToast({ type: "ok", text: "Attendance updated." });
    },
  });

  const trend = useMemo(() => {
    const rows = historyQuery.data ?? [];
    const present = rows.filter((r) => r.status === "Present").length;
    return rows.length ? Math.round((present / rows.length) * 100) : student.attendancePct;
  }, [historyQuery.data, student.attendancePct]);

  return (
    <Card className="space-y-3 rounded-2xl p-4">
      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Attendance profile
        </p>
        <p className="mt-1 text-lg font-black text-slate-900">{student.name}</p>
        <p className="text-xs text-slate-500">
          {student.roll} · {student.className} · Section {student.section}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-100 p-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Current status
          </p>
          <Select
            options={["Present", "Absent", "On Leave"]}
            value={student.status}
            onChange={(e) => statusMutation.mutate(e.target.value as AttendanceStatus)}
            className="mt-2"
          />
        </div>
        <div className="rounded-xl border border-slate-100 p-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            7-day trend
          </p>
          <p className="mt-2 text-2xl font-black text-blue-700">{trend}%</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 p-3">
        <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
          Recent marks
        </p>
        <div className="space-y-1">
          {(historyQuery.data ?? []).map((row) => (
            <div
              key={`${row.date}-${row.status}`}
              className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
            >
              <span>{row.date}</span>
              <span className="inline-flex items-center gap-1 font-semibold">
                <Dot status={row.status} />
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {toast ? (
        <div
          className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
            toast.type === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {toast.text}
        </div>
      ) : null}
    </Card>
  );
}
