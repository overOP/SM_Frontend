import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, CheckCircle2, ChevronRight, Download } from "lucide-react";

import {
  activities,
  adminPipeline,
  adminPriorityQueue,
  chartData,
  feeCollectionSnapshot,
  statsCards,
} from "../../data/dashboardData";

interface AdminHomeDashboardProps {
  onNavigate: (item: string) => void;
}

export default function AdminHomeDashboard({ onNavigate }: AdminHomeDashboardProps) {
  const feeDotClass: Record<string, string> = {
    Collected: "bg-blue-600",
    Pending: "bg-amber-500",
    Overdue: "bg-rose-600",
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Admin command center
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight">
              School operations overview
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Monitor admissions, academics, and finance in one unified workspace.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("Reports")}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/20"
          >
            <Download className="h-4 w-4" />
            Export executive snapshot
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {card.title}
              </p>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
            {card.change ? (
              <p className="mt-2 text-[11px] font-bold text-emerald-600">
                {card.change} {card.changeLabel}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-800">Attendance trend</h3>
            <button
              type="button"
              onClick={() => onNavigate("Attendance")}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Open attendance
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2.5} fill="#bfdbfe" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-black text-slate-800">Priority queue</h3>
          <div className="space-y-3">
            {adminPriorityQueue.map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center gap-2">
                  {item.severity === "high" ? (
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-amber-600" />
                  )}
                  <p className="text-sm font-bold text-slate-800">{item.title}</p>
                </div>
                <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-black text-slate-800">Admissions funnel</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={adminPipeline}>
              <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#0f172a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-black text-slate-800">Fee collection health</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={feeCollectionSnapshot} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {feeCollectionSnapshot.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap gap-3">
            {feeCollectionSnapshot.map((entry) => (
              <div key={entry.label} className="flex items-center gap-2 text-xs text-slate-600">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${feeDotClass[entry.label] ?? "bg-slate-400"}`}
                />
                {entry.label}: {entry.value}%
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-black text-slate-800">Recent activity</h3>
          <div className="space-y-4">
            {activities.map((item) => (
              <div key={item.title} className="flex gap-3">
                <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${item.color}`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                  <p className="text-[10px] text-slate-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
