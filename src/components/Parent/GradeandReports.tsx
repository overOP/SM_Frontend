import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, Award, BookOpen, CheckCircle, FileDown, Search, TrendingUp } from "lucide-react";
import { Button, Card, DataTable, Input, StatCard, StatusBadge } from "../ui";
import { ParentMetricSkeleton, ParentTableSkeleton } from "./shared/ParentModuleStates";

type ExamCategory = "Unit Test" | "Mid-Term" | "Annual";

interface PerformanceRow {
  subject: string;
  marks: string;
  progress: number;
  grade: string;
  date: string;
  category: ExamCategory;
}

const PERFORMANCE_DATA: PerformanceRow[] = [
  { subject: "Mathematics", marks: "18/20", progress: 90, grade: "A+", date: "2026-02-10", category: "Unit Test" },
  { subject: "Science", marks: "15/20", progress: 75, grade: "B", date: "2026-02-12", category: "Unit Test" },
  { subject: "Mathematics", marks: "87/100", progress: 87, grade: "A", date: "2026-03-10", category: "Mid-Term" },
  { subject: "Science", marks: "92/100", progress: 92, grade: "A+", date: "2026-03-12", category: "Mid-Term" },
  { subject: "English", marks: "78/100", progress: 78, grade: "B+", date: "2026-03-14", category: "Mid-Term" },
  { subject: "Mathematics", marks: "95/100", progress: 95, grade: "A+", date: "2025-06-10", category: "Annual" },
];

function progressSegments(progress: number): number {
  return Math.max(1, Math.min(10, Math.round(progress / 10)));
}

export default function GradeandReports() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<ExamCategory>(
    (searchParams.get("exam") as ExamCategory) ?? "Mid-Term"
  );
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const next: Record<string, string> = { exam: activeTab };
    if (query.trim()) next.q = query.trim();
    setSearchParams(next, { replace: true });
  }, [activeTab, query, setSearchParams]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 340);
    return () => clearTimeout(timer);
  }, [activeTab, query]);

  const filteredData = useMemo(
    () =>
      PERFORMANCE_DATA.filter(
        (item) =>
          item.category === activeTab &&
          (item.subject.toLowerCase().includes(query.toLowerCase()) || item.grade.toLowerCase().includes(query.toLowerCase()))
      ),
    [activeTab, query]
  );

  const average = useMemo(() => {
    if (filteredData.length === 0) return 0;
    const sum = filteredData.reduce((acc, row) => acc + row.progress, 0);
    return Math.round(sum / filteredData.length);
  }, [filteredData]);

  const columns = [
    {
      header: "Subject",
      accessor: "subject" as keyof PerformanceRow,
      render: (row: PerformanceRow) => (
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-50 p-1.5 text-blue-600">
            <BookOpen size={14} />
          </div>
          <span className="font-bold text-slate-800">{row.subject}</span>
        </div>
      ),
    },
    { header: "Score", accessor: "marks" as keyof PerformanceRow },
    {
      header: "Weightage",
      accessor: "progress" as keyof PerformanceRow,
      render: (row: PerformanceRow) => (
        <div className="flex items-center gap-2">
          <div className="grid grid-cols-10 gap-0.5">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 w-2 rounded ${idx < progressSegments(row.progress) ? "bg-blue-600" : "bg-slate-200"}`}
              />
            ))}
          </div>
          <span className="text-[10px] font-black text-slate-400">{row.progress}%</span>
        </div>
      ),
    },
    {
      header: "Grade",
      accessor: "grade" as keyof PerformanceRow,
      render: (row: PerformanceRow) => (
        <StatusBadge status={row.grade} variant={row.grade.includes("A") ? "success" : "info"} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">Grades and reports</p>
            <h2 className="mt-1 text-xl font-black text-slate-900">Academic performance insights</h2>
            <p className="mt-1 text-sm text-slate-500">Review outcomes by exam category and monitor subject-level trends.</p>
          </div>
          <Button className="gap-2">
            <FileDown size={16} />
            Export report card
          </Button>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-1.5 w-fit">
        {(["Unit Test", "Mid-Term", "Annual"] as ExamCategory[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-6 py-2 text-sm font-black transition-all ${
              activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <ParentMetricSkeleton cards={3} />
          <ParentTableSkeleton rows={3} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard title={`${activeTab} Avg`} value={`${average}%`} icon={TrendingUp} />
            <StatCard title="Total Subjects" value={filteredData.length} icon={BookOpen} colorClass="text-indigo-600" bgClass="bg-indigo-50" />
            <StatCard title="Passing Status" value="Cleared" icon={CheckCircle} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card noPadding className="xl:col-span-2 border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <h3 className="text-sm font-bold text-slate-800">{activeTab} Results Breakdown</h3>
                <div className="w-56">
                  <Input
                    placeholder="Search subject or grade..."
                    icon={Search}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>
              <DataTable columns={columns} data={filteredData} emptyMessage="No results found for current filters." />
            </Card>

            <div className="space-y-6">
              <Card className="border-slate-200">
                <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-500">Exam insights</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3">
                    <TrendingUp className="shrink-0 text-blue-600" size={16} />
                    <p className="text-xs text-blue-800">
                      Performance in <strong>{activeTab}</strong> improved compared to the previous cycle.
                    </p>
                  </div>
                  <div className="flex gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3">
                    <AlertCircle className="shrink-0 text-amber-600" size={16} />
                    <p className="text-xs text-amber-800">
                      Science remains below desired target. Additional revision is recommended.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-900 text-white">
                <div className="mb-4 flex items-center gap-2">
                  <Award className="text-amber-400" size={18} />
                  <h4 className="text-sm font-black uppercase tracking-[0.15em]">Merit status</h4>
                </div>
                <p className="text-sm text-slate-300">
                  Current trend indicates strong likelihood of distinction in final term outcomes.
                </p>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}