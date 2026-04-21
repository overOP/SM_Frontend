import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, BookOpenCheck, Calendar, Clock, Download, MapPin, Search, Timer } from "lucide-react";
import { Button, Card, DataTable, Input, StatCard, StatusBadge } from "../ui";
import { ParentMetricSkeleton, ParentTableSkeleton } from "./shared/ParentModuleStates";

interface RoutineItem {
  date: string;
  day: string;
  subject: string;
  time: string;
  venue: string;
  status: "completed" | "upcoming" | "ongoing";
}

const ROUTINE_DATA: RoutineItem[] = [
  { date: "2026-04-14", day: "Tuesday", subject: "Mathematics", time: "09:00 AM - 12:00 PM", venue: "Examination Hall A", status: "upcoming" },
  { date: "2026-04-16", day: "Thursday", subject: "Science", time: "09:00 AM - 12:00 PM", venue: "Examination Hall A", status: "upcoming" },
  { date: "2026-04-18", day: "Saturday", subject: "English", time: "09:00 AM - 12:00 PM", venue: "Main Auditorium", status: "upcoming" },
  { date: "2026-04-20", day: "Monday", subject: "Social Studies", time: "09:00 AM - 12:00 PM", venue: "Examination Hall B", status: "upcoming" },
  { date: "2026-04-22", day: "Wednesday", subject: "Computer Science", time: "01:00 PM - 03:00 PM", venue: "IT Lab 1", status: "upcoming" },
];

export default function Exam() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (query.trim()) {
      setSearchParams({ q: query.trim() }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [query, setSearchParams]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const filtered = useMemo(
    () =>
      ROUTINE_DATA.filter(
        (item) =>
          item.subject.toLowerCase().includes(query.toLowerCase()) ||
          item.venue.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  const columns = [
    {
      header: "Date & Day",
      accessor: "date" as keyof RoutineItem,
      render: (row: RoutineItem) => (
        <div className="flex flex-col">
          <span className="font-black text-slate-800 tracking-tight">{row.date}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{row.day}</span>
        </div>
      ),
    },
    {
      header: "Subject",
      accessor: "subject" as keyof RoutineItem,
      render: (row: RoutineItem) => (
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-50 p-1.5 text-blue-600">
            <BookOpenCheck size={14} />
          </div>
          <span className="font-bold text-slate-700">{row.subject}</span>
        </div>
      ),
    },
    {
      header: "Time & Venue",
      accessor: "time" as keyof RoutineItem,
      render: (row: RoutineItem) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock size={12} className="text-slate-300" />
            {row.time}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <MapPin size={12} />
            {row.venue}
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status" as keyof RoutineItem,
      render: (row: RoutineItem) => (
        <StatusBadge status={row.status} variant={row.status === "upcoming" ? "info" : "success"} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-slate-900 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-blue-600 p-3">
              <Timer size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black">18 days remaining</h2>
              <p className="mt-1 flex items-center gap-1 text-sm text-blue-200">
                <Calendar size={13} />
                Mid-Term Examination Series 2026
              </p>
            </div>
          </div>
          <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
            <Download size={15} className="mr-2" />
            Schedule PDF
          </Button>
        </div>
      </Card>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Search exam by subject or venue..."
          icon={Search}
          value={query}
          onChange={(e) => {
            setIsLoading(true);
            setQuery(e.target.value);
          }}
          className="w-full sm:w-80"
        />
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <ParentMetricSkeleton cards={3} />
          <ParentTableSkeleton rows={4} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard title="Upcoming Exams" value={filtered.length} icon={Calendar} />
            <StatCard title="Preparation" value="80%" icon={BookOpenCheck} colorClass="text-purple-600" bgClass="bg-purple-50" />
            <StatCard title="Checklist Ready" value="2 / 4" icon={AlertCircle} colorClass="text-amber-600" bgClass="bg-amber-50" />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card noPadding className="xl:col-span-2 border-slate-200 overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4">
                <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-500">Exam timetable</h3>
              </div>
              <DataTable columns={columns} data={filtered} emptyMessage="No exam entries match your search." />
            </Card>

            <Card className="border-slate-200">
              <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-500">Candidate checklist</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <BookOpenCheck size={14} className="text-blue-600" />
                  Original admit card
                </li>
                <li className="flex items-center gap-2">
                  <BookOpenCheck size={14} className="text-blue-600" />
                  Geometry box and tools
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle size={14} className="text-amber-600" />
                  School uniform (formals)
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle size={14} className="text-amber-600" />
                  Transparent water bottle
                </li>
              </ul>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}