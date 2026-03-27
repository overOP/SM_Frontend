import React, { useState } from 'react';
import { 
  Clock, 
  User, 
  Calendar as CalendarIcon, 
  ChevronRight, 
  BookOpen,
  Coffee
} from "lucide-react";

// Importing your reusable components
import { 
  Card, 
  Button, 
  StatusBadge 
} from '../ui';

// --- Types ---
interface TimeSlot {
  time: string;
  subject: string;
  teacher: string;
  type?: 'lecture' | 'break' | 'activity';
}

interface DaySchedule {
  day: string;
  slots: TimeSlot[];
}

// --- Mock Data ---
const SCHEDULE_DATA: DaySchedule[] = [
  {
    day: "Monday",
    slots: [
      { time: "08:00 – 08:45", subject: "Mathematics", teacher: "Mrs. Kapoor", type: 'lecture' },
      { time: "08:45 – 09:30", subject: "Science", teacher: "Mr. Verma", type: 'lecture' },
      { time: "09:30 – 09:45", subject: "Short Break", teacher: "Campus", type: 'break' },
      { time: "09:45 – 10:30", subject: "English", teacher: "Ms. Bhatia", type: 'lecture' },
      { time: "10:30 – 11:15", subject: "Hindi", teacher: "Mrs. Reddy", type: 'lecture' },
    ],
  },
  {
    day: "Tuesday",
    slots: [
      { time: "08:00 – 08:45", subject: "Physics", teacher: "Dr. Sharma", type: 'lecture' },
      { time: "08:45 – 09:30", subject: "P.E.", teacher: "Mr. Kumar", type: 'activity' },
      { time: "09:45 – 10:30", subject: "Mathematics", teacher: "Ms. Bhatia", type: 'lecture' },
    ],
  },
  // ... other days follow same pattern
  { day: "Wednesday", slots: [{ time: "08:00 – 08:45", subject: "Chemistry", teacher: "Mrs. Dutta" }] },
  { day: "Thursday", slots: [{ time: "08:00 – 08:45", subject: "Physics", teacher: "Dr. Sharma" }] },
  { day: "Friday", slots: [{ time: "08:00 – 08:45", subject: "Biology", teacher: "Dr. Mehta" }] },
  { day: "Sunday", slots: [{ time: "08:00 – 08:45", subject: "Yoga", teacher: "Mr. Anand" }] },
];

const Timetable = () => {
  // Default to the first day or logic could be added to default to current day
  const [activeDay, setActiveDay] = useState<string>("Monday");

  const currentSchedule = SCHEDULE_DATA.find(d => d.day === activeDay);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 lg:p-10 animate-in fade-in duration-700">
      
      {/* 1. Header & Day Selector */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Class Timetable</h1>
          <p className="text-slate-500 text-sm font-medium">Weekly schedule for Academic Year 2025-26</p>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-full overflow-x-auto no-scrollbar">
          {SCHEDULE_DATA.map((daySchedule) => (
            <button
              key={daySchedule.day}
              onClick={() => setActiveDay(daySchedule.day)}
              className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap ${
                activeDay === daySchedule.day 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {daySchedule.day}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Dynamic Schedule List */}
      <div className="space-y-4">
        {currentSchedule?.slots.map((slot, i) => (
          <Card key={i} noPadding className="group hover:border-blue-200 transition-all border-slate-100 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row items-stretch">
              
              {/* Time Indicator */}
              <div className="w-full md:w-48 bg-slate-50/50 p-6 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Clock size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Duration</span>
                </div>
                <span className="text-slate-800 font-black tracking-tight">{slot.time}</span>
              </div>

              {/* Subject Information */}
              <div className="flex-1 p-6 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    slot.type === 'break' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {slot.type === 'break' ? <Coffee size={24} /> : <BookOpen size={24} />}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {slot.subject}
                    </h4>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <User size={14} />
                      <span className="text-xs font-semibold">{slot.teacher}</span>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block">
                  <StatusBadge 
                    status={slot.type || 'Lecture'} 
                    variant={slot.type === 'break' ? 'warning' : 'info'} 
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="hidden md:flex items-center px-6 border-l border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="rounded-full h-10 w-10 p-0">
                  <ChevronRight size={18} />
                </Button>
              </div>

            </div>
          </Card>
        ))}

        {(!currentSchedule || currentSchedule.slots.length === 0) && (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <CalendarIcon size={32} />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No classes scheduled for today</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Timetable;