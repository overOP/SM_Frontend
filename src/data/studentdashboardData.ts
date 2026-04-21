import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  ClipboardCheck,
  Clock,
  BookOpen,
  BarChart3,
  CalendarDays,
  Megaphone,
  CheckCircle2,
  FileClock,
  TrendingUp,
  NotebookTabs,
  Target,
  CircleCheck,
  BellRing,
} from "lucide-react";

export interface StudentSidebarItem {
  icon: LucideIcon;
  label: string;
  description?: string;
}

export interface StudentSidebarGroup {
  title: string;
  items: StudentSidebarItem[];
}

export interface StudentScreenMeta {
  subtitle: string;
  searchPlaceholder: string;
}

interface StudentHomeKpi {
  title: string;
  value: string;
  trend: number;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

interface StudentHomeFocus {
  title: string;
  detail: string;
  status: "on-track" | "attention";
}

interface StudentActivity {
  icon: LucideIcon;
  title: string;
  desc: string;
  time: string;
  color: string;
}

export const STUDENT_SIDEBAR_GROUPS: StudentSidebarGroup[] = [
  {
    title: "Workspace",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", description: "Today overview" },
      { icon: ClipboardCheck, label: "Attendance", description: "Presence and leave" },
      { icon: Clock, label: "Timetable", description: "Daily schedule" },
    ],
  },
  {
    title: "Academics",
    items: [
      { icon: BookOpen, label: "Homework", description: "Assignments and submissions" },
      { icon: BarChart3, label: "Results", description: "Exam performance" },
    ],
  },
  {
    title: "Campus",
    items: [
      { icon: CalendarDays, label: "Events", description: "Upcoming activities" },
      { icon: Megaphone, label: "Announcements", description: "Notices and updates" },
    ],
  },
];

export const STUDENT_SCREEN_META: Record<string, StudentScreenMeta> = {
  Dashboard: {
    subtitle: "Track classes, submissions, and progress from one workspace.",
    searchPlaceholder: "Search modules, notes, or deadlines...",
  },
  Attendance: {
    subtitle: "Review attendance trends, leaves, and today's status.",
    searchPlaceholder: "Search by subject, date, or status...",
  },
  Timetable: {
    subtitle: "Check periods, faculty slots, and class timings.",
    searchPlaceholder: "Search timetable entries...",
  },
  Homework: {
    subtitle: "Organize assignments with clear due-date priorities.",
    searchPlaceholder: "Search by subject or assignment...",
  },
  Results: {
    subtitle: "View marks, GPA trajectory, and performance insights.",
    searchPlaceholder: "Search by exam, subject, or semester...",
  },
  Events: {
    subtitle: "Stay informed about school events and participation.",
    searchPlaceholder: "Search events or activities...",
  },
  Announcements: {
    subtitle: "Read institutional communication and alerts quickly.",
    searchPlaceholder: "Search announcements...",
  },
};

export function getStudentScreenMeta(activeItem: string): StudentScreenMeta {
  return (
    STUDENT_SCREEN_META[activeItem] ?? {
      subtitle: "Student workspace overview",
      searchPlaceholder: "Search...",
    }
  );
}

export const studentHomeKpis: StudentHomeKpi[] = [
  {
    title: "Attendance",
    value: "94.2%",
    trend: 2,
    icon: CheckCircle2,
    colorClass: "text-emerald-600",
    bgClass: "bg-emerald-50",
  },
  {
    title: "Pending Homework",
    value: "03",
    trend: -1,
    icon: FileClock,
    colorClass: "text-amber-600",
    bgClass: "bg-amber-50",
  },
  {
    title: "Current GPA",
    value: "3.78",
    trend: 4,
    icon: TrendingUp,
    colorClass: "text-blue-600",
    bgClass: "bg-blue-50",
  },
  {
    title: "This Week Classes",
    value: "28",
    trend: 0,
    icon: NotebookTabs,
    colorClass: "text-violet-600",
    bgClass: "bg-violet-50",
  },
];

export const studentHomeFocus: StudentHomeFocus[] = [
  {
    title: "Physics practical file",
    detail: "Due tomorrow • Not submitted",
    status: "attention",
  },
  {
    title: "Mathematics revision set",
    detail: "Due in 2 days • 70% complete",
    status: "on-track",
  },
  {
    title: "English speaking assessment",
    detail: "Scheduled Friday • Preparation pending",
    status: "attention",
  },
];

export const studentHomeActivities: StudentActivity[] = [
  {
    icon: CircleCheck,
    title: "Homework submitted",
    desc: "Chemistry assignment uploaded successfully.",
    time: "20 minutes ago",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: BellRing,
    title: "New announcement",
    desc: "Unit test timetable published for this month.",
    time: "1 hour ago",
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: Target,
    title: "Performance update",
    desc: "Mathematics score improved by 8% this week.",
    time: "Yesterday",
    color: "bg-violet-100 text-violet-700",
  },
];
