import { useState } from "react";
import { Menu, Bell, Search } from "lucide-react";
import ParentSidebar from "../components/Parent/features/ParentSidebar";
import ParentOverview from "../components/Parent/features/ParentOverview";
import ParentChildProfile from "../components/Parent/features/ParentChildProfile";
import ChildAttendance from "../components/Parent/features/ParentChildAttendance";
import GradeandReports from "../components/Parent/features/GradeandReports";
import ParentAnnouncement from "../components/Parent/features/ParentAnnouncement";
import Timetable from "../components/Parent/features/Timetable";


const ParentDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Overview");

  // Reusable Header (Similar to your Admin layout)
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
          <p className="text-xs text-gray-500">
            Parent Portal • Student Tracking
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              className="pl-10 pr-4 py-2 w-64 rounded-xl border border-gray-100 bg-gray-50 text-sm focus:outline-none"
            />
          </div>
          <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>
    </header>
  );

  const renderContent = () => {
    switch (activeItem) {
      case "Overview":
        return <ParentOverview/>;
      case "Child Profile":
        return <ParentChildProfile/>;
      case "Attendance":
        return <ChildAttendance/>
      case "Grades and Reports":
        return <GradeandReports/>;
      case "Timetable":
        return <Timetable/>;
      case "Announcements":
        return <ParentAnnouncement/>;
      default:
        return <div className="p-4">Welcome to Parent Portal</div>;
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
