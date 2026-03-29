import { useState } from "react";
import { Search, ChevronDown, Plus, Calendar, Clock, MapPin, Users, X, Trash2 } from "lucide-react";

interface Event {
  id: number;
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

const initialEvents: Event[] = [
  { id: 1, type: "Sports", title: "Annual Sports Day", description: "Annual sports competition featuring track and field events, team sports, and more.", date: "Sun, Dec 28, 2025", time: "9:00 AM - 4:00 PM", location: "Main Sports Ground", audience: "All Students", colorClass: "border-l-green-500", badgeClass: "bg-green-50 text-green-600" },
  { id: 2, type: "Meeting", title: "Parent-Teacher Meeting", description: "Quarterly meeting to discuss student progress and academic performance.", date: "Mon, Jan 5, 2026", time: "10:00 AM - 1:00 PM", location: "School Auditorium", audience: "Parents & Teachers", colorClass: "border-l-orange-400", badgeClass: "bg-orange-50 text-orange-600" },
  { id: 3, type: "Academic", title: "Science Exhibition", description: "Annual science exhibition where students showcase their projects and experiments.", date: "Fri, Feb 6, 2026", time: "10:00 AM - 3:00 PM", location: "School Hall", audience: "All Students", colorClass: "border-l-blue-600", badgeClass: "bg-blue-50 text-blue-600" },
];

const eventTypes = ["All Types", "Sports", "Meeting", "Academic", "Cultural", "Holiday"];

const styleConfig: Record<string, { colorClass: string; badgeClass: string }> = {
  Sports:   { colorClass: "border-l-green-500",  badgeClass: "bg-green-50 text-green-600" },
  Meeting:  { colorClass: "border-l-orange-400", badgeClass: "bg-orange-50 text-orange-600" },
  Academic: { colorClass: "border-l-blue-600",   badgeClass: "bg-blue-50 text-blue-600" },
  Cultural: { colorClass: "border-l-teal-400",   badgeClass: "bg-teal-50 text-teal-600" },
  Holiday:  { colorClass: "border-l-red-500",    badgeClass: "bg-red-50 text-red-600" },
};

const AdminEventData = () => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [newEvent, setNewEvent] = useState({ type: "Academic", title: "", description: "", date: "", time: "", location: "", audience: "" });

  const handleSave = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const styles = styleConfig[newEvent.type] ?? styleConfig["Academic"];
    setEvents([{ id: Date.now(), ...newEvent, ...styles }, ...events]);
    setIsModalOpen(false);
    setNewEvent({ type: "Academic", title: "", description: "", date: "", time: "", location: "", audience: "" });
  };

  const handleDelete = (id: number) => {
    setEvents(events.filter((e) => e.id !== id));
    setDeleteConfirmId(null);
  };

  const filteredEvents = events.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = selectedType === "All Types" || e.type === selectedType;
    return matchSearch && matchType;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans text-slate-800">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3 w-full max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none text-sm" />
          </div>
          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center justify-between gap-2 min-w-35 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-slate-600 hover:bg-gray-50">
              {selectedType} <ChevronDown size={16} />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-lg shadow-xl z-20 overflow-hidden">
                {eventTypes.map((t) => (
                  <button key={t} onClick={() => { setSelectedType(t); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50">{t}</button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-lg shadow-blue-100">
          <Plus size={18} /> Add Event
        </button>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-[6px] ${event.colorClass} p-6 flex flex-col gap-3 relative group`}>
            {/* Delete button — appears on hover */}
            <button
              onClick={() => setDeleteConfirmId(event.id)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
              title="Delete event"
            >
              <Trash2 size={15} />
            </button>

            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${event.badgeClass}`}>{event.type}</span>
            </div>
            <h3 className="font-bold text-xl text-slate-800 pr-6">{event.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{event.description}</p>
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-3 text-slate-500"><Calendar size={15} /><span className="text-sm">{event.date}</span></div>
              <div className="flex items-center gap-3 text-slate-500"><Clock size={15} /><span className="text-sm">{event.time}</span></div>
              <div className="flex items-center gap-3 text-slate-500"><MapPin size={15} /><span className="text-sm">{event.location}</span></div>
              <div className="flex items-center gap-3 text-slate-500"><Users size={15} /><span className="text-sm">{event.audience}</span></div>
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="col-span-3 py-16 text-center text-slate-400">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No events found</p>
          </div>
        )}
      </div>

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Event?</h3>
            <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 py-2.5 font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD EVENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Create New Event</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Event Title</label>
                  <input required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Type</label>
                  <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm" value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}>
                    {eventTypes.filter((t) => t !== "All Types").map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Date</label>
                  <input required placeholder="e.g. Mon, Jan 26, 2026" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Time Range</label>
                  <input required placeholder="9:00 AM - 1:00 PM" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Audience</label>
                  <input required placeholder="e.g. All Students" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm" value={newEvent.audience} onChange={(e) => setNewEvent({ ...newEvent, audience: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Location</label>
                  <input required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Description</label>
                  <textarea rows={2} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEventData;
