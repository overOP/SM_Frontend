import { useState, useEffect } from "react";
import { getInitials } from "../../../utils/format";

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

interface ClassFormData {
  name: string;
  room: string;
  teacher: string;
  students: number;
  subjects: string;
  color: string;
}

const initialClassData: ClassEntry[] = [
  { id: 1, name: "Class 10A", room: "101", teacher: "Dr. Sarah Johnson", initials: "DSJ", students: 35, subjectsCount: 5, subjects: ["Mathematics", "Physics", "Chemistry", "English"], color: "border-blue-500" },
  { id: 2, name: "Class 10B", room: "102", teacher: "Prof. Michael Chen", initials: "PMC", students: 32, subjectsCount: 5, subjects: ["Mathematics", "Physics", "Chemistry", "English"], color: "border-blue-500" },
  { id: 3, name: "Class 9A", room: "103", teacher: "Ms. Emily Davis", initials: "MED", students: 38, subjectsCount: 5, subjects: ["Mathematics", "Physics", "Chemistry", "English"], color: "border-blue-500" },
];

export const useClassManagement = () => {
  const [classes, setClasses] = useState<ClassEntry[]>(initialClassData);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassEntry | null>(null);

  const [formData, setFormData] = useState<ClassFormData>({
    name: "",
    room: "",
    teacher: "",
    students: 0,
    subjects: "",
    color: "border-blue-500"
  });

  // Close menu on outside click
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenu(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleOpenEdit = (cls: ClassEntry) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      room: cls.room,
      teacher: cls.teacher,
      students: cls.students,
      subjects: cls.subjects.join(", "),
      color: cls.color
    });
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      setClasses(classes.filter((c) => c.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectList = formData.subjects.split(",").map(s => s.trim()).filter(s => s !== "");
    const initials = getInitials(formData.teacher);

    if (editingClass) {
      setClasses(classes.map(c =>
        c.id === editingClass.id
          ? { ...c, ...formData, subjects: subjectList, initials, subjectsCount: subjectList.length }
          : c
      ));
    } else {
      const newClass: ClassEntry = {
        id: Date.now(),
        ...formData,
        subjects: subjectList,
        subjectsCount: subjectList.length,
        initials
      };
      setClasses([...classes, newClass]);
    }
    setIsModalOpen(false);
  };

  const handleAddNew = () => {
    setEditingClass(null);
    setFormData({ name: "", room: "", teacher: "", students: 0, subjects: "", color: "border-blue-500" });
    setIsModalOpen(true);
  };

  return {
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
  };
};