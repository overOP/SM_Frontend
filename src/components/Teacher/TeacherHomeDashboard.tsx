import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Sparkles,
  Clock,
  Award,
  BarChart3,
  Megaphone,
  ChevronRight,
} from "lucide-react";

import {
  statsCards,
  chartData,
  activities,
} from "../../data/teacherdashboardData";

interface TeacherHomeDashboardProps {
  userName?: string;
  onNavigate: (label: string) => void;
}

const QUICK_ACTIONS: {
  label: string;
  description: string;
  icon: typeof Sparkles;
}[] = [
  {
    label: "Teaching",
    description: "Attendance, marks & syllabus",
    icon: Sparkles,
  },
  {
    label: "Timetable",
    description: "This week’s schedule",
    icon: Clock,
  },
  {
    label: "Results",
    description: "Grades & assessments",
    icon: Award,
  },
  {
    label: "Reports",
    description: "Analytics & exports",
    icon: BarChart3,
  },
  {
    label: "Announcements",
    description: "School-wide notices",
    icon: Megaphone,
  },
];

const TeacherHomeDashboard = ({
  userName = "there",
  onNavigate,
}: TeacherHomeDashboardProps) => {
  const firstName = userName.trim().split(/\s+/)[0] ?? userName;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/80 to-blue-50/40 p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Faculty workspace
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Welcome back, {firstName}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Jump into your most common tasks — everything stays in one place for
          faster daily workflows.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => onNavigate(action.label)}
              className="group flex items-start gap-4 rounded-xl border border-slate-100 bg-white/90 p-4 text-left shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <action.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 font-semibold text-slate-800">
                  <span>{action.label}</span>
                  <ChevronRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  {action.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}
              >
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            <p className="mt-1 text-sm text-gray-500">{card.sub}</p>
            {card.change != null && (
              <p className="mt-2 text-xs font-medium text-emerald-600">
                {card.change}
                {card.changeLabel ? ` ${card.changeLabel}` : ""}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="mb-6 text-lg font-bold text-slate-800">
            Weekly engagement trend
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#teacherHomeGradient)"
              />
              <defs>
                <linearGradient
                  id="teacherHomeGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#3b82f6"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="#3b82f6"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="mb-6 text-lg font-bold text-slate-800">
            Recent activity
          </h3>
          <div className="space-y-5">
            {activities.map((a, i) => (
              <div key={i} className="flex gap-4">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${a.color}`}
                >
                  <a.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-none text-slate-800">
                    {a.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{a.desc}</p>
                </div>
                <span className="text-[10px] font-medium text-gray-400">
                  {a.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherHomeDashboard;
