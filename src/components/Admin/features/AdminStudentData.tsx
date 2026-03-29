import { useState } from "react";
import { Search, Plus, Download, ChevronDown, X, Eye, Trash2, MoreHorizontal, GraduationCap } from "lucide-react";
import * as XLSX from "xlsx";

type StudentStatus = "active" | "inactive";

interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  guardian: string;
  guardianPhone: string;
  attendance: string;
  status: StudentStatus;
  initials: string;
}

const initialStudents: Student[] = [
  { id: "STU001", name: "Alex Thompson", email: "alex.thompson@school.edu", class: "10A", guardian: "John Thompson", guardianPhone: "+91 98765 43210", attendance: "96%", status: "active", initials: "AT" },
  { id: "STU002", name: "Emma Watson", email: "emma.watson@school.edu", class: "10A", guardian: "Mary Watson", guardianPhone: "+91 99887 76655", attendance: "94%", status: "active", initials: "EW" },
  { id: "STU003", name: "James Miller", email: "james.miller@school.edu", class: "9B", guardian: "Robert Miller", guardianPhone: "+91 91122 33445", attendance: "88%", status: "active", initials: "JM" },
  { id: "STU004", name: "Sophie Brown", email: "sophie.brown@school.edu", class: "8A", guardian: "David Brown", guardianPhone: "+91 90000 11223", attendance: "92%", status: "active", initials: "SB" },
  { id: "STU005", name: "Liam Neeson", email: "liam.n@school.edu", class: "9B", guardian: "Sue Neeson", guardianPhone: "+91 94455 66778", attendance: "90%", status: "inactive", initials: "LN" },
];

const AdminStudentData = () => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "", email: "", class: "", guardian: "",
    guardianPhone: "", attendance: "100%", status: "active" as StudentStatus,
  });

  const classOptions = ["All Classes", ...Array.from(new Set(students.map((s) => s.class))).sort()];

  const filteredStudents = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = selectedClass === "All Classes" || s.class === selectedClass;
    return matchSearch && matchClass;
  });

  const handleAdd = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const initials = formData.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    const newStudent: Student = {
      ...formData,
      id: `STU${Math.floor(100 + Math.random() * 900)}`,
      initials,
    };
    setStudents([newStudent, ...students]);
    setIsAddModalOpen(false);
    setFormData({ name: "", email: "", class: "", guardian: "", guardianPhone: "", attendance: "100%", status: "active" });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to remove this student?")) {
      setStudents(students.filter((s) => s.id !== id));
    }
    setActiveMenu(null);
  };

  const handleExport = () => {
    const data = filteredStudents.map((s, i) => ({
      "S.No": i + 1,
      "Student ID": s.id,
      "Full Name": s.name,
      "Email": s.email,
      "Class": s.class,
      "Guardian Name": s.guardian,
      "Guardian Phone": s.guardianPhone,
      "Attendance": s.attendance,
      "Status": s.status,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, `Students_${selectedClass}_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[300px]">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
            />
          </div>
          <div className="relative">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-medium text-slate-600 shadow-sm focus:outline-none cursor-pointer"
            >
              {classOptions.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-medium text-slate-600 shadow-sm hover:bg-gray-50 transition-all"
          >
            <Download size={16} /> Export Excel
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            <Plus size={18} /> Add Student
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-600">{filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""}</p>
        </div>
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
              {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100">{student.initials}</div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-none">{student.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">{student.id}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-600">{student.class}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{student.guardian}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${parseInt(student.attendance) >= 90 ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-500"}`}>
                      {student.attendance}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${student.status === "active" ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative flex justify-end" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActiveMenu(activeMenu === student.id ? null : student.id)}
                        className="p-1.5 text-gray-300 hover:text-slate-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      {activeMenu === student.id && (
                        <div className="absolute right-0 mt-8 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-10">
                          <button onClick={() => { setViewStudent(student); setActiveMenu(null); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                            <Eye size={14} /> View
                          </button>
                          <button onClick={() => handleDelete(student.id)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <GraduationCap className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                    <p className="text-sm text-gray-400 font-medium">No students found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW MODAL */}
      {viewStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-linear-to-r from-blue-600 to-blue-500 p-6 text-white relative">
              <button onClick={() => setViewStudent(null)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20"><X size={18} /></button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-xl font-black">{viewStudent.initials}</div>
                <div>
                  <h2 className="text-xl font-black">{viewStudent.name}</h2>
                  <p className="text-blue-200 text-sm">{viewStudent.email}</p>
                  <span className={`inline-block mt-1 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${viewStudent.status === "active" ? "bg-green-400/30 text-green-100" : "bg-slate-400/30 text-slate-100"}`}>
                    {viewStudent.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 grid grid-cols-2 gap-3">
              {[
                { label: "Roll No.", value: viewStudent.id },
                { label: "Class", value: viewStudent.class },
                { label: "Guardian", value: viewStudent.guardian },
                { label: "Guardian Phone", value: viewStudent.guardianPhone },
                { label: "Attendance", value: viewStudent.attendance },
              ].map((item) => (
                <div key={item.label} className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6">
              <button onClick={() => setViewStudent(null)} className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 text-sm">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Enroll New Student</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><X size={20} /></button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Full Name</label>
                  <input required className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Class</label>
                  <input required placeholder="e.g. 10A" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" value={formData.class} onChange={(e) => setFormData({ ...formData, class: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Status</label>
                  <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as StudentStatus })}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Email Address</label>
                  <input type="email" required className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Guardian Name</label>
                  <input required className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" value={formData.guardian} onChange={(e) => setFormData({ ...formData, guardian: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Guardian Phone</label>
                  <input type="tel" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" value={formData.guardianPhone} onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })} />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-gray-50 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100">Confirm Enrollment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudentData;
