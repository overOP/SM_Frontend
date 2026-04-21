import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarDays, ChevronLeft, ChevronRight, FileUp, Info, Send } from "lucide-react";
import { Button, Card, Input } from "../ui";
import { Modal } from "../ui/Modal";
import {
  StudentCalendarSkeleton,
  StudentMetricSkeleton,
} from "./shared/StudentModuleStates";

type AttendanceStatus = "present" | "absent" | "late" | "holiday";

interface SubjectAttendanceRow {
  subject: string;
  conducted: number;
  attended: number;
}

interface LeaveFormState {
  startDate: string;
  endDate: string;
  reason: string;
  documentName: string;
}

const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SUBJECT_BREAKDOWN: SubjectAttendanceRow[] = [
  { subject: "Mathematics", conducted: 24, attended: 22 },
  { subject: "Physics", conducted: 22, attended: 20 },
  { subject: "Chemistry", conducted: 20, attended: 18 },
  { subject: "English", conducted: 18, attended: 17 },
  { subject: "Computer Science", conducted: 20, attended: 19 },
  { subject: "Biology", conducted: 16, attended: 15 },
];

function pct(attended: number, conducted: number): number {
  if (conducted <= 0) return 0;
  return Math.round((attended / conducted) * 100);
}

export function getAttendanceColor(status: AttendanceStatus): string {
  switch (status) {
    case "present":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "absent":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "late":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "holiday":
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

function CircularAttendanceRing({ value }: { value: number }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative h-24 w-24">
      <svg className="h-24 w-24 -rotate-90">
        <circle cx="48" cy="48" r={radius} className="fill-none stroke-slate-100" strokeWidth="8" />
        <circle
          cx="48"
          cy="48"
          r={radius}
          className="fill-none stroke-blue-600 transition-all"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-black text-slate-900">{clamped}%</span>
      </div>
    </div>
  );
}

export default function StudentAttendanceData() {
  const [searchParams, setSearchParams] = useSearchParams();
  const now = new Date();
  const initialMonth = Number(searchParams.get("month")) || now.getMonth() + 1;
  const initialYear = Number(searchParams.get("year")) || now.getFullYear();

  const [month, setMonth] = useState(Math.min(12, Math.max(1, initialMonth)));
  const [year, setYear] = useState(initialYear);
  const [isLoading, setIsLoading] = useState(true);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState<LeaveFormState>({
    startDate: "",
    endDate: "",
    reason: "",
    documentName: "",
  });

  useEffect(() => {
    setSearchParams({ month: String(month), year: String(year) }, { replace: true });
  }, [month, year, setSearchParams]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(timer);
  }, [month, year]);

  const calendarData = useMemo(() => {
    const totalDays = new Date(year, month, 0).getDate();
    const firstWeekDay = new Date(year, month - 1, 1).getDay();
    const days: Array<{ day: number; status: AttendanceStatus }> = [];

    for (let day = 1; day <= totalDays; day += 1) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();

      let status: AttendanceStatus = "present";
      if (dayOfWeek === 0) status = "holiday";
      else if ((day + month) % 11 === 0) status = "absent";
      else if ((day + month) % 6 === 0) status = "late";

      days.push({ day, status });
    }

    return { days, totalDays, firstWeekDay };
  }, [month, year]);

  const summary = useMemo(() => {
    const attended = SUBJECT_BREAKDOWN.reduce((sum, s) => sum + s.attended, 0);
    const conducted = SUBJECT_BREAKDOWN.reduce((sum, s) => sum + s.conducted, 0);
    const percentage = pct(attended, conducted);
    const absences = conducted - attended;
    const buffer = Math.max(0, Math.floor(attended / 0.75 - conducted));

    return { attended, conducted, percentage, absences, buffer };
  }, []);

  const trendData = useMemo(() => {
    const points = [3, 2, 1, 0].map((delta) => {
      const d = new Date(year, month - 1 - delta, 1);
      return {
        month: d.toLocaleString("en-US", { month: "short" }),
        percentage: 88 + ((d.getMonth() + 3) % 7),
      };
    });
    return points;
  }, [month, year]);

  const monthTitle = `${MONTH_LABELS[month - 1]} ${year}`;

  const goToPreviousMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((prev) => prev - 1);
      return;
    }
    setMonth((prev) => prev - 1);
  };

  const goToNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((prev) => prev + 1);
      return;
    }
    setMonth((prev) => prev + 1);
  };

  const onUploadDocument = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setLeaveForm((prev) => ({ ...prev, documentName: file?.name ?? "" }));
  };

  const submitLeave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLeaveModalOpen(false);
    setLeaveForm({ startDate: "", endDate: "", reason: "", documentName: "" });
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">Attendance</p>
            <h2 className="mt-1 text-xl font-black text-slate-900">Read-only attendance record</h2>
            <p className="mt-1 text-sm text-slate-500">Your attendance data is system-managed and cannot be edited.</p>
          </div>
          <Button
            type="button"
            variant="primary"
            className="gap-2"
            onClick={() => setIsLeaveModalOpen(true)}
            title="Open leave request form"
          >
            <Send size={14} />
            Request Leave
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <StudentMetricSkeleton cards={3} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-slate-200">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Overall Percentage</p>
            <div className="mt-4 flex items-center gap-4">
              <CircularAttendanceRing value={summary.percentage} />
              <div>
                <p className="text-2xl font-black text-slate-900">{summary.percentage}%</p>
                <p className="text-xs text-slate-500">{summary.attended} of {summary.conducted} classes attended</p>
              </div>
            </div>
          </Card>

          <Card className="border-slate-200">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Total Absences</p>
            <div className="mt-4">
              <span className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-2xl font-black text-rose-700">
                {summary.absences}
              </span>
              <p className="mt-2 text-xs text-slate-500">All tracked absences for this session.</p>
            </div>
          </Card>

          <Card className="border-slate-200">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Attendance Buffer</p>
            <div className="mt-4">
              <p className="text-2xl font-black text-slate-900">{summary.buffer} days</p>
              <p className="mt-2 text-xs text-slate-500">Days you can miss before dropping below 75%.</p>
            </div>
          </Card>
        </div>
      )}

      {isLoading ? (
        <StudentCalendarSkeleton />
      ) : (
        <Card className="border-slate-200">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-500">Monthly calendar</h3>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={goToPreviousMonth}
                aria-label="Previous month"
                title="Previous month"
              >
                <ChevronLeft size={14} />
              </Button>
              <span className="min-w-[150px] text-center text-sm font-bold text-slate-800">{monthTitle}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={goToNextMonth}
                aria-label="Next month"
                title="Next month"
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2 text-xs">
            {(["present", "absent", "late", "holiday"] as AttendanceStatus[]).map((status) => (
              <span key={status} className={`rounded-full border px-2.5 py-1 font-semibold capitalize ${getAttendanceColor(status)}`}>
                {status}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {WEEKDAY_SHORT.map((day) => (
              <div key={day} className="py-1 text-center text-[11px] font-black uppercase tracking-wider text-slate-400">
                {day}
              </div>
            ))}

            {Array.from({ length: calendarData.firstWeekDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-14 rounded-xl border border-transparent" />
            ))}

            {calendarData.days.map((item) => (
              <div
                key={item.day}
                className={`h-14 rounded-xl border px-2 py-1.5 ${getAttendanceColor(item.status)}`}
                title={`${item.day} ${monthTitle}: ${item.status}`}
              >
                <p className="text-xs font-black">{item.day}</p>
                <p className="mt-1 text-[10px] font-semibold capitalize">{item.status}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="border-slate-200">
          <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-500">Subject-wise breakdown</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="py-2">Subject</th>
                  <th className="py-2">Conducted</th>
                  <th className="py-2">Attended</th>
                  <th className="py-2">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {SUBJECT_BREAKDOWN.map((row) => {
                  const percentage = pct(row.attended, row.conducted);
                  return (
                    <tr key={row.subject} className="border-b border-slate-50 text-sm last:border-b-0">
                      <td className="py-2.5 font-semibold text-slate-800">{row.subject}</td>
                      <td className="py-2.5 text-slate-600">{row.conducted}</td>
                      <td className="py-2.5 text-slate-600">{row.attended}</td>
                      <td className="py-2.5">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-bold ${
                            percentage >= 85 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {percentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="border-slate-200">
          <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-500">4-Month trend</h3>
          <div className="mt-4 h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="percentage" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            <Info size={14} className="mt-0.5 shrink-0" />
            Values are read-only and generated from attendance records.
          </div>
        </Card>
      </div>
      <Modal isOpen={isLeaveModalOpen} onClose={() => setIsLeaveModalOpen(false)} title="Request Leave">
        <form className="space-y-4" onSubmit={submitLeave}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              type="date"
              label="Start date"
              value={leaveForm.startDate}
              onChange={(event) => setLeaveForm((prev) => ({ ...prev, startDate: event.target.value }))}
              required
              title="Leave start date"
            />
            <Input
              type="date"
              label="End date"
              value={leaveForm.endDate}
              onChange={(event) => setLeaveForm((prev) => ({ ...prev, endDate: event.target.value }))}
              required
              title="Leave end date"
            />
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 text-sm font-semibold text-slate-700" htmlFor="leave-reason">
              Reason
            </label>
            <textarea
              id="leave-reason"
              value={leaveForm.reason}
              onChange={(event) => setLeaveForm((prev) => ({ ...prev, reason: event.target.value }))}
              rows={4}
              required
              placeholder="Write a short reason for leave..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 text-sm font-semibold text-slate-700" htmlFor="leave-document">
              Document Upload
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2">
              <FileUp size={16} className="text-slate-400" />
              <input
                id="leave-document"
                type="file"
                accept=".pdf,image/*"
                onChange={onUploadDocument}
                className="w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-2.5 file:py-1.5 file:text-xs file:font-semibold file:text-blue-600 hover:file:bg-blue-100"
              />
            </div>
            {leaveForm.documentName ? <p className="text-xs text-slate-500">{leaveForm.documentName}</p> : null}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsLeaveModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="gap-2">
              <CalendarDays size={14} />
              Submit request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}