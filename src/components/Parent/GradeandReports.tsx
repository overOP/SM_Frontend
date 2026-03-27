import React, { useState } from 'react';
import { 
   
  TrendingUp, 
  Award, 
  FileDown, 
  Search,
  BookOpen,
  CheckCircle,
  AlertCircle
} from "lucide-react";

// Importing your reusable components
import { 
  Card, 
  StatCard, 
  DataTable, 
  StatusBadge, 
  Button, 
  Input,
   
} from '../ui';

// --- Types ---
type ExamCategory = "Unit Test" | "Mid-Term" | "Annual";

interface PerformanceRow {
  subject: string;
  marks: string;
  progress: number;
  grade: string;
  date: string;
  category: ExamCategory;
}

// --- Mock Data ---
const PERFORMANCE_DATA: PerformanceRow[] = [
  // Unit Tests
  { subject: "Mathematics", marks: "18/20", progress: 90, grade: "A+", date: "2026-02-10", category: "Unit Test" },
  { subject: "Science", marks: "15/20", progress: 75, grade: "B", date: "2026-02-12", category: "Unit Test" },
  // Mid-Term
  { subject: "Mathematics", marks: "87/100", progress: 87, grade: "A", date: "2026-03-10", category: "Mid-Term" },
  { subject: "Science", marks: "92/100", progress: 92, grade: "A+", date: "2026-03-12", category: "Mid-Term" },
  { subject: "English", marks: "78/100", progress: 78, grade: "B+", date: "2026-03-14", category: "Mid-Term" },
  // Annual (Projected or Previous)
  { subject: "Mathematics", marks: "95/100", progress: 95, grade: "A+", date: "2025-06-10", category: "Annual" },
];

const GradeAndReports = () => {
  const [activeTab, setActiveTab] = useState<ExamCategory>("Mid-Term");

  // Filter data based on active tab
  const filteredData = PERFORMANCE_DATA.filter(item => item.category === activeTab);

  const columns = [
    { 
      header: 'Subject', 
      accessor: 'subject' as keyof PerformanceRow,
      render: (row: PerformanceRow) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-blue-600">
            <BookOpen size={16} />
          </div>
          <span className="font-bold text-slate-800">{row.subject}</span>
        </div>
      )
    },
    { header: 'Score', accessor: 'marks' as keyof PerformanceRow },
    { 
      header: 'Weightage', 
      accessor: 'progress' as keyof PerformanceRow,
      render: (row: PerformanceRow) => (
        <div className="flex items-center gap-3 w-40">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${
                row.progress >= 90 ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
              style={{ width: `${row.progress}%` }}
            />
          </div>
          <span className="text-[10px] font-black text-slate-400">{row.progress}%</span>
        </div>
      )
    },
    { 
      header: 'Grade', 
      accessor: 'grade' as keyof PerformanceRow,
      render: (row: PerformanceRow) => (
        <StatusBadge 
          status={row.grade} 
          variant={row.grade.includes('A') ? 'success' : 'info'} 
        />
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 lg:p-10 animate-in fade-in duration-700">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Academic Performance</h1>
          <p className="text-slate-500 text-sm font-medium">Detailed breakdown of examination results and progress.</p>
        </div>
        <Button shadow>
          <FileDown size={18} className="mr-2" /> Export Report Card
        </Button>
      </div>

      {/* 2. Custom UX Tabs */}
      <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit">
        {(["Unit Test", "Mid-Term", "Annual"] as ExamCategory[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${
              activeTab === tab 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}s
          </button>
        ))}
      </div>

      {/* 3. Summary Stats (Dynamic based on tab) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title={`${activeTab} Avg`} value="84.5%" icon={TrendingUp} trend={2} />
        <StatCard title="Total Subjects" value={filteredData.length} icon={BookOpen} colorClass="text-indigo-600" bgClass="bg-indigo-50" />
        <StatCard title="Passing Status" value="Cleared" icon={CheckCircle} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* 4. Results Table (Left 2/3) */}
        <div className="xl:col-span-2">
          <Card noPadding className="border-none shadow-xl shadow-slate-200/40">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
               <h3 className="font-bold text-slate-800 tracking-tight">{activeTab} Results Breakdown</h3>
               <div className="w-48">
                 <Input placeholder="Filter..." icon={Search} className="h-9 text-xs bg-slate-50 border-none" />
               </div>
            </div>
            <DataTable columns={columns} data={filteredData} />
          </Card>
        </div>

        {/* 5. Teacher Remarks & Insights (Right 1/3) */}
        <div className="space-y-6">
          <Card title="Exam Insights" className="border-none shadow-lg">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                <TrendingUp className="text-blue-600 shrink-0" size={18} />
                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                  Performance in <strong>{activeTab}s</strong> has improved by 4% compared to the previous assessment.
                </p>
              </div>
              
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                <AlertCircle className="text-amber-600 shrink-0" size={18} />
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  Science marks are slightly below the class average of 82%. Suggest additional focus.
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900 text-white border-none p-8">
             <div className="flex items-center gap-3 mb-6">
               <Award className="text-amber-400" size={24} />
               <h4 className="text-lg font-black tracking-tight">Merit Status</h4>
             </div>
             <p className="text-sm text-slate-400 leading-relaxed">
               Based on current trends, the student is on track for a <strong>Distinction</strong> in the Annual Finals.
             </p>
             <div className="mt-8 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-amber-400 w-4/5 shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
             </div>
             <p className="mt-2 text-[10px] font-bold text-slate-500 uppercase">80% of Merit Goal reached</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GradeAndReports;