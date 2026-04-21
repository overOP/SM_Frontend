import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Download,
  FlaskConical,
  Lock,
  MapPin,
  User,
} from "lucide-react";
import { Button, Card, StatusBadge } from "../ui";
import {
  StudentEmptyState,
  StudentMetricSkeleton,
  StudentTableSkeleton,
} from "./shared/StudentModuleStates";

type SessionType = "lecture" | "lab" | "break";

interface Session {
  id: string;
  subject: string;
  teacher?: string;
  room?: string;
  start: string;
  end: string;
  type: SessionType;
}

interface TimetableDay {
  day: string;
  sessions: Session[];
}

const DAY_ORDER = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TIMETABLE_DATA: TimetableDay[] = [
  {
    day: "Sunday",
    sessions: [
      { id: "sun-1", subject: "English", teacher: "Ms. Emily Davis", start: "08:00", end: "08:45", room: "Room 103", type: "lecture" },
      { id: "sun-2", subject: "Mathematics", teacher: "Dr. Sarah Johnson", start: "08:50", end: "09:35", room: "Room 101", type: "lecture" },
      { id: "sun-3", subject: "Short Break", start: "10:25", end: "10:45", type: "break" },
      { id: "sun-4", subject: "Chemistry Lab", teacher: "Mr. Robert Wilson", start: "10:50", end: "11:35", room: "Lab 1", type: "lab" },
    ],
  },
  {
    day: "Monday",
    sessions: [
      { id: "mon-1", subject: "Physics", teacher: "Prof. Michael Chen", start: "08:00", end: "08:45", room: "Room 102", type: "lecture" },
      { id: "mon-2", subject: "Mathematics", teacher: "Dr. Sarah Johnson", start: "08:50", end: "09:35", room: "Room 101", type: "lecture" },
      { id: "mon-3", subject: "Lunch", start: "12:25", end: "13:10", type: "break" },
      { id: "mon-4", subject: "History", teacher: "Mrs. Patricia Brown", start: "13:15", end: "14:00", room: "Room 104", type: "lecture" },
    ],
  },
  {
    day: "Tuesday",
    sessions: [
      { id: "tue-1", subject: "Biology", teacher: "Dr. Lisa Anderson", start: "09:40", end: "10:25", room: "Room 105", type: "lecture" },
      { id: "tue-2", subject: "Geography", teacher: "Mr. James Wilson", start: "11:40", end: "12:25", room: "Room 106", type: "lecture" },
      { id: "tue-3", subject: "Physical Education", teacher: "Coach Miller", start: "13:15", end: "14:00", room: "Sports Ground", type: "lecture" },
    ],
  },
  { day: "Wednesday", sessions: [] },
  { day: "Thursday", sessions: [] },
  { day: "Friday", sessions: [] },
  { day: "Saturday", sessions: [] },
];

function getSessionTone(type: SessionType): string {
  if (type === "lab") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (type === "break") return "bg-slate-50 text-slate-600 border-slate-200";
  return "bg-blue-50 text-blue-700 border-blue-200";
}

export default function StudentTimetableData() {
  const [searchParams, setSearchParams] = useSearchParams();
  const todayName = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());
  const [weekOffset, setWeekOffset] = useState(Number(searchParams.get("week")) || 0);
  const [activeDay, setActiveDay] = useState(searchParams.get("day") || todayName);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!DAY_ORDER.includes(activeDay)) {
      setActiveDay(todayName);
    }
  }, [activeDay, todayName]);

  useEffect(() => {
    setSearchParams({ day: activeDay, week: String(weekOffset) }, { replace: true });
  }, [activeDay, weekOffset, setSearchParams]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [activeDay, weekOffset]);

  const sessions = useMemo(
    () => TIMETABLE_DATA.find((entry) => entry.day === activeDay)?.sessions ?? [],
    [activeDay]
  );

  const stats = useMemo(() => {
    const lectures = sessions.filter((item) => item.type === "lecture").length;
    const labs = sessions.filter((item) => item.type === "lab").length;
    return {
      total: sessions.length,
      lectures,
      labs,
    };
  }, [sessions]);

  const weekLabel = weekOffset === 0 ? "Current Week" : weekOffset > 0 ? `Week +${weekOffset}` : `Week ${weekOffset}`;

  const prevWeek = () => setWeekOffset((prev) => prev - 1);
  const nextWeek = () => setWeekOffset((prev) => prev + 1);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <StudentMetricSkeleton cards={3} />
        <StudentTableSkeleton rows={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">Timetable</p>
            <h2 className="mt-1 text-xl font-black text-slate-900">Weekly schedule planner</h2>
            <p className="mt-1 text-sm text-slate-500">Schedule data is read-only and managed by administration.</p>
          </div>
          <Button type="button" variant="outline" className="gap-2" title="Download timetable PDF">
            <Download size={14} />
            Download PDF
          </Button>
        </div>
      </Card>

      <Card className="border-slate-200 bg-blue-50/40 p-4 shadow-sm">
        <div className="flex items-start gap-2 text-xs text-slate-600">
          <Lock size={14} className="mt-0.5 shrink-0 text-blue-600" />
          Timetable entries are informational only. Contact administration for changes.
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-slate-200">
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">Total Sessions</p>
          <p className="mt-3 text-2xl font-black text-slate-900">{stats.total}</p>
        </Card>
        <Card className="border-slate-200">
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">Lecture Slots</p>
          <p className="mt-3 text-2xl font-black text-slate-900">{stats.lectures}</p>
        </Card>
        <Card className="border-slate-200">
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">Lab Slots</p>
          <p className="mt-3 text-2xl font-black text-slate-900">{stats.labs}</p>
        </Card>
      </div>

      <Card className="border-slate-200">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-blue-600" />
            <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">{weekLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={prevWeek} title="Previous week">
              <ChevronLeft size={14} />
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={nextWeek} title="Next week">
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {DAY_ORDER.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setActiveDay(day)}
              className={`rounded-xl px-3 py-2 text-xs font-black uppercase tracking-wider transition-all ${
                activeDay === day
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
              title={`View ${day} schedule`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
                <th className="py-2">Time</th>
                <th className="py-2">Subject</th>
                <th className="py-2">Teacher</th>
                <th className="py-2">Room</th>
                <th className="py-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4">
                    <StudentEmptyState title="No sessions scheduled" description={`No classes planned for ${activeDay}.`} />
                  </td>
                </tr>
              ) : (
                sessions.map((session) => (
                  <tr key={session.id} className="border-b border-slate-50 text-sm last:border-b-0">
                    <td className="py-2.5">
                      <span className="inline-flex items-center gap-1 text-slate-700">
                        <Clock size={13} className="text-slate-400" />
                        {session.start} - {session.end}
                      </span>
                    </td>
                    <td className="py-2.5 font-semibold text-slate-800">{session.subject}</td>
                    <td className="py-2.5 text-slate-600">
                      {session.teacher ? (
                        <span className="inline-flex items-center gap-1">
                          <User size={13} className="text-slate-400" />
                          {session.teacher}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-2.5 text-slate-600">
                      {session.room ? (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={13} className="text-slate-400" />
                          {session.room}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-2.5">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold uppercase ${getSessionTone(session.type)}`}>
                        {session.type === "lab" ? <FlaskConical size={12} /> : session.type === "break" ? <Coffee size={12} /> : null}
                        {session.type}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </Card>

      <Card className="border-slate-200">
        <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-500">Schedule notes</h3>
        <p className="mt-3 text-sm text-slate-600">
          Please keep lab coat and notebook ready for all lab sessions. Arrive at least 5 minutes before slot start.
        </p>
        <div className="mt-4">
          <StatusBadge status="Read only" variant="info" />
        </div>
      </Card>
    </div>
  );
}