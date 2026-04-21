import {
  Suspense,
  useEffect,
  use,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  Award,
  BookOpen,
  ChevronDown,
  GraduationCap,
  Loader2,
  Printer,
  Search,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSearchParams } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import { loadStudentResultsBundle, STUDENT_DEMO_ID } from "../../data/studentResultsData";
import { canStudentViewResultRow } from "../../lib/resultsPermissions";
import { rowPercentage } from "../../lib/gpa";
import type { AcademicResultDTO } from "../../types/results";
import { Card, Button, Input, Select } from "../ui";
import { StudentFilterHint } from "./shared/StudentModuleStates";

function gradeTone(pct: number, letter: string): string {
  if (letter === "F" || pct < 40) {
    return "text-rose-600 bg-rose-50 border-rose-100";
  }
  if (pct >= 90 || letter === "A+") {
    return "text-amber-800 bg-amber-50 border-amber-200 ring-1 ring-amber-200/60";
  }
  if (pct >= 80) {
    return "text-emerald-700 bg-emerald-50 border-emerald-100";
  }
  return "text-slate-700 bg-slate-50 border-slate-100";
}

function ResultsBody({ userId }: { userId: string }) {
  const bundle = use(loadStudentResultsBundle(userId));
  const [searchParams, setSearchParams] = useSearchParams();

  const [semesterLabel, setSemesterLabel] = useState(searchParams.get("semester") ?? "All semesters");
  const [categoryLabel, setCategoryLabel] = useState(searchParams.get("category") ?? "All categories");
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const subjectMap = useMemo(
    () => new Map(bundle.subjects.map((s) => [s.id, s])),
    [bundle.subjects]
  );

  const filtered = useMemo(() => {
    const semesterId =
      semesterLabel === "All semesters"
        ? null
        : bundle.semesters.find((s) => s.label === semesterLabel)?.id ?? null;
    const category =
      categoryLabel === "All categories" ? null : categoryLabel;

    return bundle.results.filter((r) => {
      if (!canStudentViewResultRow(userId, r.studentId)) return false;
      if (r.status !== "Published") return false;
      if (semesterId && r.semesterId !== semesterId) return false;
      const sub = subjectMap.get(r.subjectId);
      if (!sub) return false;
      if (category && sub.category !== category) return false;
      const q = query.trim().toLowerCase();
      if (q && !sub.name.toLowerCase().includes(q) && !sub.code.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [bundle.results, bundle.semesters, subjectMap, semesterLabel, categoryLabel, query, userId]);

  const categories = useMemo(() => {
    const s = new Set<string>();
    bundle.subjects.forEach((x) => s.add(x.category));
    return ["all", ...[...s].sort()];
  }, [bundle.subjects]);

  const semesterLabels = useMemo(
    () => ["All semesters", ...bundle.semesters.sort((a, b) => a.order - b.order).map((s) => s.label)],
    [bundle.semesters]
  );

  useEffect(() => {
    const next: Record<string, string> = {};
    if (semesterLabel !== "All semesters") next.semester = semesterLabel;
    if (categoryLabel !== "All categories") next.category = categoryLabel;
    if (query.trim()) next.q = query.trim();
    setSearchParams(next, { replace: true });
  }, [semesterLabel, categoryLabel, query, setSearchParams]);

  const chartData = bundle.overview.semesterTrend.map((t) => ({
    name: t.semesterLabel,
    sgpa: t.sgpa,
  }));

  if (userId && userId !== STUDENT_DEMO_ID) {
    return (
      <Card className="border-none p-10 text-center rounded-[2rem]">
        <p className="text-slate-600 font-medium">No published results are available for this account in the demo.</p>
      </Card>
    );
  }

  return (
    <div id="student-results-root" className="space-y-8 print:space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between print:hidden">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Academics</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">Results & transcript</h2>
          <p className="text-sm text-slate-500 font-medium">
            {bundle.student.name} · {bundle.student.rollNo}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="rounded-2xl gap-2 border-slate-200"
          onClick={() => window.print()}
        >
          <Printer className="h-4 w-4" />
          Export / Print
        </Button>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 print:grid-cols-3 print:gap-3">
        <Card className="border-none bg-white p-6 shadow-sm rounded-[2rem] print:rounded-xl print:p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">CGPA</p>
            <GraduationCap className="h-5 w-5 text-blue-500 print:hidden" />
          </div>
          <p className="mt-3 text-4xl font-black text-slate-900 tracking-tighter">{bundle.overview.cgpa.toFixed(2)}</p>
          <p className="mt-1 text-xs font-bold text-emerald-600">Cumulative (published)</p>
        </Card>
        <Card className="border-none bg-white p-6 shadow-sm rounded-[2rem] print:rounded-xl print:p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Credits earned</p>
            <BookOpen className="h-5 w-5 text-violet-500 print:hidden" />
          </div>
          <p className="mt-3 text-4xl font-black text-slate-900 tracking-tighter">{bundle.overview.creditsEarned}</p>
          <p className="mt-1 text-xs font-bold text-slate-400">Passed courses</p>
        </Card>
        <Card className="border-none bg-white p-6 shadow-sm rounded-[2rem] print:rounded-xl print:p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Class rank</p>
            <Award className="h-5 w-5 text-amber-500 print:hidden" />
          </div>
          <p className="mt-3 text-4xl font-black text-slate-900 tracking-tighter">#{bundle.overview.currentRank}</p>
          <p className="mt-1 text-xs font-bold text-slate-400">Of 120 students</p>
        </Card>
      </div>

      {/* Chart */}
      <Card className="border-none bg-white p-6 shadow-sm rounded-[2.5rem] print:hidden">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">SGPA trend</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Last four semesters</p>
          </div>
          <TrendingUp className="h-5 w-5 text-slate-300" />
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} width={32} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: "rgba(59,130,246,0.06)" }}
                contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}
              />
              <Bar dataKey="sgpa" fill="#3b82f6" radius={[10, 10, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4 print:hidden">
        <Input
          placeholder="Search subject or code..."
          icon={Search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          title="Search subject or code"
        />
        <Select
          options={semesterLabels}
          value={semesterLabel}
          onChange={(e) => setSemesterLabel(e.target.value)}
          title="Filter by semester"
        />
        <Select
          options={categories.map((c) => (c === "all" ? "All categories" : c))}
          value={categoryLabel}
          onChange={(e) => setCategoryLabel(e.target.value)}
          title="Filter by category"
        />
        <Button
          type="button"
          variant="outline"
          className="rounded-xl border-slate-200"
          onClick={() => {
            setSemesterLabel("All semesters");
            setCategoryLabel("All categories");
            setQuery("");
          }}
          title="Reset all filters"
        >
          Reset filters
        </Button>
      </div>

      <div className="print:hidden">
        <StatusPill text={`${filtered.length} published rows`} />
      </div>

      <div className="print:hidden">
        <StudentFilterHint params={["q", "semester", "category"]} />
      </div>

      {/* Desktop table */}
      <Card className="hidden overflow-hidden border-none shadow-sm md:block print:block print:shadow-none rounded-[2rem] print:rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Subject</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Credits</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Internal</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Practical</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Theory</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Total</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Grade</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const sub = subjectMap.get(r.subjectId);
                const pct = rowPercentage(r);
                const tone = gradeTone(pct, r.gradeLetter);
                return (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-800">{sub?.name ?? "—"}</p>
                      <p className="text-[10px] font-bold text-slate-400">{sub?.code}</p>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-600">{sub?.category}</td>
                    <td className="px-4 py-3 text-sm font-bold text-slate-700">{sub?.credits}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {r.internalMarks}/{r.maxInternal}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {r.practicalMarks}/{r.maxPractical}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {r.theoryMarks}/{r.maxTheory}
                    </td>
                    <td className="px-4 py-3 text-sm font-black text-slate-800">
                      {r.totalMarks}/{rowMax(r)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-lg border px-2 py-1 text-[11px] font-black ${tone}`}>
                        {r.gradeLetter}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="py-16 text-center text-sm font-medium text-slate-400">No rows match your filters.</p>
        )}
      </Card>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden print:hidden">
        {filtered.map((r) => (
          <ResultMobileCard key={r.id} r={r} subjectMap={subjectMap} />
        ))}
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-400">No rows match your filters.</p>
        )}
      </div>

      {/* Print-only transcript header */}
      <div className="hidden print:block print:pt-4">
        <p className="text-center text-xs font-bold text-slate-500">Official transcript (demo) — {bundle.student.name}</p>
      </div>
    </div>
  );
}

function StatusPill({ text }: { text: string }) {
  return (
    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
      {text}
    </span>
  );
}

function rowMax(r: AcademicResultDTO): number {
  return r.maxInternal + r.maxPractical + r.maxTheory;
}

function ResultMobileCard({
  r,
  subjectMap,
}: {
  r: AcademicResultDTO;
  subjectMap: Map<string, { name: string; code: string; category: string; credits: number }>;
}) {
  const sub = subjectMap.get(r.subjectId);
  const pct = rowPercentage(r);
  const tone = gradeTone(pct, r.gradeLetter);
  return (
    <details className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate font-black text-slate-900">{sub?.name}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{sub?.code}</p>
        </div>
        <span className={`shrink-0 rounded-lg border px-2 py-1 text-[11px] font-black ${tone}`}>{r.gradeLetter}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-180" />
      </summary>
      <div className="space-y-2 border-t border-slate-50 px-4 pb-4 pt-2 text-sm">
        <div className="flex justify-between text-slate-500">
          <span>Credits</span>
          <span className="font-bold text-slate-800">{sub?.credits}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Internal</span>
          <span className="font-medium text-slate-700">
            {r.internalMarks}/{r.maxInternal}
          </span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Practical</span>
          <span className="font-medium text-slate-700">
            {r.practicalMarks}/{r.maxPractical}
          </span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Theory</span>
          <span className="font-medium text-slate-700">
            {r.theoryMarks}/{r.maxTheory}
          </span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Total</span>
          <span className="font-black text-slate-900">
            {r.totalMarks}/{rowMax(r)}
          </span>
        </div>
      </div>
    </details>
  );
}

function ResultsFallback() {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-[2rem] border border-dashed border-slate-200 bg-white">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <p className="text-sm font-bold text-slate-500">Loading results…</p>
    </div>
  );
}

export default function StudentResults() {
  const auth = useContext(AuthContext);
  const userId = auth?.user?.id ?? "";

  return (
    <Suspense fallback={<ResultsFallback />}>
      <ResultsBody userId={userId} />
    </Suspense>
  );
}
