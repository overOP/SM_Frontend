import React from "react";
import { X } from "lucide-react";

interface ClassFormData {
  name: string;
  room: string;
  teacher: string;
  students: number;
  subjects: string;
  color: string;
}

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ClassFormData;
  setFormData: (data: ClassFormData) => void;
  onSave: (e: React.FormEvent) => void;
  editingClass: any; // You can type this properly later
}

const ClassFormModal: React.FC<ClassFormModalProps> = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSave,
  editingClass,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {editingClass ? "Edit Class Details" : "Add New Class"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSave} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Class Name</label>
              <input
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Room No.</label>
              <input
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Class Teacher</label>
            <input
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none"
              value={formData.teacher}
              onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Student Count</label>
              <input
                type="number"
                className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                value={formData.students}
                onChange={(e) => setFormData({ ...formData, students: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Theme Color</label>
              <select
                className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              >
                <option value="border-blue-500">Blue</option>
                <option value="border-teal-400">Teal</option>
                <option value="border-green-500">Green</option>
                <option value="border-purple-500">Purple</option>
                <option value="border-orange-500">Orange</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Subjects (comma separated)</label>
            <textarea
              rows={2}
              className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none"
              placeholder="Math, Science, English..."
              value={formData.subjects}
              onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassFormModal;