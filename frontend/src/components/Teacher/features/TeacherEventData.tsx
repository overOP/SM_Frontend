import { useState } from "react";
import { Search, ChevronDown, Calendar, Clock, MapPin, Users, X, Eye } from "lucide-react";

interface Event {
  type: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  audience: string;
  colorClass: string;
  badgeClass: string;
}

const events: Event[] = [
  { type: "Sports", title: "Annual Sports Day", description: "Annual sports competition featuring track and field events, team sports, a...", date: "Sun, Dec 28, 2025", time: "9:00 AM - 4:00 PM", location: "Main Sports Ground", audience: "All Students", colorClass: "border-l-green-500", badgeClass: "bg-green-50 text-green-600" },
  { type: "Meeting", title: "Parent-Teacher Meeting", description: "Quarterly meeting to discuss student progress and academic performance.", date: "Mon, Jan 5, 2026", time: "10:00 AM - 1:00 PM", location: "School Auditorium", audience: "Parents & Teachers", colorClass: "border-l-orange-400", badgeClass: "bg-orange-50 text-orange-600" },
  { type: "Academic", title: "Science Fair", description: "Students showcase their science projects and innovations.", date: "Thu, Jan 15, 2026", time: "11:00 AM - 3:00 PM", location: "Science Lab Building", audience: "Class 8-10", colorClass: "border-l-blue-600", badgeClass: "bg-blue-50 text-blue-600" },
  { type: "Cultural", title: "Cultural Festival", description: "Annual cultural celebration with performances, art exhibitions, and foo...", date: "Tue, Jan 20, 2026", time: "5:00 PM - 9:00 PM", location: "School Main Hall", audience: "All Students", colorClass: "border-l-teal-400", badgeClass: "bg-teal-50 text-teal-600" },
  { type: "Holiday", title: "Republic Day Celebration", description: "National holiday celebration with flag hoisting and cultural programs.", date: "Mon, Jan 26, 2026", time: "8:00 AM - 12:00 PM", location: "School Ground", audience: "Staff & Students", colorClass: "border-l-red-500", badgeClass: "bg-red-50 text-red-600" },
  { type: "Academic", title: "Mid-Term Examinations", description: "Mid-term examination period for all classes.", date: "Sun, Feb 1, 2026", time: "9:00 AM - 12:00 PM", location: "Respective Classrooms", audience: "All Students", colorClass: "border-l-blue-700", badgeClass: "bg-blue-50 text-blue-700" },
];

const TeacherEventData = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans text-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search events..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedEvent(event)}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:cursor-pointer transition-all hover:border-blue-400"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${event.badgeClass}`}>
                {event.type}
              </span>
              <Eye className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">{event.title}</h3>
            <p className="text-sm text-slate-500 line-clamp-2 mb-4">{event.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Users className="w-4 h-4" />
                <span className="text-xs">{event.audience}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">{selectedEvent.title}</h2>
                  <button onClick={() => setSelectedEvent(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide ${selectedEvent.badgeClass}`}>
                  {selectedEvent.type}
                </span>
              </div>
              <div className="p-8 space-y-6">
                <p className="text-lg text-slate-700 leading-relaxed">{selectedEvent.description}</p>
                <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-slate-900">{selectedEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-slate-700">{selectedEvent.time}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-slate-900">{selectedEvent.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-slate-700">{selectedEvent.audience}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherEventData;

