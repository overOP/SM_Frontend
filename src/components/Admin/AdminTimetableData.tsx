import React, { useState, useRef } from 'react';
import { 
  
  Check, 
  Plus, 
  Trash2, 
  Printer, 
  Calendar, 
  Clock, 
  Coffee, 
  MapPin, 
  Edit3, 
  Save, 

  Layout,
  User,
  DoorOpen
} from 'lucide-react';
import { Button, Select, Input, Card,  } from '../ui'; 

interface Session {
  id: number;
  subject: string;
  teacher: string;
  time: string;
  room: string;
  isBreak: boolean;
}

interface DayColumn {
  day: string;
  sessions: Session[];
}

const AdminTimetableData: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('Class 10A');
  const [editingDay, setEditingDay] = useState<string | null>(null);
  
  const classes = ['Class 10A', 'Class 10B', 'Class 9A', 'Class 9B', 'Class 8A'];
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // Initial State
  const [timetable, setTimetable] = useState<DayColumn[]>([
    { day: "Monday", sessions: [
      { id: 1, subject: "Mathematics", teacher: "Dr. Sarah Johnson", time: "08:00 - 08:45", room: "101", isBreak: false },
      { id: 2, subject: "Morning Break", teacher: "-", time: "08:45 - 09:00", room: "-", isBreak: true },
    ]},
    { day: "Tuesday", sessions: [] },
    { day: "Wednesday", sessions: [] },
    { day: "Thursday", sessions: [] },
    { day: "Friday", sessions: [] },
  ]);

  const nextId = useRef(3);

  // --- Handlers ---

  const handleAddRow = (dayName: string) => {
    const newSession: Session = {
      id: nextId.current++,
      subject: "",
      teacher: "",
      time: "08:00 - 09:00",
      room: "",
      isBreak: false
    };
    
    setTimetable(prev => prev.map(d => 
      d.day === dayName ? { ...d, sessions: [...d.sessions, newSession] } : d
    ));
  };

  const updateSession = (dayName: string, sessionId: number, field: keyof Session, value: string | number | boolean) => {
    setTimetable(prev => prev.map(d => {
      if (d.day === dayName) {
        return {
          ...d,
          sessions: d.sessions.map(s => s.id === sessionId ? { ...s, [field]: value } : s)
        };
      }
      return d;
    }));
  };

  const deleteSession = (dayName: string, sessionId: number) => {
    setTimetable(prev => prev.map(d => 
      d.day === dayName ? { ...d, sessions: d.sessions.filter(s => s.id !== sessionId) } : d
    ));
  };

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen font-sans text-slate-700">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Class Timetable</h1>
          <p className="text-sm text-slate-400 font-medium">Weekly schedule management for students and faculty</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Select 
            options={classes} 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full sm:w-48"
          />
          <Button variant="outline" onClick={() => window.print()} className="w-full sm:w-auto gap-2 bg-white">
            <Printer size={16} /> Export PDF
          </Button>
          <Button variant="primary" className="w-full sm:w-auto gap-2 shadow-lg shadow-blue-100">
            <Save size={16} /> Save Changes
          </Button>
        </div>
      </div>

      {/* Timetable Grid - 5 Columns for Weekdays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {timetable.map((col) => {
          const isToday = col.day === todayName;
          const isEditing = editingDay === col.day;

          return (
            <div key={col.day} className="flex flex-col gap-4 group/day">
              {/* Day Header */}
              <div className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all duration-300 ${
                isToday ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-100' : 'bg-white border-slate-100 shadow-sm'
              }`}>
                <h3 className={`font-black text-xs uppercase tracking-widest ${isToday ? 'text-white' : 'text-slate-400'}`}>
                  {col.day}
                </h3>
                <button 
                  onClick={() => setEditingDay(isEditing ? null : col.day)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isToday ? 'hover:bg-blue-500 text-white' : 'hover:bg-slate-100 text-slate-300 hover:text-blue-500'
                  }`}
                >
                  {isEditing ? <Check size={16} /> : <Edit3 size={16} />}
                </button>
              </div>

              {/* Sessions List */}
              <div className={`flex-1 space-y-3 min-h-[600px] p-2 rounded-3xl transition-all duration-300 ${
                isEditing ? 'bg-blue-50/50 ring-2 ring-blue-200 ring-dashed ring-offset-4' : ''
              }`}>
                {col.sessions.map((session) => (
                  <Card key={session.id} noPadding className={`relative border-l-4 transition-all hover:shadow-md ${
                    session.isBreak ? 'border-amber-400 bg-amber-50/30' : 'border-blue-500 bg-white'
                  } ${isEditing ? 'p-4' : 'p-4'}`}>
                    
                    {isEditing ? (
                      <div className="space-y-3 animate-in fade-in zoom-in-95">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-black uppercase text-slate-400">Editing Session</span>
                          <Button variant="ghost"onClick={() => deleteSession(col.day, session.id)} className="text-rose-400 hover:text-rose-600">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                        
                        <Input 
                          placeholder="08:00 - 09:00"
                          icon={Clock}
                          value={session.time}
                          onChange={(e) => updateSession(col.day, session.id, 'time', e.target.value)}
                        />
                        
                        <Input 
                          placeholder="Subject"
                          icon={Layout}
                          value={session.subject}
                          onChange={(e) => updateSession(col.day, session.id, 'subject', e.target.value)}
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <Input 
                            placeholder="Room"
                            icon={MapPin}
                            value={session.room}
                            onChange={(e) => updateSession(col.day, session.id, 'room', e.target.value)}
                          />
                          <button 
                            onClick={() => updateSession(col.day, session.id, 'isBreak', !session.isBreak)}
                            className={`flex items-center justify-center gap-1.5 rounded-xl border text-[10px] font-bold uppercase transition-all ${
                              session.isBreak 
                                ? 'bg-amber-100 border-amber-200 text-amber-700' 
                                : 'bg-slate-50 border-slate-200 text-slate-500'
                            }`}
                          >
                            {session.isBreak ? <Coffee size={12} /> : <Clock size={12} />}
                            {session.isBreak ? 'Break' : 'Period'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase ${session.isBreak ? 'text-amber-600' : 'text-blue-600'}`}>
                            <Clock size={12} /> {session.time}
                          </div>
                          {session.isBreak && <Coffee size={14} className="text-amber-400" />}
                        </div>
                        
                        <h4 className="font-bold text-slate-800 text-sm mb-3 group-hover:text-blue-600 transition-colors">
                          {session.subject || "No Title"}
                        </h4>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                            <DoorOpen size={12} /> Rm {session.room || '--'}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase max-w-[80px] truncate">
                            <User size={12} /> {session.teacher || 'TBA'}
                          </div>
                        </div>
                      </>
                    )}
                  </Card>
                ))}

                {/* Day Add Button */}
                {isEditing ? (
                  <button 
                    onClick={() => handleAddRow(col.day)}
                    className="w-full py-4 border-2 border-dashed border-blue-200 rounded-2xl text-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-1"
                  >
                    <Plus size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Add Session</span>
                  </button>
                ) : col.sessions.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-100 rounded-3xl opacity-50 group-hover/day:opacity-100 transition-opacity">
                    <Calendar size={32} className="text-slate-200 mb-4" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-4">No Sessions Scheduled</p>
                    <Button variant="ghost" size="sm" onClick={() => setEditingDay(col.day)} className="text-blue-500 font-black text-[10px]">
                      + SETUP DAY
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminTimetableData;