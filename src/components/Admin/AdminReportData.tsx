import React, { useState } from "react";
import { 
  Download, 
  Users, 
  TrendingUp, 
  GraduationCap, 
  ClipboardCheck,
  FileBarChart,
  
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  CartesianGrid
} from "recharts";

// Importing Reusable UI Components
import { Button, Select, Card, StatCard } from '../ui';

// --- Types & Interfaces ---
interface SubjectPerformance {
  name: string;
  score: number;
}

interface GradeDistribution {
  name: string;
  value: number;
  color: string;
}

// --- Mock Data ---
const SUBJECT_DATA: SubjectPerformance[] = [
  { name: "Mathematics", score: 82 },
  { name: "Physics", score: 74 },
  { name: "Comp. Science", score: 91 },
  { name: "Chemistry", score: 68 },
  { name: "English", score: 88 },
];

const GRADE_DATA: GradeDistribution[] = [
  { name: "Grade A+", value: 20, color: "#2563eb" }, // Blue 600
  { name: "Grade A", value: 35, color: "#3b82f6" },  // Blue 500
  { name: "Grade B", value: 25, color: "#93c5fd" },  // Blue 300
  { name: "Below C", value: 20, color: "#e2e8f0" },  // Slate 200
];

const AdminReportData: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState("This Month");

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <FileBarChart className="text-blue-600" />
            Academic Analytics
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-1">Real-time performance tracking and student reporting</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white gap-2">
            <Download size={16} /> Export CSV
          </Button>
          <Button variant="primary" className="shadow-lg shadow-blue-100 gap-2">
            <Download size={16} /> Full PDF Report
          </Button>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value="1,284" 
          icon={Users} 
          trend={12} 
        />
        <StatCard 
          title="Avg. Attendance" 
          value="94.2%" 
          icon={ClipboardCheck} 
          trend={-2} 
        />
        <StatCard 
          title="Avg. Performance" 
          value="78.5%" 
          icon={TrendingUp} 
          trend={5} 
        />
        <StatCard 
          title="Graduation Prep" 
          value="99.1%" 
          icon={GraduationCap} 
        />
      </div>

      {/* 3. Visualization Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Subject Performance - Bar Chart */}
        <Card className="lg:col-span-3 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Subject Proficiency</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Average score per department</p>
            </div>
            <Select 
              value={selectedTime} 
              onChange={(e) => setSelectedTime(e.target.value)} 
              options={["Weekly", "Monthly", "Yearly"]}
              className="w-32"
            />
          </div>
          
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={SUBJECT_DATA} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  dataKey="score" 
                  fill="#2563eb" 
                  radius={[6, 6, 0, 0]} 
                  barSize={40} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Grade Distribution - Pie Chart */}
        <Card className="lg:col-span-2 flex flex-col min-h-[400px]">
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Grade Distribution</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Overall class standings</p>
          </div>
          
          <div className="flex-1 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie 
                  data={GRADE_DATA} 
                  innerRadius={70} 
                  outerRadius={90} 
                  paddingAngle={8} 
                  dataKey="value"
                  stroke="none"
                >
                  {GRADE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label for Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-800">2026</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yearly</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {GRADE_DATA.map((item) => (
              <div key={item.name} className="flex items-center gap-2 p-2 rounded-xl border border-slate-50 bg-slate-50/50">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[11px] font-bold text-slate-600 truncate">{item.name}</span>
                <span className="ml-auto text-[11px] font-black text-slate-400">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* 4. Detailed Student Report Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
                <Users size={16} />
            </div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Individual Student Reports</h3>
        </div>
        <Card noPadding className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Student report table content will go here */}
        </Card>
      </div>

    </div>
  );
};

export default AdminReportData;