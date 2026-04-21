import React from 'react';
import { Search, Plus, Pin, Calendar, User } from "lucide-react";
import { Button, Input, Card, StatusBadge } from '../ui';

interface PinnedAnnouncement {
  id: number;
  priority: string;
  audience: string;
  title: string;
  author: string;
  content: string;
  date: string;
}

interface RecentAnnouncement {
  id: number;
  title: string;
  date: string;
  author: string;
}

const AdminAnnouncementData: React.FC = () => {
  const pinnedAnnouncements: PinnedAnnouncement[] = [
    {
      id: 1,
      priority: "High Priority",
      audience: "Everyone",
      title: "Annual Sports Day 2026",
      author: "Dr. Sarah Johnson",
      content: "The annual sports meet is scheduled for next month. Please ensure all student registrations are completed.",
      date: "Oct 24, 2026",
    },
    {
      id: 2,
      priority: "High Priority",
      audience: "Students",
      title: "Mid-Term Examination Schedule",
      author: "Academic Office",
      content: "The detailed schedule for the upcoming mid-term examinations has been uploaded.",
      date: "Oct 22, 2026",
    },
  ];

  const recentAnnouncements: RecentAnnouncement[] = [
    { id: 3, title: "Library New Arrivals", date: "Oct 20, 2026", author: "Librarian" },
    { id: 4, title: "Canteen Menu Update", date: "Oct 19, 2026", author: "Admin Staff" },
    { id: 5, title: "Tech Club Meeting", date: "Oct 18, 2026", author: "John Doe" },
  ];

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 3);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-900">
      {/* Header Section using Input and Button components */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Input 
            placeholder="Search announcement..." 
            className="pl-10" // Adding padding for the absolute icon
          />
          <Search className="absolute left-3 top-[38px] -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
        <Button variant="primary" className="gap-2">
          <Plus className="w-4 h-4" /> New Announcement
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Pin className="w-5 h-5 text-blue-600 fill-blue-600" />
        <h2 className="text-lg font-bold">Pinned Announcements</h2>
      </div>

      {/* Pinned Section using Card and StatusBadge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {pinnedAnnouncements.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Pin className="w-4 h-4 text-blue-600 fill-blue-600" />
              <div className="flex gap-2">
                <StatusBadge status={item.priority} variant="danger" />
                <StatusBadge status={item.audience} variant="info" />
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{item.content}</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                  {getInitials(item.author)}
                </div>
                <span className="text-sm font-semibold text-slate-700">{item.author}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5" /> 
                <span className="text-xs">{item.date}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800">Recent Announcements</h2>
      </div>

      {/* Recent Section using Card and StatusBadge */}
      <div className="flex flex-col lg:flex-row gap-6">
        {recentAnnouncements.map((item) => (
          <Card key={item.id} className="flex-1 hover:border-blue-200 transition-colors">
            <div className="flex gap-2 mb-4">
              <StatusBadge status="Medium" variant="warning" />
              <StatusBadge status="Students" variant="info" />
            </div>
            <div className="mb-5">
              <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This is a sample description for the recent announcement to keep the community updated.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-slate-600">{item.author}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3 h-3" />
                <span className="text-[10px]">{item.date}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminAnnouncementData;