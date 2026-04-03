import { useState } from "react";
import { ChevronDown, TrendingUp, Award, BookOpen } from "lucide-react";

interface Subject {
  name: string;
  teacher: string;
  marks: number;
  total: number;
  grade: string;
  gradeColor: string;
  bgColor: string;
}

interface ExamResult {
  exam: string;
  date: string;
  subjects: Subject[];
}

const results: Record<string, Record<string, ExamResult>> = {
  "2025-26": {
    "1st Term": {
      exam: "1st Term",
      date: "July 2025",
      subjects: [
        { name: "Mathematics", teacher: "Dr. Sarah Johnson", marks: 48, total: 50, grade: "A+", gradeColor: "text-emerald-600", bgColor: "bg-emerald-50" },
        { name: "English", teacher: "Ms. Emily Davis", marks: 45, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Physics", teacher: "Prof. Michael Chen", marks: 44, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Chemistry", teacher: "Mr. Robert Wilson", marks: 40, total: 50, grade: "B+", gradeColor: "text-orange-500", bgColor: "bg-orange-50" },
        { name: "Biology", teacher: "Dr. Lisa Anderson", marks: 47, total: 50, grade: "A+", gradeColor: "text-emerald-600", bgColor: "bg-emerald-50" },
        { name: "History", teacher: "Mrs. Patricia Brown", marks: 43, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
      ],
    },
    "2nd Term": {
      exam: "2nd Term",
      date: "September 2025",
      subjects: [
        { name: "Mathematics", teacher: "Dr. Sarah Johnson", marks: 88, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "English", teacher: "Ms. Emily Davis", marks: 91, total: 100, grade: "A+", gradeColor: "text-emerald-600", bgColor: "bg-emerald-50" },
        { name: "Physics", teacher: "Prof. Michael Chen", marks: 85, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Chemistry", teacher: "Mr. Robert Wilson", marks: 79, total: 100, grade: "B+", gradeColor: "text-orange-500", bgColor: "bg-orange-50" },
        { name: "Biology", teacher: "Dr. Lisa Anderson", marks: 93, total: 100, grade: "A+", gradeColor: "text-emerald-600", bgColor: "bg-emerald-50" },
        { name: "History", teacher: "Mrs. Patricia Brown", marks: 82, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
      ],
    },
    "3rd Term": {
      exam: "3rd Term",
      date: "November 2025",
      subjects: [
        { name: "Mathematics", teacher: "Dr. Sarah Johnson", marks: 46, total: 50, grade: "A+", gradeColor: "text-emerald-600", bgColor: "bg-emerald-50" },
        { name: "English", teacher: "Ms. Emily Davis", marks: 44, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Physics", teacher: "Prof. Michael Chen", marks: 41, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Chemistry", teacher: "Mr. Robert Wilson", marks: 38, total: 50, grade: "B+", gradeColor: "text-orange-500", bgColor: "bg-orange-50" },
        { name: "Biology", teacher: "Dr. Lisa Anderson", marks: 45, total: 50, grade: "A+", gradeColor: "text-emerald-600", bgColor: "bg-emerald-50" },
        { name: "History", teacher: "Mrs. Patricia Brown", marks: 42, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
      ],
    },
    "Final Term": {
      exam: "Final Term",
      date: "March 2026",
      subjects: [
        { name: "Mathematics", teacher: "Dr. Sarah Johnson", marks: 92, total: 100, grade: "A+", gradeColor: "text-emerald-600", bgColor: "bg-emerald-50" },
        { name: "English", teacher: "Ms. Emily Davis", marks: 89, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Physics", teacher: "Prof. Michael Chen", marks: 87, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Chemistry", teacher: "Mr. Robert Wilson", marks: 83, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Biology", teacher: "Dr. Lisa Anderson", marks: 95, total: 100, grade: "A+", gradeColor: "text-emerald-600", bgColor: "bg-emerald-50" },
        { name: "History", teacher: "Mrs. Patricia Brown", marks: 86, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
      ],
    },
  },
  "2024-25": {
    "1st Term": {
      exam: "1st Term",
      date: "July 2024",
      subjects: [
        { name: "Mathematics", teacher: "Dr. Sarah Johnson", marks: 48, total: 50, grade: "A+", gradeColor: "text-emerald-600", bgColor: "bg-emerald-50" },
        { name: "English", teacher: "Ms. Emily Davis", marks: 45, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Physics", teacher: "Prof. Michael Chen", marks: 44, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Chemistry", teacher: "Mr. Robert Wilson", marks: 40, total: 50, grade: "B+", gradeColor: "text-orange-500", bgColor: "bg-orange-50" },
        { name: "Biology", teacher: "Dr. Lisa Anderson", marks: 47, total: 50, grade: "A+", gradeColor: "text-emerald-600", bgColor: "bg-emerald-50" },
        { name: "History", teacher: "Mrs. Patricia Brown", marks: 43, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
      ],
    },
    "2nd Term": {
      exam: "2nd Term",
      date: "September 2024",
      subjects: [
        { name: "Mathematics", teacher: "Dr. Sarah Johnson", marks: 88, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "English", teacher: "Ms. Emily Davis", marks: 91, total: 100, grade: "A+", gradeColor: "text-emerald-600", bgColor: "bg-emerald-50" },
        { name: "Physics", teacher: "Prof. Michael Chen", marks: 85, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Chemistry", teacher: "Mr. Robert Wilson", marks: 79, total: 100, grade: "B+", gradeColor: "text-orange-500", bgColor: "bg-orange-50" },
        { name: "Biology", teacher: "Dr. Lisa Anderson", marks: 93, total: 100, grade: "A+", gradeColor: "text-emerald-600", bgColor: "bg-emerald-50" },
        { name: "History", teacher: "Mrs. Patricia Brown", marks: 82, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
      ],
    },
    "3rd Term": {
      exam: "3rd Term",
      date: "November 2024",
      subjects: [
        { name: "Mathematics", teacher: "Dr. Sarah Johnson", marks: 46, total: 50, grade: "A+", gradeColor: "text-emerald-600", bgColor: "bg-emerald-50" },
        { name: "English", teacher: "Ms. Emily Davis", marks: 44, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Physics", teacher: "Prof. Michael Chen", marks: 41, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Chemistry", teacher: "Mr. Robert Wilson", marks: 38, total: 50, grade: "B+", gradeColor: "text-orange-500", bgColor: "bg-orange-50" },
        { name: "Biology", teacher: "Dr. Lisa Anderson", marks: 45, total: 50, grade: "A+", gradeColor: "text-emerald-600", bgColor: "bg-emerald-50" },
        { name: "History", teacher: "Mrs. Patricia Brown", marks: 42, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
      ],
    },
    "Final Term": {
      exam: "Final Term",
      date: "March 2025",
      subjects: [
        { name: "Mathematics", teacher: "Dr. Sarah Johnson", marks: 90, total: 100, grade: "A+", gradeColor: "text-emerald-600", bgColor: "bg-emerald-50" },
        { name: "English", teacher: "Ms. Emily Davis", marks: 87, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Physics", teacher: "Prof. Michael Chen", marks: 84, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Chemistry", teacher: "Mr. Robert Wilson", marks: 80, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Biology", teacher: "Dr. Lisa Anderson", marks: 92, total: 100, grade: "A+", gradeColor: "text-emerald-600", bgColor: "bg-emerald-50" },
        { name: "History", teacher: "Mrs. Patricia Brown", marks: 83, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
      ],
    },
  },
};

const GradeandReports = () => {
  const years = Object.keys(results);
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [selectedTerm, setSelectedTerm] = useState("1st Term");
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showTermDropdown, setShowTermDropdown] = useState(false);

  const terms = Object.keys(results[selectedYear]);
  const current = results[selectedYear][selectedTerm];
  const totalMarks = current.subjects.reduce((s, sub) => s + sub.marks, 0);
  const totalMax = current.subjects.reduce((s, sub) => s + sub.total, 0);
  const percentage = Math.round((totalMarks / totalMax) * 100);

  return (
    <div className="space-y-6">
      {/* Header with dropdowns */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">Grades & Reports</h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Year dropdown */}
            <div className="relative">
              <button
                onClick={() => { setShowYearDropdown(!showYearDropdown); setShowTermDropdown(false); }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-semibold text-slate-600 transition-colors"
              >
                {selectedYear} <ChevronDown className="w-4 h-4" />
              </button>
              {showYearDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowYearDropdown(false)} />
                  <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-100 z-20 overflow-hidden min-w-30">
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => { setSelectedYear(year); setSelectedTerm("1st Term"); setShowYearDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${selectedYear === year ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"}`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Term dropdown */}
            <div className="relative">
              <button
                onClick={() => { setShowTermDropdown(!showTermDropdown); setShowYearDropdown(false); }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold text-white transition-colors"
              >
                {selectedTerm} <ChevronDown className="w-4 h-4" />
              </button>
              {showTermDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowTermDropdown(false)} />
                  <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-100 z-20 overflow-hidden min-w-35">
                    {terms.map((term) => (
                      <button
                        key={term}
                        onClick={() => { setSelectedTerm(term); setShowTermDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${selectedTerm === term ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"}`}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Marks</p>
            <p className="text-xl font-black text-slate-800">{totalMarks} / {totalMax}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Percentage</p>
            <p className="text-xl font-black text-slate-800">{percentage}%</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Exam Date</p>
            <p className="text-xl font-black text-slate-800">{current.date}</p>
          </div>
        </div>
      </div>

      {/* Subject results */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4">Subject-wise Results — {current.exam}</h3>
        <div className="space-y-3">
          {current.subjects.map((subject) => (
            <div key={subject.name} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">{subject.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{subject.teacher}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">{subject.marks} / {subject.total}</p>
                <p className="text-xs text-slate-400 mt-0.5">{Math.round((subject.marks / subject.total) * 100)}%</p>
              </div>
              <span className={`px-3 py-1.5 rounded-lg text-xs font-black ${subject.gradeColor} ${subject.bgColor} min-w-10 text-center`}>
                {subject.grade}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GradeandReports;
