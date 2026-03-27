import React, { useState, useMemo } from 'react';
import { Megaphone, Calendar, Plus } from "lucide-react";

// Importing your reusable components
import { 
  Card, 
  StatusBadge, 
  Button, 
  Select 
} from "../ui";

// 1. Types & Mock Data Integration
type NoticeTag = "event" | "exam" | "general";

interface Notice {
  id: string;
  title: string;
  tag: NoticeTag;
  desc: string;
  date: string;
}

const MOCK_NOTICES: Notice[] = [
  {
    id: '1',
    title: "Annual Sports Day",
    tag: "event",
    desc: "The annual sports day will be held on April 5th. All students are expected to participate in at least one event.",
    date: "2026-03-22",
  },
  {
    id: '2',
    title: "Mid-Term Exam Schedule",
    tag: "exam",
    desc: "Mid-term examinations will commence from April 14th. The detailed subject-wise schedule has been uploaded.",
    date: "2026-03-20",
  },
  {
    id: '3',
    title: "PTM Scheduled for March 28",
    tag: "general",
    desc: "Parent-Teacher Meeting is scheduled for Saturday, March 28th from 9 AM to 1 PM. Your presence is important.",
    date: "2026-03-18",
  }
];

const ParentAnnouncement = () => {
  const [filter, setFilter] = useState<string>("All Categories");

  /* DATA INTEGRATION:
     To fetch from an API, use a hook like:
     const { data: notices, isLoading } = useQuery(['notices'], fetchNotices);
  */
  const notices = MOCK_NOTICES;

  // UX Improvement: Filtering logic
  const filteredNotices = useMemo(() => {
    if (filter === "All Categories") return notices;
    return notices.filter(n => n.tag === filter.toLowerCase());
  }, [filter, notices]);

  // Map tags to your StatusBadge variants
  const getBadgeVariant = (tag: NoticeTag) => {
    const variants: Record<NoticeTag, any> = {
      event: "success",
      exam: "danger",
      general: "info"
    };
    return variants[tag];
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-700">
      
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Announcements</h1>
          <p className="text-slate-500 text-sm">Stay updated with the latest school news and events.</p>
        </div>
        <div className="flex gap-2">
          <Select 
            options={["All Categories", "Event", "Exam", "General"]} 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-44"
          />
          
        </div>
      </div>

      {/* Announcements List */}
      <Card className="border-none shadow-xl shadow-slate-200/40" noPadding>
        <div className="divide-y divide-slate-50">
          {filteredNotices.length > 0 ? filteredNotices.map((notice) => (
            <div 
              key={notice.id} 
              className="p-6 flex flex-col md:flex-row items-start gap-6 hover:bg-slate-50/50 transition-colors group"
            >
              {/* Icon Container */}
              <div className="hidden md:flex w-14 h-14 shrink-0 rounded-2xl bg-white border border-slate-100 shadow-sm items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <Megaphone size={24} />
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h4 className="text-lg font-bold text-slate-800">{notice.title}</h4>
                  <StatusBadge status={notice.tag} variant={getBadgeVariant(notice.tag)} />
                </div>

                <p className="text-slate-600 leading-relaxed text-sm max-w-3xl">
                  {notice.desc}
                </p>

                <div className="flex items-center gap-4 pt-1">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <Calendar size={14} />
                    {notice.date}
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600 font-bold h-auto p-0 hover:bg-transparent">
                    View Details →
                  </Button>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center flex flex-col items-center">
               <div className="bg-slate-50 p-4 rounded-full mb-4">
                 <Megaphone size={32} className="text-slate-300" />
               </div>
               <p className="text-slate-400 font-medium">No announcements found in this category.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ParentAnnouncement;