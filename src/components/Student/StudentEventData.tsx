import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  CalendarCheck,
  Clock,
  MapPin,
  Palmtree,
  Search,
  Trophy,
  Users2,
} from "lucide-react";
import { Button, Card, Input, StatusBadge } from "../ui";
import { Modal } from "../ui/Modal";
import {
  StudentCardGridSkeleton,
  StudentEmptyState,
  StudentFilterHint,
} from "./shared/StudentModuleStates";

type EventType = "Sports" | "Meeting" | "Academic" | "Cultural" | "Holiday";

interface SchoolEvent {
  id: number;
  type: EventType;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  audience: string;
}

const EVENTS_DATA: SchoolEvent[] = [
  {
    id: 1,
    type: "Sports",
    title: "Annual Sports Day",
    description: "Track and field events, team sports, and closing ceremony awards.",
    date: "Sun, Dec 28, 2025",
    time: "9:00 AM - 4:00 PM",
    location: "Main Sports Ground",
    audience: "All Students",
  },
  {
    id: 2,
    type: "Meeting",
    title: "Parent-Teacher Meeting",
    description: "Quarterly review meeting on student academic and behavior progress.",
    date: "Mon, Jan 5, 2026",
    time: "10:00 AM - 1:00 PM",
    location: "School Auditorium",
    audience: "Parents & Teachers",
  },
  {
    id: 3,
    type: "Academic",
    title: "Science Fair",
    description: "Student project showcase with faculty review and judging panel.",
    date: "Thu, Jan 15, 2026",
    time: "11:00 AM - 3:00 PM",
    location: "Science Lab Building",
    audience: "Class 8-10",
  },
  {
    id: 4,
    type: "Cultural",
    title: "Cultural Festival",
    description: "Performances, exhibitions, and inter-house cultural competitions.",
    date: "Tue, Jan 20, 2026",
    time: "5:00 PM - 9:00 PM",
    location: "School Main Hall",
    audience: "All Students",
  },
  {
    id: 5,
    type: "Holiday",
    title: "Republic Day Celebration",
    description: "Flag hoisting ceremony and patriotic cultural program.",
    date: "Mon, Jan 26, 2026",
    time: "8:00 AM - 12:00 PM",
    location: "School Ground",
    audience: "Staff & Students",
  },
];

function getIcon(type: EventType) {
  switch (type) {
    case "Sports":
      return <Trophy size={18} />;
    case "Meeting":
      return <Users2 size={18} />;
    case "Academic":
      return <BookOpen size={18} />;
    case "Holiday":
      return <Palmtree size={18} />;
    default:
      return <CalendarCheck size={18} />;
  }
}

function getVariant(type: EventType) {
  switch (type) {
    case "Sports":
      return "success";
    case "Meeting":
      return "warning";
    case "Academic":
      return "info";
    case "Holiday":
      return "danger";
    default:
      return "default";
  }
}

export default function StudentEventData() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
  const [activeFilter, setActiveFilter] = useState<EventType | "All">(
    (searchParams.get("type") as EventType | "All") ?? "All"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [activeEvent, setActiveEvent] = useState<SchoolEvent | null>(null);

  useEffect(() => {
    const nextParams: Record<string, string> = {};
    if (searchTerm.trim()) nextParams.q = searchTerm.trim();
    if (activeFilter !== "All") nextParams.type = activeFilter;
    setSearchParams(nextParams, { replace: true });
  }, [searchTerm, activeFilter, setSearchParams]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 350);
    return () => clearTimeout(timer);
  }, [searchTerm, activeFilter]);

  const filteredEvents = useMemo(
    () =>
      EVENTS_DATA.filter((event) => {
        const matchesSearch =
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === "All" || event.type === activeFilter;
        return matchesSearch && matchesFilter;
      }),
    [searchTerm, activeFilter]
  );

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">Events</p>
            <h2 className="mt-1 text-xl font-black text-slate-900">Campus events calendar</h2>
            <p className="mt-1 text-sm text-slate-500">Browse upcoming activities and event participation updates.</p>
          </div>
          <Input
            placeholder="Search events..."
            icon={Search}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full lg:w-80"
            title="Search events"
          />
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        {["All", "Academic", "Sports", "Cultural", "Meeting", "Holiday"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveFilter(tab as EventType | "All")}
            className={`rounded-xl border px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] transition-all ${
              activeFilter === tab
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
            }`}
            title={`Filter ${tab}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <StudentCardGridSkeleton cards={3} />
      ) : filteredEvents.length === 0 ? (
        <StudentEmptyState title="No events found" description="No events match the current search and filters." />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="border-slate-200 bg-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`rounded-xl p-2.5 ${
                      event.type === "Sports"
                        ? "bg-emerald-50 text-emerald-700"
                        : event.type === "Academic"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {getIcon(event.type)}
                  </div>
                  <StatusBadge status={event.type} variant={getVariant(event.type)} />
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900">{event.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{event.description}</p>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                  <p className="flex items-center gap-2">
                    <Calendar size={13} className="text-blue-600" />
                    {event.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={13} className="text-slate-400" />
                    {event.time}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={13} className="text-slate-400" />
                    {event.location}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-[10px] font-black uppercase tracking-wider"
                  onClick={() => setActiveEvent(event)}
                >
                  View details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <StudentFilterHint params={["q", "type"]} />

      <Modal isOpen={Boolean(activeEvent)} onClose={() => setActiveEvent(null)} title="Event Details">
        {activeEvent ? (
          <div className="space-y-3 text-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-600">{activeEvent.type}</p>
            <h4 className="text-lg font-black text-slate-900">{activeEvent.title}</h4>
            <p className="text-slate-600">{activeEvent.description}</p>
            <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
              <p className="flex items-center gap-2">
                <Calendar size={13} className="text-blue-600" />
                {activeEvent.date}
              </p>
              <p className="flex items-center gap-2">
                <Clock size={13} className="text-slate-400" />
                {activeEvent.time}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={13} className="text-slate-400" />
                {activeEvent.location}
              </p>
              <p className="text-slate-500">Audience: {activeEvent.audience}</p>
            </div>
            <div className="flex justify-end">
              <Button type="button" variant="primary" onClick={() => setActiveEvent(null)}>
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}