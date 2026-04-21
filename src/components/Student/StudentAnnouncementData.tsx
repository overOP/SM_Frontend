import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { Bell, Clock, Pin, Search, User } from "lucide-react";
import type { Announcement } from "../../types";
import { Button, Card, Input, StatusBadge } from "../ui";
import { Modal } from "../ui/Modal";
import {
  StudentCardGridSkeleton,
  StudentEmptyState,
} from "./shared/StudentModuleStates";

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

export default function StudentAnnouncementData() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get("q") ?? "");
  const [priorityFilter, setPriorityFilter] = useState<"All" | "High" | "Medium" | "Low">(
    (searchParams.get("priority") as "All" | "High" | "Medium" | "Low") ?? "All"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [activeAnnouncement, setActiveAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    const next: Record<string, string> = {};
    if (searchTerm.trim()) next.q = searchTerm.trim();
    if (priorityFilter !== "All") next.priority = priorityFilter;
    setSearchParams(next, { replace: true });
  }, [searchTerm, priorityFilter, setSearchParams]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 320);
    return () => clearTimeout(timer);
  }, [searchTerm, priorityFilter]);

  const filteredItems = useMemo<Announcement[]>(() => {
    return MOCK_ANNOUNCEMENTS.filter((item) => {
      const matchesQuery =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === "All" || item.priority === priorityFilter;
      return matchesQuery && matchesPriority;
    });
  }, [searchTerm, priorityFilter]);

  const pinnedItems = filteredItems.filter(item => item.isPinned);
  const recentItems = filteredItems.filter(item => !item.isPinned);

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-md shadow-blue-100">
              <Bell size={18} />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">Announcements</p>
              <h2 className="text-xl font-black tracking-tight text-slate-900">Notice board</h2>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Input
              placeholder="Search announcements..."
              icon={Search}
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80"
              title="Search announcements"
            />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as "All" | "High" | "Medium" | "Low")}
              className="h-[42px] rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              title="Filter by priority"
              aria-label="Filter by priority"
            >
              <option value="All">All priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </Card>

      {isLoading ? <StudentCardGridSkeleton cards={3} /> : null}

      {!isLoading && (
        <>
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-blue-600">
                <Pin size={13} className="rotate-45 fill-blue-600" />
                <span>Pinned</span>
              </div>
              <StatusBadge status={`${filteredItems.length} in view`} variant="info" />
            </div>
            {pinnedItems.length === 0 ? (
              <StudentEmptyState title="No pinned announcements" description="There are no pinned notices for current filters." />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {pinnedItems.map((item) => (
                  <Card key={item.id} className="border-slate-200">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <StatusBadge status={item.priority} variant="danger" />
                        <StatusBadge status={item.audience} variant="info" />
                      </div>
                      <h3 className="text-base font-black text-slate-900">{item.title}</h3>
                      <p className="text-sm text-slate-600">{item.content}</p>
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-black text-blue-600">
                            {getInitials(item.author)}
                          </div>
                          <span className="text-xs font-bold text-slate-700">{item.author}</span>
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                          <Clock size={12} /> {item.date}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Recent updates</h3>
            {recentItems.length === 0 ? (
              <StudentEmptyState title="No recent announcements" description="No recent updates match the current filters." />
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {recentItems.map((item) => (
                  <Card key={item.id} className="border-slate-200 p-0 transition-shadow hover:shadow-md">
                    <button
                      type="button"
                      className="w-full cursor-pointer p-6 text-left"
                      onClick={() => setActiveAnnouncement(item)}
                      title={`Open announcement ${item.title}`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                          <h4 className="line-clamp-1 text-sm font-bold text-slate-800">{item.title}</h4>
                        </div>
                        <p className="line-clamp-2 text-xs text-slate-500">{item.content}</p>
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                          <span className="flex items-center gap-1">
                            <User size={12} /> {item.author}
                          </span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </button>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <Modal isOpen={Boolean(activeAnnouncement)} onClose={() => setActiveAnnouncement(null)} title="Announcement">
        {activeAnnouncement ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <StatusBadge status={activeAnnouncement.priority} variant="danger" />
              <StatusBadge status={activeAnnouncement.audience} variant="info" />
            </div>
            <h3 className="text-lg font-black text-slate-900">{activeAnnouncement.title}</h3>
            <p className="text-sm leading-relaxed text-slate-600">{activeAnnouncement.content}</p>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-500">
              <p>Author: {activeAnnouncement.author}</p>
              <p className="mt-1">Date: {activeAnnouncement.date}</p>
            </div>
            <div className="flex justify-end">
              <Button type="button" variant="primary" onClick={() => setActiveAnnouncement(null)}>
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}