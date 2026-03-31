import { useState, useEffect } from "react";
import { Search, Menu, LogOut, Settings } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

import AdminSidebar from "../components/Admin/features/AdminSidebar";
import AdminTeacherData from "../components/Admin/features/AdminTeacherData";
import AdminStudentData from "../components/Admin/features/AdminStudentData";
import AdminClassData from "../components/Admin/features/AdminClassData";
import AdminFeesData from "../components/Admin/features/AdminFeesData";
import AdminAttendanceData from "../components/Admin/features/AdminAttendanceData";
import AdminEventData from "../components/Admin/features/AdminEventData";
import AdminAnnouncementData from "../components/Admin/features/AdminAnnouncementData";
import AdminExamData from "../components/Admin/features/AdminExamData.tsx";
import AdminReportData from "../components/Admin/features/AdminReportData";
import AdminSettingsData from "../components/Admin/features/AdminSettingsData";
import AdminTimetableData from "../components/Admin/features/AdminTimetableData";
import AdminResultData from "../components/Admin/features/AdminResultData";
import { NotificationDropdown } from "../components/shared/NotificationDropdown";
import { useDashboard } from "../hooks/useDashboard";
import type { Notification } from "../types";
import { sidebarItems, statsCards, chartData, activities } from "../data/dashboardData.ts";

const AdminDashboard = () => {
  const {
    collapsed, setCollapsed, mobileOpen, setMobileOpen,
    activeItem, setActiveItem, dateInfo,
    showNotifications, setShowNotifications, showProfile, setShowProfile,
    handleLogout, auth,
  } = useDashboard();

  const [searchFilters, setSearchFilters] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem("admin-search-filters") ?? "{}"); }
    catch { return {}; }
  });

  const [notifications] = useState<Notification[]>([
    { id: 1, title: "New Admission", desc: "Siddharth added to Class 10A", time: "2 mins ago", unread: true },
    { id: 2, title: "Fee Payment", desc: "Monthly fee received from Roll #22", time: "1 hour ago", unread: true },
    { id: 3, title: "Exam Results", desc: "Board exams result are now available", time: "5 hours ago", unread: true },
  ]);

  useEffect(() => {
    localStorage.setItem("admin-search-filters", JSON.stringify(searchFilters));
  }, [searchFilters]);

  const HeaderActions = ({ placeholder = "Search...", sectionKey }: { placeholder?: string; sectionKey: string }) => (
    <div className="flex flex-1 items-center justify-between">
      <div className="hidden md:block">
        <h1 className="text-xl font-bold text-slate-800">{activeItem}</h1>
        <p className="text-xs text-gray-500">
          {activeItem === "Dashboard" ? "School overview and analytics" : `Manage ${activeItem.toLowerCase()}`}
        </p>
      </div>

      <div className="flex items-center gap-6 ml-auto">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchFilters[sectionKey] ?? ""}
            onChange={(e) => setSearchFilters((prev) => ({ ...prev, [sectionKey]: e.target.value }))}
            className="pl-10 pr-4 py-2 w-48 lg:w-64 rounded-xl border border-gray-100 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-4 border-l pl-6 border-gray-100">
          <NotificationDropdown
            notifications={notifications}
            show={showNotifications}
            onToggle={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            onClose={() => setShowNotifications(false)}
          />

          <div className="hidden lg:flex flex-col items-end min-w-max">
            <p className="text-xs font-bold text-slate-700 leading-none">{dateInfo.day}</p>
            <p className="text-[10px] text-gray-400 mt-1 leading-none">{dateInfo.fullDate}</p>
          </div>

          <div className="relative">
            <button
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className={`flex items-center gap-2 p-1.5 rounded-xl transition-all ${showProfile ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-black">AD</div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-700 leading-none">Admin</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Administrator</p>
              </div>
            </button>
            {showProfile && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 z-20 overflow-hidden">
                  <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                    <p className="text-sm font-bold text-slate-800">Admin</p>
                    <p className="text-xs text-slate-400 mt-0.5">{auth?.user?.email}</p>
                    <span className="inline-block mt-2 px-2.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wider">Administrator</span>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => { setActiveItem("Settings"); setShowProfile(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" /> Settings
                    </button>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderHeaderContent = () => {
    switch (activeItem) {
      case "Teachers": return <HeaderActions placeholder="Search teachers..." sectionKey="Teachers" />;
      case "Students": return <HeaderActions placeholder="Search students..." sectionKey="Students" />;
      default: return <HeaderActions placeholder="Search everything..." sectionKey={activeItem} />;
    }
  };

  const renderContent = () => {
    switch (activeItem) {
      case "Teachers":      return <AdminTeacherData />;
      case "Students":      return <AdminStudentData />;
      case "Classes":       return <AdminClassData />;
      case "Fees":          return <AdminFeesData />;
      case "Attendance":    return <AdminAttendanceData />;
      case "Timetable":     return <AdminTimetableData />;
      case "Exams":         return <AdminExamData />;
      case "Events":        return <AdminEventData />;
      case "Announcements": return <AdminAnnouncementData />;
      case "Results":       return <AdminResultData />;
      case "Reports":       return <AdminReportData />;
      case "Settings":      return <AdminSettingsData />;
      default:
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {statsCards.map((card) => (
                <div key={card.title} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                      <card.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{card.sub}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
              <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-6 text-slate-800">Weekly Attendance Overview</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fill="url(#colorView)" />
                    <defs>
                      <linearGradient id="colorView" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-6 text-slate-800">Recent Activity</h3>
                <div className="space-y-5">
                  {activities.map((a, i) => (
                    <div key={i} className="flex gap-4">
                      <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center ${a.color}`}>
                        <a.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800 leading-none">{a.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{a.desc}</p>
                      </div>
                      <span className="text-[10px] font-medium text-gray-400">{a.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        sidebarItems={sidebarItems}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center h-20 shadow-sm z-10">
          <button className="lg:hidden text-gray-600 mr-4 p-2 hover:bg-slate-100 rounded-lg" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
          {renderHeaderContent()}
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
          <div className="max-w-1400 mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
