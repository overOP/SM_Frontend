import { useMemo, useState } from "react";
import { Search, Pin, Calendar, User } from "lucide-react";
import { getInitials } from "../../../utils/format";
import { useAnnouncements, type Announcement } from "../../../context/AnnouncementContext";

const getPriorityBadge = (priority: Announcement["priority"]) => {
  if (priority === "High") return "bg-red-50 text-red-600 border-red-100";
  if (priority === "Low") return "bg-emerald-50 text-emerald-600 border-emerald-100";
  return "bg-orange-50 text-orange-600 border-orange-100";
};

const TeacherAnnouncementData = () => {
  const { announcements } = useAnnouncements();
  const [searchQuery, setSearchQuery] = useState("");

  const visible = useMemo(() => {
    const relevant = announcements.filter(
      (a) => a.audience === "Teachers" || a.audience === "Everyone"
    );
    const query = searchQuery.trim().toLowerCase();
    if (!query) return relevant;
    return relevant.filter((a) =>
      [a.title, a.author, a.content, a.date, a.priority]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [announcements, searchQuery]);

  const pinned = visible.filter((a) => a.pinned);
  const recent = visible.filter((a) => !a.pinned);

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search announcement..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {pinned.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-6">
            <Pin className="w-5 h-5 text-blue-600 fill-blue-600" />
            <h2 className="text-lg font-bold">Pinned Announcements</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {pinned.map((item) => (
              <div key={item.id} className="bg-gray-100 border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <Pin className="w-4 h-4 text-blue-600 fill-blue-600" />
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full border ${getPriorityBadge(item.priority)}`}>
                      {item.priority} Priority
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-blue-600 text-[10px] font-bold rounded-full">
                      {item.audience}
                    </span>
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
              </div>
            ))}
          </div>
        </>
      )}

      {recent.length > 0 && (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800">Recent Announcements</h2>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            {recent.map((item) => (
              <div key={item.id} className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-blue-200 transition-colors">
                <div className="flex gap-2 mb-4">
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md border ${getPriorityBadge(item.priority)}`}>
                    {item.priority}
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md border border-blue-100">
                    {item.audience}
                  </span>
                </div>
                <div className="mb-5">
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.content}</p>
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
              </div>
            ))}
          </div>
        </>
      )}

      {visible.length === 0 && (
        <p className="text-sm text-slate-500">No announcements found.</p>
      )}
    </div>
  );
};

export default TeacherAnnouncementData;
