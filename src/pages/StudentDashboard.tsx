import  { useState, useMemo } from "react";
import { Search, Bell, Menu, ChevronRight, TrendingUp, Sparkles, Clock } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Reusable UI Components
import { Card, Button } from "../components/ui";

// Student Feature Components
import StudentSidebar from "../components/Student/StudentSidebar";
import StudentAttendanceData from "../components/Student/StudentAttendanceData";
import StudentEventData from "../components/Student/StudentEventData";
import StudentTimetableData from "../components/Student/StudentTimetableData";
import StudentAnnouncementData from "../components/Student/StudentAnnouncementData";
import Homework from "../components/Student/StudentHomework";

// Data
import {
  sidebarItems,
  statsCards,
  chartData,
  activities,
} from "../data/studentdashboardData";

// --- Types ---
interface Notification {
  id: number;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

interface HeaderProps {
  activeItem: string;
  unreadCount: number;
  showNotifications: boolean;
  setShowNotifications: (val: boolean) => void;
  notifications: Notification[];
  dateInfo: { day: string; fullDate: string };
  setMobileOpen: (val: boolean) => void;
  placeholder?: string;
}


const DashboardHeader = ({ 
  activeItem, unreadCount, showNotifications, setShowNotifications, notifications, dateInfo, setMobileOpen, placeholder = "Search everything..." 
}: HeaderProps) => (
  <header className="sticky top-0 z-30 flex h-24 w-full items-center justify-between border-b border-slate-100 bg-white/80 px-8 backdrop-blur-md">
    <div className="flex items-center gap-4">
      <Button 
        variant="ghost" 
        className="lg:hidden p-2 text-slate-600 hover:bg-blue-50" 
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={22} />
      </Button>
      
      <div className="hidden md:block">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Portal</span>
          <ChevronRight size={10} className="text-slate-300" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{activeItem}</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">{activeItem}</h1>
      </div>
    </div>

    <div className="flex items-center gap-6">
      <div className="relative hidden xl:block">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder={placeholder}
          className="h-12 w-72 rounded-2xl bg-slate-50 pl-12 pr-4 text-sm font-medium transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none border-none"
        />
      </div>

      <div className="flex items-center gap-3 border-l border-slate-100 pl-6">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
              showNotifications ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-4 w-80 origin-top-right overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-2xl z-50 animate-in zoom-in-95 duration-200">
                <div className="bg-blue-50/50 p-5 border-b border-slate-100 flex justify-between items-center">
                  <p className="text-xs font-black uppercase tracking-widest text-blue-600">Notifications</p>
                  <span className="text-[10px] font-bold text-blue-600 bg-white px-2 py-1 rounded-lg border border-blue-100">New: {unreadCount}</span>
                </div>
                <div className="max-h-[380px] overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-5 hover:bg-blue-50/30 transition-colors cursor-pointer border-b border-slate-50 last:border-0">
                      <div className="flex gap-4">
                        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${n.unread ? "bg-blue-600" : "bg-slate-200"}`} />
                        <div className="space-y-1">
                          <p className="text-sm font-bold leading-none text-slate-900">{n.title}</p>
                          <p className="text-xs text-slate-500 leading-relaxed">{n.desc}</p>
                          <p className="text-[10px] font-medium text-slate-400 pt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="hidden sm:flex flex-col items-end min-w-[100px]">
          <span className="text-xs font-black text-slate-900 leading-none">{dateInfo.day}</span>
          <span className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-tighter">{dateInfo.fullDate}</span>
        </div>
      </div>
    </div>
  </header>
);

const DefaultDashboardView = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    {/* Statistics Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {statsCards.map((card) => (
        <Card key={card.title} className="group border-none bg-white p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${card.color} shadow-sm`}>
              <card.icon className="w-6 h-6" />
            </div>
            <TrendingUp className="text-slate-200 group-hover:text-blue-500 transition-colors" size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{card.title}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{card.value}</h3>
            <p className="text-xs font-bold text-emerald-500 mt-2 flex items-center gap-1">
              <Sparkles size={12} /> {card.sub}
            </p>
          </div>
        </Card>
      ))}
    </div>

    {/* Charts & Logs */}
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <Card className="xl:col-span-2 border-none bg-white p-8 rounded-[3rem] shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Attendance Intelligence</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time presence tracking</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-2xl">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-black text-blue-600 uppercase">Live Metrics</span>
          </div>
        </div>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} dy={15} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '15px'}}
                itemStyle={{fontSize: '12px', fontWeight: '900', color: '#1e293b'}}
              />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="border-none bg-white p-8 rounded-[3rem] shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">System Logs</h3>
          <Clock className="text-slate-300" size={20} />
        </div>
        <div className="space-y-8 relative">
          <div className="absolute left-[17px] top-2 bottom-2 w-px bg-blue-50" />
          {activities.map((a, i) => (
            <div key={i} className="flex gap-5 relative z-10 group cursor-pointer">
              <div className={`w-9 h-9 rounded-2xl shrink-0 flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${a.color} border-2 border-white`}>
                <a.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 border-b border-slate-50 pb-4 group-last:border-0">
                <div className="flex justify-between items-start">
                   <p className="text-sm font-black text-slate-800 leading-none tracking-tight">{a.title}</p>
                   <span className="text-[9px] font-black text-slate-300 uppercase">{a.time}</span>
                </div>
                <p className="text-xs text-slate-400 font-medium mt-1.5">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

/* --- 2. MAIN DASHBOARD PAGE --- */

const StudentDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [showNotifications, setShowNotifications] = useState(false);

  // Memoized date to fix the setState in effect error
  const dateInfo = useMemo(() => {
    const now = new Date();
    return {
      day: now.toLocaleDateString("en-US", { weekday: "long" }),
      fullDate: now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    };
  }, []);

  const notifications= useMemo(() => [
    { id: 1, title: "New Admission", desc: "Siddharth added to Class 10A", time: "2 mins ago", unread: true },
    { id: 2, title: "Fee Payment", desc: "Monthly fee received", time: "1 hour ago", unread: true },
    { id: 3, title: "Exam Results", desc: "Board exams result available", time: "5 hours ago", unread: true },
  ], []);

  const unreadCount = useMemo(() => notifications.filter(n => n.unread).length, [notifications]);

  const renderContent = () => {
    return (
      <div key={activeItem} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {(() => {
          switch (activeItem) {
            case "Timetable": return <StudentTimetableData />;
            case "Announcements": return <StudentAnnouncementData />;
            case "Events": return <StudentEventData />;
            case "Attendance": return <StudentAttendanceData />;
            case "Homework": return <Homework />;
            default: return <DefaultDashboardView />;
          }
        })()}
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      <StudentSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        sidebarItems={sidebarItems}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader 
          activeItem={activeItem}
          unreadCount={unreadCount}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          notifications={notifications}
          dateInfo={dateInfo}
          setMobileOpen={setMobileOpen}
          placeholder={activeItem === "Teachers" ? "Search staff..." : "Search students..."}
        />
        
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-[#f8fafc] p-6 lg:p-10">
          <div className="max-w-[1500px] mx-auto pb-10">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;