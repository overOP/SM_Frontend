import React, { useState, useMemo } from "react";
import { 
  Search, 
  Plus, 
  Calendar, 
  
  MapPin, 
   
  Filter,
  X,
  Trophy,
  Users2,
  BookOpen,
  Palmtree,
  CalendarCheck
} from "lucide-react";

import { Card, StatusBadge, Button, Input } from '../ui';

// --- Types ---
export type EventType = "Sports" | "Meeting" | "Academic" | "Cultural" | "Holiday";

export interface SchoolEvent {
  id: number;
  type: EventType;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  audience: string;
}

// --- Static Data (Satisfies React Compiler) ---
const EVENTS_DATA: SchoolEvent[] = [
  { id: 1, type: "Sports", title: "Annual Sports Day", description: "Annual sports competition featuring track and field events, team sports, and awards.", date: "Sun, Dec 28, 2025", time: "9:00 AM - 4:00 PM", location: "Main Sports Ground", audience: "All Students" },
  { id: 2, type: "Meeting", title: "Parent-Teacher Meeting", description: "Quarterly meeting to discuss student progress and academic performance.", date: "Mon, Jan 5, 2026", time: "10:00 AM - 1:00 PM", location: "School Auditorium", audience: "Parents & Teachers" },
  { id: 3, type: "Academic", title: "Science Fair", description: "Students showcase their science projects and innovations to the faculty.", date: "Thu, Jan 15, 2026", time: "11:00 AM - 3:00 PM", location: "Science Lab Building", audience: "Class 8-10" },
  { id: 4, type: "Cultural", title: "Cultural Festival", description: "Annual cultural celebration with performances, art exhibitions, and food.", date: "Tue, Jan 20, 2026", time: "5:00 PM - 9:00 PM", location: "School Main Hall", audience: "All Students" },
  { id: 5, type: "Holiday", title: "Republic Day Celebration", description: "National holiday celebration with flag hoisting and cultural programs.", date: "Mon, Jan 26, 2026", time: "8:00 AM - 12:00 PM", location: "School Ground", audience: "Staff & Students" },
];

const StudentEvents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<EventType | "All">("All");

  // Filtering Logic
  const filteredEvents = useMemo(() => {
    return EVENTS_DATA.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === "All" || event.type === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  const getIcon = (type: EventType) => {
    switch (type) {
      case "Sports": return <Trophy size={18} />;
      case "Meeting": return <Users2 size={18} />;
      case "Academic": return <BookOpen size={18} />;
      case "Holiday": return <Palmtree size={18} />;
      default: return <CalendarCheck size={18} />;
    }
  };

  const getVariant = (type: EventType) => {
    switch (type) {
      case "Sports": return "success";
      case "Meeting": return "warning";
      case "Academic": return "info";
      case "Holiday": return "error";
      default: return "default";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* 1. Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Events Gallery</h2>
          <p className="text-slate-400 font-medium mt-1">Stay updated with the latest school activities.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Input 
              placeholder="Find an event..." 
              icon={Search}
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full md:w-72 bg-white border-slate-200 rounded-2xl"
            />
            {searchTerm && (
              <Button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                <X size={14} />
              </Button>
            )}
          </div>
         
        </div>
      </div>

      {/* 2. Type Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {["All", "Academic", "Sports", "Cultural", "Meeting", "Holiday"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab as any)}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all border ${
              activeFilter === tab 
              ? "bg-slate-900 text-white border-slate-900" 
              : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event) => (
          <Card key={event.id} noPadding className="group hover:scale-[1.02] transition-all duration-300 border-none shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="p-8 space-y-5">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${
                  event.type === 'Sports' ? 'bg-emerald-50 text-emerald-600' : 
                  event.type === 'Academic' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'
                }`}>
                  {getIcon(event.type)}
                </div>
                <StatusBadge status={event.type} variant={getVariant(event.type)} />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                  {event.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2 line-clamp-2">
                  {event.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-50 space-y-3">
                <div className="flex items-center gap-3 text-slate-500">
                  <Calendar size={14} className="text-blue-500" />
                  <span className="text-[11px] font-bold uppercase tracking-tight">{event.date}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <MapPin size={14} className="text-slate-300" />
                  <span className="text-[11px] font-bold text-slate-400">{event.location}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full rounded-xl py-6 border-slate-100 text-[10px] font-black uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="py-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <Filter size={32} className="text-slate-200" />
          </div>
          <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No events found</p>
        </div>
      )}
    </div>
  );
};

export default StudentEvents;