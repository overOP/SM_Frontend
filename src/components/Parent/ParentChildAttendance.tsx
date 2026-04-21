import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  Calendar as CalendarIcon,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Send,
} from "lucide-react";
import { Button, Card, DataTable, Input, Select, StatCard, StatusBadge } from "../ui";
import { Modal } from "../ui/Modal";
import {
  ParentCalendarSkeleton,
  ParentEmptyState,
  ParentMetricSkeleton,
} from "./shared/ParentModuleStates";

type AttendanceStatus = "present" | "absent" | "late" | "holiday";
type LeaveStatus = "approved" | "pending" | "rejected";

interface LeaveRequest {
  id: string;
  childName: string;
  type: string;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  reason: string;
}

interface LeaveFormState {
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
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

const MOCK_LEAVE_HISTORY: LeaveRequest[] = [
  { id: "LR-992", childName: "Aarav Sharma", type: "Sick Leave", startDate: "2026-03-10", endDate: "2026-03-11", status: "approved", reason: "Flu and fever" },
  { id: "LR-102", childName: "Aarav Sharma", type: "Casual", startDate: "2026-04-05", endDate: "2026-04-05", status: "pending", reason: "Family function" },
];

function getAttendanceTone(status: AttendanceStatus): string {
  if (status === "present") return "bg-emerald-50 border-emerald-200 text-emerald-700";
  if (status === "absent") return "bg-rose-50 border-rose-200 text-rose-700";
  if (status === "late") return "bg-amber-50 border-amber-200 text-amber-700";
  return "bg-blue-50 border-blue-200 text-blue-700";
}

export default function ParentChildAttendance() {
  const [searchParams, setSearchParams] = useSearchParams();
  const now = new Date();
  const [month, setMonth] = useState(Number(searchParams.get("month")) || now.getMonth() + 1);
  const [year, setYear] = useState(Number(searchParams.get("year")) || now.getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState<LeaveFormState>({
    startDate: "",
    endDate: "",
    leaveType: "Sick Leave",
    reason: "",
  });

  useEffect(() => {
    setSearchParams({ month: String(month), year: String(year) }, { replace: true });
  }, [month, year, setSearchParams]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 380);
    return () => clearTimeout(timer);
  }, [month, year]);

  const monthTitle = `${MONTH_LABELS[month - 1]} ${year}`;

  const calendarDays = useMemo(() => {
    const totalDays = new Date(year, month, 0).getDate();
    const startOffset = new Date(year, month - 1, 1).getDay();
    const days: Array<{ day: number; status: AttendanceStatus }> = [];
    for (let day = 1; day <= totalDays; day += 1) {
      const date = new Date(year, month - 1, day);
      const weekday = date.getDay();
      let status: AttendanceStatus = "present";
      if (weekday === 0) status = "holiday";
      else if ((day + month) % 12 === 0) status = "absent";
      else if ((day + month) % 7 === 0) status = "late";
      days.push({ day, status });
    }
    return { startOffset, days };
  }, [month, year]);

  const summary = useMemo(() => {
    const present = calendarDays.days.filter((d) => d.status === "present").length;
    const absent = calendarDays.days.filter((d) => d.status === "absent").length;
    const pending = MOCK_LEAVE_HISTORY.filter((row) => row.status === "pending").length;
    const activeSchoolDays = calendarDays.days.filter((d) => d.status !== "holiday").length;
    const attendanceRate = activeSchoolDays === 0 ? 0 : Math.round((present / activeSchoolDays) * 100);
    return { present, absent, pending, attendanceRate };
  }, [calendarDays.days]);

  const goPrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((prev) => prev - 1);
      return;
    }
    setMonth((prev) => prev - 1);
  };

  const goNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((prev) => prev + 1);
      return;
    }
    setMonth((prev) => prev + 1);
  };

  const leaveColumns = [
    {
      header: "Request ID",
      accessor: "id" as keyof LeaveRequest,
      render: (row: LeaveRequest) => <span className="font-bold text-slate-800">#{row.id}</span>,
    },
    { header: "Type", accessor: "type" as keyof LeaveRequest },
    {
      header: "Dates",
      accessor: "startDate" as keyof LeaveRequest,
      render: (row: LeaveRequest) => <span className="text-xs text-slate-500">{row.startDate} - {row.endDate}</span>,
    },
    {
      header: "Status",
      accessor: "status" as keyof LeaveRequest,
      render: (row: LeaveRequest) => (
        <StatusBadge
          status={row.status}
          variant={row.status === "approved" ? "success" : row.status === "pending" ? "warning" : "danger"}
        />
      ),
    },
  ];

  const submitLeave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLeaveModalOpen(false);
    setLeaveForm({ startDate: "", endDate: "", leaveType: "Sick Leave", reason: "" });
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">Parent Attendance</p>
            <h2 className="mt-1 text-xl font-black text-slate-900">Attendance and leave management</h2>
            <p className="mt-1 text-sm text-slate-500">Review records and submit leave requests for your child.</p>
          </div>
          <Button type="button" onClick={() => setIsLeaveModalOpen(true)} className="gap-2">
            <Plus size={16} />
            Apply for leave
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <ParentMetricSkeleton cards={4} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Present Days" value={summary.present} icon={CheckCircle2} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
          <StatCard title="Total Absent" value={summary.absent} icon={AlertCircle} colorClass="text-rose-600" bgClass="bg-rose-50" />
          <StatCard title="Pending Request" value={summary.pending} icon={Clock} colorClass="text-amber-600" bgClass="bg-amber-50" />
          <StatCard title="Attendance Rate" value={`${summary.attendanceRate}%`} icon={CalendarDays} />
        </div>
      )}

      {isLoading ? (
        <ParentCalendarSkeleton />
      ) : (
        <Card className="border-slate-200">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-500">Monthly attendance</h3>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={goPrevMonth} title="Previous month">
                <ChevronLeft size={14} />
              </Button>
              <span className="min-w-[150px] text-center text-sm font-bold text-slate-800">{monthTitle}</span>
              <Button type="button" variant="outline" size="sm" onClick={goNextMonth} title="Next month">
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {WEEKDAY_SHORT.map((day) => (
              <div key={day} className="py-1 text-center text-[11px] font-black uppercase tracking-wider text-slate-400">
                {day}
              </div>
            ))}

            {Array.from({ length: calendarDays.startOffset }).map((_, i) => (
              <div key={`offset-${i}`} className="h-14 rounded-xl border border-transparent" />
            ))}

            {calendarDays.days.map((item) => (
              <div key={item.day} className={`h-14 rounded-xl border px-2 py-1.5 ${getAttendanceTone(item.status)}`}>
                <p className="text-xs font-black">{item.day}</p>
                <p className="mt-1 text-[10px] font-semibold capitalize">{item.status}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="border-slate-200" noPadding>
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-500">Leave application history</h3>
        </div>
        {MOCK_LEAVE_HISTORY.length > 0 ? (
          <DataTable columns={leaveColumns} data={MOCK_LEAVE_HISTORY} emptyMessage="No leave history found." />
        ) : (
          <div className="p-4">
            <ParentEmptyState title="No leave records" description="No leave requests have been submitted yet." />
          </div>
        )}
      </Card>

      <Modal isOpen={isLeaveModalOpen} onClose={() => setIsLeaveModalOpen(false)} title="New Leave Application">
        <form className="space-y-4" onSubmit={submitLeave}>
          <Select label="Select Student" options={["Aarav Sharma"]} required />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="From Date"
              type="date"
              value={leaveForm.startDate}
              onChange={(e) => setLeaveForm((prev) => ({ ...prev, startDate: e.target.value }))}
              required
              icon={CalendarIcon}
            />
            <Input
              label="To Date"
              type="date"
              value={leaveForm.endDate}
              onChange={(e) => setLeaveForm((prev) => ({ ...prev, endDate: e.target.value }))}
              required
              icon={CalendarIcon}
            />
          </div>
          <Select
            label="Leave Type"
            options={["Sick Leave", "Casual Leave", "Family Emergency", "Other"]}
            value={leaveForm.leaveType}
            onChange={(e) => setLeaveForm((prev) => ({ ...prev, leaveType: e.target.value }))}
            required
          />
          <div className="space-y-1.5">
            <label className="ml-1 text-sm font-semibold text-slate-700" htmlFor="leave-reason-parent">
              Reason
            </label>
            <textarea
              id="leave-reason-parent"
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm((prev) => ({ ...prev, reason: e.target.value }))}
              rows={4}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              placeholder="Please provide reason..."
            />
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700">
            School admin will review and notify you once this request is processed.
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsLeaveModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Send size={14} />
              Submit request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}