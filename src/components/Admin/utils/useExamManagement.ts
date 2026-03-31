import { useState, type FormEvent } from "react";
import { useExamContext } from "../../../context/ExamContext";

// Re-export types so existing imports from this file continue to work
export type { Exam, ExamFormData, ExamStatus } from "../../../context/ExamContext";
export { ALL_SUBJECTS } from "../../../context/ExamContext";

import type { ExamFormData, Exam } from "../../../context/ExamContext";

const emptyForm: ExamFormData = {
  name: "",
  subjects: [],
  class: "",
  date: "",
  time: "",
  duration: "",
  totalMarks: 100,
  status: "upcoming",
};

export const useExamManagement = () => {
  const { exams, addExam, deleteExam } = useExamContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewExam, setViewExam] = useState<Exam | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExamFormData>(emptyForm);

  const classOptions = ["All Classes", ...Array.from(new Set(exams.map((e) => e.class))).sort()];

  const filteredExams = exams.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.subjects.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      e.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = selectedClass === "All Classes" || e.class === selectedClass;
    return matchSearch && matchClass;
  });

  const handleAdd = (ev: FormEvent) => {
    ev.preventDefault();
    addExam(formData);
    setIsAddModalOpen(false);
    setFormData(emptyForm);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      deleteExam(id);
    }
    setActiveMenu(null);
  };

  const handleViewExam = (exam: Exam) => {
    setViewExam(exam);
    setActiveMenu(null);
  };

  return {
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
  };
};
