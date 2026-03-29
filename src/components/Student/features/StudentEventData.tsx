// import { useState } from "react";
// import { Search, ChevronDown, Calendar, Clock, MapPin, Users } from "lucide-react";

// const StudentEventData = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterType, setFilterType] = useState("All");

//   const categories = ["All", "Sports", "Meetings", "Academics", "Cultural", "Holiday"];

//   const filteredEvents = events.filter(event => {
//     const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesType = filterType === "All" || event.type === filterType;
//     return matchesSearch && matchesType;
//   });

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
//         <div className="relative flex-1 max-w-md">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//           <input 
//             type="text" 
//             placeholder="Search events..." 
//             className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <select 
//           className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none cursor-pointer"
//           onChange={(e) => setFilterType(e.target.value)}
//         >
//           {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
//         </select>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredEvents.map((event, idx) => (
//           <div key={idx} className={`bg-white rounded-xl shadow-sm border-l-[6px] ${event.colorClass} p-6`}>
//              {/* ... existing event card content ... */}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };


import { useState } from "react";
import { Search, ChevronDown, Calendar, MapPin, Users } from "lucide-react";

const StudentEventData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Sports", "Meetings", "Academics", "Cultural", "Holiday"];
  
  // Example data based on your request
  const events = [
    { id: 1, type: "Sports", title: "Annual Sports Meet", date: "Oct 24, 2026", location: "Main Field", color: "border-l-emerald-500" },
    { id: 2, type: "Meetings", title: "Parent Teacher Meet", date: "Nov 05, 2026", location: "Hall A", color: "border-l-orange-500" },
    { id: 3, type: "Academics", title: "Science Olympiad", date: "Nov 12, 2026", location: "Lab 2", color: "border-l-blue-500" },
  ];

  const filteredEvents = events.filter(e => 
    (activeCategory === "All" || e.type === activeCategory) &&
    e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" placeholder="Search events..." 
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500/20"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          onChange={(e) => setActiveCategory(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none shadow-sm"
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <div key={event.id} className={`bg-white p-6 rounded-2xl border-l-[6px] ${event.color} shadow-sm border border-slate-100`}>
            <span className="text-[10px] font-black uppercase text-slate-400">{event.type}</span>
            <h3 className="text-lg font-bold text-slate-800 mb-4">{event.title}</h3>
            <div className="space-y-2 text-slate-500 text-sm font-medium">
              <div className="flex items-center gap-2"><Calendar size={14}/> {event.date}</div>
              <div className="flex items-center gap-2"><MapPin size={14}/> {event.location}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentEventData;