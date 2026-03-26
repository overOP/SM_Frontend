import React, { useState } from "react";
import {
  ChevronLeft, ChevronRight,
  Download, Save, CheckCircle2, XCircle, Clock, User
} from "lucide-react";

import { 
  Button, 
  Select, 
  Card, 
  StatCard, 
  DataTable, 
  StatusBadge,
  Input
} from "../ui"; 
type AttendanceStatus = "Present" | "Absent" | "On Leave";

interface Student {
  id: number;
  name: string;
  roll: string;
  status: AttendanceStatus;
  initials: string;
  color: string;
}

const AdminAttendanceData: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState("Class 10A");
  const classes = ["Class 10A", "Class 10B", "Class 9A", "Class 9B", "Class 8A"];

  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Alex Thompson", roll: "STU001", status: "Present", initials: "AT", color: "bg-blue-100 text-blue-600" },
    { id: 2, name: "Emma Watson", roll: "STU002", status: "Present", initials: "EW", color: "bg-purple-100 text-purple-600" },
    { id: 3, name: "John Doe", roll: "STU003", status: "Absent", initials: "JD", color: "bg-emerald-100 text-emerald-600" },
  ]);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  
  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", { 
    weekday: "short", month: "short", day: "numeric", year: "numeric" 
  });

  // Date Handlers
  const handlePrevDate = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setSelectedDate(prevDate.toISOString().split("T")[0]);
  };

  const handleNextDate = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setSelectedDate(nextDate.toISOString().split("T")[0]);
  };

  const updateStatus = (id: number, status: AttendanceStatus) => {
    setStudents((prev) => prev.map((s) => s.id === id ? { ...s, status } : s));
  };

  const columns = [
    { 
      header: "#", 
      accessor: "id" as keyof Student,
      render: (_: Student, index: number) => (
        <span className="text-xs font-bold text-slate-300">{index + 1}</span>
      )
    },
    { 
      header: "Student", 
      accessor: "name" as keyof Student,
      render: (student: Student) => (
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shadow-sm ${student.color}`}>
            {student.initials}
          </div>
          <span className="text-sm font-bold text-slate-700">{student.name}</span>
        </div>
      )
    },
    { header: "Roll No.", accessor: "roll" as keyof Student },
    { 
      header: "Status", 
      accessor: "status" as keyof Student,
      render: (student: Student) => {
        const variantMap: Record<AttendanceStatus, "success" | "danger" | "warning"> = {
          "Present": "success",
          "Absent": "danger",
          "On Leave": "warning"
        };
        return <StatusBadge status={student.status} variant={variantMap[student.status]} />;
      }
    },
    {
      header: "Actions",
      accessor: "id" as keyof Student,
      render: (student: Student) => (
        <div className="flex justify-end gap-2">
          <Button onClick={() => updateStatus(student.id, "Present")} className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all active:scale-90">
            <CheckCircle2 className="w-4 h-4" />
          </Button>
          <Button onClick={() => updateStatus(student.id, "Absent")} className="p-2 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-rose-500 transition-all active:scale-90">
            <XCircle className="w-4 h-4" />
          </Button>
          <Button onClick={() => updateStatus(student.id, "On Leave")} className="p-2 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-orange-500 transition-all active:scale-90">
            <Clock className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 bg-slate-50 min-h-screen">
      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          <Select 
            options={classes} 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)} 
            className="sm:min-w-[180px]"
          />

          <div className="flex items-center bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <Button variant="ghost" size="sm" onClick={handlePrevDate}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border-none focus:ring-0 w-36 text-center font-semibold bg-transparent" 
            />

            <Button variant="ghost" size="sm" onClick={handleNextDate}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-3 w-full lg:w-auto">
          <Button variant="outline" className="flex-1 lg:flex-none">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button variant="primary" className="flex-1 lg:flex-none">
            <Save className="w-4 h-4 mr-2" /> Save Attendance
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Students" value="10" icon={User} />
        <StatCard title="Present" value="7" icon={CheckCircle2} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
        <StatCard title="Absent" value="2" icon={XCircle} colorClass="text-rose-600" bgClass="bg-rose-50" />
        <StatCard title="On Leave" value="1" icon={Clock} colorClass="text-orange-600" bgClass="bg-orange-50" />
      </div>

      {/* Progress Card */}
      <Card className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h4 className="font-bold text-slate-800">Attendance Rate</h4>
            <p className="text-xs text-slate-400">Class performance for today</p>
          </div>
          <span className="text-2xl font-black text-blue-600 tracking-tight">70%</span>
        </div>
        <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: "70%" }}></div>
        </div>
      </Card>

      {/* Main Table */}
      <Card noPadding>
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-black text-lg text-slate-800">{selectedClass}</h3>
          <span className="text-sm font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{formattedDate}</span>
        </div>
        <DataTable columns={columns} data={students} />
      </Card>
    </div>
  );
};

export default AdminAttendanceData;