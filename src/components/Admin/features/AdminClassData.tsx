import { Plus } from "lucide-react";
import ClassCard from "./ClassCard";
import ClassFormModal from "./ClassFormModal";
import { useClassManagement } from "./useClassManagement";

const AdminClassData = () => {
  const {
    classes,
    activeMenu,
    setActiveMenu,
    isModalOpen,
    setIsModalOpen,
    editingClass,
    formData,
    setFormData,
    handleOpenEdit,
    handleDelete,
    handleSave,
    handleAddNew,
  } = useClassManagement();

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-700">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Class Management</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={18} /> Add Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <ClassCard
            key={cls.id}
            cls={cls}
            activeMenu={activeMenu}
            onMenuToggle={(id) => setActiveMenu(activeMenu === id ? null : id)}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <ClassFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        editingClass={editingClass}
      />
    </div>
  );
};

export default AdminClassData;