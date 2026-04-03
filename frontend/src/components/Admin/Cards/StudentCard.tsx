import React from "react";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  guardian: string;
  guardianPhone: string;
  attendance: string;
  status: "active" | "inactive";
  initials: string;
}

interface StudentCardProps {
  student: Student;
  activeMenu: string | null;
  onMenuToggle: (id: string) => void;
  onView: (student: Student) => void;
  onDelete: (id: string) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  activeMenu,
  onMenuToggle,
  onView,
  onDelete,
}) => {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm border border-blue-100">
            {student.initials}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{student.name}</p>
            <p className="text-sm text-slate-500">{student.id}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-slate-600">{student.email}</td>
      <td className="px-6 py-4">
        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          {student.class}
        </span>
      </td>
      <td className="px-6 py-4 text-slate-600">{student.guardian}</td>
      <td className="px-6 py-4 text-slate-600">{student.attendance}</td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          student.status === "active"
            ? "bg-green-50 text-green-700"
            : "bg-red-50 text-red-700"
        }`}>
          {student.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="relative">
          <button
            onClick={() => onMenuToggle(student.id)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {activeMenu === student.id && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-10">
              <button
                onClick={() => onView(student)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                <Eye size={14} /> View
              </button>
              <button
                onClick={() => onDelete(student.id)}
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

export default StudentCard;