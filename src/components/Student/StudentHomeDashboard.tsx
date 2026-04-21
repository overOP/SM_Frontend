import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { ArrowRight, CalendarClock, Lock, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, Button, StatCard } from "../ui";
import { studentHomeActivities, studentHomeFocus, studentHomeKpis } from "../../data/studentdashboardData";

interface StudentHomeDashboardProps {
  userName?: string;
  onNavigate: Dispatch<SetStateAction<string>>;
}

const WEEKLY_PROGRESS = [
  { week: "W1", score: 78 },
  { week: "W2", score: 82 },
  { week: "W3", score: 86 },
  { week: "W4", score: 89 },
];

const TODAY_TIMELINE = [
  { slot: "08:00 - 08:45", subject: "Mathematics", room: "Room 101", status: "upcoming" },
  { slot: "09:40 - 10:25", subject: "Physics", room: "Lab 2", status: "upcoming" },
  { slot: "11:40 - 12:25", subject: "English", room: "Room 103", status: "upcoming" },
  { slot: "13:15 - 14:00", subject: "Computer Science", room: "Lab 1", status: "upcoming" },
];

function HomeDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="border border-slate-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse space-y-3">
          <div className="h-3 w-36 rounded bg-slate-200" />
          <div className="h-7 w-72 rounded bg-slate-200" />
          <div className="h-4 w-96 rounded bg-slate-100" />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} className="border border-slate-200 bg-white p-6 shadow-sm">
            <div className="animate-pulse space-y-3">
              <div className="h-3 w-24 rounded bg-slate-200" />
              <div className="h-7 w-20 rounded bg-slate-200" />
              <div className="h-3 w-28 rounded bg-slate-100" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function StudentHomeDashboard({ userName, onNavigate }: StudentHomeDashboardProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 420);
    return () => clearTimeout(timer);
  }, []);

  const firstName = useMemo(() => userName?.split(" ")[0] ?? "Learner", [userName]);

  if (isLoading) return <HomeDashboardSkeleton />;

  return (
    <div className="space-y-6">
      <Card className="border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">Student command center</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
              Welcome back, {firstName}
            </h2>
            <p className="mt-2 text-sm text-slate-500">Keep your day on track with attendance, tasks, and results in one place.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => onNavigate("Timetable")} className="gap-2">
              Open timetable <ArrowRight size={14} />
            </Button>
            <Button type="button" variant="outline" onClick={() => onNavigate("Homework")} className="gap-2">
              Open homework <ArrowRight size={14} />
            </Button>
            <Button type="button" variant="primary" onClick={() => onNavigate("Results")} className="gap-2">
              View results <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {studentHomeKpis.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            icon={item.icon}
            trend={item.trend}
            colorClass={item.colorClass}
            bgClass={item.bgClass}
          />
        ))}
      </div>

      <Card className="border border-slate-200 bg-blue-50/40 p-4 shadow-sm">
        <div className="flex items-start gap-2 text-xs text-slate-600">
          <Lock size={14} className="mt-0.5 shrink-0 text-blue-600" />
          Dashboard records are synced from school systems and are read-only in student view.
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3 border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-500">Weekly performance trend</h3>
            <div className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-blue-600">
              <TrendingUp size={12} />
              Improving
            </div>
          </div>
          <div className="mt-4 h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_PROGRESS}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="score" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="xl:col-span-2 border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-500">Today's classes</h3>
            <CalendarClock size={16} className="text-slate-400" />
          </div>
          <div className="mt-4 space-y-3">
            {TODAY_TIMELINE.map((item) => (
              <div key={`${item.slot}-${item.subject}`} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">{item.slot}</p>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">
                    {item.status}
                  </span>
                </div>
                <p className="mt-1 text-sm font-bold text-slate-800">{item.subject}</p>
                <p className="text-xs text-slate-500">{item.room}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-500">Priority focus</h3>
          <div className="mt-4 space-y-3">
            {studentHomeFocus.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-bold text-slate-800">{item.title}</p>
                  <p className="text-xs font-medium text-slate-500">{item.detail}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                    item.status === "on-track"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {item.status === "on-track" ? "On track" : "Attention"}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-500">Recent activity</h3>
          <div className="mt-4 space-y-4">
            {studentHomeActivities.map((item) => (
              <div key={item.title} className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-b-0">
                <div className={`mt-0.5 rounded-lg p-2 ${item.color}`}>
                  <item.icon size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
