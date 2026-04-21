import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Calendar, Megaphone, Search } from "lucide-react";
import { Button, Card, Input, StatusBadge } from "../ui";
import { Modal } from "../ui/Modal";
import { ParentCardGridSkeleton, ParentEmptyState } from "./shared/ParentModuleStates";

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
    id: "1",
    title: "Annual Sports Day",
    tag: "event",
    desc: "Annual sports day will be held on April 5th. Students must register by Friday.",
    date: "2026-03-22",
  },
  {
    id: "2",
    title: "Mid-Term Exam Schedule",
    tag: "exam",
    desc: "Mid-term examinations commence from April 14th. Detailed schedule uploaded.",
    date: "2026-03-20",
  },
  {
    id: "3",
    title: "PTM Scheduled for March 28",
    tag: "general",
    desc: "Parent-Teacher meeting is scheduled Saturday, March 28th from 9 AM to 1 PM.",
    date: "2026-03-18",
  },
];

function badgeVariant(tag: NoticeTag) {
  if (tag === "event") return "success";
  if (tag === "exam") return "danger";
  return "info";
}

export default function ParentAnnouncement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [filter, setFilter] = useState<"all" | NoticeTag>((searchParams.get("type") as "all" | NoticeTag) ?? "all");
  const [isLoading, setIsLoading] = useState(true);
  const [activeNotice, setActiveNotice] = useState<Notice | null>(null);

  useEffect(() => {
    const next: Record<string, string> = {};
    if (query.trim()) next.q = query.trim();
    if (filter !== "all") next.type = filter;
    setSearchParams(next, { replace: true });
  }, [query, filter, setSearchParams]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [query, filter]);

  const filteredNotices = useMemo(
    () =>
      MOCK_NOTICES.filter(
        (n) =>
          (filter === "all" || n.tag === filter) &&
          (n.title.toLowerCase().includes(query.toLowerCase()) || n.desc.toLowerCase().includes(query.toLowerCase()))
      ),
    [filter, query]
  );

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">Announcements</p>
            <h2 className="mt-1 text-xl font-black text-slate-900">School notices</h2>
            <p className="mt-1 text-sm text-slate-500">Stay updated with school-wide events and circulars.</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Input
              placeholder="Search announcements..."
              icon={Search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full sm:w-72"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as "all" | NoticeTag)}
              title="Filter announcements by category"
              aria-label="Filter announcements by category"
              className="h-[42px] rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            >
              <option value="all">All Categories</option>
              <option value="event">Event</option>
              <option value="exam">Exam</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <ParentCardGridSkeleton cards={3} />
      ) : filteredNotices.length === 0 ? (
        <ParentEmptyState title="No announcements found" description="No notices match your current search and filters." />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredNotices.map((notice) => (
            <Card key={notice.id} className="border-slate-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                    <Megaphone size={16} />
                  </div>
                  <StatusBadge status={notice.tag} variant={badgeVariant(notice.tag)} />
                </div>
                <h4 className="text-base font-bold text-slate-800">{notice.title}</h4>
                <p className="text-sm text-slate-600">{notice.desc}</p>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <p className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar size={13} />
                    {notice.date}
                  </p>
                  <Button type="button" variant="outline" size="sm" onClick={() => setActiveNotice(notice)}>
                    View
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={Boolean(activeNotice)} onClose={() => setActiveNotice(null)} title="Announcement details">
        {activeNotice ? (
          <div className="space-y-3">
            <StatusBadge status={activeNotice.tag} variant={badgeVariant(activeNotice.tag)} />
            <h3 className="text-lg font-black text-slate-900">{activeNotice.title}</h3>
            <p className="text-sm text-slate-600">{activeNotice.desc}</p>
            <p className="text-xs text-slate-500">Date: {activeNotice.date}</p>
            <div className="flex justify-end">
              <Button type="button" onClick={() => setActiveNotice(null)}>
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}