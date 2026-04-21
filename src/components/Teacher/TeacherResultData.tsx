import { useCallback, useContext, useMemo, useState } from "react";
import { AlertTriangle, BookOpen, Save, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AuthContext } from "../../context/AuthContext";
import type { Role } from "../../types";
import {
  DEMO_STUDENT_NAMES,
  demoSubjects,
  getTeacherResultRowsForFaculty,
} from "../../data/studentResultsData";
import { percentageToLetter, rowMaxTotal, rowPercentage } from "../../lib/gpa";
import { canTeacherEditResultRow } from "../../lib/resultsPermissions";
import type { AcademicResultDTO } from "../../types/results";
import { Button, Card, DataTable, type Column } from "../ui";

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

interface SubjectInsight {
  subjectId: string;
  avgPct: number;
  rows: number;
}

type StatusFilter = "All" | AcademicResultDTO["status"];

export default function TeacherResultData() {
  const auth = useContext(AuthContext);
  const facultyId = auth?.user?.id ?? "";
  const role = auth?.user?.role;
  return <TeacherResultDataInner key={facultyId || "none"} facultyId={facultyId} role={role} />;
}

function TeacherResultDataInner({
  facultyId,
  role,
}: {
  facultyId: string;
  role: Role | undefined;
}) {
  const [subjectFilter, setSubjectFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [rows, setRows] = useState<AcademicResultDTO[]>(() =>
    facultyId ? getTeacherResultRowsForFaculty(facultyId) : []
  );

  const subjectName = useMemo(() => {
    const m = new Map(demoSubjects.map((s) => [s.id, s.name]));
    return (id: string) => m.get(id) ?? id;
  }, []);

  const updateRow = useCallback((id: string, patch: Partial<AcademicResultDTO>) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (!canTeacherEditResultRow(role, facultyId, r)) return r;
        const next = { ...r, ...patch };
        next.totalMarks = next.internalMarks + next.practicalMarks + next.theoryMarks;
        const pct = rowPercentage(next);
        next.gradeLetter = percentageToLetter(pct);
        return next;
      })
    );
  }, [role, facultyId]);

  const filteredRows = useMemo(
    () =>
      rows.filter((r) => {
        const subjectOk = subjectFilter === "All" || r.subjectId === subjectFilter;
        const statusOk = statusFilter === "All" || r.status === statusFilter;
        return subjectOk && statusOk;
      }),
    [rows, statusFilter, subjectFilter]
  );

  const summary = useMemo(() => {
    const total = filteredRows.length;
    if (total === 0) {
      return {
        avgPct: 0,
        passRate: 0,
        draftCount: 0,
        underReviewCount: 0,
        publishedCount: 0,
      };
    }
    const pctTotal = filteredRows.reduce((acc, r) => acc + rowPercentage(r), 0);
    const passCount = filteredRows.filter((r) => rowPercentage(r) >= 40).length;
    const draftCount = filteredRows.filter((r) => r.status === "Draft").length;
    const underReviewCount = filteredRows.filter((r) => r.status === "UnderReview").length;
    const publishedCount = filteredRows.filter((r) => r.status === "Published").length;
    return {
      avgPct: pctTotal / total,
      passRate: (passCount / total) * 100,
      draftCount,
      underReviewCount,
      publishedCount,
    };
  }, [filteredRows]);

  const subjectInsights = useMemo<SubjectInsight[]>(() => {
    const bySubject = new Map<string, { pctTotal: number; rows: number }>();
    for (const row of filteredRows) {
      const prev = bySubject.get(row.subjectId) ?? { pctTotal: 0, rows: 0 };
      prev.pctTotal += rowPercentage(row);
      prev.rows += 1;
      bySubject.set(row.subjectId, prev);
    }
    return Array.from(bySubject.entries()).map(([subjectId, stats]) => ({
      subjectId,
      rows: stats.rows,
      avgPct: stats.rows ? stats.pctTotal / stats.rows : 0,
    }));
  }, [filteredRows]);

  const atRisk = useMemo(
    () => filteredRows.filter((r) => rowPercentage(r) < 50),
    [filteredRows]
  );

  const subjectOptions = useMemo(
    () => ["All", ...new Set(rows.map((r) => r.subjectId))],
    [rows]
  );

  const columns: Column<AcademicResultDTO>[] = useMemo(
    () => [
      {
        header: "Student",
        render: (row) => (
          <span className="font-bold text-slate-800">
            {DEMO_STUDENT_NAMES[row.studentId] ?? row.studentId}
          </span>
        ),
      },
      { header: "Subject", render: (row) => <span className="text-slate-700">{subjectName(row.subjectId)}</span> },
      {
        header: "Internal",
        render: (row) =>
          canTeacherEditResultRow(role, facultyId, row) ? (
            <input
              type="number"
              className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-sm font-bold"
              value={row.internalMarks}
              min={0}
              max={row.maxInternal}
              title={`Internal marks for ${DEMO_STUDENT_NAMES[row.studentId] ?? row.studentId}`}
              aria-label={`Internal marks for ${DEMO_STUDENT_NAMES[row.studentId] ?? row.studentId}`}
              placeholder="0"
              onChange={(e) =>
                updateRow(row.id, {
                  internalMarks: clamp(Number(e.target.value), 0, row.maxInternal),
                })
              }
            />
          ) : (
            <span>{row.internalMarks}</span>
          ),
      },
      {
        header: "Practical",
        render: (row) =>
          canTeacherEditResultRow(role, facultyId, row) ? (
            <input
              type="number"
              className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-sm font-bold"
              value={row.practicalMarks}
              min={0}
              max={row.maxPractical}
              title={`Practical marks for ${DEMO_STUDENT_NAMES[row.studentId] ?? row.studentId}`}
              aria-label={`Practical marks for ${DEMO_STUDENT_NAMES[row.studentId] ?? row.studentId}`}
              placeholder="0"
              onChange={(e) =>
                updateRow(row.id, {
                  practicalMarks: clamp(Number(e.target.value), 0, row.maxPractical),
                })
              }
            />
          ) : (
            <span>{row.practicalMarks}</span>
          ),
      },
      {
        header: "Theory",
        render: (row) =>
          canTeacherEditResultRow(role, facultyId, row) ? (
            <input
              type="number"
              className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-sm font-bold"
              value={row.theoryMarks}
              min={0}
              max={row.maxTheory}
              title={`Theory marks for ${DEMO_STUDENT_NAMES[row.studentId] ?? row.studentId}`}
              aria-label={`Theory marks for ${DEMO_STUDENT_NAMES[row.studentId] ?? row.studentId}`}
              placeholder="0"
              onChange={(e) =>
                updateRow(row.id, {
                  theoryMarks: clamp(Number(e.target.value), 0, row.maxTheory),
                })
              }
            />
          ) : (
            <span>{row.theoryMarks}</span>
          ),
      },
      {
        header: "Total / Max",
        render: (row) => (
          <span className="font-black text-slate-800">
            {row.totalMarks}/{rowMaxTotal(row)}
          </span>
        ),
      },
      {
        header: "Grade",
        render: (row) => {
          const pct = rowPercentage(row);
          const fail = pct < 40;
          const top = pct >= 90;
          return (
            <span
              className={`rounded-md border px-2 py-0.5 text-[10px] font-black ${
                fail
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : top
                    ? "border-amber-200 bg-amber-50 text-amber-900"
                    : "border-emerald-100 bg-emerald-50 text-emerald-800"
              }`}
            >
              {row.gradeLetter}
            </span>
          );
        },
      },
      {
        header: "Status",
        accessor: "status",
      },
    ],
    [role, facultyId, subjectName, updateRow]
  );

  if (!facultyId || rows.length === 0) {
    return (
      <Card className="rounded-2xl border-none p-10 text-center">
        <BookOpen className="mx-auto mb-3 h-10 w-10 text-slate-300" />
        <p className="font-bold text-slate-600">No assigned subject results in the demo, or sign in as the teacher account.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 p-2 md:p-0">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">My subject results</h1>
          <p className="text-sm text-slate-500">
            Modern results desk: live filters, quality signals, and inline grading.
          </p>
        </div>
        <Button variant="primary" className="gap-2 rounded-xl" type="button" onClick={() => {}}>
          <Save className="h-4 w-4" />
          Save (local demo)
        </Button>
      </div>

      <Card className="rounded-2xl border border-slate-100 p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <label className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Subject
            </span>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
            >
              {subjectOptions.map((id) => (
                <option key={id} value={id}>
                  {id === "All" ? "All subjects" : subjectName(id)}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Publish status
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="All">All statuses</option>
              <option value="Draft">Draft</option>
              <option value="UnderReview">Under review</option>
              <option value="Published">Published</option>
            </select>
          </label>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Quality signal
            </p>
            <div className="mt-1 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-semibold text-slate-800">
                Avg {summary.avgPct.toFixed(1)}% · Pass {summary.passRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Rows in view</p>
          <p className="mt-1 text-2xl font-black text-slate-900">{filteredRows.length}</p>
        </Card>
        <Card className="rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Published</p>
          <p className="mt-1 text-2xl font-black text-emerald-700">{summary.publishedCount}</p>
        </Card>
        <Card className="rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Pending review</p>
          <p className="mt-1 text-2xl font-black text-amber-700">{summary.underReviewCount}</p>
        </Card>
        <Card className="rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">Draft</p>
          <p className="mt-1 text-2xl font-black text-slate-800">{summary.draftCount}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="rounded-2xl border border-slate-100 p-4 shadow-sm xl:col-span-2">
          <h3 className="mb-1 text-sm font-black text-slate-800">Subject performance</h3>
          <p className="mb-4 text-xs text-slate-500">Average percentage by selected subject scope</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectInsights}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="subjectId"
                  tickFormatter={(id) => subjectName(id)}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value) => `${Number(value).toFixed(1)}%`}
                  labelFormatter={(id) => subjectName(String(id))}
                />
                <Bar dataKey="avgPct" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl border border-slate-100 p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h3 className="text-sm font-black text-slate-800">At-risk rows</h3>
          </div>
          {atRisk.length === 0 ? (
            <p className="text-xs text-slate-500">No rows below 50% in this view.</p>
          ) : (
            <div className="space-y-2">
              {atRisk.slice(0, 5).map((r) => (
                <div key={r.id} className="rounded-xl border border-amber-100 bg-amber-50 px-3 py-2">
                  <p className="text-xs font-bold text-slate-800">
                    {(DEMO_STUDENT_NAMES[r.studentId] ?? r.studentId)} · {subjectName(r.subjectId)}
                  </p>
                  <p className="text-[11px] text-amber-800">
                    {rowPercentage(r).toFixed(1)}% · {r.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card noPadding className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
        <DataTable columns={columns} data={filteredRows} emptyMessage="No rows for selected filters." />
      </Card>

    </div>
  );
}
