import React from "react";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import type { Exam, ExamStatus } from "../utils/useExamManagement";

const statusStyles: Record<ExamStatus, string> = {
  upcoming: "bg-blue-50 text-blue-700",
  ongoing: "bg-yellow-50 text-yellow-700",
  completed: "bg-green-50 text-green-700",
};

interface ExamCardProps {
  exam: Exam;
  activeMenu: string | null;
  onMenuToggle: (id: string) => void;
  onView: (exam: Exam) => void;
  onDelete: (id: string) => void;
}

const ExamCard: React.FC<ExamCardProps> = ({
  exam,
  activeMenu,
  onMenuToggle,
  onView,
  onDelete,
}) => {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50">
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
        <div className="relative">
          <button
            onClick={() => onMenuToggle(exam.id)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {activeMenu === exam.id && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-10">
              <button
                onClick={() => onView(exam)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                <Eye size={14} /> View
              </button>
              <button
                onClick={() => onDelete(exam.id)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ExamCard;
