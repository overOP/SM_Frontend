import type { Dispatch, SetStateAction } from "react";
import { ArrowRight } from "lucide-react";
import { Button, Card, StatCard } from "../ui";
import { parentHomeAlerts, parentHomeKpis } from "../../data/parentdashboardData";

interface ParentHomeDashboardProps {
  userName?: string;
  onNavigate: Dispatch<SetStateAction<string>>;
}

export default function ParentHomeDashboard({ userName, onNavigate }: ParentHomeDashboardProps) {
  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">Parent command center</p>
            <h2 className="mt-1 text-2xl font-black text-slate-900">Welcome, {userName?.split(" ")[0] ?? "Parent"}</h2>
            <p className="mt-1 text-sm text-slate-500">Keep track of attendance, exams, notices, and outcomes from one view.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="gap-2" onClick={() => onNavigate("Attendance")}>
              View attendance <ArrowRight size={14} />
            </Button>
            <Button type="button" variant="primary" className="gap-2" onClick={() => onNavigate("Grades and Reports")}>
              Open reports <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {parentHomeKpis.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            icon={item.icon}
            colorClass={item.colorClass}
            bgClass={item.bgClass}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-500">Recommended next actions</h3>
          <div className="mt-4 space-y-3">
            <button
              type="button"
              className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-blue-50"
              onClick={() => onNavigate("ExamResults")}
            >
              <p className="text-sm font-bold text-slate-800">Review upcoming exam routine</p>
              <p className="text-xs text-slate-500">Check dates, venues, and preparation checklist.</p>
            </button>
            <button
              type="button"
              className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-blue-50"
              onClick={() => onNavigate("Announcements")}
            >
              <p className="text-sm font-bold text-slate-800">Check latest school announcements</p>
              <p className="text-xs text-slate-500">Stay updated on events and policy notices.</p>
            </button>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-500">Alerts</h3>
          <div className="mt-4 space-y-3">
            {parentHomeAlerts.map((alert) => (
              <div key={alert.title} className={`rounded-xl border px-3 py-2 text-xs ${alert.tone}`}>
                <p className="font-bold">{alert.title}</p>
                <p className="mt-1">{alert.detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
