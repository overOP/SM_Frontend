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

const results: Record<string, ExamResult[]> = {
  "2025-26": [
    {
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
    {
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
    {
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
    {
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
  ],
  "2024-25": [
    {
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
    {
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
    {
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
    {
      exam: "Final Term",
      date: "March 2025",
      subjects: [
        { name: "Mathematics", teacher: "Dr. Sarah Johnson", marks: 92, total: 100, grade: "A+", gradeColor: "text-emerald-600", bgColor: "bg-emerald-50" },
        { name: "English", teacher: "Ms. Emily Davis", marks: 89, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Physics", teacher: "Prof. Michael Chen", marks: 87, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Chemistry", teacher: "Mr. Robert Wilson", marks: 83, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Biology", teacher: "Dr. Lisa Anderson", marks: 95, total: 100, grade: "A+", gradeColor: "text-emerald-600", bgColor: "bg-emerald-50" },
        { name: "History", teacher: "Mrs. Patricia Brown", marks: 86, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
      ],
    },
  ],
"2023-24": [
    {
      exam: "1st Term",
      date: "July 2023",
      subjects: [
        { name: "Mathematics", teacher: "Dr. Sarah Johnson", marks: 42, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "English", teacher: "Ms. Emily Davis", marks: 41, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Physics", teacher: "Prof. Michael Chen", marks: 38, total: 50, grade: "B+", gradeColor: "text-orange-500", bgColor: "bg-orange-50" },
        { name: "Chemistry", teacher: "Mr. Robert Wilson", marks: 37, total: 50, grade: "B+", gradeColor: "text-orange-500", bgColor: "bg-orange-50" },
        { name: "Biology", teacher: "Dr. Lisa Anderson", marks: 43, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "History", teacher: "Mrs. Patricia Brown", marks: 40, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
      ],
    },
    {
      exam: "2nd Term",
      date: "September 2023",
      subjects: [
        { name: "Mathematics", teacher: "Dr. Sarah Johnson", marks: 45, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "English", teacher: "Ms. Emily Davis", marks: 42, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Physics", teacher: "Prof. Michael Chen", marks: 39, total: 50, grade: "B+", gradeColor: "text-orange-500", bgColor: "bg-orange-50" },
        { name: "Chemistry", teacher: "Mr. Robert Wilson", marks: 38, total: 50, grade: "B+", gradeColor: "text-orange-500", bgColor: "bg-orange-50" },
        { name: "Biology", teacher: "Dr. Lisa Anderson", marks: 44, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "History", teacher: "Mrs. Patricia Brown", marks: 41, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
      ],
    },
    {
      exam: "3rd Term",
      date: "November 2023",
      subjects: [
        { name: "Mathematics", teacher: "Dr. Sarah Johnson", marks: 46, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "English", teacher: "Ms. Emily Davis", marks: 43, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Physics", teacher: "Prof. Michael Chen", marks: 40, total: 50, grade: "B+", gradeColor: "text-orange-500", bgColor: "bg-orange-50" },
        { name: "Chemistry", teacher: "Mr. Robert Wilson", marks: 39, total: 50, grade: "B+", gradeColor: "text-orange-500", bgColor: "bg-orange-50" },
        { name: "Biology", teacher: "Dr. Lisa Anderson", marks: 45, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "History", teacher: "Mrs. Patricia Brown", marks: 42, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
      ],
    },
    {
      exam: "Final Term",
      date: "March 2024",
      subjects: [
        { name: "Mathematics", teacher: "Dr. Sarah Johnson", marks: 85, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "English", teacher: "Ms. Emily Davis", marks: 87, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Physics", teacher: "Prof. Michael Chen", marks: 80, total: 100, grade: "A-", gradeColor: "text-blue-500", bgColor: "bg-blue-50" },
        { name: "Chemistry", teacher: "Mr. Robert Wilson", marks: 78, total: 100, grade: "B+", gradeColor: "text-orange-500", bgColor: "bg-orange-50" },
        { name: "Biology", teacher: "Dr. Lisa Anderson", marks: 88, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "History", teacher: "Mrs. Patricia Brown", marks: 82, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
      ],
    },
  ],
"2022-23": [
    {
      exam: "1st Term",
      date: "July 2022",
      subjects: [
        { name: "Mathematics", teacher: "Ms. Priya Sharma", marks: 35, total: 50, grade: "B+", gradeColor: "text-orange-500", bgColor: "bg-orange-50" },
        { name: "English", teacher: "Mr. David Brown", marks: 38, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Physics", teacher: "Dr. Oliver Green", marks: 36, total: 50, grade: "B+", gradeColor: "text-orange-500", bgColor: "bg-orange-50" },
        { name: "Chemistry", teacher: "Mr. Raj Kapoor", marks: 39, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Biology", teacher: "Ms. Rekha Joshi", marks: 37, total: 50, grade: "A-", gradeColor: "text-blue-500", bgColor: "bg-blue-50" },
        { name: "History", teacher: "Dr. Sarah Johnson", marks: 34, total: 50, grade: "B+", gradeColor: "text-orange-500", bgColor: "bg-orange-50" },
      ],
    },
    {
      exam: "2nd Term",
      date: "September 2022",
      subjects: [
        { name: "Mathematics", teacher: "Ms. Priya Sharma", marks: 40, total: 50, grade: "A-", gradeColor: "text-blue-500", bgColor: "bg-blue-50" },
        { name: "English", teacher: "Mr. David Brown", marks: 42, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Physics", teacher: "Dr. Oliver Green", marks: 38, total: 50, grade: "B+", gradeColor: "text-orange-500", bgColor: "bg-orange-50" },
        { name: "Chemistry", teacher: "Mr. Raj Kapoor", marks: 41, total: 50, grade: "A-", gradeColor: "text-blue-500", bgColor: "bg-blue-50" },
        { name: "Biology", teacher: "Ms. Rekha Joshi", marks: 39, total: 50, grade: "A-", gradeColor: "text-blue-500", bgColor: "bg-blue-50" },
        { name: "History", teacher: "Dr. Sarah Johnson", marks: 37, total: 50, grade: "B+", gradeColor: "text-orange-500", bgColor: "bg-orange-50" },
      ],
    },
    {
      exam: "3rd Term",
      date: "November 2022",
      subjects: [
        { name: "Mathematics", teacher: "Ms. Priya Sharma", marks: 45, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "English", teacher: "Mr. David Brown", marks: 44, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Physics", teacher: "Dr. Oliver Green", marks: 42, total: 50, grade: "A-", gradeColor: "text-blue-500", bgColor: "bg-blue-50" },
        { name: "Chemistry", teacher: "Mr. Raj Kapoor", marks: 40, total: 50, grade: "A-", gradeColor: "text-blue-500", bgColor: "bg-blue-50" },
        { name: "Biology", teacher: "Ms. Rekha Joshi", marks: 43, total: 50, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "History", teacher: "Dr. Sarah Johnson", marks: 41, total: 50, grade: "A-", gradeColor: "text-blue-500", bgColor: "bg-blue-50" },
      ],
    },
    {
      exam: "Final Term",
      date: "March 2023",
      subjects: [
        { name: "Mathematics", teacher: "Ms. Priya Sharma", marks: 78, total: 100, grade: "B+", gradeColor: "text-orange-500", bgColor: "bg-orange-50" },
        { name: "English", teacher: "Mr. David Brown", marks: 82, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Physics", teacher: "Dr. Oliver Green", marks: 75, total: 100, grade: "B+", gradeColor: "text-orange-500", bgColor: "bg-orange-50" },
        { name: "Chemistry", teacher: "Mr. Raj Kapoor", marks: 84, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
        { name: "Biology", teacher: "Ms. Rekha Joshi", marks: 80, total: 100, grade: "A-", gradeColor: "text-blue-500", bgColor: "bg-blue-50" },
        { name: "History", teacher: "Dr. Sarah Johnson", marks: 82, total: 100, grade: "A", gradeColor: "text-blue-600", bgColor: "bg-blue-50" },
      ],
    },
  ],
};


const gradePoints: Record<string, number> = { "A+": 4.0, "A": 3.7, "A-": 3.3, "B+": 3.0, "B": 2.7, "C+": 2.3, "C": 2.0 };

const StudentResultData = () => {
  const [selectedYear, setSelectedYear] = useState("2024-25");
  const [selectedExam, setSelectedExam] = useState("Final Term");
  const [yearOpen, setYearOpen] = useState(false);
  const [examOpen, setExamOpen] = useState(false);

  const years = Object.keys(results);
  const exams = results[selectedYear]?.map((r) => r.exam) ?? [];
  const currentResult = results[selectedYear]?.find((r) => r.exam === selectedExam);

  const totalMarks = currentResult?.subjects.reduce((s, sub) => s + sub.marks, 0) ?? 0;
  const totalMax = currentResult?.subjects.reduce((s, sub) => s + sub.total, 0) ?? 0;
  const percentage = totalMax > 0 ? ((totalMarks / totalMax) * 100).toFixed(1) : "0";
  const gpa = currentResult
    ? (currentResult.subjects.reduce((s, sub) => s + (gradePoints[sub.grade] ?? 0), 0) / currentResult.subjects.length).toFixed(2)
    : "0";

  if (!currentResult) {
    return <div className="text-center py-20 text-slate-400">No results available for selected filters.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Marks</p>
            <p className="text-2xl font-bold text-slate-800">{totalMarks}<span className="text-sm text-gray-400 font-normal"> / {totalMax}</span></p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Percentage</p>
            <p className="text-2xl font-bold text-slate-800">{percentage}<span className="text-sm text-gray-400 font-normal">%</span></p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">GPA</p>
            <p className="text-2xl font-bold text-slate-800">{gpa}<span className="text-sm text-gray-400 font-normal"> / 4.0</span></p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Year Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setYearOpen(!yearOpen); setExamOpen(false); }}
            className="flex items-center gap-3 bg-white px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all"
          >
            Academic Year: <span className="text-blue-600 font-bold">{selectedYear}</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${yearOpen ? "rotate-180" : ""}`} />
          </button>
          {yearOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-10 overflow-hidden min-w-full">
              {years.map((y) => (
                <button key={y} onClick={() => { setSelectedYear(y); setYearOpen(false); setSelectedExam(results[y][0]?.exam || ""); }}
                  className={`w-full px-4 py-2.5 text-sm text-left hover:bg-slate-50 ${y === selectedYear ? "bg-blue-50 text-blue-600 font-semibold border-r-2 border-blue-500" : "text-slate-600"} transition-colors`}>
                  {y}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Exam Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setExamOpen(!examOpen); setYearOpen(false); }}
            className="flex items-center gap-3 bg-white px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all"
          >
            Exam: <span className="text-blue-600 font-bold">{selectedExam}</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${examOpen ? "rotate-180" : ""}`} />
          </button>
          {examOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-10 overflow-hidden min-w-max">
              {exams.map((e) => (
                <button key={e} onClick={() => { setSelectedExam(e); setExamOpen(false); }}
                  className={`w-full px-4 py-2.5 text-sm text-left hover:bg-slate-50 ${e === selectedExam ? "bg-blue-50 text-blue-600 font-semibold border-r-2 border-blue-500" : "text-slate-600"} transition-colors`}>
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>

        {currentResult && (
          <span className="text-xs text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-lg">{currentResult.date}</span>
        )}
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Teacher</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Marks Obtained</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Total Marks</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Percentage</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentResult.subjects.map((subject, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-slate-800">{subject.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{subject.teacher}</td>
                <td className="px-6 py-4">
                  <span className="text-lg font-bold text-slate-800">{subject.marks}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{subject.total}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full shadow-sm"
                        style={{ width: `${(subject.marks / subject.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-600">
                      {((subject.marks / subject.total) * 100).toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${subject.gradeColor} ${subject.bgColor} shadow-sm`}>
                    {subject.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gradient-to-r from-slate-50 to-blue-50 border-t-2 border-slate-200">
              <td className="px-6 py-4 text-sm font-bold text-slate-800" colSpan={2}>Overall</td>
              <td className="px-6 py-4 text-lg font-bold text-slate-800">{totalMarks} / {totalMax}</td>
              <td className="px-6 py-4 text-lg font-bold text-emerald-600">{percentage}%</td>
              <td colSpan={2} className="px-6 py-4 text-lg font-bold text-purple-600">GPA: {gpa} / 4.0</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default StudentResultData;

