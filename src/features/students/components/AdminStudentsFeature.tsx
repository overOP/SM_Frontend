import { useCallback, useEffect, useMemo, useState } from "react";
import { ShieldCheck, Users, GraduationCap, AlertTriangle } from "lucide-react";
import { Button, Card } from "../../../components/ui";
import type { Student } from "../types";
import {
  fetchClassSectionOptions,
  fetchStudentById,
  fetchStudents,
} from "../services/studentsService";
import { useStudentFilters } from "../hooks/useStudentFilters";
import { StudentFilterBar } from "./StudentFilterBar";
import { StudentDataTable } from "./StudentDataTable";
import { StudentTableSkeleton } from "./StudentTableSkeleton";
import { BulkImportModal } from "./BulkImportModal";
import { AdminKpiRow } from "../../../components/Admin/shared/AdminKpiRow";
import { StudentManagementDetailView } from "./StudentManagementDetailView";
import {
  AdminDetailEmpty,
  AdminFilterHint,
} from "../../shared/components/AdminFeatureStates";

export function AdminStudentsFeature() {
  const { filters, setSearch, setClassName, setSection, setPage, clear } =
    useStudentFilters();

  const [rows, setRows] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [classOptions, setClassOptions] = useState<string[]>(["all"]);
  const [sectionsByClass, setSectionsByClass] = useState<Record<string, string[]>>({});
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    avgAttendance: 0,
  });
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchStudents(filters);
    setRows(data.rows);
    setTotal(data.total);
    setPageSize(data.pageSize);
    setStats(data.stats);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const init = async () => {
      const options = await fetchClassSectionOptions();
      setClassOptions(["all", ...options.classes]);
      setSectionsByClass(options.sectionsByClass);
    };
    void init();
  }, []);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [rows]);

  useEffect(() => {
    if (rows.length === 0) {
      setActiveStudentId(null);
      setActiveStudent(null);
      return;
    }
    if (!activeStudentId || !rows.some((r) => r.id === activeStudentId)) {
      setActiveStudentId(rows[0].id);
    }
  }, [rows, activeStudentId]);

  useEffect(() => {
    if (!activeStudentId) return;
    const local = rows.find((r) => r.id === activeStudentId);
    if (local) {
      setActiveStudent(local);
      return;
    }
    void (async () => {
      const fetched = await fetchStudentById(activeStudentId);
      if (fetched) setActiveStudent(fetched);
    })();
  }, [activeStudentId, rows]);

  const sectionOptions = useMemo(() => {
    if (filters.className === "all") return ["all"];
    const list = sectionsByClass[filters.className] ?? [];
    return ["all", ...list];
  }, [filters.className, sectionsByClass]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const toggleOne = (studentId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  };

  const toggleAllPage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allSelected = rows.every((r) => next.has(r.id));
      if (allSelected) rows.forEach((r) => next.delete(r.id));
      else rows.forEach((r) => next.add(r.id));
      return next;
    });
  };

  const exportRows = () => {
    const header = "Name,AdmissionID,Class,Section,Email,Guardian,Status,Attendance";
    const lines = rows.map(
      (row) =>
        `${row.name},${row.admissionId},${row.className},${row.section},${row.email},${row.guardian},${row.status},${row.attendancePct}`
    );
    const blob = new Blob([[header, ...lines].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "students.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const kpiItems = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      colorClass: "text-blue-600",
      bgClass: "bg-blue-50",
    },
    {
      title: "Active",
      value: stats.activeStudents,
      icon: ShieldCheck,
      colorClass: "text-emerald-600",
      bgClass: "bg-emerald-50",
    },
    {
      title: "Avg Attendance",
      value: `${stats.avgAttendance}%`,
      icon: GraduationCap,
      colorClass: "text-violet-600",
      bgClass: "bg-violet-50",
    },
    {
      title: "Selected",
      value: selectedIds.size,
      icon: AlertTriangle,
      colorClass: "text-amber-600",
      bgClass: "bg-amber-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <AdminKpiRow items={kpiItems} />

      <StudentFilterBar
        search={filters.search}
        className={filters.className}
        section={filters.section}
        classOptions={classOptions}
        sectionOptions={sectionOptions}
        onSearchChange={setSearch}
        onClassChange={setClassName}
        onSectionChange={setSection}
        onOpenImport={() => setIsImportOpen(true)}
        onExport={exportRows}
        totalInView={total}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_1fr]">
        <div>
          {loading ? (
            <StudentTableSkeleton />
          ) : (
            <StudentDataTable
              rows={rows}
              selectedIds={selectedIds}
              onToggleOne={toggleOne}
              onToggleAllPage={toggleAllPage}
              onOpenDetail={(studentId) => setActiveStudentId(studentId)}
            />
          )}

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
        </div>

        {activeStudent ? (
          <StudentManagementDetailView
            student={activeStudent}
            onStudentPatched={(next) => {
              setActiveStudent(next);
              setRows((prev) => prev.map((row) => (row.id === next.id ? next : row)));
            }}
          />
        ) : (
          <AdminDetailEmpty message="Select a student to open the management detail view." />
        )}
      </div>

      <AdminFilterHint params={["search", "class", "section", "page"]} />

      <BulkImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImported={load}
      />
    </div>
  );
}
