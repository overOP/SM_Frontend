export type AttendanceStatus = "Present" | "Absent" | "On Leave";

export interface AttendanceStudent {
  id: string;
  name: string;
  roll: string;
  className: string;
  section: string;
  status: AttendanceStatus;
  attendancePct: number;
  initials: string;
}

export interface AttendanceFilters {
  className: string;
  dateIso: string;
  search: string;
  page: number;
}

export interface AttendanceHistoryPoint {
  date: string;
  status: AttendanceStatus;
}
