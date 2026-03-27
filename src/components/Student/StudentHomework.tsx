import React, { useState, useMemo } from "react";
import { 
  Search, 
  Clock, 
  FileUp, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  X, 
  AlertCircle,
  Filter
} from "lucide-react";

// --- Custom Hook: useDebounce ---
import { useDebounce } from "../../hooks/useDebounce";

// --- Types & Interfaces ---
export type HomeworkStatus = "pending" | "submitted" | "graded" | "overdue";

export interface HomeworkItem {
  id: number;
  subject: string;
  title: string;
  dueDate: string;
  status: HomeworkStatus;
  priority: 'high' | 'medium' | 'low';
  description: string;
}

// --- Reusable UI Imports (Mocking your library structure) ---
import { 
  Card, 
  StatCard, 
  DataTable, 
  StatusBadge, 
  Button, 
  Input,

} from '../ui';
import { Modal } from '../ui/Modal';
const StudentHomework: React.FC = () => {
  // State Management
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<HomeworkItem | null>(null);
  
  // UX: Debounce search to prevent UI lag
  const debouncedSearch = useDebounce<string>(searchTerm, 300);

  // Mock Data (In a real app, this comes from an API/Context)
  const homeworkData: HomeworkItem[] = [
    { 
      id: 1, 
      subject: "Mathematics", 
      title: "Quadratic Equations Practice", 
      dueDate: "2026-03-28", 
      status: "pending", 
      priority: "high",
      description: "Complete exercises 5.1 to 5.4. Focus on the discriminant formula."
    },
    { 
      id: 2, 
      subject: "Physics", 
      title: "Newton's Laws Lab Report", 
      dueDate: "2026-03-30", 
      status: "pending", 
      priority: "medium",
      description: "Write a 500-word summary of the friction experiment conducted on Tuesday."
    },
    { 
      id: 3, 
      subject: "English", 
      title: "Modern Education Essay", 
      dueDate: "2026-03-25", 
      status: "submitted", 
      priority: "low",
      description: "Final draft of the persuasive essay regarding digital literacy."
    },
  ];

  // Logic: Filtered Data for DataTable
  const filteredData = useMemo<HomeworkItem[]>(() => {
    return homeworkData.filter((hw) => 
      hw.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      hw.subject.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch]);

  const handleActionClick = (task: HomeworkItem): void => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // DataTable Column Definitions
  const columns = [
    { 
      header: 'Assignment', 
      accessor: 'title' as keyof HomeworkItem,
      render: (row: HomeworkItem) => (
        <div className="py-2">
          <p className="font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
            {row.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
              {row.subject}
            </span>
          </div>
        </div>
      )
    },
    { 
      header: 'Due Date', 
      accessor: 'dueDate' as keyof HomeworkItem,
      render: (row: HomeworkItem) => (
        <div className="flex items-center gap-2 text-slate-500 font-bold text-[11px] uppercase tracking-tighter">
          <Calendar size={14} className="text-slate-300" />
          {row.dueDate}
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status' as keyof HomeworkItem,
      render: (row: HomeworkItem) => (
        <StatusBadge 
          status={row.status} 
          variant={row.status === 'pending' ? 'warning' : row.status === 'submitted' ? 'info' : 'success'} 
        />
      )
    },
    {
      header: 'Action',
      render: (row: HomeworkItem) => (
        <Button 
          variant={row.status === 'pending' ? 'default' : 'outline'} 
          size="sm" 
          className="rounded-xl h-9 px-6 font-bold text-[11px] uppercase tracking-widest transition-all hover:scale-105"
          onClick={() => handleActionClick(row)}
        >
          {row.status === 'pending' ? 'Submit Now' : 'Details'}
        </Button>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Homework Hub</h2>
          <p className="text-slate-400 font-medium mt-1">Manage your academic tasks and track submission progress.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Input 
              placeholder="Search assignments..." 
              icon={Search}
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 bg-white border-slate-200 focus:ring-4 focus:ring-blue-50 transition-all rounded-2xl pr-10"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <Button variant="outline" className="rounded-2xl border-slate-200 bg-white hidden md:flex">
             <Filter size={18} className="mr-2" /> Filter
          </Button>
        </div>
      </div>

      {/* 2. Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Assigned" value="08" icon={BookOpen} />
        <StatCard 
          title="Action Required" 
          value={homeworkData.filter(h => h.status === 'pending').length.toString()} 
          icon={Clock} 
          colorClass="text-amber-600" 
          bgClass="bg-amber-50" 
        />
        <StatCard 
          title="Successfully Graded" 
          value="04" 
          icon={CheckCircle2} 
          colorClass="text-emerald-600" 
          bgClass="bg-emerald-50" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* 3. Main Task Table */}
        <div className="xl:col-span-3">
          <Card noPadding className="border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-600 rounded-full" />
                <h3 className="font-black text-slate-800 uppercase tracking-[0.2em] text-xs">Current Assignments</h3>
              </div>
              <StatusBadge status="Term 2 Active" variant="info" />
            </div>
            
            <DataTable<HomeworkItem> columns={columns} data={filteredData} />
            
            {filteredData.length === 0 && (
              <div className="py-24 text-center">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-100">
                    <Search size={32} className="text-slate-200" />
                 </div>
                 <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No results matching "{searchTerm}"</p>
              </div>
            )}
          </Card>
        </div>

        {/* 4. Submission Sidebar */}
        <div className="space-y-6">
          <Card title="Quick Guidelines" className="border-none shadow-xl">
             <div className="space-y-6">
                <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
                      <FileUp size={20} />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-900 text-sm">Upload Policy</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">PDF format only. Ensure your student ID is in the footer.</p>
                   </div>
                </div>

                <div className="p-5 rounded-3xl bg-rose-50 border border-rose-100 flex gap-4">
                  <AlertCircle size={20} className="text-rose-600 shrink-0" />
                  <p className="text-[11px] text-rose-800/80 leading-relaxed font-bold">
                    Late submissions carry a 10% mark penalty per day.
                  </p>
                </div>
                
                <Button className="w-full rounded-2xl py-7 bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-[10px] hover:shadow-2xl transition-all">
                   Archive History
                </Button>
             </div>
          </Card>
        </div>
      </div>

      {/* 5. The Submission Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Submit Work"
      >
        <div className="space-y-6 p-2">
          {selectedTask && (
            <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{selectedTask.subject}</span>
              <h4 className="font-black text-slate-900 text-lg leading-tight mt-1">{selectedTask.title}</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{selectedTask.description}</p>
            </div>
          )}

          <div className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-12 flex flex-col items-center justify-center group hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer">
             <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                <FileUp size={40} />
             </div>
             <p className="mt-6 font-black text-slate-800 text-lg">Upload Solution</p>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Click or drag to upload</p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px]" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1 bg-blue-600 rounded-2xl h-12 shadow-xl shadow-blue-200 font-black uppercase tracking-widest text-[10px]">
              Confirm Submission
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentHomework;