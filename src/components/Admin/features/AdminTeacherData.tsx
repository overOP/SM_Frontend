import { useState, useEffect } from "react";
import { Search, MoreHorizontal, Plus, Mail, Phone, BookOpen, X, Edit2, Trash2, Eye, GraduationCap } from "lucide-react";
import { getInitials } from "../../../utils/format";

type TeacherStatus = "Active" | "On Leave";

interface Teacher {
  id: number;
  name: string;
  initials: string;
  status: TeacherStatus;
  subject: string;
  email: string;
  phone: string;
  classes: string[];
}

const initialTeachers: Teacher[] = [
  { id: 1, name: "Dr. Sarah Johnson", initials: "DSJ", status: "Active", subject: "Mathematics", email: "sarah.johnson@school.edu", phone: "+1 234 567 8901", classes: ["10A", "10B", "9A"] },
  { id: 2, name: "Prof. Michael Chen", initials: "PMC", status: "Active", subject: "Physics", email: "michael.chen@school.edu", phone: "+1 234 567 8902", classes: ["10A", "9B", "8A"] },
  { id: 3, name: "Ms. Emily Davis", initials: "MED", status: "Active", subject: "English", email: "emily.davis@school.edu", phone: "+1 234 567 8903", classes: ["8A", "8B", "7A"] },
  { id: 4, name: "Mr. Robert Wilson", initials: "RW", status: "Active", subject: "Chemistry", email: "robert.wilson@school.edu", phone: "+1 234 567 8904", classes: ["10A", "10B"] },
  { id: 5, name: "Dr. Lisa Anderson", initials: "LA", status: "On Leave", subject: "Biology", email: "lisa.anderson@school.edu", phone: "+1 234 567 8905", classes: ["9A", "9B"] },
];

type ModalMode = "add" | "edit" | "view" | null;

const AdminTeacherData = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const [formData, setFormData] = useState({
    name: "", subject: "", email: "", phone: "",
    status: "Active" as TeacherStatus, classes: "",
  });

  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    if (activeMenu !== null) window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [activeMenu]);

  const openAdd = () => {
    setSelectedTeacher(null);
    setFormData({ name: "", subject: "", email: "", phone: "", status: "Active", classes: "" });
    setModalMode("add");
  };

  const openEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormData({ name: teacher.name, subject: teacher.subject, email: teacher.email, phone: teacher.phone, status: teacher.status, classes: teacher.classes.join(", ") });
    setModalMode("edit");
    setActiveMenu(null);
  };

  const openView = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setModalMode("view");
    setActiveMenu(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to remove this teacher?")) {
      setTeachers(teachers.filter((t) => t.id !== id));
    }
    setActiveMenu(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = getInitials(formData.name, 3);
    const classesArray = formData.classes ? formData.classes.split(",").map((c) => c.trim()).filter(Boolean) : [];

    if (modalMode === "edit" && selectedTeacher) {
      setTeachers(teachers.map((t) => t.id === selectedTeacher.id ? { ...t, ...formData, initials, classes: classesArray } : t));
    } else {
      setTeachers([{ id: Date.now(), ...formData, initials, classes: classesArray }, ...teachers]);
    }
    setModalMode(null);
  };

  const filteredTeachers = teachers.filter(
    (t) => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-6 bg-slate-50 min-h-screen">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
          />
        </div>
        <button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
        >
          <Plus size={18} strokeWidth={3} /> Add Teacher
        </button>
      </div>

      {/* Teacher Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <div key={teacher.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {teacher.initials}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight">{teacher.name}</h3>
                  <span className={`inline-block mt-1 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${teacher.status === "Active" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}>
                    {teacher.status}
                  </span>
                </div>
              </div>

              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setActiveMenu(activeMenu === teacher.id ? null : teacher.id)}
                  className="text-gray-400 hover:text-slate-600 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MoreHorizontal size={20} />
                </button>
                {activeMenu === teacher.id && (
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-10">
                    <button onClick={() => openView(teacher)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                      <Eye size={14} /> View
                    </button>
                    <button onClick={() => openEdit(teacher)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(teacher.id)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <BookOpen size={15} className="text-slate-400" /><span>{teacher.subject}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Mail size={15} className="text-slate-400" /><span className="truncate">{teacher.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Phone size={15} className="text-slate-400" /><span>{teacher.phone || "N/A"}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
              <div className="flex flex-wrap gap-2">
                {teacher.classes.length > 0 ? teacher.classes.map((cls) => (
                  <span key={cls} className="bg-slate-50 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold border border-slate-100">{cls}</span>
                )) : (
                  <span className="text-xs text-gray-300 italic">No classes assigned</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredTeachers.length === 0 && (
          <div className="col-span-3 py-16 text-center text-slate-400">
            <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No teachers found</p>
          </div>
        )}
      </div>

      {/* VIEW MODAL */}
      {modalMode === "view" && selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-linear-to-r from-indigo-600 to-blue-600 p-6 text-white relative">
              <button onClick={() => setModalMode(null)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20 transition-colors">
                <X size={18} />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-xl font-black">
                  {selectedTeacher.initials}
                </div>
                <div>
                  <h2 className="text-xl font-black">{selectedTeacher.name}</h2>
                  <p className="text-indigo-200 text-sm">{selectedTeacher.subject}</p>
                  <span className={`inline-block mt-1 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${selectedTeacher.status === "Active" ? "bg-green-400/30 text-green-100" : "bg-orange-400/30 text-orange-100"}`}>
                    {selectedTeacher.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {[
                { icon: <Mail size={16} />, label: "Email", value: selectedTeacher.email },
                { icon: <Phone size={16} />, label: "Phone", value: selectedTeacher.phone || "N/A" },
                { icon: <BookOpen size={16} />, label: "Subject", value: selectedTeacher.subject },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm">{row.icon}</div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{row.label}</p>
                    <p className="text-sm font-semibold text-slate-700">{row.value}</p>
                  </div>
                </div>
              ))}
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Assigned Classes</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTeacher.classes.length > 0 ? selectedTeacher.classes.map((cls) => (
                    <span key={cls} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">{cls}</span>
                  )) : <span className="text-xs text-slate-400 italic">None assigned</span>}
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => { setModalMode(null); openEdit(selectedTeacher); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-600 transition-colors">
                <Edit2 size={14} /> Edit
              </button>
              <button onClick={() => setModalMode(null)} className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 text-sm transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {(modalMode === "add" || modalMode === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">{modalMode === "edit" ? "Update Teacher Profile" : "Add New Teacher"}</h2>
              <button onClick={() => setModalMode(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Full Name</label>
                  <input required placeholder="e.g. Dr. John Doe" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Subject</label>
                  <input required className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Status</label>
                  <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as TeacherStatus })}>
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Email Address</label>
                <input type="email" required placeholder="john@school.edu" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Phone Number</label>
                <input type="tel" placeholder="+1 000 000 0000" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Assigned Classes (comma separated)</label>
                <input placeholder="10A, 9B, 8C" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" value={formData.classes} onChange={(e) => setFormData({ ...formData, classes: e.target.value })} />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setModalMode(null)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100">{modalMode === "edit" ? "Save Changes" : "Create Teacher"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeacherData;
