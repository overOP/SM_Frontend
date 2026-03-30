import React from "react";
import { X } from "lucide-react";

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

interface StudentViewModalProps {
  student: Student | null;
  onClose: () => void;
}

const StudentViewModal: React.FC<StudentViewModalProps> = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-linear-to-r from-blue-600 to-blue-500 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20">
            <X size={18} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-xl font-black">
              {student.initials}
            </div>
            <div>
              <h2 className="text-xl font-black">{student.name}</h2>
              <p className="text-blue-200 text-sm">{student.email}</p>
              <span className={`inline-block mt-1 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                student.status === "active" ? "bg-green-400/30 text-green-100" : "bg-slate-400/30 text-slate-100"
              }`}>
                {student.status}
              </span>
            </div>
          </div>
        </div>
        <div className="p-6 grid grid-cols-2 gap-3">
          {[
            { label: "Roll No.", value: student.id },
            { label: "Class", value: student.class },
            { label: "Guardian", value: student.guardian },
            { label: "Guardian Phone", value: student.guardianPhone },
            { label: "Attendance", value: student.attendance },
          ].map((item) => (
            <div key={item.label} className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</p>
              <p className="text-sm font-bold text-slate-700 mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="px-6 pb-6">
          <button onClick={onClose} className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentViewModal;