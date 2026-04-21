import type {
  AttendanceFilters,
  AttendanceHistoryPoint,
  AttendanceStatus,
  AttendanceStudent,
} from "../types";

const CLASSES = ["Class 10A", "Class 10B", "Class 9A", "Class 9B", "Class 8A"];

let ATTENDANCE_DB: AttendanceStudent[] = [
  {
    id: "att_1",
    name: "Alex Thompson",
    roll: "STU001",
    className: "Class 10A",
    section: "A",
    status: "Present",
    attendancePct: 96,
    initials: "AT",
  },
  {
    id: "att_2",
    name: "Emma Watson",
    roll: "STU002",
    className: "Class 10A",
    section: "A",
    status: "Present",
    attendancePct: 94,
    initials: "EW",
  },
  {
    id: "att_3",
    name: "John Doe",
    roll: "STU003",
    className: "Class 10A",
    section: "A",
    status: "Absent",
    attendancePct: 82,
    initials: "JD",
  },
  {
    id: "att_4",
    name: "Lina George",
    roll: "STU004",
    className: "Class 10A",
    section: "A",
    status: "On Leave",
    attendancePct: 88,
    initials: "LG",
  },
  {
    id: "att_11",
    name: "Aarav Singh",
    roll: "STU011",
    className: "Class 10B",
    section: "B",
    status: "Present",
    attendancePct: 93,
    initials: "AS",
  },
];

const HISTORY_DB: Record<string, AttendanceHistoryPoint[]> = {
  att_1: [
    { date: "2026-04-14", status: "Present" },
    { date: "2026-04-15", status: "Present" },
    { date: "2026-04-16", status: "Absent" },
    { date: "2026-04-17", status: "Present" },
  ],
  att_3: [
    { date: "2026-04-14", status: "Absent" },
    { date: "2026-04-15", status: "Present" },
    { date: "2026-04-16", status: "Absent" },
    { date: "2026-04-17", status: "On Leave" },
  ],
};

export async function fetchAttendanceClasses() {
  await new Promise((r) => setTimeout(r, 120));
  return CLASSES;
}

export async function fetchAttendanceRows(filters: AttendanceFilters) {
  await new Promise((r) => setTimeout(r, 180));
  const q = filters.search.trim().toLowerCase();
  const filtered = ATTENDANCE_DB.filter((row) => {
    const classOk =
      filters.className === "all" || row.className === filters.className;
    const searchOk =
      q.length === 0 ||
      row.name.toLowerCase().includes(q) ||
      row.roll.toLowerCase().includes(q);
    return classOk && searchOk;
  });
  const pageSize = 10;
  const start = (Math.max(1, filters.page) - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);
  const scoped = ATTENDANCE_DB.filter((r) =>
    filters.className === "all" ? true : r.className === filters.className
  );
  const present = scoped.filter((r) => r.status === "Present").length;
  const absent = scoped.filter((r) => r.status === "Absent").length;
  const leave = scoped.filter((r) => r.status === "On Leave").length;
  const total = scoped.length;
  return {
    rows,
    total: filtered.length,
    pageSize,
    stats: {
      total,
      present,
      absent,
      leave,
      attendanceRate: total ? Math.round((present / total) * 100) : 0,
    },
  };
}

export async function fetchAttendanceStudentById(studentId: string) {
  await new Promise((r) => setTimeout(r, 120));
  return ATTENDANCE_DB.find((s) => s.id === studentId) ?? null;
}

export async function fetchAttendanceHistory(studentId: string) {
  await new Promise((r) => setTimeout(r, 120));
  return HISTORY_DB[studentId] ?? [];
}

export async function updateAttendanceStatus(
  studentId: string,
  status: AttendanceStatus
) {
  await new Promise((r) => setTimeout(r, 220));
  if (Math.random() < 0.12) {
    throw new Error("Attendance save failed. Retry.");
  }
  ATTENDANCE_DB = ATTENDANCE_DB.map((s) => (s.id === studentId ? { ...s, status } : s));
  return ATTENDANCE_DB.find((s) => s.id === studentId) ?? null;
}

export async function bulkAttendanceStatus(
  className: string,
  status: AttendanceStatus
) {
  await new Promise((r) => setTimeout(r, 200));
  ATTENDANCE_DB = ATTENDANCE_DB.map((s) =>
    className === "all" || s.className === className ? { ...s, status } : s
  );
}
