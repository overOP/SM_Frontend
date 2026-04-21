import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, User, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button, Card } from "../../../components/ui";
import { AdminKpiRow } from "../../../components/Admin/shared/AdminKpiRow";
import type { AttendanceStatus, AttendanceStudent } from "../types";
import {
  bulkAttendanceStatus,
  fetchAttendanceClasses,
  fetchAttendanceRows,
  updateAttendanceStatus,
} from "../services/attendanceService";
import { useAttendanceFilters } from "../hooks/useAttendanceFilters";
import { AttendanceFilterBar } from "./AttendanceFilterBar";
import { AttendanceDataTable } from "./AttendanceDataTable";
import { AttendanceDetailView } from "./AttendanceDetailView";

export function AttendanceFeature() {
  const { filters, setClassName, setDateIso, setSearch, setPage, clear } =
    useAttendanceFilters();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);

  const classesQuery = useQuery({
    queryKey: ["attendance-classes"],
    queryFn: fetchAttendanceClasses,
    staleTime: 60000,
  });

  const rowsQuery = useQuery({
    queryKey: ["attendance-rows", filters],
    queryFn: () => fetchAttendanceRows(filters),
    staleTime: 10000,
  });

  const rows = rowsQuery.data?.rows ?? [];
  const stats = rowsQuery.data?.stats ?? {
    total: 0,
    present: 0,
    absent: 0,
    leave: 0,
    attendanceRate: 0,
  };
  const total = rowsQuery.data?.total ?? 0;
  const pageSize = rowsQuery.data?.pageSize ?? 10;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    setSelectedIds(new Set());
  }, [rows]);

  useEffect(() => {
    if (rows.length === 0) {
      setActiveId(null);
      return;
    }
    if (!activeId || !rows.some((r) => r.id === activeId)) {
      setActiveId(rows[0].id);
    }
  }, [rows, activeId]);

  const activeStudent = useMemo(
    () => rows.find((r) => r.id === activeId) ?? null,
    [rows, activeId]
  );

  const kpiItems = [
    { title: "Total", value: stats.total, icon: User },
    {
      title: "Present",
      value: stats.present,
      icon: CheckCircle2,
      colorClass: "text-emerald-600",
      bgClass: "bg-emerald-50",
    },
    {
      title: "Absent",
      value: stats.absent,
      icon: XCircle,
      colorClass: "text-rose-600",
      bgClass: "bg-rose-50",
    },
    {
      title: "On Leave",
      value: stats.leave,
      icon: Clock,
      colorClass: "text-amber-600",
      bgClass: "bg-amber-50",
    },
  ];

  const exportRows = () => {
    const header = "Name,Roll,Class,Section,Status,AttendancePct";
    const lines = rows.map(
      (r) =>
        `${r.name},${r.roll},${r.className},${r.section},${r.status},${r.attendancePct}`
    );
    const blob = new Blob([[header, ...lines].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `attendance-${filters.dateIso}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const updateOne = async (id: string, status: AttendanceStatus) => {
    await updateAttendanceStatus(id, status);
    await rowsQuery.refetch();
  };

  const patchLocal = (next: AttendanceStudent) => {
    rowsQuery.refetch();
    setActiveId(next.id);
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllPage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const all = rows.length > 0 && rows.every((r) => next.has(r.id));
      if (all) rows.forEach((r) => next.delete(r.id));
      else rows.forEach((r) => next.add(r.id));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <AdminKpiRow items={kpiItems} />

      <AttendanceFilterBar
        className={filters.className}
        dateIso={filters.dateIso}
        search={filters.search}
        classOptions={["all", ...(classesQuery.data ?? [])]}
        onClassChange={setClassName}
        onDateChange={setDateIso}
        onSearchChange={setSearch}
        onMarkAllPresent={async () => {
          await bulkAttendanceStatus(filters.className, "Present");
          await rowsQuery.refetch();
        }}
        onMarkAllAbsent={async () => {
          await bulkAttendanceStatus(filters.className, "Absent");
          await rowsQuery.refetch();
        }}
        onSave={() => void rowsQuery.refetch()}
        onExport={exportRows}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_1fr]">
        <div>
          <AttendanceDataTable
            rows={rows}
            selectedIds={selectedIds}
            onToggleOne={toggleOne}
            onToggleAllPage={toggleAllPage}
            onSetStatus={(id, status) => void updateOne(id, status)}
            onOpenDetail={setActiveId}
          />

          <Card className="mt-4 flex items-center justify-between rounded-2xl px-4 py-2">
            <p className="text-xs font-medium text-slate-500">
              Page {filters.page} of {totalPages} · {total} records
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, filters.page - 1))}
                disabled={filters.page <= 1}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, filters.page + 1))}
                disabled={filters.page >= totalPages}
              >
                Next
              </Button>
              <Button variant="ghost" size="sm" onClick={clear}>
                Reset
              </Button>
            </div>
          </Card>

          {stats.absent > 0 ? (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
              <AlertTriangle className="h-3.5 w-3.5" />
              {stats.absent} absent students require follow-up
            </div>
          ) : null}
        </div>

        {activeStudent ? (
          <AttendanceDetailView student={activeStudent} onPatched={patchLocal} />
        ) : (
          <Card className="rounded-2xl p-8 text-center text-sm text-slate-500">
            Select a row to open attendance detail.
          </Card>
        )}
      </div>
    </div>
  );
}
