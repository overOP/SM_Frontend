import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  Clock,
  CalendarDays,
  Megaphone,
  UserPlus,
  CheckCircle2,
  BarChart3,
  UserCircle,
} from "lucide-react";

interface SidebarItem {
  icon: LucideIcon;
  label: string;
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

export const sidebarItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: ClipboardCheck, label: "Attendance" },
  { icon: Clock, label: "Timetable" },
  { icon: BookOpen, label: "Homework" },
  { icon: BarChart3, label: "Results" },
  { icon: CalendarDays, label: "Events" },
  { icon: Megaphone, label: "Announcements" },
  { icon: UserCircle, label: "Profile" },
];

export const statsCards: StatCard[] = [
  { title: "Days Present", value: "89", sub: "Out of 96 school days", change: "+3%", changeLabel: "from last month", icon: CheckCircle2, color: "bg-emerald-100 text-emerald-600" },
  { title: "Days Absent", value: "7", sub: "This academic year", change: null, changeLabel: null, icon: CalendarDays, color: "bg-rose-100 text-rose-500" },
  { title: "Homework Pending", value: "3", sub: "Due this week", change: null, changeLabel: null, icon: BookOpen, color: "bg-orange-100 text-orange-500" },
  { title: "Current GPA", value: "3.8", sub: "Out of 4.0", change: "+0.2", changeLabel: "from last term", icon: GraduationCap, color: "bg-blue-100 text-blue-600" },
];

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
  { icon: UserPlus, title: "New student enrolled", desc: "Emma Watson joined Class 10A", time: "5 minutes ago", color: "bg-blue-100 text-blue-600" },
  { icon: ClipboardCheck, title: "Attendance marked", desc: "Class 8B attendance completed", time: "15 minutes ago", color: "bg-emerald-100 text-emerald-600" },
  { icon: Megaphone, title: "New announcement", desc: "Annual sports day schedule published", time: "1 hour ago", color: "bg-orange-100 text-orange-600" },
];
