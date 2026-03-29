import { useState } from "react";
import { Search, Download, ChevronDown, Check, Eye, X } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  guardian: string;
  attendance: string;
  status: string;
  initials: string;
}

const classStudents: Record<string, Student[]> = {
  "Class 10A": [
    { id: "STU001", name: "Alex Thompson", email: "alex.thompson@school.edu", class: "10A", guardian: "John Thompson", attendance: "96%", status: "active", initials: "AT" },
    { id: "STU002", name: "Emma Watson", email: "emma.watson@school.edu", class: "10A", guardian: "Mary Watson", attendance: "94%", status: "active", initials: "EW" },
    { id: "STU003", name: "Rohan Sharma", email: "rohan.sharma@school.edu", class: "10A", guardian: "Priya Sharma", attendance: "88%", status: "active", initials: "RS" },
    { id: "STU004", name: "Aisha Khan", email: "aisha.khan@school.edu", class: "10A", guardian: "Tariq Khan", attendance: "91%", status: "active", initials: "AK" },
    { id: "STU005", name: "Lucas Martin", email: "lucas.martin@school.edu", class: "10A", guardian: "Claire Martin", attendance: "79%", status: "inactive", initials: "LM" },
    { id: "STU006", name: "Priya Patel", email: "priya.patel@school.edu", class: "10A", guardian: "Raj Patel", attendance: "97%", status: "active", initials: "PP" },
    { id: "STU007", name: "Noah Williams", email: "noah.williams@school.edu", class: "10A", guardian: "Sarah Williams", attendance: "85%", status: "active", initials: "NW" },
  ],
  "Class 10B": [
    { id: "STU011", name: "Kavya Reddy", email: "kavya.reddy@school.edu", class: "10B", guardian: "Srinivas Reddy", attendance: "93%", status: "active", initials: "KR" },
    { id: "STU012", name: "Ethan Brown", email: "ethan.brown@school.edu", class: "10B", guardian: "James Brown", attendance: "87%", status: "active", initials: "EB" },
    { id: "STU013", name: "Zara Ahmed", email: "zara.ahmed@school.edu", class: "10B", guardian: "Ali Ahmed", attendance: "95%", status: "active", initials: "ZA" },
    { id: "STU014", name: "Aryan Gupta", email: "aryan.gupta@school.edu", class: "10B", guardian: "Deepak Gupta", attendance: "82%", status: "active", initials: "AG" },
    { id: "STU015", name: "Sofia Costa", email: "sofia.costa@school.edu", class: "10B", guardian: "Miguel Costa", attendance: "90%", status: "active", initials: "SC" },
  ],
  "Class 9A": [
    { id: "STU021", name: "Aarav Mehta", email: "aarav.mehta@school.edu", class: "9A", guardian: "Sunita Mehta", attendance: "94%", status: "active", initials: "AM" },
    { id: "STU022", name: "Lily Chen", email: "lily.chen@school.edu", class: "9A", guardian: "Wei Chen", attendance: "98%", status: "active", initials: "LC" },
    { id: "STU023", name: "Omar Hassan", email: "omar.hassan@school.edu", class: "9A", guardian: "Fatima Hassan", attendance: "76%", status: "inactive", initials: "OH" },
    { id: "STU024", name: "Isabelle Dupont", email: "isabelle.dupont@school.edu", class: "9A", guardian: "Pierre Dupont", attendance: "89%", status: "active", initials: "ID" },
    { id: "STU025", name: "Yash Joshi", email: "yash.joshi@school.edu", class: "9A", guardian: "Meena Joshi", attendance: "92%", status: "active", initials: "YJ" },
    { id: "STU026", name: "Chloe Turner", email: "chloe.turner@school.edu", class: "9A", guardian: "Paul Turner", attendance: "88%", status: "active", initials: "CT" },
    { id: "STU027", name: "Dev Kapoor", email: "dev.kapoor@school.edu", class: "9A", guardian: "Anita Kapoor", attendance: "91%", status: "active", initials: "DK" },
    { id: "STU028", name: "Mia Johnson", email: "mia.johnson@school.edu", class: "9A", guardian: "Tom Johnson", attendance: "84%", status: "active", initials: "MJ" },
    { id: "STU029", name: "Sameer Nair", email: "sameer.nair@school.edu", class: "9A", guardian: "Radha Nair", attendance: "96%", status: "active", initials: "SN" },
  ],
};

const teacherClasses = ["Class 10A", "Class 10B", "Class 9A"];

const TeacherStudentData = () => {
  const [selectedClass, setSelectedClass] = useState("Class 10A");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewStudent, setViewStudent] = useState<Student | null>(null);

  const students = classStudents[selectedClass] ?? [];

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = students.length;
  const activeCount = students.filter((s) => s.status === "active").length;
  const avgAttendance =
    students.length > 0
      ? Math.round(students.reduce((sum, s) => sum + parseInt(s.attendance), 0) / students.length) + "%"
      : "—";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
            />
          </div>

          {/* Class Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-medium text-slate-600 shadow-sm hover:bg-gray-50 transition-all"
            >
              {selectedClass} <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden">
                {teacherClasses.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => { setSelectedClass(cls); setIsDropdownOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 ${cls === selectedClass ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600"}`}
                  >
                    {cls} {cls === selectedClass && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-medium text-slate-600 shadow-sm hover:bg-gray-50 transition-all">
          <Download size={16} /> Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total Students", value: String(totalStudents), color: "text-slate-800" },
          { label: "Active", value: String(activeCount), color: "text-green-600" },
          { label: "Avg Attendance", value: avgAttendance, color: "text-slate-800" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-sm font-medium text-gray-400 mb-2">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">{selectedClass} — {filtered.length} student{filtered.length !== 1 ? "s" : ""}</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Student</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Roll No.</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Guardian</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Attendance</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((student) => (
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
                <td className="px-6 py-4 text-sm text-slate-500 font-medium">{student.guardian}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    parseInt(student.attendance) > 90 ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                  }`}>
                    {student.attendance}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    student.status === "active" ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"
                  }`}>{student.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setViewStudent(student)}
                    className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="View details"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">No students found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Student Modal */}
      {viewStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-xl font-black backdrop-blur-sm">
                  {viewStudent.initials}
                </div>
                <button onClick={() => setViewStudent(null)} className="text-white/70 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <h2 className="text-xl font-bold">{viewStudent.name}</h2>
              <p className="text-blue-100 text-sm">{viewStudent.email}</p>
            </div>
            <div className="p-6 space-y-3">
              {[
                { label: "Roll Number", value: viewStudent.id },
                { label: "Class", value: viewStudent.class },
                { label: "Guardian", value: viewStudent.guardian },
                { label: "Attendance", value: viewStudent.attendance },
                { label: "Status", value: viewStudent.status.charAt(0).toUpperCase() + viewStudent.status.slice(1) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                  <span className="text-sm font-semibold text-slate-700">{value}</span>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6">
              <button onClick={() => setViewStudent(null)} className="w-full py-2.5 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherStudentData;
