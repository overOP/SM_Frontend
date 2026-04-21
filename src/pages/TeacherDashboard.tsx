import { Suspense, lazy, useContext, useMemo, useState } from "react";
import { Search, Bell, Menu } from "lucide-react";

import TeacherSidebar from "../components/Teacher/TeacherSidebar";
const TeacherHomeDashboard = lazy(() => import("../components/Teacher/TeacherHomeDashboard"));
const TeacherClassData = lazy(() => import("../components/Teacher/TeacherClassData"));
const TeacherTimetableData = lazy(() => import("../components/Teacher/TeacherTimetableData"));
const TeacherReportData = lazy(() => import("../components/Teacher/TeacherReportData"));
const TeacherSettingsData = lazy(() => import("../components/Teacher/TeacherSettingsData"));
const TeacherAttendanceData = lazy(() => import("../components/Teacher/TeacherAttendanceData"));
const TeacherEventData = lazy(() => import("../components/Teacher/TeacherEventData"));
const TeacherAnnouncementData = lazy(() => import("../components/Teacher/TeacherAnnouncementData"));
const TeacherResultData = lazy(() => import("../components/Teacher/TeacherResultData"));

import {
  TEACHER_SIDEBAR_GROUPS,
  getTeacherScreenMeta,
} from "../data/teacherdashboardData.ts";
import { AuthContext } from "../context/AuthContext";

interface Notification {
  id: number;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

interface TeacherDashboardHeaderProps {
  activeItem: string;
  subtitle: string;
  searchPlaceholder: string;
  dateDay: string;
  fullDate: string;
  notifications: Notification[];
  showNotifications: boolean;
  setShowNotifications: (v: boolean) => void;
}

function TeacherDashboardHeader({
  activeItem,
  subtitle,
  searchPlaceholder,
  dateDay,
  fullDate,
  notifications,
  showNotifications,
  setShowNotifications,
}: TeacherDashboardHeaderProps) {
  return (
    <div className="flex flex-1 items-center justify-between">
      <div className="hidden md:block min-w-0 pr-4">
        <h1 className="text-xl font-bold text-slate-800 truncate">{activeItem}</h1>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>

      <div className="flex items-center gap-6 ml-auto shrink-0">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder={searchPlaceholder}
            className="pl-10 pr-4 py-2 w-48 lg:w-64 rounded-xl border border-gray-100 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-4 border-l pl-6 border-gray-100">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 rounded-xl transition-all ${
                showNotifications
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notifications.some((n) => n.unread) && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
              )}
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNotifications(false)}
                  aria-hidden
                />
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-20 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                  <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-sm">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-300px overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer flex gap-3 transition-colors ${
                          n.unread ? "bg-blue-50/20" : ""
                        }`}
                      >
                        <div
                          className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                            n.unread ? "bg-blue-600" : "bg-transparent"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 leading-tight">
                            {n.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">{n.desc}</p>
                          <p className="text-[10px] text-slate-400 mt-2">
                            {n.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col items-end min-w-max">
            <p className="text-xs font-bold text-slate-700 leading-none">
              {dateDay}
            </p>
            <p className="text-[10px] text-gray-400 mt-1 leading-none">
              {fullDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const TeacherDashboard = () => {
  const auth = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [dateInfo] = useState(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return {
      day: now.toLocaleDateString("en-US", { weekday: "long" }),
      fullDate: now.toLocaleDateString("en-US", options),
    };
  });

  const screenMeta = getTeacherScreenMeta(activeItem);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Attendance pending",
      desc: "CSE 2024-B has 3 students unmarked",
      time: "2 mins ago",
      unread: true,
    },
    {
      id: 2,
      title: "Marks upload",
      desc: "CS-302 midterm marks imported successfully",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "Department circular",
      desc: "Internal viva schedule shared for this Friday",
      time: "5 hours ago",
      unread: true,
    },
  ]);

  const tabComponent = useMemo(() => {
    switch (activeItem) {
      case "Classes":
        return <TeacherClassData />;
      case "Teaching":
        return <TeacherAttendanceData />;
      case "Timetable":
        return <TeacherTimetableData />;
      case "Events":
        return <TeacherEventData />;
      case "Announcements":
        return <TeacherAnnouncementData />;
      case "Reports":
        return <TeacherReportData />;
      case "Results":
        return <TeacherResultData />;
      case "Settings":
        return <TeacherSettingsData />;
      case "Dashboard":
      default:
        return (
          <TeacherHomeDashboard
            userName={auth?.user?.name}
            onNavigate={setActiveItem}
          />
        );
    }
  }, [activeItem, auth?.user?.name]);

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <TeacherSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        sidebarGroups={TEACHER_SIDEBAR_GROUPS}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center h-20 shadow-sm z-10">
          <button
            type="button"
            className="lg:hidden text-gray-600 mr-4 p-2 hover:bg-slate-100 rounded-lg shrink-0"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <TeacherDashboardHeader
            activeItem={activeItem}
            subtitle={screenMeta.subtitle}
            searchPlaceholder={screenMeta.searchPlaceholder}
            dateDay={dateInfo.day}
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

export default TeacherDashboard;
