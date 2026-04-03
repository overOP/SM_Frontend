import { Plus, BookOpen } from "lucide-react";

import ExamCard from "../Cards/ExamCard";
import ExamFormModal from "../Modals/ExamFormModal";
import ExamViewModal from "../Modals/ExamViewModal";
import { useExamManagement } from "../utils/useExamManagement";

const AdminExamData = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedClass,
    setSelectedClass,
    isAddModalOpen,
    setIsAddModalOpen,
    viewExam,
    setViewExam,
    activeMenu,
    setActiveMenu,
    formData,
    setFormData,
    classOptions,
    filteredExams,
    handleAdd,
    handleDelete,
    handleViewExam,
  } = useExamManagement();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
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
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
        >
          <Plus size={18} /> Add Exam
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
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
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredExams.length > 0 ? (
                filteredExams.map((exam) => (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                    activeMenu={activeMenu}
                    onMenuToggle={(id) => setActiveMenu(activeMenu === id ? null : id)}
                    onView={handleViewExam}
                    onDelete={handleDelete}
                  />
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

      <ExamViewModal
        exam={viewExam}
        onClose={() => setViewExam(null)}
      />

      <ExamFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAdd}
      />
    </div>
  );
};

export default AdminExamData;
