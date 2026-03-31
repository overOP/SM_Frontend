import React from "react";
import { MoreHorizontal, Users, BookOpen, Edit2, Trash2 } from "lucide-react";

interface ClassEntry {
  id: number;
  name: string;
  room: string;
  teacher: string;
  initials: string;
  students: number;
  subjectsCount: number;
  subjects: string[];
  color: string;
}

interface ClassCardProps {
  cls: ClassEntry;
  activeMenu: number | null;
  onMenuToggle: (id: number) => void;
  onEdit: (cls: ClassEntry) => void;
  onDelete: (id: number) => void;
}

const ClassCard: React.FC<ClassCardProps> = ({
  cls,
  activeMenu,
  onMenuToggle,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border-t-8 ${cls.color} p-6 hover:shadow-md transition-shadow relative group`}>
      <div className="flex justify-between items-start mb-1">
        <h2 className="text-xl font-bold text-slate-800">{cls.name}</h2>

        {/* Dropdown Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenuToggle(cls.id);
            }}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {activeMenu === cls.id && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-10 animate-in fade-in zoom-in duration-150">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(cls);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                <Edit2 size={14} /> Edit
              </button>
              <button
                onClick={() => onDelete(cls.id)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-400 mb-4">Room {cls.room}</p>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-100 uppercase">
          {cls.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700 leading-tight">{cls.teacher}</p>
          <p className="text-xs text-slate-400">Class Teacher</p>
        </div>
      </div>

      <div className="flex items-center gap-6 mb-6 text-slate-500">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="text-sm">{cls.students} students</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          <span className="text-sm">{cls.subjectsCount} subjects</span>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Subjects</p>
        <div className="flex flex-wrap gap-2">
          {cls.subjects.slice(0, 3).map((sub, idx) => (
            <span key={idx} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[11px] font-bold text-slate-700">
              {sub}
            </span>
          ))}
          {cls.subjects.length > 3 && (
            <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[11px] font-bold text-slate-700">
              +{cls.subjects.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassCard;