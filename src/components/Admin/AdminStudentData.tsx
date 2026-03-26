import React, { useState } from "react";
import { 
  Search, 
  Plus, 
  Download, 
  MoreHorizontal, 
  UserPlus, 
  Mail, 
  GraduationCap, 
  ShieldCheck,
  Users
} from "lucide-react";

// Importing UI Library
import { 
  Button, 
  Card, 
  Input, 
  Select, 
  StatusBadge, 

  StatCard,
  DataTable 
} from "../ui";
import { Modal } from "../ui/Modal";

// Define the Column type locally to resolve the 'accessor' requirement error
interface Column<T> {
  header: string;
  accessor?: keyof T; // Optional: for simple data access
  render?: (row: T, index: number) => React.ReactNode; // For custom UI like avatars/badges
}

type StudentStatus = "active" | "inactive";

interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  guardian: string;
  attendance: string;
  status: StudentStatus;
  initials: string;
}

const initialStudents: Student[] = [
  { id: "STU001", name: "Alex Thompson", email: "alex.thompson@school.edu", class: "10A", guardian: "John Thompson", attendance: "96%", status: "active", initials: "AT" },
  { id: "STU002", name: "Emma Watson", email: "emma.watson@school.edu", class: "10A", guardian: "Mary Watson", attendance: "94%", status: "active", initials: "EW" },
  { id: "STU003", name: "James Miller", email: "james.miller@school.edu", class: "9B", guardian: "Robert Miller", attendance: "88%", status: "active", initials: "JM" },
  { id: "STU004", name: "Sophie Brown", email: "sophie.brown@school.edu", class: "8A", guardian: "David Brown", attendance: "92%", status: "active", initials: "SB" },
];

const AdminStudentData: React.FC = () => {
  // UI Logic States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Data State
  const [students, setStudents] = useState<Student[]>(initialStudents);

  // Form State
  const initialFormState = {
    name: "",
    email: "",
    class: "10A",
    guardian: "",
    attendance: "100%"
  };
  const [formData, setFormData] = useState(initialFormState);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: `STU00${students.length + 1}`,
      ...formData,
      status: "active",
      initials: formData.name.split(' ').map(n => n[0]).join('').toUpperCase()
    };
    
    setStudents([newStudent, ...students]);
    setIsModalOpen(false);
    setFormData(initialFormState);
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === "All Classes" || s.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  // Column definitions using our updated 'Column' interface
  const columns: Column<Student>[] = [
    {
      header: "Student",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100">
            {row.initials}
          </div>
          <div>
            <p className="font-bold text-slate-800 leading-none">{row.name}</p>
            <p className="text-[11px] text-slate-400 mt-1">{row.email}</p>
          </div>
        </div>
      )
    },
    { 
      header: "Roll No.", 
      accessor: "id" // Simple accessor
    },
    { 
      header: "Class", 
      render: (row) => <StatusBadge status={row.class} variant="default" /> 
    },
    { 
      header: "Guardian", 
      accessor: "guardian" 
    },
    { 
      header: "Attendance", 
      render: (row) => (
        <span className={`font-bold ${parseInt(row.attendance) > 90 ? "text-emerald-500" : "text-amber-500"}`}>
          {row.attendance}
        </span>
      )
    },
    { 
      header: "Status", 
      render: (row) => <StatusBadge status={row.status} variant="success" /> 
    },
    {
      header: "",
      render: () => (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" className="p-0 h-8 w-8 rounded-full">
            <MoreHorizontal size={16} className="text-slate-400" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen font-sans">
      
      {/* 1. Stats Overview Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Students" value={students.length.toString()} icon={Users} colorClass="text-blue-600" bgClass="bg-blue-50" />
        <StatCard title="Active Status" value="98%" icon={ShieldCheck} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
        <StatCard title="Avg Attendance" value="92.4%" icon={GraduationCap} colorClass="text-purple-600" bgClass="bg-purple-50" />
        <StatCard title="Term Admissions" value="14" trend={12} icon={UserPlus} colorClass="text-amber-600" bgClass="bg-amber-50" />
      </div>

      {/* 2. Control Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <Input 
            placeholder="Search by name or roll number..." 
            icon={Search} 
            className="max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select 
            options={["All Classes", "10A", "10B", "9B", "8A"]} 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="sm:w-48"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download size={16} /> Export
          </Button>
          <Button variant="primary" className="gap-2 shadow-lg shadow-blue-100" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add Student
          </Button>
        </div>
      </div>

      {/* 3. Data Table */}
      <Card noPadding className="border-none shadow-sm overflow-hidden bg-white">
        <DataTable 
          columns={columns} 
          data={filteredStudents} 
          emptyMessage="No students found matching your search criteria."
        />
      </Card>

      {/* 4. Enrollment Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Student Enrollment"
      >
        <form onSubmit={handleAddStudent} className="space-y-4">
          <Input 
            label="Full Name" 
            placeholder="e.g. John Doe" 
            icon={UserPlus} 
            required 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="john.doe@school.edu" 
            icon={Mail} 
            required 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Assign Class" 
              options={["10A", "10B", "9A", "9B", "8A"]} 
              value={formData.class}
              onChange={(e) => setFormData({...formData, class: e.target.value})}
            />
            <Input 
              label="Guardian Name" 
              placeholder="Parent/Guardian" 
              required 
              value={formData.guardian}
              onChange={(e) => setFormData({...formData, guardian: e.target.value})}
            />
          </div>
          
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-50">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Discard
            </Button>
            <Button variant="primary" type="submit" className="px-10">
              Complete Enrollment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminStudentData;