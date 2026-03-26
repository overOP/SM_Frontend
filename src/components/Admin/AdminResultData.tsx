import React, { useState } from "react";
import { 
  Search, 
  Plus, 
   
  Eye, 
  Edit2, 
  Trash2, 
  User, 
  BookOpen, 
  Hash, 
  Award 
} from "lucide-react";

// Importing your UI Library components
import { 
  Button, 
  Input, 
  Select, 
  Card, 
  StatusBadge, 
 
  DataTable 
} from "../ui";
import { Modal } from "../ui/Modal";

// --- Types ---
type ResultStatus = "Pass" | "Fail";

interface Result {
  id: number;
  name: string;
  class: string;
  roll: string;
  subject: string;
  marks: number;
  grade: string;
  status: ResultStatus;
}

// Local interface for the Column definition
interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (row: T, index: number) => React.ReactNode;
}

// --- Utilities ---
const calculateGrade = (marks: number): { grade: string; status: ResultStatus } => {
  if (marks >= 90) return { grade: "A+", status: "Pass" };
  if (marks >= 80) return { grade: "A", status: "Pass" };
  if (marks >= 70) return { grade: "B+", status: "Pass" };
  if (marks >= 60) return { grade: "B", status: "Pass" };
  if (marks >= 40) return { grade: "C", status: "Pass" };
  return { grade: "F", status: "Fail" };
};

const AdminResultData = () => {
  // Data State
  const [results, setResults] = useState<Result[]>([
    { id: 1, name: "Ishan Awasthi", class: "12-B", roll: "205", subject: "Computer Science", marks: 92, grade: "A+", status: "Pass" },
    { id: 2, name: "Sandip Bhatta", class: "12-A", roll: "102", subject: "Mathematics", marks: 88, grade: "A", status: "Pass" },
    { id: 5, name: "Rohan Mehta", class: "12-B", roll: "208", subject: "Computer Science", marks: 35, grade: "F", status: "Fail" },
  ]);

  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Result | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("All Classes");

  // Form State
  const [formData, setFormData] = useState({
    name: "", class: "", roll: "", subject: "", marks: ""
  });

  // --- Handlers ---
  const handleOpenForm = (student: Result | null = null) => {
    if (student) {
      setSelectedStudent(student);
      setFormData({
        name: student.name,
        class: student.class,
        roll: student.roll,
        subject: student.subject,
        marks: String(student.marks),
      });
    } else {
      setSelectedStudent(null);
      setFormData({ name: "", class: "", roll: "", subject: "", marks: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const m = parseInt(formData.marks);
    const { grade, status } = calculateGrade(m);

    if (selectedStudent) {
      setResults(results.map((item) =>
        item.id === selectedStudent.id
          ? { ...item, ...formData, marks: m, grade, status }
          : item
      ));
    } else {
      const newEntry: Result = {
        ...formData,
        id: Date.now(),
        marks: m,
        grade,
        status
      };
      setResults([newEntry, ...results]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this result?")) {
      setResults(results.filter((item) => item.id !== id));
    }
  };

  const filteredResults = results.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.roll.includes(searchQuery);
    const matchesClass = filterClass === "All Classes" || item.class.startsWith(filterClass);
    return matchesSearch && matchesClass;
  });

  // --- Column Definitions ---
  const columns: Column<Result>[] = [
    {
      header: "Student",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
            <User size={14} />
          </div>
          <span className="font-bold text-slate-800">{row.name}</span>
        </div>
      )
    },
    { header: "Roll No.", accessor: "roll" },
    { 
        header: "Class", 
        render: (row) => <StatusBadge status={row.class} variant="default" /> 
    },
    { header: "Subject", accessor: "subject" },
    { 
      header: "Marks", 
      render: (row) => <span className="font-black text-slate-700">{row.marks}</span> 
    },
    { 
      header: "Grade", 
      render: (row) => (
        <span className={`px-2 py-1 rounded-md text-[10px] font-black border ${
          row.status === "Pass" ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-rose-50 border-rose-100 text-rose-600"
        }`}>
          {row.grade}
        </span>
      )
    },
    { 
      header: "Status", 
      render: (row) => (
        <StatusBadge 
          status={row.status} 
          variant={row.status === "Pass" ? "success" : "danger"} 
        />
      )
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => { setSelectedStudent(row); setIsViewModalOpen(true); }}>
            <Eye size={14} className="text-slate-400" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleOpenForm(row)}>
            <Edit2 size={14} className="text-blue-500" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)}>
            <Trash2 size={14} className="text-rose-500" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Examination Results</h1>
          <p className="text-sm text-slate-400 font-medium">Manage and monitor student academic performance</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Input 
            placeholder="Search by name or roll..." 
            icon={Search} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select 
            options={["All Classes", "12", "11", "10"]} 
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="w-full sm:w-40"
          />
          <Button variant="primary" onClick={() => handleOpenForm()} className="w-full sm:w-auto gap-2 shadow-lg shadow-blue-100">
            <Plus size={18} /> Add Result
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card noPadding className="border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
        <DataTable 
          columns={columns} 
          data={filteredResults} 
          emptyMessage="No examination records found matching your filters."
        />
      </Card>

      {/* Enrollment/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedStudent ? "Update Result Record" : "New Examination Entry"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input 
            label="Student Full Name" 
            icon={User} 
            placeholder="e.g. Ishan Awasthi"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Class" 
              icon={Award}
              placeholder="12-B"
              value={formData.class}
              onChange={(e) => setFormData({...formData, class: e.target.value})}
              required
            />
            <Input 
              label="Roll Number" 
              icon={Hash}
              placeholder="205"
              value={formData.roll}
              onChange={(e) => setFormData({...formData, roll: e.target.value})}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Subject" 
              icon={BookOpen}
              placeholder="Mathematics"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              required
            />
            <Input 
              label="Obtained Marks" 
              type="number"
              icon={Award}
              placeholder="0-100"
              value={formData.marks}
              onChange={(e) => setFormData({...formData, marks: e.target.value})}
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-50">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Discard
            </Button>
            <Button variant="primary" type="submit" className="px-10">
              {selectedStudent ? "Update Record" : "Save Entry"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Detail View Modal */}
      {selectedStudent && (
        <Modal 
            isOpen={isViewModalOpen} 
            onClose={() => setIsViewModalOpen(false)} 
            title="Student Performance Profile"
        >
            <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-blue-100">
                        {selectedStudent.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 leading-none">{selectedStudent.name}</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Roll: {selectedStudent.roll} • Class {selectedStudent.class}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-slate-100 rounded-2xl bg-white">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Subject</p>
                        <p className="font-bold text-slate-700">{selectedStudent.subject}</p>
                    </div>
                    <div className="p-4 border border-slate-100 rounded-2xl bg-white">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Score</p>
                        <p className="font-black text-blue-600 text-lg">{selectedStudent.marks}/100</p>
                    </div>
                </div>

                <div className={`p-4 rounded-2xl flex items-center justify-between ${selectedStudent.status === "Pass" ? "bg-emerald-50 border border-emerald-100" : "bg-rose-50 border border-rose-100"}`}>
                   <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${selectedStudent.status === "Pass" ? "text-emerald-600" : "text-rose-600"}`}>Final Grade</p>
                        <p className={`text-2xl font-black ${selectedStudent.status === "Pass" ? "text-emerald-700" : "text-rose-700"}`}>{selectedStudent.grade}</p>
                   </div>
                   <StatusBadge status={selectedStudent.status} variant={selectedStudent.status === "Pass" ? "success" : "danger"} />
                </div>

                <Button variant="outline" onClick={() => setIsViewModalOpen(false)} className="w-full">
                    Close Profile
                </Button>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminResultData;