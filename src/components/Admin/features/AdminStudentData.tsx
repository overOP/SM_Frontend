



import React, { useState } from "react";
import { Search, Plus, Download, ChevronDown, X } from "lucide-react";

type StudentStatus = "active" | "inactive";

interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  guardian: string;
  attendance: string;
  status: StudentStatus;
  initials: string;
}

const initialStudents: Student[] = [
  { id: "STU001", name: "Alex Thompson", email: "alex.thompson@school.edu", class: "10A", guardian: "John Thompson", attendance: "96%", status: "active", initials: "AT" },
  { id: "STU002", name: "Emma Watson", email: "emma.watson@school.edu", class: "10A", guardian: "Mary Watson", attendance: "94%", status: "active", initials: "EW" },
  { id: "STU003", name: "James Miller", email: "james.miller@school.edu", class: "9B", guardian: "Robert Miller", attendance: "88%", status: "active", initials: "JM" },
  { id: "STU004", name: "Sophie Brown", email: "sophie.brown@school.edu", class: "8A", guardian: "David Brown", attendance: "92%", status: "active", initials: "SB" },
  { id: "STU005", name: "Liam Neeson", email: "liam.n@school.edu", class: "9B", guardian: "Sue Neeson", attendance: "90%", status: "active", initials: "LN" },
];

const AdminStudentData = () => {
  const [students, setTeachers] = useState<Student[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    class: "",
    guardian: "",
    attendance: "100%",
    status: "active" as StudentStatus,
  });

  // --- Dynamic Class List for Dropdown ---
  // This creates a unique list of classes from our student data
  const classOptions = ["All Classes", ...new Set(students.map((s) => s.class))].sort();

  // --- Filter Logic ---
  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === "All Classes" || s.class === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  // --- Handlers ---
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = formData.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    const newStudent: Student = {
      ...formData,
      id: `STU${Math.floor(100 + Math.random() * 900)}`,
      initials,
    };
    setTeachers([newStudent, ...students]);
    setIsModalOpen(false);
    setFormData({ name: "", email: "", class: "", guardian: "", attendance: "100%", status: "active" });
  };


  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-4">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-[300px]">
          {/* Search Input */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
            />
          </div>

          {/* Class Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-medium text-slate-600 shadow-sm hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              {classOptions.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-medium text-slate-600 shadow-sm hover:bg-gray-50">
            <Download size={16} /> Export
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            <Plus size={18} /> Add Student
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Roll No.</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Class</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Guardian</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Attendance</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100">
                          {student.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-none">{student.name}</p>
                          <p className="text-xs text-gray-400 mt-1">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-600">{student.id}</td>
                    <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg font-bold text-slate-600">
                            {student.class}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">{student.guardian}</td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">{student.attendance}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase">
                        {student.status}
                      </span>
                    </td>
                  
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-400 italic">
                    No students found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD STUDENT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Enroll New Student</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddStudent} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Full Name</label>
                  <input 
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Class</label>
                  <input 
                    required
                    placeholder="e.g. 10A"
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={formData.class}
                    onChange={(e) => setFormData({...formData, class: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Guardian Name</label>
                  <input 
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={formData.guardian}
                    onChange={(e) => setFormData({...formData, guardian: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Email Address</label>
                <input 
                  type="email" required
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                  Confirm Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudentData;