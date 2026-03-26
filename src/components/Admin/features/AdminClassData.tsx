import React, { useState, useEffect } from "react";
import { MoreHorizontal, Users, BookOpen, X, Edit2, Trash2, Plus } from "lucide-react";

interface ClassEntry {
  id: number;
  name: string;
  room: string;
  teacher: string;
  initials: string;
  students: number;
  subjectsCount: number;
  subjects: string[];
  color: string;
}

const initialClassData: ClassEntry[] = [
  { id: 1, name: "Class 10A", room: "101", teacher: "Dr. Sarah Johnson", initials: "DSJ", students: 35, subjectsCount: 5, subjects: ["Mathematics", "Physics", "Chemistry", "English"], color: "border-blue-500" },
  { id: 2, name: "Class 10B", room: "102", teacher: "Prof. Michael Chen", initials: "PMC", students: 32, subjectsCount: 5, subjects: ["Mathematics", "Physics", "Chemistry", "English"], color: "border-blue-500" },
  { id: 3, name: "Class 9A", room: "103", teacher: "Ms. Emily Davis", initials: "MED", students: 38, subjectsCount: 5, subjects: ["Mathematics", "Physics", "Chemistry", "English"], color: "border-blue-500" },
];

const AdminClassData = () => {
  const [classes, setClasses] = useState<ClassEntry[]>(initialClassData);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassEntry | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    room: "",
    teacher: "",
    students: 0,
    subjects: "", // Handled as comma-separated string
    color: "border-blue-500"
  });

  // Close menu on outside click
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenu(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // --- Handlers ---
  const handleOpenEdit = (e: React.MouseEvent, cls: ClassEntry) => {
    e.stopPropagation();
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      room: cls.room,
      teacher: cls.teacher,
      students: cls.students,
      subjects: cls.subjects.join(", "),
      color: cls.color
    });
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      setClasses(classes.filter((c) => c.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectList = formData.subjects.split(",").map(s => s.trim()).filter(s => s !== "");
    const initials = formData.teacher.split(" ").map(n => n[0]).join("").toUpperCase();

    if (editingClass) {
      setClasses(classes.map(c => 
        c.id === editingClass.id 
          ? { ...c, ...formData, subjects: subjectList, initials, subjectsCount: subjectList.length } 
          : c
      ));
    } else {
      const newClass: ClassEntry = {
        id: Date.now(),
        ...formData,
        subjects: subjectList,
        subjectsCount: subjectList.length,
        initials
      };
      setClasses([...classes, newClass]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-700">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Class Management</h1>
        <button 
          onClick={() => { setEditingClass(null); setFormData({ name: "", room: "", teacher: "", students: 0, subjects: "", color: "border-blue-500" }); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={18} /> Add Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div key={cls.id} className={`bg-white rounded-2xl shadow-sm border-t-8 ${cls.color} p-6 hover:shadow-md transition-shadow relative group`}>
            <div className="flex justify-between items-start mb-1">
              <h2 className="text-xl font-bold text-slate-800">{cls.name}</h2>
              
              {/* Dropdown Menu */}
              <div className="relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === cls.id ? null : cls.id); }}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                
                {activeMenu === cls.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-10 animate-in fade-in zoom-in duration-150">
                    <button 
                      onClick={(e) => handleOpenEdit(e, cls)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(cls.id)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-sm text-slate-400 mb-4">Room {cls.room}</p>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-100 uppercase">
                {cls.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 leading-tight">{cls.teacher}</p>
                <p className="text-xs text-slate-400">Class Teacher</p>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-6 text-slate-500">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">{cls.students} students</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">{cls.subjectsCount} subjects</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Subjects</p>
              <div className="flex flex-wrap gap-2">
                {cls.subjects.slice(0, 3).map((sub, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[11px] font-bold text-slate-700">
                    {sub}
                  </span>
                ))}
                {cls.subjects.length > 3 && (
                  <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[11px] font-bold text-slate-700">
                    +{cls.subjects.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- EDIT/ADD MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">
                {editingClass ? "Edit Class Details" : "Add New Class"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Class Name</label>
                  <input 
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Room No.</label>
                  <input 
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                    value={formData.room}
                    onChange={(e) => setFormData({...formData, room: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Class Teacher</label>
                <input 
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                  value={formData.teacher}
                  onChange={(e) => setFormData({...formData, teacher: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Student Count</label>
                  <input 
                    type="number"
                    className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                    value={formData.students}
                    onChange={(e) => setFormData({...formData, students: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Theme Color</label>
                  <select 
                    className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  >
                    <option value="border-blue-500">Blue</option>
                    <option value="border-teal-400">Teal</option>
                    <option value="border-green-500">Green</option>
                    <option value="border-purple-500">Purple</option>
                    <option value="border-orange-500">Orange</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Subjects (comma separated)</label>
                <textarea 
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                  placeholder="Math, Science, English..."
                  value={formData.subjects}
                  onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
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

export default AdminClassData;