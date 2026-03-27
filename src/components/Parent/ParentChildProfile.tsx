import React from 'react';
import { 
  User, 
  BookOpen, 
  Award, 
  Calendar as CalendarIcon, 
  Hash, 
  School 
} from "lucide-react";

// Importing your reusable components
import { 
  Card, 
  StatCard, 
  Button, 
  StatusBadge 
} from '../ui';

// --- Types ---
interface StudentProfile {
  firstName: string;
  lastName: string;
  class: string;
  rollNo: string;
  subjects: string[];
  gpa: string;
  attendance: string;
  rank: string;
}

// --- Mock Data ---
const STUDENT_DATA: StudentProfile = {
  firstName: "Aarav",
  lastName: "Sharma",
  class: "8th - A",
  rollNo: "2024-08A-12",
  subjects: ["Mathematics", "Science", "English", "Hindi", "Social Studies", "Computer Science"],
  gpa: "3.8",
  attendance: "96%",
  rank: "4th"
};

const ParentChildProfile = () => {
  const { firstName, lastName, subjects, gpa, attendance, rank } = STUDENT_DATA;

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 lg:p-10 animate-in fade-in duration-700">
      
      {/* 1. Profile Header Card */}
      <Card className="border-none shadow-xl shadow-slate-200/40 bg-slate-900 text-white overflow-hidden relative">
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl">
            {firstName[0]}{lastName[0]}
          </div>
          
          <div className="text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h1 className="text-4xl text-black font-black tracking-tight">{firstName} {lastName}</h1>
              <StatusBadge status="Active Student" variant="success" />
            </div>
            <p className="text-slate-400 font-medium text-lg flex items-center justify-center md:justify-start gap-2">
              <School size={20} className="text-blue-400" />
              Metropolia International School
            </p>
          </div>
        </div>
      </Card>

      {/* 2. Quick Academic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Current GPA" value={gpa} icon={Award} colorClass="text-amber-600" bgClass="bg-amber-50" trend={5} />
        <StatCard title="Attendance" value={attendance} icon={CalendarIcon} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
        <StatCard title="Class Rank" value={rank} icon={Hash} colorClass="text-blue-600" bgClass="bg-blue-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. Detailed Information (Left 2/3) */}
        <div className="lg:col-span-2 space-y-8">
          <Card title="Academic Details" className="border-none shadow-lg shadow-slate-200/30">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {[
                { label: "Full Name", value: `${firstName} ${lastName}` },
                { label: "Class & Section", value: STUDENT_DATA.class },
                { label: "Enrollment ID", value: STUDENT_DATA.rollNo },
                { label: "Academic Year", value: "2025 - 2026" },
                { label: "House", value: "Blue Tigers" },
                { label: "Blood Group", value: "B+" }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50">
                  <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">{item.label}</span>
                  <span className="text-slate-800 font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Enrolled Subjects" className="border-none shadow-lg shadow-slate-200/30">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <BookOpen size={20} className="text-blue-600" />
              Curriculum Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <div
                  key={subject}
                  className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-1 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                >
                  <span className="text-slate-800 font-bold group-hover:text-blue-700">{subject}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Core Subject</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 4. Side Actions/Notices (Right 1/3) */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none p-8">
            <h4 className="text-xl font-black mb-2">Need Help?</h4>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              Contact the class teacher for any academic or behavioral queries regarding Aarav.
            </p>
            <Button variant="secondary" className="w-full bg-white text-black hover:bg-blue-50 hover:text-white border-none shadow-lg">
              Message Teacher
            </Button>
          </Card>

          <Card title="Quick Downloads" className="border-none shadow-md">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-between text-slate-600">
                <span>Report Card (Term 1)</span>
                <BookOpen size={16} />
              </Button>
              <Button variant="outline" className="w-full justify-between text-slate-600">
                <span>Subject Syllabus</span>
                <BookOpen size={16} />
              </Button>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default ParentChildProfile;