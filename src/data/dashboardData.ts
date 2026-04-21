import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  Clock,
  CalendarDays,
  Megaphone,
  BarChart3,
  Settings,
  UserPlus,
  CheckCircle2,
  ReceiptText,
  Building2,
  ChartBar,
} from "lucide-react";

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  description?: string;
}

export interface AdminSidebarGroup {
  title: string;
  items: SidebarItem[];
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
  { icon: LayoutDashboard, label: "Dashboard", description: "Institution command center" },
  { icon: Users, label: "Teachers", description: "Faculty profiles and staffing" },
  { icon: GraduationCap, label: "Students", description: "Enrollment and student records" },
  { icon: Building2, label: "Classes", description: "Classes, sections, and capacity" },
  { icon: ReceiptText, label: "Fees", description: "Collection and dues tracking" },
  { icon: ClipboardCheck, label: "Attendance", description: "Daily attendance health" },
  { icon: Clock, label: "Timetable", description: "Scheduling operations" },
  { icon: ChartBar, label: "Results", description: "Assessment outcomes" },
  { icon: CalendarDays, label: "Events", description: "Academic calendar and events" },
  { icon: Megaphone, label: "Announcements", description: "Broadcast communications" },
  { icon: BarChart3, label: "Reports", description: "Analytics and exports" },
  { icon: Settings, label: "Settings", description: "Portal preferences and controls" },
];

export const ADMIN_SIDEBAR_GROUPS: AdminSidebarGroup[] = [
  { title: "Overview", items: [sidebarItems[0]] },
  { title: "Academic operations", items: [sidebarItems[1], sidebarItems[2], sidebarItems[3], sidebarItems[5], sidebarItems[7], sidebarItems[6]] },
  { title: "Business operations", items: [sidebarItems[4], sidebarItems[8], sidebarItems[9]] },
  { title: "Insights & control", items: [sidebarItems[10], sidebarItems[11]] },
];

export const ADMIN_SCREEN_META: Record<string, { subtitle: string; searchPlaceholder: string }> = {
  Dashboard: {
    subtitle: "Realtime school operations and priority actions",
    searchPlaceholder: "Search students, staff, classes...",
  },
  Teachers: {
    subtitle: "Faculty workforce planning and management",
    searchPlaceholder: "Search teachers...",
  },
  Students: {
    subtitle: "Admissions, profiles, and student lifecycle",
    searchPlaceholder: "Search students...",
  },
  Classes: {
    subtitle: "Sections, rosters, and classroom capacity",
    searchPlaceholder: "Search classes...",
  },
  Fees: {
    subtitle: "Finance desk for billing and fee collection",
    searchPlaceholder: "Search invoices or students...",
  },
  Attendance: {
    subtitle: "Presence compliance and attendance exceptions",
    searchPlaceholder: "Search attendance records...",
  },
  Timetable: {
    subtitle: "Institution-wide timetable orchestration",
    searchPlaceholder: "Search schedules...",
  },
  Results: {
    subtitle: "Result governance and performance quality",
    searchPlaceholder: "Search subjects or results...",
  },
  Events: {
    subtitle: "Campus events and participation planning",
    searchPlaceholder: "Search events...",
  },
  Announcements: {
    subtitle: "Communication center for notices and alerts",
    searchPlaceholder: "Search announcements...",
  },
  Reports: {
    subtitle: "Institution analytics and reporting exports",
    searchPlaceholder: "Search reports...",
  },
  Settings: {
    subtitle: "Security, roles, and configuration settings",
    searchPlaceholder: "Search settings...",
  },
};

export function getAdminScreenMeta(activeItem: string) {
  return (
    ADMIN_SCREEN_META[activeItem] ?? {
      subtitle: `Manage ${activeItem.toLowerCase()}`,
      searchPlaceholder: "Search...",
    }
  );
}

export const statsCards: StatCard[] = [
  { title: "Total Students", value: "1,234", sub: "Active enrollments", change: "+12%", changeLabel: "from last month", icon: GraduationCap, color: "bg-blue-100 text-blue-600" },
  { title: "Total Teachers", value: "89", sub: "Across all departments", change: "+5%", changeLabel: "from last month", icon: Users, color: "bg-cyan-100 text-cyan-600" },
  { title: "Active Classes", value: "45", sub: "12 sections", change: null, changeLabel: null, icon: BookOpen, color: "bg-orange-100 text-orange-600" },
  { title: "Today's Attendance", value: "92%", sub: "1,135 students present", change: "+3%", changeLabel: "from last month", icon: CheckCircle2, color: "bg-emerald-100 text-emerald-600" },
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

export const adminPriorityQueue = [
  { title: "Admissions follow-up", detail: "14 applications awaiting document verification", severity: "high" },
  { title: "Fee defaulters", detail: "27 students pending monthly fee beyond due date", severity: "high" },
  { title: "Staffing gap", detail: "2 mathematics periods uncovered for Grade 10B", severity: "medium" },
  { title: "Transport compliance", detail: "3 routes require updated driver checklist", severity: "medium" },
];

export const adminPipeline = [
  { stage: "Leads", value: 96 },
  { stage: "Applications", value: 58 },
  { stage: "Verified", value: 41 },
  { stage: "Admitted", value: 29 },
];

export const feeCollectionSnapshot = [
  { label: "Collected", value: 72, color: "#2563eb" },
  { label: "Pending", value: 21, color: "#f59e0b" },
  { label: "Overdue", value: 7, color: "#dc2626" },
];
