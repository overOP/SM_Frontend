import { Plus, GraduationCap } from "lucide-react";
import StudentCard from "./StudentCard";
import StudentFilters from "./StudentFilters";
import StudentViewModal from "./StudentViewModal";
import StudentFormModal from "./StudentFormModal";
import { useStudentManagement } from "./useStudentManagement";

const AdminStudentData = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedClass,
    setSelectedClass,
    isAddModalOpen,
    setIsAddModalOpen,
    viewStudent,
    setViewStudent,
    activeMenu,
    setActiveMenu,
    formData,
    setFormData,
    classOptions,
    filteredStudents,
    handleAdd,
    handleDelete,
    handleExport,
    handleViewStudent,
    handleAddNew,
  } = useStudentManagement();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <StudentFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedClass={selectedClass}
          onClassChange={setSelectedClass}
          classOptions={classOptions}
          onExport={handleExport}
        />
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
        >
          <Plus size={18} /> Add Student
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-600">
            {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Roll No.</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Class</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Guardian</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Attendance</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    activeMenu={activeMenu}
                    onMenuToggle={(id) => setActiveMenu(activeMenu === id ? null : id)}
                    onView={handleViewStudent}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <GraduationCap className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                    <p className="text-sm text-gray-400 font-medium">No students found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StudentViewModal
        student={viewStudent}
        onClose={() => setViewStudent(null)}
      />

      <StudentFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAdd}
      />
    </div>
  );
};

export default AdminStudentData;
