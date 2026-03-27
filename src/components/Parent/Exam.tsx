import React from 'react';
import { 
  Trophy, 
  Target, 
  Download, 
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  Timer,
  BookOpenCheck,
  BrainCircuit,
  Award
} from "lucide-react";

// Importing your reusable UI components
import { 
  Card, 
  StatCard, 
  DataTable, 
  StatusBadge, 
  Button, 
 
} from '../ui';

// --- Types ---
interface RoutineItem {
  date: string;
  day: string;
  subject: string;
  time: string;
  venue: string;
  status: 'completed' | 'upcoming' | 'ongoing';
}

const ExamResults = () => {
  const routineData: RoutineItem[] = [
    { date: "2026-04-14", day: "Tuesday", subject: "Mathematics", time: "09:00 AM - 12:00 PM", venue: "Examination Hall A", status: 'upcoming' },
    { date: "2026-04-16", day: "Thursday", subject: "Science", time: "09:00 AM - 12:00 PM", venue: "Examination Hall A", status: 'upcoming' },
    { date: "2026-04-18", day: "Saturday", subject: "English", time: "09:00 AM - 12:00 PM", venue: "Main Auditorium", status: 'upcoming' },
    { date: "2026-04-20", day: "Monday", subject: "Social Studies", time: "09:00 AM - 12:00 PM", venue: "Examination Hall B", status: 'upcoming' },
    { date: "2026-04-22", day: "Wednesday", subject: "Computer Science", time: "01:00 PM - 03:00 PM", venue: "IT Lab 1", status: 'upcoming' },
  ];

  const columns = [
    { 
      header: 'Date & Day', 
      accessor: 'date' as keyof RoutineItem,
      render: (row: RoutineItem) => (
        <div className="flex flex-col">
          <span className="font-black text-slate-800 tracking-tight">{row.date}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{row.day}</span>
        </div>
      )
    },
    { 
      header: 'Subject', 
      accessor: 'subject' as keyof RoutineItem,
      render: (row: RoutineItem) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <BookOpenCheck size={16} />
          </div>
          <span className="font-bold text-slate-700">{row.subject}</span>
        </div>
      )
    },
    { 
      header: 'Time & Venue', 
      accessor: 'time' as keyof RoutineItem,
      render: (row: RoutineItem) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
            <Clock size={12} className="text-slate-300" />
            {row.time}
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <MapPin size={12} />
            {row.venue}
          </div>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status' as keyof RoutineItem,
      render: (row: RoutineItem) => (
        <StatusBadge 
          status={row.status} 
          variant={row.status === 'upcoming' ? 'info' : 'success'} 
        />
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 lg:p-10 animate-in fade-in duration-700">
      
      {/* 1. Dynamic Header with Countdown */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl rotate-3">
            <Timer size={40} />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight">18 Days Remaining</h2>
            <p className="text-blue-200/70 font-medium flex items-center gap-2 mt-1">
              <Calendar size={14} /> Mid-Term Examination Series 2026
            </p>
          </div>
        </div>
        <div className="flex gap-3 relative z-10">
          <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-2xl">
            <Download size={18} className="mr-2" /> Schedule PDF
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 rounded-2xl px-8 shadow-xl shadow-blue-500/20">
            Exam Guidelines
          </Button>
        </div>
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
      </div>

      {/* 2. Preparation & Previous Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Overall GPA" value="3.92" icon={Target} trend={4.2} />
        <StatCard title="Class Rank" value="04 / 42" icon={Award} colorClass="text-amber-600" bgClass="bg-amber-50" />
        <StatCard title="Preparation" value="80%" icon={BrainCircuit} colorClass="text-purple-600" bgClass="bg-purple-50" />
        <StatCard title="Last Term" value="Distinction" icon={Trophy} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* 3. Exam Routine (Replaced Scorecard) */}
        <div className="xl:col-span-2 space-y-6">
          <Card noPadding className="border-none shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                <h3 className="font-black text-slate-800 uppercase tracking-wider text-sm">Exam Time-Table</h3>
              </div>
              <StatusBadge status="Admit Card Issued" variant="success" />
            </div>
            <div className="p-4">
               <DataTable 
                columns={columns} 
                data={routineData} 
              />
            </div>
          </Card>
        </div>

        {/* 4. Exam Insights & Rules */}
        <div className="space-y-6">
          <Card title="Candidate Checklist" className="border-none shadow-lg">
             <div className="space-y-5">
                <ul className="space-y-4">
                  {[
                    { text: "Original Admit Card", checked: true },
                    { text: "Geometry Box & Tools", checked: true },
                    { text: "School Uniform (Formals)", checked: false },
                    { text: "Transparent Water Bottle", checked: false }
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${item.checked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200'}`}>
                        {item.checked && <BookOpenCheck size={12} />}
                      </div>
                      {item.text}
                    </li>
                  ))}
                </ul>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4">
                  <div className="p-2 bg-white rounded-xl text-amber-600 shadow-sm shrink-0 h-fit">
                    <AlertCircle size={18} />
                  </div>
                  <div>
                    <h4 className="font-black text-amber-900 text-xs uppercase tracking-widest mb-1">Warning</h4>
                    <p className="text-[11px] text-amber-800/70 leading-relaxed font-medium">
                      Electronic gadgets, including smartwatches, are strictly prohibited in the hall.
                    </p>
                  </div>
                </div>
             </div>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-none p-8">
             <h4 className="font-black text-lg mb-2">Principal's Note</h4>
             <p className="text-sm text-blue-100 leading-relaxed italic">
               "We encourage parents to ensure students maintain a consistent sleep schedule during the 10-day examination period to maximize cognitive performance."
             </p>
             <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
                   Attendance Required: 90%+
                </div>
                <div className="flex -space-x-2">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="w-6 h-6 rounded-full border-2 border-indigo-600 bg-blue-400" />
                   ))}
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExamResults;