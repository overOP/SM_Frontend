import React, { useState, useMemo,  } from "react";
import type { ChangeEvent } from "react";
import { Search, Pin, Bell, Clock, User, X } from "lucide-react";
import type { Announcement }  from "../../types";
import { Card, StatusBadge, Button, Input } from '../ui';

// Static data defined outside the component to satisfy the React Compiler
const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { 
    id: 1, 
    priority: "High", 
    audience: "Everyone", 
    title: "Annual Sports Day 2026", 
    author: "Dr. Sarah Johnson", 
    content: "The annual sports meet is scheduled for next month. Registrations close this Friday.", 
    date: "Oct 24, 2026",
    isPinned: true
  },
  { 
    id: 2, 
    priority: "Medium", 
    audience: "Students", 
    title: "New Tech Stack Workshop", 
    author: "Ayush Tiwari", 
    content: "Join us for a deep dive into Next.js and TypeScript patterns in the computer lab.", 
    date: "Oct 25, 2026",
    isPinned: false
  }
];

const StudentAnnouncements: React.FC = () => {
  // Explicitly typing State
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Explicitly typing the Memoized filtered data
  const filteredItems = useMemo<Announcement[]>(() => {
    return MOCK_ANNOUNCEMENTS.filter((item) => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const pinnedItems = filteredItems.filter(item => item.isPinned);
  const recentItems = filteredItems.filter(item => !item.isPinned);

  // Helper function with explicit parameter and return types
  const getInitials = (name: string): string => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-100">
            <Bell size={24} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Notice Board</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Input 
              placeholder="Search announcements..." 
              icon={Search}
              value={searchTerm}
              // Specific event typing for React Input
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 bg-white border-slate-200 rounded-2xl"
            />
            {searchTerm && (
              <Button 
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
              >
                <X size={16} />
              </Button>
            )}
          </div>
          
        </div>
      </div>

      {/* Pinned Grid */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-[10px]">
          <Pin size={14} className="rotate-45 fill-blue-600" />
          <span>Pinned Information</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pinnedItems.map((item) => (
            <Card key={item.id} className="border-none shadow-2xl shadow-slate-200/50">
               {/* Content logic using specific types */}
               <div className="space-y-4">
                  <div className="flex justify-between">
                     <StatusBadge status={item.priority} variant="danger" />
                     <StatusBadge status={item.audience} variant="info" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.content}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                          {getInitials(item.author)}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{item.author}</span>
                     </div>
                     <span className="text-[10px] font-black text-slate-300 flex items-center gap-1">
                        <Clock size={12} /> {item.date}
                     </span>
                  </div>
               </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Feed */}
      <section className="space-y-6">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Updates</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {recentItems.map((item) => (
            <Card key={item.id} className="hover:shadow-xl transition-shadow cursor-pointer border-slate-100">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                   <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{item.title}</h4>
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <span className="flex items-center gap-1"><User size={12} /> {item.author}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StudentAnnouncements;