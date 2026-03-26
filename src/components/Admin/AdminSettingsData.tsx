import React from "react";
import { 
  Save, 
  School, 
  Calendar, 
  ShieldCheck, 
  Bell, 
  Edit2, 
  CheckCircle,
  Globe,
  Mail,
  Phone,
  Hash
} from "lucide-react";
import { Button, Input, Select, Card, StatusBadge } from '../ui';
import useSettingsForm, { type SettingsTab, type NotificationSettings } from "../../hooks/useSettingsForm";
// Reusable Helper for consistent labeling
const FormLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
    {children}
  </label>
);

const SchoolForm = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col">
        <FormLabel>School Name</FormLabel>
        <Input icon={School} defaultValue="EduManage International School" />
      </div>
      <div className="flex flex-col">
        <FormLabel>School Code</FormLabel>
        <Input icon={Hash} defaultValue="EMIS-2024" />
      </div>
    </div>

    <div className="flex flex-col">
      <FormLabel>Full Address</FormLabel>
      {/* If your UI library has a Textarea component, use it here. 
          Otherwise, styling it to match your Input component: */}
      <textarea
        rows={3}
        placeholder="Full Address"
        defaultValue="123 Education Lane, Academic City"
        className="w-full rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-all placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 hover:border-blue-100 focus:border-blue-500 resize-none shadow-sm"
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <FormLabel>Phone</FormLabel>
        <Input icon={Phone} defaultValue="+977 12345678" />
      </div>
      <div>
        <FormLabel>Admin Email</FormLabel>
        <Input icon={Mail} type="email" defaultValue="info@edumanage.com" />
      </div>
      <div>
        <FormLabel>Official Website</FormLabel>
        <Input icon={Globe} type="url" defaultValue="https://www.edumanage.com" />
      </div>
    </div>
  </div>
);

const AcademicForm = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <FormLabel>Current Academic Year</FormLabel>
        <Select options={["2025-26", "2026-27"]} />
      </div>
      <div>
        <FormLabel>Current Semester</FormLabel>
        <Select options={["Semester 1", "Semester 2"]} />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
      <div>
        <FormLabel>Year Start Date</FormLabel>
        <Input type="date" icon={Calendar} />
      </div>
      <div>
        <FormLabel>Year End Date</FormLabel>
        <Input type="date" icon={Calendar} />
      </div>
    </div>
  </div>
);

const RolesForm = () => {
  const roles = [
    { name: "Admin", permissions: ["Full System Access", "User Management", "Settings", "Reports"], variant: "info" as const },
    { name: "Teacher", permissions: ["Manage Attendance", "Enter Marks", "View Students"], variant: "success" as const },
    { name: "Student", permissions: ["View Attendance", "View Results", "Download Materials"], variant: "default" as const }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
      {roles.map((role) => (
        <Card key={role.name} className="p-5 group hover:border-blue-200 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight">{role.name}</h3>
                <StatusBadge status="Active" variant={role.variant} />
              </div>
            </div>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit2 size={14} className="mr-2" /> Edit Permissions
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 pl-13">
            {role.permissions.map((perm) => (
              <span key={perm} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold border border-slate-100 uppercase tracking-tight">
                {perm}
              </span>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

interface NotificationsFormProps {
  notifications: NotificationSettings;
  toggleNotification: (key: keyof NotificationSettings) => void;
}

const NotificationsForm = ({ notifications, toggleNotification }: NotificationsFormProps) => {
  const notificationsList: { key: keyof NotificationSettings; title: string; desc: string }[] = [
    { key: "email", title: "Email Notifications", desc: "Receive summary reports via email" },
    { key: "attendance", title: "Attendance Alerts", desc: "Notify parents automatically for absences" },
    { key: "enrollments", title: "New Enrollments", desc: "Alert admin when a new student is registered" },
    { key: "events", title: "Event Reminders", desc: "Push notifications for upcoming holidays" },
  ];

  return (
    <div className="divide-y divide-slate-50 animate-in fade-in slide-in-from-bottom-2 duration-400">
      {notificationsList.map((item) => (
        <div key={item.key} className="flex items-center justify-between py-6 first:pt-0 last:pb-0">
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-xl ${notifications[item.key] ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'} transition-colors`}>
              <Bell size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 tracking-tight">{item.title}</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{item.desc}</p>
            </div>
          </div>
          {/* Reusable Toggle UI */}
          <Button
            type="button"
            onClick={() => toggleNotification(item.key)}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${
              notifications[item.key] ? "bg-emerald-500 shadow-lg shadow-emerald-100" : "bg-slate-200"
            }`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${
              notifications[item.key] ? "translate-x-6" : ""
            }`} />
          </Button>
        </div>
      ))}
    </div>
  );
};

const AdminSettingsData = () => {
  const { activeTab, setActiveTab, notifications, toggleNotification, showSaved, handleSave } = useSettingsForm();

  const navItems: { id: SettingsTab; icon: React.ComponentType<{ size?: number } & React.SVGProps<SVGSVGElement>> }[] = [
    { id: "School", icon: School },
    { id: "Academic", icon: Calendar },
    { id: "Roles", icon: ShieldCheck },
    { id: "Notifications", icon: Bell },
  ];

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen font-sans text-slate-700">
      
      {/* 1. Header Navigation Tabs */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/50 rounded-2xl w-fit">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === item.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <item.icon size={14} />
              {item.id}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Content Card */}
      <Card noPadding className="max-w-4xl mx-auto overflow-hidden border-none shadow-xl shadow-slate-200/50 bg-white">
        <div className="bg-white px-8 py-6 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{activeTab}</h1>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Global Configuration</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
             {navItems.find(i => i.id === activeTab)?.icon && React.createElement(navItems.find(i => i.id === activeTab)!.icon, { size: 24 })}
          </div>
        </div>
        
        <div className="p-8 min-h-[400px]">
          {activeTab === "School" && <SchoolForm />}
          {activeTab === "Academic" && <AcademicForm />}
          {activeTab === "Roles" && <RolesForm />}
          {activeTab === "Notifications" && (
            <NotificationsForm notifications={notifications} toggleNotification={toggleNotification} />
          )}
        </div>

        {/* 3. Global Footer / Save Action */}
        <div className="bg-slate-50/50 px-8 py-5 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Last modified: 26 March 2026
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="ghost" className="flex-1 sm:flex-none">Discard</Button>
            <Button 
              onClick={handleSave} 
              variant="primary"
              className="flex-1 sm:flex-none px-8 shadow-lg shadow-blue-100"
            >
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </Card>

      {/* 4. Success Toast */}
      {showSaved && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800">
            <div className="bg-emerald-500 p-1 rounded-full">
              <CheckCircle size={16} className="text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight">System settings synchronized!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsData;