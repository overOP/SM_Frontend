import { useState } from "react";
import { getInitials } from "../../../utils/format";
import { exportToExcel } from "../../../utils/excel";

type StudentStatus = "active" | "inactive";

interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  guardian: string;
  guardianPhone: string;
  attendance: string;
  status: StudentStatus;
  initials: string;
}

interface StudentFormData {
  name: string;
  email: string;
  class: string;
  guardian: string;
  guardianPhone: string;
  attendance: string;
  status: StudentStatus;
}

const initialStudents: Student[] = [
  { id: "STU001", name: "Alex Thompson", email: "alex.thompson@school.edu", class: "10A", guardian: "John Thompson", guardianPhone: "+91 98765 43210", attendance: "96%", status: "active", initials: "AT" },
  { id: "STU002", name: "Emma Watson", email: "emma.watson@school.edu", class: "10A", guardian: "Mary Watson", guardianPhone: "+91 99887 76655", attendance: "94%", status: "active", initials: "EW" },
  { id: "STU003", name: "James Miller", email: "james.miller@school.edu", class: "9B", guardian: "Robert Miller", guardianPhone: "+91 91122 33445", attendance: "88%", status: "active", initials: "JM" },
  { id: "STU004", name: "Sophie Brown", email: "sophie.brown@school.edu", class: "8A", guardian: "David Brown", guardianPhone: "+91 90000 11223", attendance: "92%", status: "active", initials: "SB" },
  { id: "STU005", name: "Liam Neeson", email: "liam.n@school.edu", class: "9B", guardian: "Sue Neeson", guardianPhone: "+91 94455 66778", attendance: "90%", status: "inactive", initials: "LN" },
];

export const useStudentManagement = () => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const [formData, setFormData] = useState<StudentFormData>({
    name: "", email: "", class: "", guardian: "",
    guardianPhone: "", attendance: "100%", status: "active",
  });

  const classOptions = ["All Classes", ...Array.from(new Set(students.map((s) => s.class))).sort()];

  const filteredStudents = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = selectedClass === "All Classes" || s.class === selectedClass;
    return matchSearch && matchClass;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = getInitials(formData.name);
    const newStudent: Student = {
      ...formData,
      id: `STU${Math.floor(100 + Math.random() * 900)}`,
      initials,
    };
    setStudents([newStudent, ...students]);
    setIsAddModalOpen(false);
    setFormData({ name: "", email: "", class: "", guardian: "", guardianPhone: "", attendance: "100%", status: "active" });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to remove this student?")) {
      setStudents(students.filter((s) => s.id !== id));
    }
    setActiveMenu(null);
  };

  const handleExport = () => {
    const data = filteredStudents.map((s, i) => ({
      "S.No": i + 1,
      "Student ID": s.id,
      "Full Name": s.name,
      "Email": s.email,
      "Class": s.class,
      "Guardian Name": s.guardian,
      "Guardian Phone": s.guardianPhone,
      "Attendance": s.attendance,
      "Status": s.status,
    }));
    exportToExcel(data, "Students", `Students_${selectedClass}_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const handleViewStudent = (student: Student) => {
    setViewStudent(student);
    setActiveMenu(null);
  };

  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  return {
    students,
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
  };
};