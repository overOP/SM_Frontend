import { useState } from "react";
import { BookOpen, Eye, X, Calendar, Clock, Timer, Award, Hash } from "lucide-react";
import { useExamContext } from "../../../context/ExamContext";
import type { Exam, ExamStatus } from "../../../context/ExamContext";

const statusStyles: Record<ExamStatus, string> = {
  upcoming: "bg-blue-50 text-blue-700",
  ongoing: "bg-yellow-50 text-yellow-700",
  completed: "bg-green-50 text-green-700",
};

const TeacherExamData = () => {
  const { exams } = useExamContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [viewExam, setViewExam] = useState<Exam | null>(null);

  const classOptions = ["All Classes", ...Array.from(new Set(exams.map((e) => e.class))).sort()];

  const filteredExams = exams.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.subjects.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      e.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = selectedClass === "All Classes" || e.class === selectedClass;
    return matchSearch && matchClass;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search exams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm w-56"
        />
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none shadow-sm"
        >
          {classOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <p className="text-sm font-bold text-slate-600">
            {filteredExams.length} exam{filteredExams.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Exam</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Class</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Marks</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredExams.length > 0 ? (
                filteredExams.map((exam) => (
                  <tr key={exam.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{exam.name}</p>
                      <p className="text-xs text-slate-400">{exam.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {exam.subjects.map((s) => (
                          <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        {exam.class}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{exam.date}</td>
                    <td className="px-6 py-4 text-slate-600">{exam.time}</td>
                    <td className="px-6 py-4 text-slate-600">{exam.duration}</td>
                    <td className="px-6 py-4 text-slate-600">{exam.totalMarks}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[exam.status]}`}>
                        {exam.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setViewExam(exam)}
                        className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center">
                    <BookOpen className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                    <p className="text-sm text-gray-400 font-medium">No exams found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{viewExam.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{viewExam.id}</p>
              </div>
              <button onClick={() => setViewExam(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${statusStyles[viewExam.status]}`}>
                  {viewExam.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3 col-span-2">
                  <BookOpen size={16} className="mt-0.5 text-slate-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Subjects</p>
                    <div className="flex flex-wrap gap-1">
                      {viewExam.subjects.map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {[
                  { icon: <Hash size={16} />, label: "Class", value: viewExam.class },
                  { icon: <Calendar size={16} />, label: "Date", value: viewExam.date },
                  { icon: <Clock size={16} />, label: "Time", value: viewExam.time },
                  { icon: <Timer size={16} />, label: "Duration", value: viewExam.duration },
                  { icon: <Award size={16} />, label: "Total Marks", value: viewExam.totalMarks },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="mt-0.5 text-slate-400">{icon}</div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">{label}</p>
                      <p className="text-sm font-medium text-slate-700">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={() => setViewExam(null)}
                className="w-full py-3 font-bold text-slate-500 hover:bg-gray-50 rounded-xl border border-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherExamData;
