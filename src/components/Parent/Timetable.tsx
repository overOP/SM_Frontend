import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BookOpen, Clock, Coffee, User } from "lucide-react";
import { Card, StatusBadge } from "../ui";
import { ParentEmptyState, ParentTableSkeleton } from "./shared/ParentModuleStates";

interface TimeSlot {
  time: string;
  subject: string;
  teacher: string;
  type?: "lecture" | "break" | "activity";
}

interface DaySchedule {
  day: string;
  slots: TimeSlot[];
}

const SCHEDULE_DATA: DaySchedule[] = [
  {
    day: "Monday",
    slots: [
      { time: "08:00 - 08:45", subject: "Mathematics", teacher: "Mrs. Kapoor", type: "lecture" },
      { time: "08:45 - 09:30", subject: "Science", teacher: "Mr. Verma", type: "lecture" },
      { time: "09:30 - 09:45", subject: "Short Break", teacher: "Campus", type: "break" },
      { time: "09:45 - 10:30", subject: "English", teacher: "Ms. Bhatia", type: "lecture" },
      { time: "10:30 - 11:15", subject: "Hindi", teacher: "Mrs. Reddy", type: "lecture" },
    ],
  },
  {
    day: "Tuesday",
    slots: [
      { time: "08:00 - 08:45", subject: "Physics", teacher: "Dr. Sharma", type: "lecture" },
      { time: "08:45 - 09:30", subject: "P.E.", teacher: "Mr. Kumar", type: "activity" },
      { time: "09:45 - 10:30", subject: "Mathematics", teacher: "Ms. Bhatia", type: "lecture" },
    ],
  },
  { day: "Wednesday", slots: [{ time: "08:00 - 08:45", subject: "Chemistry", teacher: "Mrs. Dutta" }] },
  { day: "Thursday", slots: [{ time: "08:00 - 08:45", subject: "Physics", teacher: "Dr. Sharma" }] },
  { day: "Friday", slots: [{ time: "08:00 - 08:45", subject: "Biology", teacher: "Dr. Mehta" }] },
  { day: "Saturday", slots: [] },
  { day: "Sunday", slots: [{ time: "08:00 - 08:45", subject: "Yoga", teacher: "Mr. Anand" }] },
];

export default function Timetable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDay = searchParams.get("day") ?? "Monday";
  const [activeDay, setActiveDay] = useState(initialDay);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSearchParams({ day: activeDay }, { replace: true });
  }, [activeDay, setSearchParams]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 320);
    return () => clearTimeout(timer);
  }, [activeDay]);

  const currentSchedule = useMemo(
    () => SCHEDULE_DATA.find((d) => d.day === activeDay),
    [activeDay]
  );

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">Timetable</p>
          <h2 className="mt-1 text-xl font-black text-slate-900">Class schedule</h2>
          <p className="mt-1 text-sm text-slate-500">Weekly schedule for Academic Year 2025-26.</p>
        </div>
      </Card>

      <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1.5 w-full overflow-x-auto no-scrollbar">
        {SCHEDULE_DATA.map((daySchedule) => (
          <button
            key={daySchedule.day}
            type="button"
            onClick={() => setActiveDay(daySchedule.day)}
            className={`whitespace-nowrap rounded-xl px-6 py-2.5 text-sm font-black transition-all ${
              activeDay === daySchedule.day ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {daySchedule.day}
          </button>
        ))}
      </div>

      {isLoading ? (
        <ParentTableSkeleton rows={4} />
      ) : (
        <div className="space-y-3">
          {currentSchedule?.slots.length ? (
            currentSchedule.slots.map((slot, i) => (
              <Card key={`${slot.subject}-${i}`} className="border-slate-200">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[180px_1fr_auto] md:items-center">
                  <div className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Time</p>
                    <p className="text-sm font-black text-slate-800">{slot.time}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl p-2 ${slot.type === "break" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"}`}>
                      {slot.type === "break" ? <Coffee size={18} /> : <BookOpen size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{slot.subject}</p>
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        <User size={12} />
                        {slot.teacher}
                      </p>
                    </div>
                  </div>

                  <div className="justify-self-start md:justify-self-end">
                    <StatusBadge status={slot.type ?? "lecture"} variant={slot.type === "break" ? "warning" : "info"} />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <ParentEmptyState title="No classes scheduled" description={`No sessions are planned for ${activeDay}.`} />
          )}
        </div>
      )}

      <Card className="border-slate-200 bg-slate-50">
        <p className="flex items-center gap-2 text-xs text-slate-500">
          <Clock size={12} />
          Class schedule syncs by day using URL state and updates automatically.
        </p>
      </Card>
    </div>
  );
}