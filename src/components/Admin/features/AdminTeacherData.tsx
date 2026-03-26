import React, { useState, useEffect } from "react";
import { Search, MoreHorizontal, Plus, Mail, Phone, BookOpen, X, Edit2, Trash2 } from "lucide-react";

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
];

const AdminTeacherData = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    email: "",
    phone: "",
    status: "Active" as TeacherStatus,
    classes: ""
  });

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    if (activeMenu !== null) {
        window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [activeMenu]);

  // --- Handlers ---
  const handleOpenAddModal = () => {
    setEditingTeacher(null);
    setFormData({ name: "", subject: "", email: "", phone: "", status: "Active", classes: "" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      subject: teacher.subject,
      email: teacher.email,
      phone: teacher.phone,
      status: teacher.status,
      classes: teacher.classes.join(", ")
    });
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
        setTeachers(teachers.filter(t => t.id !== id));
    }
    setActiveMenu(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = formData.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 3);
    const classesArray = formData.classes ? formData.classes.split(",").map(c => c.trim()) : [];

    if (editingTeacher) {
      setTeachers(teachers.map(t => 
        t.id === editingTeacher.id 
        ? { ...t, ...formData, initials, classes: classesArray } 
        : t
      ));
    } else {
      const newEntry: Teacher = {
        id: Date.now(),
        ...formData,
        initials,
        classes: classesArray,
      };
      setTeachers([newEntry, ...teachers]);
    }
    setIsModalOpen(false);
  };

  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-6 bg-slate-50 min-h-screen">
      {/* Search and Add Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
          />
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
        >
          <Plus size={18} strokeWidth={3} />
          Add Teacher
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

              {/* Menu Button */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => setActiveMenu(activeMenu === teacher.id ? null : teacher.id)}
                  className="text-gray-400 hover:text-slate-600 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MoreHorizontal size={20} />
                </button>
                
                {activeMenu === teacher.id && (
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-10 animate-in fade-in zoom-in duration-150">
                    <button 
                      onClick={() => handleOpenEditModal(teacher)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(teacher.id)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                <BookOpen size={16} className="text-slate-400" />
                <span>{teacher.subject}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                <Mail size={16} className="text-slate-400" />
                <span className="truncate">{teacher.email}</span>
              </div>
              {/* Added Phone Number Display */}
              <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                <Phone size={16} className="text-slate-400" />
                <span>{teacher.phone || "N/A"}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
              <div className="flex flex-wrap gap-2">
                {teacher.classes.length > 0 ? (
                  teacher.classes.map((cls) => (
                    <span key={cls} className="bg-slate-50 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold border border-slate-100">
                      {cls}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-300 italic">No classes assigned</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">
                {editingTeacher ? "Update Teacher Profile" : "Add New Teacher"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Full Name</label>
                  <input 
                    required
                    placeholder="e.g. Dr. John Doe"
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Subject</label>
                  <input 
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Status</label>
                  <select 
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as TeacherStatus})}
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Email Address</label>
                <input 
                  type="email" required
                  placeholder="john@school.edu"
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              {/* Added Phone Number Input Field */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Phone Number</label>
                <input 
                  type="tel"
                  placeholder="+1 000 000 0000"
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Assigned Classes (comma separated)</label>
                <input 
                  placeholder="10A, 9B, 8C"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={formData.classes}
                  onChange={(e) => setFormData({...formData, classes: e.target.value})}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 font-bold text-slate-500 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
                >
                  {editingTeacher ? "Save Changes" : "Create Teacher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeacherData;