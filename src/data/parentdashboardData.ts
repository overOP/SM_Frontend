import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  UserCircle,
  CalendarCheck,
  GraduationCap,
  Clock,
  Megaphone,
  ScrollText,
  CheckCircle2,
  AlertCircle,
  Wallet,
  TrendingUp,
  CalendarClock,
} from "lucide-react";

export interface ParentSidebarItem {
  icon: LucideIcon;
  label: string;
  description?: string;
}

export interface ParentSidebarGroup {
  title: string;
  items: ParentSidebarItem[];
}

export interface ParentScreenMeta {
  subtitle: string;
  searchPlaceholder: string;
}

export interface ParentHomeKpi {
  title: string;
  value: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

export const PARENT_SIDEBAR_GROUPS: ParentSidebarGroup[] = [
  {
    title: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Overview", description: "Child command center" },
      { icon: UserCircle, label: "Child Profile", description: "Identity and records" },
    ],
  },
  {
    title: "Academics",
    items: [
      { icon: CalendarCheck, label: "Attendance", description: "Presence and leave" },
      { icon: GraduationCap, label: "Grades and Reports", description: "Performance tracking" },
      { icon: ScrollText, label: "ExamResults", description: "Exam schedule and status" },
    ],
  },
  {
    title: "School Life",
    items: [
      { icon: Clock, label: "Timetable", description: "Weekly class plan" },
      { icon: Megaphone, label: "Announcements", description: "School notices" },
    ],
  },
];

export const PARENT_SCREEN_META: Record<string, ParentScreenMeta> = {
  Overview: {
    subtitle: "Track your child progress, attendance, and pending actions in one place.",
    searchPlaceholder: "Search updates, remarks, or notices...",
  },
  "Child Profile": {
    subtitle: "Review profile details, academic identity, and enrolled subjects.",
    searchPlaceholder: "Search profile fields...",
  },
  Attendance: {
    subtitle: "Monitor attendance trends and apply leave requests when needed.",
    searchPlaceholder: "Search date, leave status, or reason...",
  },
  "Grades and Reports": {
    subtitle: "Analyze grades, term performance, and subject-level progress.",
    searchPlaceholder: "Search subject, grade, or exam...",
  },
  Timetable: {
    subtitle: "View class schedule and session timings for the week.",
    searchPlaceholder: "Search by day or subject...",
  },
  Announcements: {
    subtitle: "Stay informed with school-wide and class-level updates.",
    searchPlaceholder: "Search announcements...",
  },
  ExamResults: {
    subtitle: "Check examination routine, readiness, and related notices.",
    searchPlaceholder: "Search exams, venue, or date...",
  },
};

export function getParentScreenMeta(activeItem: string): ParentScreenMeta {
  return (
    PARENT_SCREEN_META[activeItem] ?? {
      subtitle: "Parent portal",
      searchPlaceholder: "Search...",
    }
  );
}

export const parentHomeKpis: ParentHomeKpi[] = [
  {
    title: "Attendance",
    value: "96%",
    icon: CheckCircle2,
    colorClass: "text-emerald-600",
    bgClass: "bg-emerald-50",
  },
  {
    title: "Term GPA",
    value: "3.8",
    icon: TrendingUp,
    colorClass: "text-blue-600",
    bgClass: "bg-blue-50",
  },
  {
    title: "Fee Status",
    value: "Pending",
    icon: Wallet,
    colorClass: "text-rose-600",
    bgClass: "bg-rose-50",
  },
  {
    title: "Next Exam",
    value: "18 days",
    icon: CalendarClock,
    colorClass: "text-violet-600",
    bgClass: "bg-violet-50",
  },
];

export const parentHomeAlerts = [
  {
    title: "Fee reminder",
    detail: "Transport and tuition fees are pending for April.",
    icon: AlertCircle,
    tone: "bg-amber-50 text-amber-700 border-amber-200",
  },
];
