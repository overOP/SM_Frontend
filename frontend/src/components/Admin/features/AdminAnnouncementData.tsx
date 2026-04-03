import { useMemo, useState } from "react";
import { Search, Plus, Pin, Calendar, User, X } from "lucide-react";
import { useAnnouncements, type Announcement } from "../../../context/AnnouncementContext";

interface AnnouncementForm {
  title: string;
  author: string;
  content: string;
  audience: string;
  priority: "High" | "Medium" | "Low";
  date: string;
  pinned: boolean;
}

const defaultForm: AnnouncementForm = {
  title: "",
  author: "",
  content: "",
  audience: "Everyone",
  priority: "Medium",
  date: "",
  pinned: false,
};

const AdminAnnouncementData = () => {
  const { announcements, setAnnouncements } = useAnnouncements();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<AnnouncementForm>(defaultForm);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 3);

  const formatDate = (value: string) => {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPriorityBadge = (priority: Announcement["priority"]) => {
    if (priority === "High") return "bg-red-50 text-red-600 border-red-100";
    if (priority === "Low") return "bg-emerald-50 text-emerald-600 border-emerald-100";
    return "bg-orange-50 text-orange-600 border-orange-100";
  };

  const filteredAnnouncements = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return announcements;

    return announcements.filter((item) =>
      [item.title, item.author, item.content, item.audience, item.date, item.priority]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [announcements, searchQuery]);

  const pinnedAnnouncements = filteredAnnouncements.filter((item) => item.pinned);
  const recentAnnouncements = filteredAnnouncements.filter((item) => !item.pinned);

  const handleSave = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const newAnnouncement: Announcement = {
      id: Date.now(),
      title: formData.title.trim(),
      author: formData.author.trim(),
      content: formData.content.trim(),
      audience: formData.audience,
      priority: formData.priority,
      date: formatDate(formData.date),
      pinned: formData.pinned,
    };

    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    setFormData(defaultForm);
    setIsModalOpen(false);
  };

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
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Pin className="w-5 h-5 text-blue-600 fill-blue-600" />
        <h2 className="text-lg font-bold">Pinned Announcements</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {pinnedAnnouncements.map((item) => (
          <div key={item.id} className="bg-gray-100 border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Pin className="w-4 h-4 text-blue-600 fill-blue-600" />
              <div className="flex gap-2">
                <span
                  className={`px-3 py-1 text-[10px] font-bold rounded-full border ${getPriorityBadge(
                    item.priority
                  )}`}
                >
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
                <Calendar className="w-3.5 h-3.5" /> <span className="text-xs">{item.date}</span>
              </div>
            </div>
          </div>
        ))}
        {pinnedAnnouncements.length === 0 && (
          <p className="text-sm text-slate-500">No pinned announcements match your search.</p>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800">Recent Announcements</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {recentAnnouncements.map((item) => (
          <div
            key={item.id}
            className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-blue-200 transition-colors"
          >
            <div className="flex gap-2 mb-4">
              <button
                className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md border ${getPriorityBadge(
                  item.priority
                )}`}
              >
                {item.priority}
              </button>
              <button className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md border border-blue-100">
                {item.audience}
              </button>
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
        {recentAnnouncements.length === 0 && (
          <p className="text-sm text-slate-500">No recent announcements match your search.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setIsModalOpen(false)} />
          <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">New Announcement</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <input
                required
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Announcement title"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  required
                  value={formData.author}
                  onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                  placeholder="Author"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <select
                  value={formData.audience}
                  onChange={(e) => setFormData((prev) => ({ ...prev, audience: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Everyone">Everyone</option>
                  <option value="Students">Students</option>
                  <option value="Teachers">Teachers</option>
                  <option value="Parents">Parents</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: e.target.value as Announcement["priority"],
                    }))
                  }
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <input
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <textarea
                required
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Announcement details"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.pinned}
                  onChange={(e) => setFormData((prev) => ({ ...prev, pinned: e.target.checked }))}
                />
                Pin this announcement
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncementData;
