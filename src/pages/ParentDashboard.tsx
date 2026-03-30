import { useState } from "react";
import { Menu, LogOut, Settings, Search } from "lucide-react";

import ParentSidebar from "../components/Parent/features/ParentSidebar";
import ParentOverview from "../components/Parent/features/ParentOverview";
import ParentChildProfile from "../components/Parent/features/ParentChildProfile";
import ChildAttendance from "../components/Parent/features/ParentChildAttendance";
import GradeandReports from "../components/Parent/features/GradeandReports";
import ParentAnnouncement from "../components/Parent/features/ParentAnnouncement";
import Timetable from "../components/Parent/features/Timetable";
import { NotificationDropdown } from "../components/shared/NotificationDropdown";
import { useDashboard } from "../hooks/useDashboard";
import type { Notification } from "../types";

const ParentDashboard = () => {
  const {
    collapsed, setCollapsed, mobileOpen, setMobileOpen,
    activeItem, setActiveItem, dateInfo,
    showNotifications, setShowNotifications, showProfile, setShowProfile,
    handleLogout, auth,
  } = useDashboard("Overview");

  const [notifications] = useState<Notification[]>([
    { id: 1, title: "Attendance Alert", desc: "Your child was absent today", time: "2 mins ago", unread: true },
    { id: 2, title: "Fee Reminder", desc: "Monthly fee due in 3 days", time: "1 hour ago", unread: true },
    { id: 3, title: "Exam Results", desc: "Mid-term results are now available", time: "5 hours ago", unread: false },
  ]);

  const renderHeader = () => (
    <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center h-20 shadow-sm z-10">
      <button
        className="lg:hidden text-gray-600 mr-4 p-2 hover:bg-slate-100 rounded-lg"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={22} />
      </button>

      <div className="flex flex-1 items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{activeItem}</h1>
          <p className="text-xs text-gray-500">Parent Portal • Student Tracking</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-48 lg:w-64 rounded-xl border border-gray-100 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <NotificationDropdown
            notifications={notifications}
            show={showNotifications}
            onToggle={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            onClose={() => setShowNotifications(false)}
          />

          <div className="hidden lg:flex flex-col items-end min-w-max border-l pl-4 border-gray-100">
            <p className="text-xs font-bold text-slate-700 leading-none">{dateInfo.day}</p>
            <p className="text-[10px] text-gray-400 mt-1 leading-none">{dateInfo.fullDate}</p>
          </div>

          <div className="relative">
            <button
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className={`flex items-center gap-2 p-1.5 rounded-xl transition-all ${showProfile ? "bg-blue-50" : "hover:bg-gray-100"}`}
            >
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-black">IA</div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-700 leading-none">Ishan Awasthi</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Parent</p>
              </div>
            </button>
            {showProfile && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 z-20 overflow-hidden">
                  <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                    <p className="text-sm font-bold text-slate-800">Ishan Awasthi</p>
                    <p className="text-xs text-slate-400 mt-0.5">{auth?.user?.email}</p>
                    <span className="inline-block mt-2 px-2.5 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-bold rounded-full uppercase tracking-wider">Parent</span>
                  </div>
                  <div className="p-2">
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                      onClick={() => setShowProfile(false)}
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
    </header>
  );

  const renderContent = () => {
    switch (activeItem) {
      case "Overview":          return <ParentOverview />;
      case "Child Profile":     return <ParentChildProfile />;
      case "Attendance":        return <ChildAttendance />;
      case "Grades and Reports": return <GradeandReports />;
      case "Timetable":         return <Timetable />;
      case "Announcements":     return <ParentAnnouncement />;
      default:                  return <ParentOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <ParentSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderHeader()}
        <main className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default ParentDashboard;
