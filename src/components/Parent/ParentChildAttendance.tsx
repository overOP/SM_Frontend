import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Send,
  AlertCircle,
  FileText
} from "lucide-react";

// Importing your reusable UI components
import { 
  Button, 
  Card, 
  StatCard, 
  DataTable, 
  StatusBadge, 
 
  Input, 
  Select 
} from '../ui';
import { Modal } from '../ui/Modal';

// --- Types ---
type AttendanceStatus = "present" | "absent" | "late" | "holiday";
type LeaveStatus = "approved" | "pending" | "rejected";

interface AttendanceDay {
  day: number;
  status: AttendanceStatus;
}

interface LeaveRequest {
  id: string;
  childName: string;
  type: string;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  reason: string;
}

// --- Mock Data ---
const MOCK_ATTENDANCE: AttendanceDay[] = [
  { day: 1, status: "holiday" }, { day: 2, status: "present" }, { day: 3, status: "present" },
  { day: 4, status: "present" }, { day: 5, status: "present" }, { day: 6, status: "present" },
  { day: 7, status: "present" }, { day: 8, status: "holiday" }, { day: 9, status: "present" },
  { day: 10, status: "present" }, { day: 11, status: "absent" }, { day: 12, status: "present" },
  { day: 13, status: "present" }, { day: 14, status: "present" }, { day: 15, status: "holiday" },
  { day: 16, status: "present" }, { day: 17, status: "late" }, { day: 18, status: "present" },
  { day: 19, status: "present" }, { day: 20, status: "present" }, { day: 21, status: "present" },
  { day: 22, status: "holiday" }, { day: 23, status: "present" }, { day: 24, status: "present" },
  { day: 25, status: "present" }, { day: 26, status: "present" }, { day: 27, status: "present" },
  { day: 28, status: "present" }, { day: 29, status: "holiday" }, { day: 30, status: "present" },
  { day: 31, status: "present" },
];

const MOCK_LEAVE_HISTORY: LeaveRequest[] = [
  { id: 'LR-992', childName: 'Aarav Sharma', type: 'Sick Leave', startDate: '2026-03-10', endDate: '2026-03-11', status: 'approved', reason: 'Flu and fever' },
  { id: 'LR-102', childName: 'Aarav Sharma', type: 'Casual', startDate: '2026-04-05', endDate: '2026-04-05', status: 'pending', reason: 'Family function' },
];

const ChildAttendance = () => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [currentMonth] = useState("March 2026");

  // Helper to map calendar status to your design system's colors
  const getAttendanceStyles = (status: AttendanceStatus) => {
    switch (status) {
      case "present": return "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100";
      case "absent": return "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100";
      case "late": return "bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100";
      case "holiday": return "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-200";
      default: return "bg-white border-slate-100";
    }
  };

  // DataTable Column Definitions
  const leaveColumns = [
    { 
      header: 'Request ID', 
      accessor: 'id' as keyof LeaveRequest, 
      render: (row: LeaveRequest) => <span className="font-bold text-slate-800">#{row.id}</span> 
    },
    { header: 'Type', accessor: 'type' as keyof LeaveRequest },
    { 
      header: 'Dates', 
      accessor: 'startDate' as keyof LeaveRequest, 
      render: (row: LeaveRequest) => <span className="text-xs text-slate-500 font-medium">{row.startDate} — {row.endDate}</span> 
    },
    { 
      header: 'Status', 
      accessor: 'status' as keyof LeaveRequest, 
      render: (row: LeaveRequest) => (
        <StatusBadge 
          status={row.status} 
          variant={row.status === 'approved' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'} 
        />
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 lg:p-10 animate-in fade-in duration-700">
      
      {/* 1. Integrated Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Attendance & Leave</h1>
          <p className="text-slate-500 text-sm font-medium">Manage records and absence requests in one place.</p>
        </div>
        <Button onClick={() => setIsLeaveModalOpen(true)} className="px-8 shadow-lg shadow-slate-200/60">
          <Plus size={18} className="mr-2" /> Apply for Leave
        </Button>
      </div>

      {/* 2. Quick Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Present Days" value="25" icon={CheckCircle2} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
        <StatCard title="Total Absent" value="1" trend={0} colorClass="text-rose-600" bgClass="bg-rose-50" />
        <StatCard title="Pending Request" value="1" icon={Clock} colorClass="text-orange-600" bgClass="bg-orange-50" />
        <StatCard title="Attendance Rate" value="96%" trend={2} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* 3. Interactive Calendar (Left 2/3) */}
        <Card className="xl:col-span-2 border-none shadow-xl shadow-slate-200/40 p-0 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CalendarIcon size={20} className="text-blue-600" />
              {currentMonth}
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full"><ChevronLeft size={16} /></Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full"><ChevronRight size={16} /></Button>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-7 gap-3 mb-6">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="text-center text-slate-400 font-bold text-[10px] uppercase tracking-widest">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-3">
              {MOCK_ATTENDANCE.map((data, idx) => (
                <div
                  key={idx}
                  className={`h-14 md:h-20 flex flex-col items-center justify-center rounded-2xl border transition-all cursor-default ${getAttendanceStyles(data.status)}`}
                >
                  <span className="text-lg font-black">{data.day}</span>
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 ${data.status === 'absent' ? 'bg-rose-400' : data.status === 'late' ? 'bg-orange-400' : 'hidden'}`} />
                </div>
              ))}
            </div>

            {/* Calendar Legend */}
            <div className="mt-8 flex flex-wrap gap-6 pt-6 border-t border-slate-50">
              {['Present', 'Absent', 'Late', 'Holiday'].map(status => (
                <div key={status} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'Present' ? 'bg-emerald-500' : 
                    status === 'Absent' ? 'bg-rose-500' : 
                    status === 'Late' ? 'bg-orange-400' : 'bg-slate-300'
                  }`} />
                  <span className="text-xs font-bold text-slate-500 tracking-wide uppercase">{status}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* 4. Policy & Info Sidebar (Right 1/3) */}
        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-none p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="relative space-y-4">
              <div className="flex gap-3">
                <Info size={22} className="shrink-0 text-blue-400" />
                <h4 className="font-bold text-lg">Leave Policy</h4>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">
                Requests should be submitted at least <strong>24 hours</strong> in advance for casual leave. Medical leave requires documentation for absences exceeding 2 days.
              </p>
              <Button variant="primary" size="sm" className="w-full bg-blue-600 hover:bg-blue-700 border-none">
                Download Handbook
              </Button>
            </div>
          </Card>

          <Card title="Recent Notifications" className="border-none shadow-md">
             <div className="space-y-4">
               <div className="flex gap-3 items-start group cursor-pointer">
                 <div className="p-2 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-100 transition-colors">
                   <AlertCircle size={18} />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-slate-800">Low Attendance Warning</p>
                   <p className="text-xs text-slate-500">Attendance dropped below 90% this week.</p>
                 </div>
               </div>
             </div>
          </Card>
        </div>
      </div>

      {/* 5. Leave History Table */}
      <Card noPadding className="border-none shadow-xl shadow-slate-200/40">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />
            <h3 className="font-black text-slate-800 uppercase tracking-wider text-sm">Application History</h3>
          </div>
        </div>
        <DataTable 
          columns={leaveColumns} 
          data={MOCK_LEAVE_HISTORY} 
          emptyMessage="No leave history found for this session." 
        />
      </Card>

      {/* 6. Leave Application Modal */}
      <Modal isOpen={isLeaveModalOpen} onClose={() => setIsLeaveModalOpen(false)} title="New Leave Application">
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setIsLeaveModalOpen(false); }}>
          <Select label="Select Student" options={["Aarav Sharma"]} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="From Date" type="date" required icon={CalendarIcon} />
            <Input label="To Date" type="date" required icon={CalendarIcon} />
          </div>
          <Select label="Type of Leave" options={["Sick Leave", "Casual Leave", "Family Emergency", "Other"]} required />
          <Input label="Reason" placeholder="Please provide specific details..." className="h-24" required />
          
          <div className="bg-blue-50 p-4 rounded-xl flex gap-3 border border-blue-100">
            <Info className="text-blue-600 shrink-0" size={18} />
            <p className="text-[11px] text-blue-800 leading-relaxed font-semibold uppercase tracking-wider">
              Note: You will receive an email notification once the administration reviews your request.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsLeaveModalOpen(false)}>Discard</Button>
            <Button type="submit">
              <Send size={16} className="mr-2" /> Submit Request
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ChildAttendance;