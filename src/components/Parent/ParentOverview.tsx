import { 
  BarChart3, 
  GraduationCap, 
  Calendar, 
  Megaphone, 
  TrendingUp, 
  AlertCircle, 
  Wallet, 
  MessageSquare,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

// Using your reusable UI library
import { 
  Card, 
  StatCard, 
  DataTable, 
  StatusBadge, 
  Button,
   
} from '../ui';

const ParentOverview = () => {
  // 1. Data Definitions
  const scheduleData = [
    { time: "08:00 - 08:45", subject: "Mathematics", teacher: "Mrs. Bhatta", room: "Room 402" },
    { time: "08:45 - 09:30", subject: "Science", teacher: "Mr. Verma", room: "Lab A" },
    { time: "09:30 - 09:45", subject: "Short Break", teacher: "-", room: "Cafeteria" },
    { time: "09:45 - 10:15", subject: "English", teacher: "Mr. Sharma", room: "Room 402" },
  ];

  const gradeData = [
    { subject: "Mathematics", marks: "87/100", trend: "+2%", status: "A" },
    { subject: "Science", marks: "92/100", trend: "+5%", status: "A+" },
    { subject: "English", marks: "80/100", trend: "-1%", status: "A-" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 lg:p-10 animate-in fade-in duration-700">
      
      {/* 1. Dynamic Hero Header */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck size={14} /> Parent Portal Active
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2">Namaste, Rajesh Sharma</h1>
              <p className="text-slate-400 text-lg">
                Ishan is performing <span className="text-emerald-400 font-bold">Above Average</span> this term.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
             <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
               View Full Profile
             </Button>
             <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
               <MessageSquare size={18} className="mr-2" /> Contact Support
             </Button>
          </div>
        </div>
        
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -mr-32 -mt-32"></div>
      </div>

      {/* 2. Vital Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Attendance" value="96%" icon={BarChart3} trend={2} bgClass="bg-blue-50" colorClass="text-blue-600" />
        <StatCard title="Term GPA" value="3.8" icon={GraduationCap} colorClass="text-indigo-600" bgClass="bg-indigo-50" />
        <StatCard title="Fee Status" value="Pending" icon={Wallet} colorClass="text-rose-600" bgClass="bg-rose-50" />
        <StatCard title="Behavoir" value="Excellent" icon={TrendingUp} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* 3. Schedule Section (Left 2/3) */}
        <div className="xl:col-span-2 space-y-8">
          <Card noPadding title="Current Daily Progress" className="border-none shadow-xl shadow-slate-200/30">
             <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 <Calendar size={18} className="text-blue-600" /> Monday's Schedule
               </h3>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ongoing: Science Lab</span>
             </div>
             
             <div className="p-4">
                <DataTable 
                  columns={[
                    { header: 'Time Slot', accessor: 'time', render: (row) => <span className="font-bold text-slate-400 text-xs">{row.time}</span> },
                    { header: 'Subject', accessor: 'subject', render: (row) => <span className="font-black text-slate-800">{row.subject}</span> },
                    { header: 'Faculty', accessor: 'teacher' },
                    { header: 'Room', accessor: 'room', render: (row) => <StatusBadge status={row.room} variant="default" /> }
                  ]}
                  data={scheduleData}
                />
             </div>
          </Card>

          {/* 4. Grade Progress with Insights */}
          <Card title="Subject Performance" className="border-none shadow-xl shadow-slate-200/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               {gradeData.map((item, i) => (
                 <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-100 transition-all group">
                   <div className="flex justify-between items-start mb-2">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{item.subject}</span>
                     <span className={`text-[10px] font-black ${item.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                       {item.trend}
                     </span>
                   </div>
                   <div className="flex items-baseline gap-2">
                     <span className="text-2xl font-black text-slate-900">{item.marks.split('/')[0]}</span>
                     <span className="text-slate-400 text-sm">/100</span>
                   </div>
                   <div className="mt-4 flex items-center gap-2">
                     <StatusBadge status={`Grade ${item.status}`} variant={item.status.includes('A') ? 'success' : 'info'} />
                   </div>
                 </div>
               ))}
            </div>
            <Button variant="ghost" className="w-full text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest">
              View All 8 Subjects <ArrowRight size={14} className="ml-2" />
            </Button>
          </Card>
        </div>

        {/* 5. Sidebar: Notices & Urgent Actions (Right 1/3) */}
        <div className="space-y-6">
          <Card className="bg-amber-50 border-amber-100 text-amber-900 p-8 shadow-none relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white rounded-lg text-amber-600 shadow-sm">
                  <AlertCircle size={20} />
                </div>
                <h4 className="font-black text-lg">Fee Reminder</h4>
              </div>
              <p className="text-sm font-medium leading-relaxed mb-6 opacity-80">
                The transport and tuition fees for the month of April are currently overdue.
              </p>
              <Button className="w-full bg-amber-900 text-white hover:bg-amber-950 border-none shadow-lg shadow-amber-900/20">
                Pay NPR 12,400
              </Button>
            </div>
          </Card>

          <Card className="border-none shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-800">Announcements</h3>
              <Megaphone size={18} className="text-blue-600" />
            </div>
            
            <div className="space-y-6">
              {[
                { title: "PTM Meeting", date: "28 Mar", color: "blue" },
                { title: "Sports Week", date: "05 Apr", color: "emerald" },
                { title: "Unit Test-2", date: "12 Apr", color: "orange" }
              ].map((notice, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className={`w-12 h-12 shrink-0 rounded-2xl bg-${notice.color}-50 flex flex-col items-center justify-center border border-${notice.color}-100`}>
                    <span className={`text-[10px] font-black text-${notice.color}-600 uppercase`}>{notice.date.split(' ')[1]}</span>
                    <span className={`text-sm font-black text-${notice.color}-700`}>{notice.date.split(' ')[0]}</span>
                  </div>
                  <div className="flex-1 border-b border-slate-50 pb-4">
                    <h5 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{notice.title}</h5>
                    <p className="text-[11px] text-slate-400 font-medium">9:00 AM • Main Auditorium</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParentOverview;