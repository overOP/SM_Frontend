import React from "react";
import { X } from "lucide-react";
import type { ExamFormData, ExamStatus } from "../utils/useExamManagement";
import { ALL_SUBJECTS } from "../utils/useExamManagement";

interface ExamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ExamFormData;
  setFormData: (data: ExamFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ExamFormModal: React.FC<ExamFormModalProps> = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Schedule New Exam</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Exam Name</label>
              <input
                required
                placeholder="e.g. Mid-Term Exam"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Subjects</label>
              <div className="grid grid-cols-2 gap-2">
                {ALL_SUBJECTS.map((subject) => (
                  <label key={subject} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.subjects.includes(subject)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...formData.subjects, subject]
                          : formData.subjects.filter((s) => s !== subject);
                        setFormData({ ...formData, subjects: updated });
                      }}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-sm text-slate-600">{subject}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Class</label>
              <input
                required
                placeholder="e.g. 10A"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Date</label>
              <input
                type="date"
                required
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Time</label>
              <input
                required
                placeholder="e.g. 09:00 AM"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Duration</label>
              <input
                required
                placeholder="e.g. 3 hrs"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Total Marks</label>
              <input
                type="number"
                required
                min={1}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Status</label>
              <select
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ExamStatus })}
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 font-bold text-slate-500 hover:bg-gray-50 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100"
            >
              Schedule Exam
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamFormModal;
