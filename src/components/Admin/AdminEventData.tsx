import React, { useState } from "react";
import { 
  Search, 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  FilterX, 
  Type, 
  AlignLeft 
} from "lucide-react";

// Importing your UI Library components
import { 
  Button, 
  Card, 
  Input, 
  Select, 
  StatusBadge, 
  
} from "../ui";
import { Modal } from "../ui/Modal";

interface Event {
  type: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  audience: string;
  accentClass: string;
  variant: "success" | "warning" | "info" | "danger" | "default";
}

const initialEvents: Event[] = [
  {
    type: "Sports",
    title: "Annual Sports Day",
    description: "Annual sports competition featuring track and field events, team sports, and awards.",
    date: "2025-12-28",
    time: "9:00 AM - 4:00 PM",
    location: "Main Sports Ground",
    audience: "All Students",
    accentClass: "border-l-emerald-500",
    variant: "success",
  },
  {
    type: "Meeting",
    title: "Parent-Teacher Meeting",
    description: "Quarterly meeting to discuss student progress and academic performance.",
    date: "2026-01-05",
    time: "10:00 AM - 1:00 PM",
    location: "School Auditorium",
    audience: "Parents & Teachers",
    accentClass: "border-l-orange-400",
    variant: "warning",
  },
  {
    type: "Academic",
    title: "Science Fair",
    description: "Students showcase their science projects and innovations to judges.",
    date: "2026-01-15",
    time: "11:00 AM - 3:00 PM",
    location: "Science Lab Building",
    audience: "Class 8-10",
    accentClass: "border-l-blue-600",
    variant: "info",
  },
  {
    type: "Holiday",
    title: "Republic Day",
    description: "National holiday celebration with flag hoisting and cultural programs.",
    date: "2026-01-26",
    time: "8:00 AM - 12:00 PM",
    location: "School Ground",
    audience: "Staff & Students",
    accentClass: "border-l-rose-500",
    variant: "danger",
  },
];

const AdminEventData: React.FC = () => {
  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All Types");

  // Data State
  const [events, setEvents] = useState<Event[]>(initialEvents);
  
  // Form State
  const initialFormState = {
    type: "Academic",
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    audience: "All Students",
  };
  const [formData, setFormData] = useState(initialFormState);

  const eventTypes = ["All Types", "Sports", "Meeting", "Academic", "Holiday", "Cultural"];
  const formTypes = ["Sports", "Meeting", "Academic", "Holiday", "Cultural"];

  // Helper to map type to variant
  const getVariant = (type: string): "success" | "warning" | "info" | "danger" | "default" => {
    const map: Record<string, "success" | "warning" | "info" | "danger" | "default"> = {
      Sports: "success",
      Meeting: "warning",
      Academic: "info",
      Holiday: "danger",
    };
    return map[type] || "default";
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent: Event = {
      ...formData,
      accentClass: formData.type === "Sports" ? "border-l-emerald-500" : "border-l-blue-600",
      variant: getVariant(formData.type)
    };

    setEvents([newEvent, ...events]);
    setIsModalOpen(false);
    setFormData(initialFormState);
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All Types" || event.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Events Calendar</h1>
          <p className="text-sm text-slate-400 font-medium">Schedule and manage school-wide activities</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Input
              placeholder="Search events..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select
            options={eventTypes}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-44"
          />

          <Button 
            variant="primary" 
            className="w-full sm:w-auto gap-2 shadow-lg shadow-blue-100"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} /> Add Event
          </Button>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, idx) => (
            <Card
              key={idx}
              className={`border-l-[6px] transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${event.accentClass}`}
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <StatusBadge status={event.type} variant={event.variant} />
                </div>

                <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-1">
                  {event.title}
                </h3>
                
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-6">
                  {event.description}
                </p>

                <div className="mt-auto space-y-3 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400">
                       <Calendar size={14} />
                    </div>
                    <span className="text-xs font-semibold">{event.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400">
                       <Clock size={14} />
                    </div>
                    <span className="text-xs font-semibold">{event.time}</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400">
                       <MapPin size={14} />
                    </div>
                    <span className="text-xs font-semibold">{event.location}</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400">
                       <Users size={14} />
                    </div>
                    <span className="text-xs font-semibold">{event.audience}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-24 text-center">
          <div className="bg-slate-100 p-4 rounded-2xl mb-4 text-slate-300">
            <FilterX size={48} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No events matched</h3>
          <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">
            Try changing your search term or selecting a different event type.
          </p>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => { setSearchTerm(""); setFilterType("All Types"); }}
          >
            Reset Filters
          </Button>
        </Card>
      )}

      {/* Add Event Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create New Event"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input 
            label="Event Title"
            placeholder="e.g. Annual Sports Day"
            icon={Type}
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Category"
              options={formTypes}
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            />
            <Input 
              label="Date"
              type="date"
              icon={Calendar}
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>

            <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Time"
              placeholder="9:00 AM - 1:00 PM"
              icon={Clock}
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
            />
            <Input 
              label="Location"
              placeholder="e.g. Main Hall"
              icon={MapPin}
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
            </div>

          <Input 
            label="Target Audience"
            placeholder="e.g. All Students"
            icon={Users}
            value={formData.audience}
            onChange={(e) => setFormData({...formData, audience: e.target.value})}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
              <AlignLeft size={14} /> Description
            </label>
            <textarea 
              rows={3}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              placeholder="Provide a brief description of the event..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-50">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Discard
            </Button>
            <Button variant="primary" type="submit" className="px-10">
              Create Event
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminEventData;