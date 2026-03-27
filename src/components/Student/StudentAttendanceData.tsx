import React, { useState, useMemo } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  Sparkles,
  Download,
  Search,
  MessageSquare,
  MoreVertical,
  Filter
} from "lucide-react";

// Using your reusable UI library
import { Card, Button } from "../ui";

// --- Types & Constants ---
type AttendanceStatus = "present" | "absent" | "late" | "holiday";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const StudentAttendanceCRM: React.FC = () => {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedMonth, setSelectedMonth] = useState(2); 
  const currentYear = 2026;

  const { totalDays, startOffset, monthName } = useMemo(() => {
    return {
      totalDays: new Date(currentYear, selectedMonth + 1, 0).getDate(),
      startOffset: new Date(currentYear, selectedMonth, 1).getDay(),
      monthName: MONTHS[selectedMonth]
    };
  }, [selectedMonth]);

  const getDailyStatus = (day: number): AttendanceStatus => {
    const date = new Date(currentYear, selectedMonth, day);
    if (date.getDay() === 0) return "holiday";
    if (selectedMonth === 2) {
      if (day === 11) return "absent";
      if (day === 17) return "late";
    }
    return "present";
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 p-4 animate-in fade-in duration-700">
      
      {/* 1. CRM Utility Bar: Search & Global Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search student by name or ID..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="rounded-2xl border-slate-200 text-slate-600 gap-2 h-12 px-6">
            <Filter size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
          </Button>
          <Button className="bg-slate-900 text-white rounded-2xl gap-2 h-12 px-6 ml-auto md:ml-0 shadow-xl shadow-slate-200">
            <Sparkles size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Generate Report</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 2. Student Context Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-none bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-3xl font-black text-white mb-4 shadow-lg">
                IA
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Ishan Awasthi</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 text-center">CS-2024-24 • Grade 10A</p>
              
              <div className="w-full grid grid-cols-2 gap-2 mb-6">
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Attendance</p>
                  <p className="text-lg font-black text-blue-600">96.4%</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Status</p>
                  <p className="text-lg font-black text-emerald-500">Active</p>
                </div>
              </div>

              <div className="w-full space-y-2">
                <Button className="w-full justify-start gap-3 bg-blue-50 hover:bg-blue-100 text-blue-600 border-none rounded-xl h-11 px-4">
                  <MessageSquare size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Message Parent</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500 rounded-xl h-11 px-4">
                  <Clock size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Late Logs</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* 3. Main Attendance Management Area */}
        <Card className="lg:col-span-9 border-none shadow-2xl shadow-slate-200/50 bg-white p-8 rounded-[3rem]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4 bg-slate-100 p-1 rounded-[1.5rem]">
               <button 
                 onClick={() => setViewMode("calendar")}
                 className={`px-6 py-2 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
               >
                 Calendar
               </button>
               <button 
                 onClick={() => setViewMode("list")}
                 className={`px-6 py-2 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
               >
                 Logs
               </button>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setSelectedMonth(p => Math.max(0, p - 1))} className="w-10 h-10 rounded-full hover:bg-slate-100 p-0"><ChevronLeft size={20} /></Button>
                <h3 className="text-sm font-black text-slate-900 min-w-[120px] text-center uppercase tracking-widest">{monthName} {currentYear}</h3>
                <Button variant="ghost" onClick={() => setSelectedMonth(p => Math.min(11, p + 1))} className="w-10 h-10 rounded-full hover:bg-slate-100 p-0"><ChevronRight size={20} /></Button>
              </div>
              <Button variant="outline" className="w-10 h-10 rounded-xl p-0 border-slate-100"><Download size={18} /></Button>
            </div>
          </div>

          {/* Render Calendar Logic with CRM "Quick Edit" Hover */}
          {viewMode === "calendar" ? (
            <div className="grid grid-cols-7 gap-3">
              {DAYS_SHORT.map(d => (
                <div key={d} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">{d}</div>
              ))}
              {Array.from({ length: startOffset }).map((_, i) => <div key={i} />)}
              {Array.from({ length: totalDays }).map((_, i) => {
                const day = i + 1;
                const status = getDailyStatus(day);
                const styles = {
                  present: "bg-emerald-50 text-emerald-600 border-emerald-100",
                  absent: "bg-rose-50 text-rose-600 border-rose-100",
                  late: "bg-amber-50 text-amber-600 border-amber-100",
                  holiday: "bg-slate-50 text-slate-300 border-transparent opacity-60"
                };
                return (
                  <div key={day} className={`h-24 rounded-[1.8rem] border flex flex-col items-center justify-center relative transition-all duration-300 cursor-pointer group hover:shadow-lg ${styles[status]}`}>
                    <span className="text-lg font-black">{day}</span>
                    <Button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/5 rounded-lg">
                      <MoreVertical size={14} />
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {/* List items go here */}
              <p className="text-center text-slate-300 font-medium py-10">Attendance log list view...</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StudentAttendanceCRM;