import { useState, useMemo } from "react";
import {
  ChevronDown, ChevronLeft, ChevronRight,
  Download, Save, CheckCircle2, XCircle, Clock,
} from "lucide-react";

type AttendanceStatus = "Present" | "Absent" | "On Leave";

interface Student {
  id: number;
  name: string;
  roll: string;
  status: AttendanceStatus;
  initials: string;
  color: string;
}

// Mock attendance data for different dates
const attendanceDataByDate: Record<string, Student[]> = {
  [new Date().toISOString().split("T")[0]]: [ // Today
    { id: 1, name: "Alex Thompson", roll: "STU001", status: "Present", initials: "AT", color: "bg-blue-100 text-blue-600" },
    { id: 2, name: "Emma Watson", roll: "STU002", status: "Present", initials: "EW", color: "bg-purple-100 text-purple-600" },
    { id: 3, name: "John Doe", roll: "STU003", status: "Absent", initials: "JD", color: "bg-emerald-100 text-emerald-600" },
    { id: 4, name: "Sarah Wilson", roll: "STU004", status: "Present", initials: "SW", color: "bg-pink-100 text-pink-600" },
    { id: 5, name: "Mike Johnson", roll: "STU005", status: "On Leave", initials: "MJ", color: "bg-indigo-100 text-indigo-600" },
    { id: 6, name: "Lisa Brown", roll: "STU006", status: "Present", initials: "LB", color: "bg-teal-100 text-teal-600" },
    { id: 7, name: "David Lee", roll: "STU007", status: "Present", initials: "DL", color: "bg-orange-100 text-orange-600" },
    { id: 8, name: "Anna Davis", roll: "STU008", status: "Absent", initials: "AD", color: "bg-red-100 text-red-600" },
    { id: 9, name: "Tom Wilson", roll: "STU009", status: "Present", initials: "TW", color: "bg-cyan-100 text-cyan-600" },
    { id: 10, name: "Maria Garcia", roll: "STU010", status: "Present", initials: "MG", color: "bg-lime-100 text-lime-600" },
  ],
  [new Date(Date.now() - 86400000).toISOString().split("T")[0]]: [ // Yesterday
    { id: 1, name: "Alex Thompson", roll: "STU001", status: "Present", initials: "AT", color: "bg-blue-100 text-blue-600" },
    { id: 2, name: "Emma Watson", roll: "STU002", status: "Absent", initials: "EW", color: "bg-purple-100 text-purple-600" },
    { id: 3, name: "John Doe", roll: "STU003", status: "Present", initials: "JD", color: "bg-emerald-100 text-emerald-600" },
    { id: 4, name: "Sarah Wilson", roll: "STU004", status: "Present", initials: "SW", color: "bg-pink-100 text-pink-600" },
    { id: 5, name: "Mike Johnson", roll: "STU005", status: "Present", initials: "MJ", color: "bg-indigo-100 text-indigo-600" },
    { id: 6, name: "Lisa Brown", roll: "STU006", status: "On Leave", initials: "LB", color: "bg-teal-100 text-teal-600" },
    { id: 7, name: "David Lee", roll: "STU007", status: "Present", initials: "DL", color: "bg-orange-100 text-orange-600" },
    { id: 8, name: "Anna Davis", roll: "STU008", status: "Present", initials: "AD", color: "bg-red-100 text-red-600" },
    { id: 9, name: "Tom Wilson", roll: "STU009", status: "Absent", initials: "TW", color: "bg-cyan-100 text-cyan-600" },
    { id: 10, name: "Maria Garcia", roll: "STU010", status: "Present", initials: "MG", color: "bg-lime-100 text-lime-600" },
  ],
  [new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0]]: [ // 2 days ago
    { id: 1, name: "Alex Thompson", roll: "STU001", status: "On Leave", initials: "AT", color: "bg-blue-100 text-blue-600" },
    { id: 2, name: "Emma Watson", roll: "STU002", status: "Present", initials: "EW", color: "bg-purple-100 text-purple-600" },
    { id: 3, name: "John Doe", roll: "STU003", status: "Present", initials: "JD", color: "bg-emerald-100 text-emerald-600" },
    { id: 4, name: "Sarah Wilson", roll: "STU004", status: "Absent", initials: "SW", color: "bg-pink-100 text-pink-600" },
    { id: 5, name: "Mike Johnson", roll: "STU005", status: "Present", initials: "MJ", color: "bg-indigo-100 text-indigo-600" },
    { id: 6, name: "Lisa Brown", roll: "STU006", status: "Present", initials: "LB", color: "bg-teal-100 text-teal-600" },
    { id: 7, name: "David Lee", roll: "STU007", status: "Present", initials: "DL", color: "bg-orange-100 text-orange-600" },
    { id: 8, name: "Anna Davis", roll: "STU008", status: "Present", initials: "AD", color: "bg-red-100 text-red-600" },
    { id: 9, name: "Tom Wilson", roll: "STU009", status: "Present", initials: "TW", color: "bg-cyan-100 text-cyan-600" },
    { id: 10, name: "Maria Garcia", roll: "STU010", status: "Absent", initials: "MG", color: "bg-lime-100 text-lime-600" },
  ],
  [new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0]]: [ // 3 days ago
    { id: 1, name: "Alex Thompson", roll: "STU001", status: "Present", initials: "AT", color: "bg-blue-100 text-blue-600" },
    { id: 2, name: "Emma Watson", roll: "STU002", status: "Present", initials: "EW", color: "bg-purple-100 text-purple-600" },
    { id: 3, name: "John Doe", roll: "STU003", status: "Absent", initials: "JD", color: "bg-emerald-100 text-emerald-600" },
    { id: 4, name: "Sarah Wilson", roll: "STU004", status: "On Leave", initials: "SW", color: "bg-pink-100 text-pink-600" },
    { id: 5, name: "Mike Johnson", roll: "STU005", status: "Present", initials: "MJ", color: "bg-indigo-100 text-indigo-600" },
    { id: 6, name: "Lisa Brown", roll: "STU006", status: "Present", initials: "LB", color: "bg-teal-100 text-teal-600" },
    { id: 7, name: "David Lee", roll: "STU007", status: "Absent", initials: "DL", color: "bg-orange-100 text-orange-600" },
    { id: 8, name: "Anna Davis", roll: "STU008", status: "Present", initials: "AD", color: "bg-red-100 text-red-600" },
    { id: 9, name: "Tom Wilson", roll: "STU009", status: "Present", initials: "TW", color: "bg-cyan-100 text-cyan-600" },
    { id: 10, name: "Maria Garcia", roll: "STU010", status: "Present", initials: "MG", color: "bg-lime-100 text-lime-600" },
  ],
};

const TeacherAttendanceData = () => {
  const [selectedClass, setSelectedClass] = useState("Class 10A");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceData, setAttendanceData] = useState<Record<string, Student[]>>(attendanceDataByDate);

  const classes = ["Class 10A", "Class 10B", "Class 9A", "Class 9B", "Class 8A"];

  // Generate mock attendance data for a date if it doesn't exist
  const generateAttendanceDataForDate = (date: string): Student[] => {
    const baseStudents = [
      { id: 1, name: "Alex Thompson", roll: "STU001", initials: "AT", color: "bg-blue-100 text-blue-600" },
      { id: 2, name: "Emma Watson", roll: "STU002", initials: "EW", color: "bg-purple-100 text-purple-600" },
      { id: 3, name: "John Doe", roll: "STU003", initials: "JD", color: "bg-emerald-100 text-emerald-600" },
      { id: 4, name: "Sarah Wilson", roll: "STU004", initials: "SW", color: "bg-pink-100 text-pink-600" },
      { id: 5, name: "Mike Johnson", roll: "STU005", initials: "MJ", color: "bg-indigo-100 text-indigo-600" },
      { id: 6, name: "Lisa Brown", roll: "STU006", initials: "LB", color: "bg-teal-100 text-teal-600" },
      { id: 7, name: "David Lee", roll: "STU007", initials: "DL", color: "bg-orange-100 text-orange-600" },
      { id: 8, name: "Anna Davis", roll: "STU008", initials: "AD", color: "bg-red-100 text-red-600" },
      { id: 9, name: "Tom Wilson", roll: "STU009", initials: "TW", color: "bg-cyan-100 text-cyan-600" },
      { id: 10, name: "Maria Garcia", roll: "STU010", initials: "MG", color: "bg-lime-100 text-lime-600" },
    ];

    const statuses: AttendanceStatus[] = ["Present", "Present", "Present", "Present", "Present", "Present", "Present", "Absent", "On Leave", "Absent"];

    // Use date as seed for consistent but varied results
    const seed = date.split('-').reduce((acc, part) => acc + parseInt(part), 0);

    return baseStudents.map((student, index) => ({
      ...student,
      status: statuses[(seed + index) % statuses.length]
    }));
  };

  // Get attendance data for the selected date
  const students = useMemo(() => {
    if (!attendanceData[selectedDate]) {
      const newData = generateAttendanceDataForDate(selectedDate);
      setAttendanceData(prev => ({ ...prev, [selectedDate]: newData }));
      return newData;
    }
    return attendanceData[selectedDate];
  }, [selectedDate, attendanceData]);

  // Update attendance status for a student
  const updateAttendanceStatus = (studentId: number, status: AttendanceStatus) => {
    setAttendanceData(prev => ({
      ...prev,
      [selectedDate]: prev[selectedDate].map(student =>
        student.id === studentId ? { ...student, status } : student
      )
    }));
  };

  // Calculate stats based on current students data
  const stats = useMemo(() => {
    const present = students.filter(s => s.status === "Present").length;
    const absent = students.filter(s => s.status === "Absent").length;
    const onLeave = students.filter(s => s.status === "On Leave").length;
    const total = students.length;
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

    return { present, absent, onLeave, total, attendanceRate };
  }, [students]);

  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

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
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export</span>
          </button>
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-md shadow-blue-200">
            <Save className="w-4 h-4" /> Save <span className="hidden sm:inline">Attendance</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Students</p>
          <h3 className="text-3xl font-black text-slate-800">{stats.total}</h3>
        </div>
        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 flex justify-between items-center">
          <div>
            <p className="text-emerald-700/60 text-xs font-bold uppercase tracking-wider mb-1">Present</p>
            <h3 className="text-3xl font-black text-emerald-600">{stats.present}</h3>
          </div>
          <div className="bg-emerald-500 text-white p-2.5 rounded-xl shadow-lg shadow-emerald-200"><CheckCircle2 className="w-6 h-6" /></div>
        </div>
        <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100 flex justify-between items-center">
          <div>
            <p className="text-rose-700/60 text-xs font-bold uppercase tracking-wider mb-1">Absent</p>
            <h3 className="text-3xl font-black text-rose-600">{stats.absent}</h3>
          </div>
          <div className="bg-rose-500 text-white p-2.5 rounded-xl shadow-lg shadow-rose-200"><XCircle className="w-6 h-6" /></div>
        </div>
        <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 flex justify-between items-center">
          <div>
            <p className="text-orange-700/60 text-xs font-bold uppercase tracking-wider mb-1">On Leave</p>
            <h3 className="text-3xl font-black text-orange-600">{stats.onLeave}</h3>
          </div>
          <div className="bg-orange-500 text-white p-2.5 rounded-xl shadow-lg shadow-orange-200"><Clock className="w-6 h-6" /></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h4 className="font-bold text-slate-800">Attendance Rate</h4>
            <p className="text-xs text-slate-400">Class performance for {formattedDate}</p>
          </div>
          <span className="text-2xl font-black text-blue-600 tracking-tight">{stats.attendanceRate}%</span>
        </div>
        <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${stats.attendanceRate}%` }}></div>
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
                      <button
                        onClick={() => updateAttendanceStatus(student.id, "Present")}
                        className={`p-2 rounded-xl transition-all shadow-lg active:scale-90 ${
                          student.status === "Present"
                            ? "bg-emerald-500 text-white shadow-emerald-100"
                            : "bg-white border border-slate-200 text-slate-400 hover:border-emerald-300 hover:text-emerald-500"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateAttendanceStatus(student.id, "Absent")}
                        className={`p-2 rounded-xl transition-all shadow-lg active:scale-90 ${
                          student.status === "Absent"
                            ? "bg-rose-500 text-white shadow-rose-100"
                            : "bg-white border border-slate-200 text-slate-400 hover:border-rose-300 hover:text-rose-500"
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateAttendanceStatus(student.id, "On Leave")}
                        className={`p-2 rounded-xl transition-all shadow-lg active:scale-90 ${
                          student.status === "On Leave"
                            ? "bg-orange-500 text-white shadow-orange-100"
                            : "bg-white border border-slate-200 text-slate-400 hover:border-orange-300 hover:text-orange-500"
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden p-4 bg-slate-50 text-center border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Swipe left to see more info →</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendanceData;
