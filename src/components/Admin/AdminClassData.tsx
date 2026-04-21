import React, { useMemo, useState } from "react";
import { 
  MoreHorizontal, 
  Users, 
  BookOpen, 
  Search,
  Plus, 
  DoorOpen, 
  UserCircle, 
  Layers,
  School,
  AlertTriangle,
} from "lucide-react";

// Importing UI Library
import { 
  Card, 
  Button, 
  StatusBadge, 
  Input, 
  Select, 
  
} from "../ui";
import { Modal } from "../ui/Modal";
import { AdminKpiRow } from "./shared/AdminKpiRow";
import { AdminSectionToolbar } from "./shared/AdminSectionToolbar";

interface ClassEntry {
  id: number;
  name: string;
  room: string;
  teacher: string;
  initials: string;
  students: number;
  subjectsCount: number;
  subjects: string[];
  accentColor: string;
  grade: string;
}

const initialClassData: ClassEntry[] = [
  { id: 1, name: "Class 10A", room: "101", teacher: "Dr. Sarah Johnson", initials: "DSJ", students: 35, subjectsCount: 5, subjects: ["Mathematics", "Physics", "Chemistry"], accentColor: "border-t-blue-500", grade: "Grade 10" },
  { id: 2, name: "Class 10B", room: "102", teacher: "Prof. Michael Chen", initials: "PMC", students: 32, subjectsCount: 5, subjects: ["Mathematics", "Physics", "Chemistry"], accentColor: "border-t-blue-500", grade: "Grade 10" },
  { id: 3, name: "Class 9A", room: "103", teacher: "Ms. Emily Davis", initials: "MED", students: 38, subjectsCount: 5, subjects: ["Mathematics", "Physics", "English"], accentColor: "border-t-purple-500", grade: "Grade 9" },
  { id: 4, name: "Class 9B", room: "104", teacher: "Mr. Robert Wilson", initials: "MRW", students: 36, subjectsCount: 5, subjects: ["Mathematics", "Physics", "English"], accentColor: "border-t-purple-500", grade: "Grade 9" },
  { id: 5, name: "Class 8A", room: "105", teacher: "Dr. Lisa Anderson", initials: "DLA", students: 40, subjectsCount: 5, subjects: ["Science", "English", "Social Studies"], accentColor: "border-t-green-500", grade: "Grade 8" },
];

const AdminClassData: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classes, setClasses] = useState<ClassEntry[]>(initialClassData);
  const [formData, setFormData] = useState({
    name: "",
    grade: "Grade 10",
    room: "",
    teacher: "",
    subjects: ""
  });

  const grades = ["All Grades", "Grade 10", "Grade 9", "Grade 8"];
  const formGrades = ["Grade 10", "Grade 9", "Grade 8", "Grade 7"];

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedSubjects = formData.subjects
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const newClass: ClassEntry = {
      id: Date.now(),
      name: formData.name,
      grade: formData.grade,
      room: formData.room,
      teacher: formData.teacher,
      initials: formData.teacher.split(' ').map(n => n[0]).join('').toUpperCase(),
      students: 0,
      subjectsCount: parsedSubjects.length,
      subjects: parsedSubjects,
      accentColor: formData.grade === "Grade 10" ? "border-t-blue-500" : "border-t-purple-500"
    };

    setClasses([newClass, ...classes]);
    setIsModalOpen(false);
    setFormData({ name: "", grade: "Grade 10", room: "", teacher: "", subjects: "" });
  };

  const filteredClasses = useMemo(
    () =>
      classes.filter((cls) => {
        const q = searchTerm.trim().toLowerCase();
        const matchesSearch =
          q.length === 0 ||
          cls.name.toLowerCase().includes(q) ||
          cls.teacher.toLowerCase().includes(q) ||
          cls.room.toLowerCase().includes(q);
        const matchesGrade = selectedGrade === "All Grades" || cls.grade === selectedGrade;
        return matchesSearch && matchesGrade;
      }),
    [classes, searchTerm, selectedGrade]
  );

  const stats = useMemo(() => {
    const totalStudents = classes.reduce((acc, c) => acc + c.students, 0);
    const avgClassSize = classes.length ? Math.round(totalStudents / classes.length) : 0;
    const overloaded = classes.filter((c) => c.students > 38).length;
    const totalSubjects = classes.reduce((acc, c) => acc + c.subjectsCount, 0);
    return { totalStudents, avgClassSize, overloaded, totalSubjects };
  }, [classes]);

  const kpiItems = [
    {
      title: "Total Sections",
      value: classes.length,
      icon: School,
      colorClass: "text-blue-600",
      bgClass: "bg-blue-50",
    },
    {
      title: "Students Allocated",
      value: stats.totalStudents,
      icon: Users,
      colorClass: "text-emerald-600",
      bgClass: "bg-emerald-50",
    },
    {
      title: "Avg Class Size",
      value: stats.avgClassSize,
      icon: Layers,
      colorClass: "text-violet-600",
      bgClass: "bg-violet-50",
    },
    {
      title: "Overloaded (>38)",
      value: stats.overloaded,
      icon: AlertTriangle,
      colorClass: "text-amber-600",
      bgClass: "bg-amber-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 font-sans text-slate-700">
      <AdminKpiRow items={kpiItems} />
      
      <AdminSectionToolbar
        title="Class Management"
        description={`Monitoring ${filteredClasses.length} sections · ${stats.totalSubjects} subject allocations`}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by class, teacher, or room..."
        filters={
          <Select 
            options={grades} 
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="w-full md:w-48"
          />
        }
        actions={
          <Button 
            variant="primary" 
            className="gap-2 shadow-blue-200 shadow-lg"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4" /> Add New Class
          </Button>
        }
      />

      {/* Grid */}
      {filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => (
            <Card 
              key={cls.id} 
              className={`border-t-8 ${cls.accentColor} hover:shadow-xl transition-all duration-300 group relative`}
            >
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {cls.name}
                  </h2>
                  <div className="flex gap-2 items-center mt-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Room {cls.room}
                    </span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                      {cls.grade}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full text-slate-400">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>

              {/* Teacher Info */}
              <div className="flex items-center gap-3 my-6 p-3 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 font-bold text-xs border border-slate-100 shadow-sm">
                  {cls.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 leading-tight">{cls.teacher}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Class Teacher</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold text-slate-600">{cls.students} Students</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <BookOpen className="w-4 h-4 text-purple-500" />
                  <span className="text-xs font-bold text-slate-600">{cls.subjectsCount} Subjects</span>
                </div>
              </div>

              {/* Subjects List */}
              <div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">Core Subjects</p>
                <div className="flex flex-wrap gap-2">
                  {cls.subjects.slice(0, 3).map((sub, idx) => (
                    <StatusBadge key={idx} status={sub} variant="default" />
                  ))}
                  {cls.subjects.length > 3 && (
                    <StatusBadge status={`+${cls.subjects.length - 3} More`} variant="info" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-24 text-center">
          <div className="bg-slate-100 p-4 rounded-2xl mb-4 text-slate-300">
            <Search size={48} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No classes found</h3>
          <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">
            Try adjusting your search or filters to find the specific section you're looking for.
          </p>
          <Button 
            variant="outline" 
            className="mt-6" 
            onClick={() => { setSearchTerm(""); setSelectedGrade("All Grades"); }}
          >
            Clear all filters
          </Button>
        </Card>
      )}

      {/* REUSABLE MODAL FOR ADD CLASS */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Class"
      >
        <form onSubmit={handleSaveClass} className="space-y-4">
          <Input 
            label="Class Name"
            placeholder="e.g. Class 11-C"
            icon={Layers}
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Grade Level"
              options={formGrades}
              value={formData.grade}
              onChange={(e) => setFormData({...formData, grade: e.target.value})}
            />
            <Input 
              label="Room Number"
              placeholder="e.g. 402"
              icon={DoorOpen}
              value={formData.room}
              onChange={(e) => setFormData({...formData, room: e.target.value})}
              required
            />
          </div>

          <Input 
            label="Assigned Class Teacher"
            placeholder="Full Name"
            icon={UserCircle}
            value={formData.teacher}
            onChange={(e) => setFormData({...formData, teacher: e.target.value})}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Subjects (Comma separated)</label>
            <textarea 
              rows={2}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              placeholder="Math, Science, English..."
              value={formData.subjects}
              onChange={(e) => setFormData({...formData, subjects: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-50">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="px-10">
              Create Class
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminClassData;