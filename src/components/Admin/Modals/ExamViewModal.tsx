import React from "react";
import { X, BookOpen, Calendar, Clock, Timer, Award, Hash } from "lucide-react";
import type { Exam, ExamStatus } from "../utils/useExamManagement";

const statusStyles: Record<ExamStatus, string> = {
  upcoming: "bg-blue-50 text-blue-700",
  ongoing: "bg-yellow-50 text-yellow-700",
  completed: "bg-green-50 text-green-700",
};

interface ExamViewModalProps {
  exam: Exam | null;
  onClose: () => void;
}

const Detail: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 text-slate-400">{icon}</div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase">{label}</p>
      <p className="text-sm font-medium text-slate-700">{value}</p>
    </div>
  </div>
);

const SubjectDetail: React.FC<{ icon: React.ReactNode; label: string; subjects: string[] }> = ({ icon, label, subjects }) => (
  <div className="flex items-start gap-3 col-span-2">
    <div className="mt-0.5 text-slate-400">{icon}</div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase mb-1">{label}</p>
      <div className="flex flex-wrap gap-1">
        {subjects.map((s) => (
          <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">{s}</span>
        ))}
      </div>
    </div>
  </div>
);

const ExamViewModal: React.FC<ExamViewModalProps> = ({ exam, onClose }) => {
  if (!exam) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{exam.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{exam.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${statusStyles[exam.status]}`}>
              {exam.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SubjectDetail icon={<BookOpen size={16} />} label="Subjects" subjects={exam.subjects} />
            <Detail icon={<Hash size={16} />} label="Class" value={exam.class} />
            <Detail icon={<Calendar size={16} />} label="Date" value={exam.date} />
            <Detail icon={<Clock size={16} />} label="Time" value={exam.time} />
            <Detail icon={<Timer size={16} />} label="Duration" value={exam.duration} />
            <Detail icon={<Award size={16} />} label="Total Marks" value={exam.totalMarks} />
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 font-bold text-slate-500 hover:bg-gray-50 rounded-xl border border-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamViewModal;
