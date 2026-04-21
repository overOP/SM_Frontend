import { Suspense, lazy, useMemo, useState } from "react";
import { Search, Bell, Menu } from "lucide-react";

import AdminSidebar from "../components/Admin/AdminSidebar.tsx";

import {
  ADMIN_SIDEBAR_GROUPS,
  getAdminScreenMeta,
} from "../data/dashboardData.ts";

const AdminHomeDashboard = lazy(() => import("../components/Admin/AdminHomeDashboard.tsx"));
const AdminTeacherData = lazy(() => import("../components/Admin/AdminTeacherData.tsx"));
const AdminStudentData = lazy(() => import("../components/Admin/AdminStudentData.tsx"));
const AdminClassData = lazy(() => import("../components/Admin/AdminClassData.tsx"));
const AdminFeesData = lazy(() => import("../components/Admin/AdminFeesData.tsx"));
const AdminAttendanceData = lazy(() => import("../components/Admin/AdminAttendanceData.tsx"));
const AdminEventData = lazy(() => import("../components/Admin/AdminEventData.tsx"));
const AdminAnnouncementData = lazy(() => import("../components/Admin/AdminAnnouncementData.tsx"));
const AdminReportData = lazy(() => import("../components/Admin/AdminReportData.tsx"));
const AdminSettingsData = lazy(() => import("../components/Admin/AdminSettingsData.tsx"));
const AdminTimetableData = lazy(() => import("../components/Admin/AdminTimetableData.tsx"));
const AdminResultData = lazy(() => import("../components/Admin/AdminResultData.tsx"));

interface Notification {
  id: number;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

interface AdminDashboardHeaderProps {
  activeItem: string;
  subtitle: string;
  searchPlaceholder: string;
  day: string;
  fullDate: string;
  notifications: Notification[];
  showNotifications: boolean;
  setShowNotifications: (v: boolean) => void;
}

function AdminDashboardHeader({
  activeItem,
  subtitle,
  searchPlaceholder,
  day,
  fullDate,
  notifications,
  showNotifications,
  setShowNotifications,
}: AdminDashboardHeaderProps) {
  return (
    <div className="flex flex-1 items-center justify-between">
      <div className="hidden min-w-0 md:block">
        <h1 className="truncate text-xl font-bold text-slate-800">{activeItem}</h1>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>

      <div className="ml-auto flex items-center gap-6">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-48 rounded-xl border border-gray-100 bg-gray-50 py-2 pl-10 pr-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 lg:w-64"
          />
        </div>

        <div className="flex items-center gap-4 border-l border-gray-100 pl-6">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative rounded-xl p-2 transition-all ${
                showNotifications
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {notifications.some((n) => n.unread) && (
                <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
              )}
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 z-20 mt-3 w-80 origin-top-right animate-in zoom-in rounded-2xl border border-slate-100 bg-white shadow-2xl fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/50 p-4">
                    <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                  </div>
                  <div className="max-h-300px overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`flex cursor-pointer gap-3 border-b border-slate-50 p-4 transition-colors hover:bg-slate-50 ${
                          n.unread ? "bg-blue-50/20" : ""
                        }`}
                      >
                        <div
                          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                            n.unread ? "bg-blue-600" : "bg-transparent"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-bold leading-tight text-slate-800">
                            {n.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">{n.desc}</p>
                          <p className="mt-2 text-[10px] text-slate-400">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="min-w-max text-right">
            <p className="text-xs font-bold leading-none text-slate-700">{day}</p>
            <p className="mt-1 text-[10px] leading-none text-gray-400">{fullDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [dateInfo] = useState(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };
    return {
      day: now.toLocaleDateString("en-US", { weekday: "long" }),
      fullDate: now.toLocaleDateString("en-US", options),
    };
  });

  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState<Notification[]>([
    { id: 1, title: "New Admission", desc: "Siddharth added to Class 10A", time: "2 mins ago", unread: true },
    { id: 2, title: "Fee Payment", desc: "Monthly fee received from Roll #22", time: "1 hour ago", unread: true },
    { id: 3, title: "Exam Results", desc: "Board exams result are now available", time: "5 hours ago", unread: true },
  ]);

  const screenMeta = getAdminScreenMeta(activeItem);

  const tabComponent = useMemo(() => {
    switch (activeItem) {
      case "Teachers":
        return <AdminTeacherData />;
      case "Students":
        return <AdminStudentData />;
      case "Classes":
        return <AdminClassData />;
      case "Fees":
        return <AdminFeesData />;
      case "Attendance":
        return <AdminAttendanceData />;
      case "Timetable":
        return <AdminTimetableData />;
      case "Events":
        return <AdminEventData />;
      case "Announcements":
        return <AdminAnnouncementData />;
      case "Results":
        return <AdminResultData />;
      case "Reports":
        return <AdminReportData />;
      case "Settings":
        return <AdminSettingsData />;
      case "Dashboard":
      default:
        return <AdminHomeDashboard onNavigate={setActiveItem} />;
    }
  }, [activeItem]);

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        sidebarGroups={ADMIN_SIDEBAR_GROUPS}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center h-20 shadow-sm z-10">
          <button
            className="lg:hidden text-gray-600 mr-4 p-2 hover:bg-slate-100 rounded-lg"
            onClick={() => setMobileOpen(true)}
            aria-label="Open admin menu"
            type="button"
          >
            <Menu size={22} />
          </button>
          <AdminDashboardHeader
            activeItem={activeItem}
            subtitle={screenMeta.subtitle}
            searchPlaceholder={screenMeta.searchPlaceholder}
            day={dateInfo.day}
            fullDate={dateInfo.fullDate}
            notifications={notifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
          />
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
          <div className="max-w-1400 mx-auto">
            <Suspense
              fallback={
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm font-semibold text-slate-500">
                  Loading {activeItem.toLowerCase()} module...
                </div>
              }
            >
              {tabComponent}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
