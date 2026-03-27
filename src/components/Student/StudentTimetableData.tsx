import React, { useState } from "react";
import { 
  Clock, 
  MapPin, 
  User, 
  Coffee, 
  FlaskConical, 
  BookOpen,
  CalendarDays,
  ChevronRight
} from "lucide-react";

// Reusable UI Library from your CRM project
import { Card, StatusBadge, Button } from '../ui';

// --- Types & Interfaces ---
export type SessionType = "lecture" | "lab" | "break";

export interface Session {
  subject: string;
  time: string;
  teacher?: string;
  room?: string;
  type: SessionType;
}

export interface TimetableDay {
  day: string;
  sessions: Session[];
}

// --- Static Data (Moved outside to satisfy React Compiler) ---
const TIMETABLE_DATA: TimetableDay[] = [
  {
    day: "Sunday",
    sessions: [
      { subject: "English", teacher: "Ms. Emily Davis", time: "8:00 - 8:45", room: "Room 103", type: "lecture" },
      { subject: "Mathematics", teacher: "Dr. Sarah Johnson", time: "8:50 - 9:35", room: "Room 101", type: "lecture" },
      { subject: "Break", time: "10:25 - 10:45", type: "break" },
      { subject: "Chemistry Lab", teacher: "Mr. Robert Wilson", time: "10:50 - 11:35", room: "Lab 1", type: "lab" },
    ],
  },
  {
    day: "Monday",
    sessions: [
      { subject: "Physics", teacher: "Prof. Michael Chen", time: "8:00 - 8:45", room: "Room 102", type: "lecture" },
      { subject: "Mathematics", teacher: "Dr. Sarah Johnson", time: "8:50 - 9:35", room: "Room 101", type: "lecture" },
      { subject: "Lunch", time: "12:25 - 1:10", type: "break" },
      { subject: "History", teacher: "Mrs. Patricia Brown", time: "1:15 - 2:00", room: "Room 104", type: "lecture" },
    ],
  },
  {
    day: "Tuesday",
    sessions: [
      { subject: "Biology", teacher: "Dr. Lisa Anderson", time: "9:40 - 10:25", room: "Room 105", type: "lecture" },
      { subject: "Geography", teacher: "Mr. James Wilson", time: "11:40 - 12:25", room: "Room 106", type: "lecture" },
      { subject: "Physical Education", teacher: "Coach Miller", time: "1:15 - 2:00", room: "Sports Ground", type: "lecture" },
    ],
  },
  // Note: Add Wednesday-Friday here following the same structure
];

const StudentTimetable: React.FC = () => {
  // Logic to determine "Today" for the initial tab state
  const todayName = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());
  
  // State: Default to today if it exists in data, otherwise first day
  const [activeTab, setActiveTab] = useState<string>(
    TIMETABLE_DATA.some(d => d.day === todayName) ? todayName : TIMETABLE_DATA[0].day
  );

  // Deriving data (React Compiler handles the optimization automatically now)
  const currentDayData = TIMETABLE_DATA.find(d => d.day === activeTab);
  const sessions = currentDayData?.sessions || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* 1. Page Header & Tab Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600">
            <CalendarDays size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Academic Schedule</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Timetable</h2>
        </div>

        {/* Custom Tab Switcher */}
        <div className="flex p-1.5 bg-slate-100 rounded-[1.5rem] border border-slate-200 overflow-x-auto no-scrollbar">
          {TIMETABLE_DATA.map((item) => (
            <button
              key={item.day}
              onClick={() => setActiveTab(item.day)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === item.day 
                ? "bg-white text-blue-600 shadow-xl shadow-blue-100 scale-105" 
                : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {item.day === todayName ? "Today" : item.day.substring(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* 2. Main Session Feed (3/4 Width) */}
        <div className="xl:col-span-3 space-y-4">
          {sessions.length > 0 ? (
            sessions.map((session, index) => (
              <Card 
                key={`${activeTab}-${index}`} 
                noPadding 
                className={`border-none shadow-lg shadow-slate-200/40 group hover:translate-x-1 transition-all duration-300 ${
                  session.type === 'break' ? 'opacity-70' : ''
                }`}
              >
                <div className="flex items-stretch min-h-[90px]">
                  {/* Visual Status Bar */}
                  <div className={`w-1.5 ${
                    session.type === 'lab' ? 'bg-emerald-500' : 
                    session.type === 'break' ? 'bg-slate-300' : 'bg-blue-600'
                  }`} />

                  <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-5">
                      {/* Contextual Icon */}
                      <div className={`p-4 rounded-2xl shrink-0 ${
                        session.type === 'lab' ? 'bg-emerald-50 text-emerald-600' : 
                        session.type === 'break' ? 'bg-slate-50 text-slate-400' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {session.type === 'lab' ? <FlaskConical size={22} /> : 
                         session.type === 'break' ? <Coffee size={22} /> : <BookOpen size={22} />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-black text-slate-800 text-lg leading-tight">
                            {session.subject}
                          </h4>
                          <StatusBadge 
                            status={session.type} 
                            variant={session.type === 'lab' ? 'success' : session.type === 'break' ? 'default' : 'info'} 
                          />
                        </div>
                        
                        {session.type !== 'break' && (
                          <div className="flex flex-wrap items-center gap-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">
                            <span className="flex items-center gap-1.5"><User size={12} className="text-slate-300" /> {session.teacher}</span>
                            <span className="flex items-center gap-1.5"><MapPin size={12} className="text-slate-300" /> {session.room}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                       <div className="text-left md:text-right">
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Schedule</p>
                          <div className="flex items-center gap-2 text-slate-700 font-black text-sm">
                             <Clock size={14} className="text-blue-500" />
                             {session.time}
                          </div>
                       </div>
                       <ChevronRight className="text-slate-200 group-hover:text-blue-600 transition-colors hidden md:block" />
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="py-20 text-center border-dashed border-2 border-slate-100 shadow-none">
               <Coffee size={40} className="mx-auto text-slate-200 mb-4" />
               <h3 className="text-lg font-black text-slate-800">Rest Day</h3>
               <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">No sessions scheduled for {activeTab}</p>
            </Card>
          )}
        </div>

        {/* 3. Sidebar (1/4 Width) */}
        <div className="space-y-6">
           <Card title="Quick Actions" className="border-none shadow-xl">
              <div className="space-y-3">
                 <Button variant="outline" className="w-full rounded-xl justify-start h-12 text-[10px] font-black uppercase tracking-widest">
                    Download PDF
                 </Button>
                 <Button variant="outline" className="w-full rounded-xl justify-start h-12 text-[10px] font-black uppercase tracking-widest">
                    Request Change
                 </Button>
              </div>
           </Card>

           <div className="p-8 rounded-[2rem] bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-2xl">
              <h4 className="font-black text-lg mb-2">Teacher's Note</h4>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                "Please remember to bring your lab coats for the Chemistry session on Sunday."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTimetable;