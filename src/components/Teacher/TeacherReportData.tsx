import { useMemo, useState, type ReactNode } from "react";
import {
  Download,
  Users,
  ClipboardCheck,
  TrendingUp,
  GraduationCap,
  AlertTriangle,
  CalendarClock,
  FileCheck2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface KpiCardProps {
  label: string;
  value: string;
  change: string;
  helper: string;
  icon: ReactNode;
}

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

interface SubjectPerformanceDatum {
  name: string;
  score: number;
  full: number;
}

interface GradeMixDatum {
  name: string;
  value: number;
  color: string;
}

interface AttendanceByClassDatum {
  className: string;
  value: number;
}

interface AttendanceTrendDatum {
  slot: string;
  value: number;
}

interface RiskStudent {
  name: string;
  roll: string;
  attendance: number;
  score: number;
}

interface ReportSnapshot {
  attendanceByClass: AttendanceByClassDatum[];
  attendanceTrend: AttendanceTrendDatum[];
  subjectPerformance: SubjectPerformanceDatum[];
  gradeMix: GradeMixDatum[];
  riskStudents: RiskStudent[];
  submissionsPending: number;
  passRate: number;
  avgScore: number;
  avgAttendance: number;
  totalStudents: number;
}

const GRADE_COLOR_CLASS: Record<string, string> = {
  A: "bg-green-600",
  B: "bg-blue-600",
  C: "bg-yellow-500",
  "D/F": "bg-red-600",
};

const REPORT_BY_CLASS: Record<string, ReportSnapshot> = {
  all: {
    attendanceByClass: [
      { className: "CSE-2024-A", value: 94 },
      { className: "CSE-2024-B", value: 91 },
      { className: "ECE-2023-A", value: 88 },
      { className: "ME-2022-A", value: 86 },
    ],
    attendanceTrend: [
      { slot: "W1", value: 89 },
      { slot: "W2", value: 90 },
      { slot: "W3", value: 92 },
      { slot: "W4", value: 91 },
    ],
    subjectPerformance: [
      { name: "Data Structures", score: 79, full: 100 },
      { name: "DBMS", score: 83, full: 100 },
      { name: "Discrete Math", score: 76, full: 100 },
      { name: "OOP", score: 81, full: 100 },
    ],
    gradeMix: [
      { name: "A", value: 24, color: "#16a34a" },
      { name: "B", value: 39, color: "#2563eb" },
      { name: "C", value: 25, color: "#eab308" },
      { name: "D/F", value: 12, color: "#dc2626" },
    ],
    riskStudents: [
      { name: "Rahul Verma", roll: "CS24B07", attendance: 71, score: 42 },
      { name: "Aisha Khan", roll: "EC23A11", attendance: 76, score: 49 },
      { name: "Pranav Iyer", roll: "ME22A03", attendance: 74, score: 51 },
    ],
    submissionsPending: 8,
    passRate: 89,
    avgScore: 79,
    avgAttendance: 90,
    totalStudents: 164,
  },
  cse24a: {
    attendanceByClass: [{ className: "CSE-2024-A", value: 94 }],
    attendanceTrend: [
      { slot: "W1", value: 92 },
      { slot: "W2", value: 93 },
      { slot: "W3", value: 95 },
      { slot: "W4", value: 94 },
    ],
    subjectPerformance: [
      { name: "Data Structures", score: 84, full: 100 },
      { name: "DBMS", score: 87, full: 100 },
      { name: "Discrete Math", score: 82, full: 100 },
      { name: "OOP", score: 85, full: 100 },
    ],
    gradeMix: [
      { name: "A", value: 36, color: "#16a34a" },
      { name: "B", value: 44, color: "#2563eb" },
      { name: "C", value: 16, color: "#eab308" },
      { name: "D/F", value: 4, color: "#dc2626" },
    ],
    riskStudents: [
      { name: "Sahil Raj", roll: "CS24A12", attendance: 78, score: 54 },
      { name: "Nitika Jain", roll: "CS24A04", attendance: 75, score: 57 },
    ],
    submissionsPending: 2,
    passRate: 96,
    avgScore: 84,
    avgAttendance: 94,
    totalStudents: 42,
  },
  cse24b: {
    attendanceByClass: [{ className: "CSE-2024-B", value: 91 }],
    attendanceTrend: [
      { slot: "W1", value: 88 },
      { slot: "W2", value: 90 },
      { slot: "W3", value: 92 },
      { slot: "W4", value: 91 },
    ],
    subjectPerformance: [
      { name: "Data Structures", score: 76, full: 100 },
      { name: "DBMS", score: 82, full: 100 },
      { name: "Discrete Math", score: 73, full: 100 },
      { name: "OOP", score: 78, full: 100 },
    ],
    gradeMix: [
      { name: "A", value: 18, color: "#16a34a" },
      { name: "B", value: 42, color: "#2563eb" },
      { name: "C", value: 29, color: "#eab308" },
      { name: "D/F", value: 11, color: "#dc2626" },
    ],
    riskStudents: [
      { name: "Rahul Verma", roll: "CS24B07", attendance: 71, score: 42 },
      { name: "Maya Menon", roll: "CS24B14", attendance: 77, score: 50 },
      { name: "Ankit Nair", roll: "CS24B02", attendance: 73, score: 47 },
    ],
    submissionsPending: 3,
    passRate: 87,
    avgScore: 77,
    avgAttendance: 91,
    totalStudents: 39,
  },
};

const KPI_CARD = ({
  label,
  value,
  change,
  helper,
  icon,
}: KpiCardProps) => (
  <div className="flex justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <p className="text-xs font-semibold text-emerald-600">{change}</p>
      <p className="mt-1 text-[11px] text-slate-400">{helper}</p>
    </div>
    <div className="rounded-xl bg-slate-50 p-3 text-slate-400">{icon}</div>
  </div>
);

const ChartContainer = ({ title, subtitle, children }: ChartContainerProps) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <h2 className="text-lg font-bold text-slate-800">{title}</h2>
    {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
    <div className="h-64 w-full">{children}</div>
  </div>
);

const TeacherReportData = () => {
  const [selectedClass, setSelectedClass] = useState<"all" | "cse24a" | "cse24b">(
    "all"
  );
  const [selectedRange, setSelectedRange] = useState<"week" | "month" | "term">(
    "month"
  );

  const view = useMemo(
    () => REPORT_BY_CLASS[selectedClass] ?? REPORT_BY_CLASS.all,
    [selectedClass]
  );

  const trendAdjusted = useMemo(() => {
    const multiplier =
      selectedRange === "week" ? 0.98 : selectedRange === "term" ? 1.02 : 1;
    return view.attendanceTrend.map((d) => ({
      ...d,
      value: Math.max(0, Math.min(100, Number((d.value * multiplier).toFixed(1)))),
    }));
  }, [selectedRange, view.attendanceTrend]);

  const activeAlerts = view.riskStudents.length + view.submissionsPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Teaching reports</h2>
          <p className="mt-1 text-sm text-slate-500">
            Operational view for attendance, outcomes, and intervention priorities.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Download size={16} />
          Export snapshot
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-3">
        <label className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Class scope
          </span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value as "all" | "cse24a" | "cse24b")}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All assigned classes</option>
            <option value="cse24a">CSE 2024 - A</option>
            <option value="cse24b">CSE 2024 - B</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Time range
          </span>
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value as "week" | "month" | "term")}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="week">This week</option>
            <option value="month">This month</option>
            <option value="term">This term</option>
          </select>
        </label>

        <div className="rounded-xl border border-amber-100 bg-amber-50 px-3 py-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">
            Attention required
          </p>
          <p className="mt-1 text-lg font-bold text-amber-800">{activeAlerts} open items</p>
          <p className="text-xs text-amber-700">At-risk students + pending submissions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPI_CARD
          label="Average attendance"
          value={`${view.avgAttendance}%`}
          change="+1.8%"
          helper="Compared to previous window"
          icon={<ClipboardCheck size={20} />}
        />
        <KPI_CARD
          label="Students in scope"
          value={String(view.totalStudents)}
          change="+6 enrolled"
          helper="Current roster for selected view"
          icon={<Users size={20} />}
        />
        <KPI_CARD
          label="Average score"
          value={`${view.avgScore}%`}
          change="+2.4%"
          helper="Across latest graded assessments"
          icon={<TrendingUp size={20} />}
        />
        <KPI_CARD
          label="Pass rate"
          value={`${view.passRate}%`}
          change="+1.2%"
          helper="Learners above passing threshold"
          icon={<GraduationCap size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartContainer
          title="Attendance by class"
          subtitle="Find sections that need immediate follow-up"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={view.attendanceByClass}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="className" axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#1e40af" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer
          title="Attendance trend"
          subtitle="Useful for spotting week-over-week slippage"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendAdjusted}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="slot" axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#14b8a6"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartContainer
          title="Subject performance"
          subtitle="Compare achieved score against full marks"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={view.subjectPerformance} margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="full" fill="#cbd5e1" barSize={28} name="Full marks" />
              <Bar dataKey="score" fill="#166534" barSize={28} name="Average score" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer
          title="Grade distribution"
          subtitle="Use this to monitor outcome spread"
        >
          <div className="flex flex-col h-full">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={view.gradeMix}
                  innerRadius={58}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {view.gradeMix.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {view.gradeMix.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      GRADE_COLOR_CLASS[item.name] ?? "bg-slate-400"
                    }`}
                  />
                  <span className="text-xs text-slate-600">
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h3 className="text-lg font-bold text-slate-800">Students needing intervention</h3>
          </div>
          {view.riskStudents.length === 0 ? (
            <p className="text-sm text-slate-500">No risk signals in this selection.</p>
          ) : (
            <div className="space-y-2">
              {view.riskStudents.map((student) => (
                <div
                  key={student.roll}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{student.name}</p>
                    <p className="text-xs text-slate-500">{student.roll}</p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-semibold text-amber-700">
                      Attendance: {student.attendance}%
                    </p>
                    <p className="text-rose-600">Score: {student.score}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-800">Action queue</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <p className="font-semibold text-slate-800">
                {view.submissionsPending} mark submissions pending review
              </p>
              <p className="text-xs text-slate-500">
                Complete review to keep report cards on schedule.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <p className="font-semibold text-slate-800">
                Parent follow-ups required for {view.riskStudents.length} learners
              </p>
              <p className="text-xs text-slate-500">
                Trigger calls/messages for low attendance and low performance.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <FileCheck2 className="h-4 w-4 text-emerald-600" />
                Report sync healthy
              </div>
              <p className="text-xs text-slate-500">
                Last export was generated successfully today.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherReportData;
