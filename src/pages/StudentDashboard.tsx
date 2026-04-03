import { useState } from "react";
import { Search, Menu, LogOut, Settings, UserCircle } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

import StudentSidebar from "../components/Student/features/StudentSidebar";
import StudentAttendanceData from "../components/Student/features/StudentAttendanceData";
import StudentEventData from "../components/Student/features/StudentEventData";
import StudentTimetableData from "../components/Student/features/StudentTimetableData";
import StudentAnnouncementData from "../components/Student/features/StudentAnnouncementData";
import Homework from "../components/Student/features/StudentHomework";
import StudentResultData from "../components/Student/features/StudentResultData";
import StudentProfileData from "../components/Student/features/StudentProfileData";
import { NotificationDropdown } from "../components/shared/NotificationDropdown";
import { useDashboard } from "../hooks/useDashboard";
import type { Notification } from "../types";
import { statsCards, chartData, activities } from "../data/studentdashboardData";

const StudentDashboard = () => {
  const {
    setMobileOpen,
    activeItem, setActiveItem, dateInfo,
    showNotifications, setShowNotifications, showProfile, setShowProfile,
    handleLogout, auth,
  } = useDashboard();

  const [notifications] = useState<Notification[]>([
    { id: 1, title: "Exam Schedule", desc: "Unit Test 2 starts from Nov 10", time: "2 mins ago", unread: true },
    { id: 2, title: "Homework Due", desc: "Math assignment due tomorrow", time: "1 hour ago", unread: true },
    { id: 3, title: "Exam Results", desc: "Mid-term results are now available", time: "5 hours ago", unread: false },
  ]);

  const HeaderActions = ({ placeholder = "Search..." }: { placeholder?: string }) => (
    <div className="flex flex-1 items-center justify-between">
      <div className="hidden md:block">
        <h1 className="text-xl font-bold text-slate-800">{activeItem}</h1>
        <p className="text-xs text-gray-500">
          {activeItem === "Dashboard" ? "Welcome back, Alex!" : `Your ${activeItem.toLowerCase()}`}
        </p>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            className="pl-10 pr-4 py-2 w-48 lg:w-64 rounded-xl border border-gray-100 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 border-l pl-4 border-gray-100">
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

         
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeItem) {
      case "Timetable":     return <StudentTimetableData />;
      case "Announcements": return <StudentAnnouncementData />;
      case "Events":        return <StudentEventData />;
      case "Attendance":    return <StudentAttendanceData />;
      case "Homework":      return <Homework />;
      case "Results":       return <StudentResultData />;
      case "Profile":       return <StudentProfileData />;
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
                <h3 className="text-lg font-bold mb-6 text-slate-800">Weekly Attendance</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
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
      <StudentSidebar
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center h-20 shadow-sm z-10">
          <button className="lg:hidden text-gray-600 mr-4 p-2 hover:bg-slate-100 rounded-lg" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
          <HeaderActions placeholder="Search..." />
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
