import { useState } from "react";
import { Menu, Bell, Search, MessageSquare, ChevronRight } from "lucide-react";
// Components
import ParentSidebar from "../components/Parent/ParentSidebar";
import ParentOverview from "../components/Parent/ParentOverview";
import ParentChildProfile from "../components/Parent/ParentChildProfile";
import ChildAttendance from "../components/Parent/ParentChildAttendance";
import GradeandReports from "../components/Parent/GradeandReports";
import ParentAnnouncement from "../components/Parent/ParentAnnouncement";
import Timetable from "../components/Parent/Timetable";
import ExamResults from "../components/Parent/Exam";
import { Button } from "../components/ui";

const ParentDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Overview");

  // Reusable Header with Breadcrumbs and Student Context
  const renderHeader = () => (
    <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center h-20 shadow-sm z-30">
      <Button
        className="lg:hidden text-gray-600 mr-4 p-2 hover:bg-slate-50 rounded-lg transition-colors"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={22} />
      </Button>

      <div className="flex flex-1 items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
            <span>Parent Portal</span>
            <ChevronRight size={10} />
            <span className="text-blue-600">Ishan Awasthi</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">{activeItem}</h1>
        </div>

        <div className="flex items-center gap-4 lg:gap-8">
          {/* Global Search - Hidden on small mobile */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search marks, attendance..."
              className="pl-11 pr-4 py-2.5 w-72 rounded-xl border border-slate-100 bg-slate-50 text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none border-transparent focus:border-blue-200"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-all rounded-xl relative group">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
            </Button>
            
            {/* Quick Chat with Teacher */}
            <Button variant="outline" size="sm" className="hidden sm:flex rounded-xl border-slate-200">
               <MessageSquare size={18} className="mr-2 text-blue-600" />
               Contact Teacher
            </Button>
          </div>
        </div>
      </div>
    </header>
  );

  const renderContent = () => {
    // Each component is wrapped in an animation container
    const contentWrapper = (children: React.ReactNode) => (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {children}
      </div>
    );

    switch (activeItem) {
      case "Overview":
        return contentWrapper(<ParentOverview />);
      case "Child Profile":
        return contentWrapper(<ParentChildProfile />);
      case "Attendance":
        return contentWrapper(<ChildAttendance />);
      case "Grades and Reports":
        return contentWrapper(<GradeandReports />);
      case "Timetable":
        return contentWrapper(<Timetable />);
      case "Announcements":
        return contentWrapper(<ParentAnnouncement />);
      case "ExamResults":
        return contentWrapper(<ExamResults />);
      default:
        return contentWrapper(<div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Page rendering in Progress</div>);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans antialiased">
      {/* Sidebar - Controlled visibility */}
      <ParentSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {renderHeader()}
        
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] scroll-smooth">
          {/* Subtle background gradient to make the white cards pop */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 to-transparent pointer-events-none" />
          
          <div className="relative z-10 p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
};

export default ParentDashboard;