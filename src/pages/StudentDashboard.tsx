import { Suspense, lazy, useContext, useMemo, useState } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import StudentSidebar from "../components/Student/StudentSidebar";
import {
  STUDENT_SIDEBAR_GROUPS,
  getStudentScreenMeta,
} from "../data/studentdashboardData";

const StudentHomeDashboard = lazy(() => import("../components/Student/StudentHomeDashboard"));
const StudentAttendanceData = lazy(() => import("../components/Student/StudentAttendanceData"));
const StudentEventData = lazy(() => import("../components/Student/StudentEventData"));
const StudentTimetableData = lazy(() => import("../components/Student/StudentTimetableData"));
const StudentAnnouncementData = lazy(() => import("../components/Student/StudentAnnouncementData"));
const StudentHomeworkData = lazy(() => import("../components/Student/StudentHomework"));
const StudentResultsData = lazy(() => import("../components/Student/StudentResults"));

interface Notification {
  id: number;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

interface StudentDashboardHeaderProps {
  activeItem: string;
  subtitle: string;
  searchPlaceholder: string;
  day: string;
  fullDate: string;
  notifications: Notification[];
  showNotifications: boolean;
  setShowNotifications: (value: boolean) => void;
}

function StudentDashboardHeader({
  activeItem,
  subtitle,
  searchPlaceholder,
  day,
  fullDate,
  notifications,
  showNotifications,
  setShowNotifications,
}: StudentDashboardHeaderProps) {
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
            type="search"
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
                showNotifications ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-100"
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
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
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
                        <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.unread ? "bg-blue-600" : "bg-transparent"}`} />
                        <div className="flex-1">
                          <p className="text-sm font-bold leading-tight text-slate-800">{n.title}</p>
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

const StudentDashboard = () => {
  const auth = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [dateInfo] = useState(() => {
    const now = new Date();
    return {
      day: now.toLocaleDateString("en-US", { weekday: "long" }),
      fullDate: now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };
  });

  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Assignment updated",
      desc: "Physics practical file deadline moved to tomorrow.",
      time: "12 mins ago",
      unread: true,
    },
    {
      id: 2,
      title: "Attendance alert",
      desc: "You are at 94% this month. Keep it above 90%.",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "Result published",
      desc: "Unit test marks for Mathematics are now available.",
      time: "Yesterday",
      unread: false,
    },
  ]);

  const screenMeta = getStudentScreenMeta(activeItem);

  const tabComponent = useMemo(() => {
    switch (activeItem) {
      case "Attendance":
        return <StudentAttendanceData />;
      case "Timetable":
        return <StudentTimetableData />;
      case "Homework":
        return <StudentHomeworkData />;
      case "Results":
        return <StudentResultsData />;
      case "Events":
        return <StudentEventData />;
      case "Announcements":
        return <StudentAnnouncementData />;
      case "Dashboard":
      default:
        return <StudentHomeDashboard userName={auth?.user?.name} onNavigate={setActiveItem} />;
    }
  }, [activeItem, auth?.user?.name]);

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <StudentSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        sidebarGroups={STUDENT_SIDEBAR_GROUPS}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-10 flex h-20 items-center border-b border-slate-100 bg-white px-8 py-4 shadow-sm">
          <button
            type="button"
            className="mr-4 rounded-lg p-2 text-gray-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open student menu"
          >
            <Menu size={22} />
          </button>
          <StudentDashboardHeader
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

        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-8">
          <div className="mx-auto max-w-1400">
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

export default StudentDashboard;