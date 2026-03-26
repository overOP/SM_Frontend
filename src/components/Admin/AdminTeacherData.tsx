import React, { useState } from "react";
import { 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  BookOpen, 
  MoreHorizontal,
  UserPlus,
  Hash,
  AtSign,
  Smartphone,
  
} from "lucide-react";

// Importing UI Library
import { 
  Button, 
  Card, 
  Input, 
  Select, 
  StatusBadge, 
  
} from "../ui";
import { Modal } from "../ui/Modal";

type TeacherStatus = "Active" | "On Leave";

interface Teacher {
  id: number;
  name: string;
  initials: string;
  status: TeacherStatus;
  subject: string;
  email: string;
  phone: string;
  classes: string[];
}

const initialTeachers: Teacher[] = [
  { id: 1, name: "Dr. Sarah Johnson", initials: "DSJ", status: "Active", subject: "Mathematics", email: "sarah.johnson@school.edu", phone: "+1 234 567 8901", classes: ["10A", "10B", "9A"] },
  { id: 2, name: "Prof. Michael Chen", initials: "PMC", status: "Active", subject: "Physics", email: "michael.chen@school.edu", phone: "+1 234 567 8902", classes: ["10A", "9B", "8A"] },
  { id: 3, name: "Ms. Emily Davis", initials: "MED", status: "Active", subject: "English", email: "emily.davis@school.edu", phone: "+1 234 567 8903", classes: ["8A", "8B", "7A"] },
  { id: 4, name: "Mr. Robert Wilson", initials: "MRW", status: "On Leave", subject: "Chemistry", email: "robert.wilson@school.edu", phone: "+1 234 567 8904", classes: [] },
  { id: 5, name: "Dr. Lisa Anderson", initials: "DLA", status: "Active", subject: "Biology", email: "lisa.anderson@school.edu", phone: "+1 234 567 8905", classes: [] },
];

const AdminTeacherData: React.FC = () => {
  // UI Logic States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Data State
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);

  // Form State
  const initialFormState = {
    name: "",
    subject: "Mathematics",
    email: "",
    phone: "",
    status: "Active" as TeacherStatus,
    classes: ""
  };
  const [formData, setFormData] = useState(initialFormState);

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTeacher: Teacher = {
      id: Date.now(),
      name: formData.name,
      initials: formData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      status: formData.status,
      subject: formData.subject,
      email: formData.email,
      phone: formData.phone,
      classes: formData.classes ? formData.classes.split(',').map(c => c.trim()) : []
    };

    setTeachers([newTeacher, ...teachers]);
    setIsModalOpen(false);
    setFormData(initialFormState);
  };

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All Status" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen font-sans text-slate-700">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Faculty Directory</h1>
          <p className="text-sm text-slate-400 font-medium">Managing {teachers.length} staff members</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search by name or subject..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select
            options={["All Status", "Active", "On Leave"]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-44"
          />

          <Button 
            variant="primary" 
            className="w-full sm:w-auto gap-2 shadow-lg shadow-blue-100"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} /> Add Teacher
          </Button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} className="hover:shadow-xl hover:border-blue-100 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-sm border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  {teacher.initials}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                    {teacher.name}
                  </h3>
                  <div className="mt-1">
                    <StatusBadge 
                      status={teacher.status} 
                      variant={teacher.status === "Active" ? "success" : "warning"} 
                    />
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full text-slate-300">
                <MoreHorizontal size={20} />
              </Button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400"><BookOpen size={14} /></div>
                <span>{teacher.subject}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400"><Mail size={14} /></div>
                <span className="truncate">{teacher.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400"><Phone size={14} /></div>
                <span>{teacher.phone}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50">
              <p className="text-[10px] font-black text-slate-300 mb-3 uppercase tracking-widest">Active Schedule</p>
              <div className="flex flex-wrap gap-2">
                {teacher.classes.length > 0 ? (
                  teacher.classes.map((cls) => (
                    <span key={cls} className="bg-slate-50 text-slate-600 px-3 py-1 rounded-lg text-[11px] font-bold border border-slate-100 hover:bg-white hover:border-blue-200 transition-colors cursor-default">
                      Class {cls}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-300 italic">No assigned classes</span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Teacher Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Register New Faculty"
      >
        <form onSubmit={handleSaveTeacher} className="space-y-4">
          <Input 
            label="Full Name"
            placeholder="e.g. Dr. Robert House"
            icon={UserPlus}
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Primary Subject"
              options={["Mathematics", "Physics", "Chemistry", "Biology", "English", "History"]}
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
            />
            <Select 
              label="Current Status"
              options={["Active", "On Leave"]}
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as TeacherStatus})}
            />
          </div>

          <Input 
            label="Official Email"
            type="email"
            placeholder="name@school.edu"
            icon={AtSign}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />

          <Input 
            label="Phone Number"
            placeholder="+1 000 000 0000"
            icon={Smartphone}
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />

          <Input 
            label="Assigned Classes (Comma separated)"
            placeholder="10A, 9B, 8C"
            icon={Hash}
            value={formData.classes}
            onChange={(e) => setFormData({...formData, classes: e.target.value})}
          />

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-50">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Discard
            </Button>
            <Button variant="primary" type="submit" className="px-10">
              Register Teacher
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminTeacherData;