import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  GraduationCap,
  ClipboardCheck,
  Clock,
  CalendarDays,
  Megaphone,
  BarChart3,
  Settings,
  UserPlus,
  CheckCircle2,
  Building2,
  Award,
  Sparkles,
} from "lucide-react";

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  /** Optional hint for tooltips / command palette */
  description?: string;
}

export interface TeacherSidebarGroup {
  title: string;
  items: SidebarItem[];
}

/** Grouped navigation — faculty-centric CRM structure */
export const TEACHER_SIDEBAR_GROUPS: TeacherSidebarGroup[] = [
  {
    title: "Overview",
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        description: "Your day at a glance",
      },
    ],
  },
  {
    title: "Teaching & learning",
    items: [
      {
        icon: Sparkles,
        label: "Teaching",
        description: "Attendance, marks & syllabus",
      },
      { icon: Building2, label: "Classes", description: "Sections you instruct" },
      { icon: Clock, label: "Timetable", description: "Weekly schedule" },
      { icon: Award, label: "Results", description: "Subject results" },
    ],
  },
  {
    title: "Operations",
    items: [
      { icon: CalendarDays, label: "Events", description: "Campus calendar" },
      { icon: Megaphone, label: "Announcements", description: "Broadcasts" },
    ],
  },
  {
    title: "Insights",
    items: [{ icon: BarChart3, label: "Reports", description: "Analytics & exports" }],
  },
  {
    title: "Account",
    items: [{ icon: Settings, label: "Settings", description: "Preferences" }],
  },
];

/** Flat list for legacy consumers */
export const sidebarItems: SidebarItem[] = TEACHER_SIDEBAR_GROUPS.flatMap((g) => g.items);

/** Header subtitle + search placeholder per screen */
export const TEACHER_SCREEN_META: Record<
  string,
  { subtitle: string; searchPlaceholder: string }
> = {
  Dashboard: {
    subtitle: "Your teaching load and priorities",
    searchPlaceholder: "Search…",
  },
  Teaching: {
    subtitle: "Attendance, marks & syllabus",
    searchPlaceholder: "Search classes or students…",
  },
  Classes: {
    subtitle: "Sections you instruct",
    searchPlaceholder: "Search classes…",
  },
  Timetable: {
    subtitle: "Weekly schedule",
    searchPlaceholder: "Search slots…",
  },
  Results: {
    subtitle: "Subject results and grading",
    searchPlaceholder: "Search results…",
  },
  Events: {
    subtitle: "Campus calendar",
    searchPlaceholder: "Search events…",
  },
  Announcements: {
    subtitle: "Broadcasts and notices",
    searchPlaceholder: "Search announcements…",
  },
  Reports: {
    subtitle: "Analytics and exports",
    searchPlaceholder: "Search reports…",
  },
  Settings: {
    subtitle: "Preferences and security",
    searchPlaceholder: "Search settings…",
  },
};

export function getTeacherScreenMeta(activeItem: string) {
  return (
    TEACHER_SCREEN_META[activeItem] ?? {
      subtitle: `Manage ${activeItem.toLowerCase()}`,
      searchPlaceholder: "Search…",
    }
  );
}

interface StatCard {
  title: string;
  value: string;
  sub: string;
  change: string | null;
  changeLabel: string | null;
  icon: LucideIcon;
  color: string;
}

interface ChartDatum {
  day: string;
  value: number;
}

interface Activity {
  icon: LucideIcon;
  title: string;
  desc: string;
  time: string;
  color: string;
}

/** Teacher home — workload-oriented (demo figures) */
export const teacherHomeStats: StatCard[] = [
  {
    title: "Students you teach",
    value: "186",
    sub: "Across assigned sections",
    change: "+4",
    changeLabel: "this term",
    icon: GraduationCap,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Sessions this week",
    value: "18",
    sub: "Timetable slots",
    change: null,
    changeLabel: null,
    icon: Clock,
    color: "bg-violet-100 text-violet-600",
  },
  {
    title: "Attendance marked",
    value: "94%",
    sub: "Last 7 school days",
    change: "+2%",
    changeLabel: "vs prior week",
    icon: CheckCircle2,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Open tasks",
    value: "5",
    sub: "Marks entry & reviews",
    change: null,
    changeLabel: null,
    icon: ClipboardCheck,
    color: "bg-amber-100 text-amber-700",
  },
];

export const statsCards: StatCard[] = teacherHomeStats;

export const chartData: ChartDatum[] = [
  { day: "Mon", value: 85 },
  { day: "Tue", value: 78 },
  { day: "Wed", value: 90 },
  { day: "Thu", value: 88 },
  { day: "Fri", value: 92 },
  { day: "Sat", value: 70 },
  { day: "Sun", value: 95 },
];

export const activities: Activity[] = [
  {
    icon: UserPlus,
    title: "New advisees",
    desc: "3 students added to CS301 tutorial",
    time: "25m ago",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: ClipboardCheck,
    title: "Attendance submitted",
    desc: "CSE 2024-A — Data Structures",
    time: "1h ago",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Megaphone,
    title: "Dept. notice",
    desc: "Exam panel meeting · Fri 4pm",
    time: "3h ago",
    color: "bg-orange-100 text-orange-600",
  },
];
