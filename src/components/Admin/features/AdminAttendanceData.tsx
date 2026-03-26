



import { useState } from "react";
import {
  ChevronDown, ChevronLeft, ChevronRight,
  Download, Save, CheckCircle2, XCircle, Clock
} from "lucide-react";
import * as XLSX from 'xlsx'; // Import for Excel Export

type AttendanceStatus = "Present" | "Absent" | "On Leave";

interface Student {
  id: number;
  name: string;
  roll: string;
  status: AttendanceStatus;
  initials: string;
  color: string;
}

const AdminAttendanceData = () => {
  const [selectedClass, setSelectedClass] = useState("Class 10A");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const classes = ["Class 10A", "Class 10B", "Class 9A", "Class 9B", "Class 8A"];

  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Alex Thompson", roll: "STU001", status: "Present", initials: "AT", color: "bg-blue-100 text-blue-600" },
    { id: 2, name: "Emma Watson", roll: "STU002", status: "Present", initials: "EW", color: "bg-purple-100 text-purple-600" },
    { id: 3, name: "John Doe", roll: "STU003", status: "Absent", initials: "JD", color: "bg-emerald-100 text-emerald-600" },
    { id: 4, name: "Sarah Connor", roll: "STU004", status: "Present", initials: "SC", color: "bg-rose-100 text-rose-600" },
    { id: 5, name: "Michael J.", roll: "STU005", status: "On Leave", initials: "MJ", color: "bg-orange-100 text-orange-600" },
  ]);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  // --- Dynamic Stats Calculations ---
  const totalStudents = students.length;
  const presentCount = students.filter(s => s.status === "Present").length;
  const absentCount = students.filter(s => s.status === "Absent").length;
  const leaveCount = students.filter(s => s.status === "On Leave").length;
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  const updateStatus = (id: number, status: AttendanceStatus) => {
    setStudents((prev) => prev.map((s) => s.id === id ? { ...s, status } : s));
  };

  // --- 1. EXCEL EXPORT FUNCTION ---
  const handleExport = () => {
    const dataToExport = students.map((s, index) => ({
      "S.No": index + 1,
      "Student Name": s.name,
      "Roll Number": s.roll,
      "Attendance Status": s.status,
      "Class": selectedClass,
      "Date": selectedDate
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, `Attendance_${selectedClass}_${selectedDate}.xlsx`);
  };

  // --- 2. SAVE FUNCTION ---
  const handleSave = () => {
    // In a real app, you'd send 'students' array to your backend here
    console.log("Saving Attendance Data:", {
      date: selectedDate,
      class: selectedClass,
      records: students
    });
    alert(`Success! Attendance for ${selectedClass} on ${selectedDate} has been saved.`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between gap-4 bg-white px-4 py-2.5 border border-slate-200 rounded-xl w-full sm:min-w-[160px] shadow-sm hover:border-blue-400 transition-all"
            >
              <span className="text-sm font-semibold">{selectedClass}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                {classes.map((cls) => (
                  <div
                    key={cls}
                    onClick={() => { setSelectedClass(cls); setIsDropdownOpen(false); }}
                    className={`px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-slate-50 ${cls === selectedClass ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600"}`}
                  >
                    {cls}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden w-full sm:w-auto">
            <button
              className="p-2.5 hover:bg-slate-50 border-r border-slate-100 text-slate-500"
              onClick={() => {
                const prevDate = new Date(selectedDate);
                prevDate.setDate(prevDate.getDate() - 1);
                setSelectedDate(prevDate.toISOString().split("T")[0]);
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <input
              type="date"
              value={selectedDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value)}
              className="px-3 py-2 text-sm font-semibold outline-none bg-transparent flex-grow text-center"
            />

            <button
              className="p-2.5 hover:bg-slate-50 border-l border-slate-100 text-slate-500"
              onClick={() => {
                const nextDate = new Date(selectedDate);
                nextDate.setDate(nextDate.getDate() + 1);
                setSelectedDate(nextDate.toISOString().split("T")[0]);
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-3 w-full lg:w-auto">
          <button 
            onClick={handleExport}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export</span>
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-md shadow-blue-200"
          >
            <Save className="w-4 h-4" /> Save <span className="hidden sm:inline">Attendance</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Students</p>
          <h3 className="text-3xl font-black text-slate-800">{totalStudents}</h3>
        </div>
        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 flex justify-between items-center">
          <div>
            <p className="text-emerald-700/60 text-xs font-bold uppercase tracking-wider mb-1">Present</p>
            <h3 className="text-3xl font-black text-emerald-600">{presentCount}</h3>
          </div>
          <div className="bg-emerald-500 text-white p-2.5 rounded-xl shadow-lg shadow-emerald-200"><CheckCircle2 className="w-6 h-6" /></div>
        </div>
        <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100 flex justify-between items-center">
          <div>
            <p className="text-rose-700/60 text-xs font-bold uppercase tracking-wider mb-1">Absent</p>
            <h3 className="text-3xl font-black text-rose-600">{absentCount}</h3>
          </div>
          <div className="bg-rose-500 text-white p-2.5 rounded-xl shadow-lg shadow-rose-200"><XCircle className="w-6 h-6" /></div>
        </div>
        <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 flex justify-between items-center">
          <div>
            <p className="text-orange-700/60 text-xs font-bold uppercase tracking-wider mb-1">On Leave</p>
            <h3 className="text-3xl font-black text-orange-600">{leaveCount}</h3>
          </div>
          <div className="bg-orange-500 text-white p-2.5 rounded-xl shadow-lg shadow-orange-200"><Clock className="w-6 h-6" /></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h4 className="font-bold text-slate-800">Attendance Rate</h4>
            <p className="text-xs text-slate-400">Class performance for today</p>
          </div>
          <span className="text-2xl font-black text-blue-600 tracking-tight">{attendanceRate}%</span>
        </div>
        <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${attendanceRate}%` }}></div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-black text-lg text-slate-800">{selectedClass}</h3>
          <span className="text-sm font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{formattedDate}</span>
        </div>

        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-50">
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Roll No.</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((student, idx) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-slate-300">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shadow-sm ${student.color}`}>
                        {student.initials}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500 tracking-tight">{student.roll}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide flex items-center gap-1.5 w-fit ${
                      student.status === "Present" ? "bg-emerald-100 text-emerald-600" :
                      student.status === "Absent" ? "bg-rose-100 text-rose-600" : "bg-orange-100 text-orange-600"
                    }`}>
                      {student.status === "Present" && <CheckCircle2 className="w-3 h-3" />}
                      {student.status === "Absent" && <XCircle className="w-3 h-3" />}
                      {student.status === "On Leave" && <Clock className="w-3 h-3" />}
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => updateStatus(student.id, "Present")} className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 active:scale-90">
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => updateStatus(student.id, "Absent")} className="p-2 bg-white border border-slate-200 text-slate-400 rounded-xl hover:border-rose-300 hover:text-rose-500 transition-all active:scale-90">
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => updateStatus(student.id, "On Leave")} className="p-2 bg-white border border-slate-200 text-slate-400 rounded-xl hover:border-orange-300 hover:text-orange-500 transition-all active:scale-90">
                        <Clock className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendanceData;