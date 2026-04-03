import { Megaphone, Calendar as CalendarIcon } from "lucide-react";
import { useAnnouncements, type Announcement } from "../../../context/AnnouncementContext";
import { useMemo } from "react";

const getIconStyle = (priority: Announcement["priority"]) => {
  if (priority === "High") return "bg-orange-50 text-orange-500";
  if (priority === "Low") return "bg-emerald-50 text-emerald-500";
  return "bg-slate-50 text-slate-500";
};

const ParentAnnouncement = () => {
  const { announcements } = useAnnouncements();

  const visible = useMemo(
    () => announcements.filter((a) => a.audience === "Parents" || a.audience === "Everyone"),
    [announcements]
  );

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm max-w-5xl mx-auto animate-in fade-in duration-500">
      <h3 className="text-xl font-black text-slate-800 mb-8">Latest Announcements</h3>

      {visible.length === 0 && (
        <p className="text-sm text-slate-500">No announcements at this time.</p>
      )}

      <div className="space-y-4">
        {visible.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-6 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-all group"
          >
            <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${getIconStyle(item.priority)}`}>
              <Megaphone size={20} />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-black text-slate-800 text-lg leading-tight">{item.title}</h4>
                <span className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full border border-slate-100">
                  {item.priority}
                </span>
              </div>

              <p className="text-sm text-slate-500 leading-relaxed mb-4">{item.content}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{item.author}</span>
                <div className="flex items-center gap-2 text-slate-400">
                  <CalendarIcon size={14} />
                  <span className="text-xs font-bold">{item.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParentAnnouncement;
