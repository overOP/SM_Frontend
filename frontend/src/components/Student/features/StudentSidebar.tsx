// import { useContext } from "react";
// import { AuthContext } from "../../../context/AuthContext";
// import type { LucideIcon } from "lucide-react";
// import { ChevronLeft, ChevronRight, Building2, LogOut, X } from "lucide-react";
// import { useNavigate } from "react-router";

// interface SidebarItem {
//   icon: LucideIcon;
//   label: string;
// }

// interface StudentSidebarProps {
//   collapsed: boolean;
//   setCollapsed: (value: boolean) => void;
//   sidebarItems: SidebarItem[];
//   mobileOpen: boolean;
//   setMobileOpen: (value: boolean) => void;
//   activeItem: string;
//   setActiveItem: (value: string) => void;
// }

// const StudentSidebar = ({
//   collapsed,
//   setCollapsed,
//   sidebarItems,
//   mobileOpen,
//   setMobileOpen,
//   activeItem,
//   setActiveItem,
// }: StudentSidebarProps) => {
//   const auth = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     auth?.logout();
//     navigate("/login");
//   };

//   return (
//     <>
//       {mobileOpen && (
//         <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
//       )}

//       <aside
//         className={`
//         fixed lg:static z-50 top-0 left-0 h-full
//         ${collapsed ? "w-30 " : "w-64"}
//         ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
//         lg:translate-x-0
//         bg-white border-r border-gray-200
//         flex flex-col
//         transition-all duration-300
//       `}
//       >
//         <div className="flex items-center gap-3 p-5 border-b border-gray-200">
//           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
//             <Building2 className="w-5 h-5 text-white" />
//           </div>
//           {!collapsed && (
//             <div>
//               <h2 className="font-bold text-gray-800 text-sm">EduManage</h2>
//               <p className="text-xs text-gray-500">School Portal</p>
//             </div>
//           )}
//           <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-gray-500 hover:text-gray-800 hidden lg:block">
//             {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
//           </button>
//           <button onClick={() => setMobileOpen(false)} className="ml-auto text-gray-500 hover:text-gray-800 lg:hidden">
//             <X size={20} />
//           </button>
//         </div>

//         <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
//           {sidebarItems.map((item) => {
//             const isActive = activeItem === item.label;
//             return (
//               <button
//                 key={item.label}
//                 onClick={() => { setActiveItem(item.label); setMobileOpen(false); }}
//                 className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
//                   isActive ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
//                 }`}
//               >
//                 <item.icon className="w-5 h-5" />
//                 {!collapsed && <span>{item.label}</span>}
//               </button>
//             );
//           })}
//         </nav>

//         <div className="p-4 border-t border-gray-200">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
//               <span className="text-xs font-bold text-blue-600">AJ</span>
//             </div>
//             {!collapsed && (
//               <div>
//                 <p className="text-sm font-semibold text-gray-800">Alex Johnson</p>
//                 <p className="text-xs text-gray-500">Student</p>
//               </div>
//             )}
//           </div>
//           <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mt-4">
//             <LogOut size={16} />
//             {!collapsed && <span>Log out</span>}
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default StudentSidebar;



// import { LayoutDashboard, CalendarCheck, ClipboardList, CalendarDays, Award, Bell, User, BookOpen } from "lucide-react";

// const StudentSidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
//   const menuItems = [
//     { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
//     { id: "attendance", label: "Attendance", icon: CalendarCheck },
//     { id: "timetable", label: "Timetable", icon: CalendarDays },
//     { id: "homework", label: "Homework", icon: BookOpen },
//     { id: "results", label: "Results", icon: Award },
//     { id: "events", label: "Events", icon: ClipboardList },
//     { id: "announcements", label: "Announcements", icon: Bell },
//     { id: "profile", label: "Profile", icon: User },
//   ];

//   return (
//     <div className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col p-4">
//       <div className="flex items-center gap-3 px-2 mb-10">
//         <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
//         <span className="font-black text-xl tracking-tight text-slate-800">SchoolSync</span>
//       </div>
//       <nav className="space-y-1">
//         {menuItems.map((item) => (
//           <button
//             key={item.id}
//             onClick={() => setActiveTab(item.id)}
//             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
//               activeTab === item.id ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
//             }`}
//           >
//             <item.icon size={18} /> {item.label}
//           </button>
//         ))}
//       </nav>
//     </div>
//   );
// };

// export default StudentSidebar;



import {
  LayoutDashboard,
  CalendarCheck,
  ClipboardList,
  CalendarDays,
  Award,
  Bell,
  User,
  BookOpen,
  Building2,
  LogOut,
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router";

const StudentSidebar = ({
  activeItem,
  setActiveItem,
}: {
  activeItem: string;
  setActiveItem: (t: string) => void;
}) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth?.logout();
    navigate("/login");
  };

  // Mock student name - in a real app, this would come from user profile data
  const studentName = "Alex Johnson";

  const menuItems = [
    { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "Attendance", label: "Attendance", icon: CalendarCheck },
    { id: "Timetable", label: "Timetable", icon: CalendarDays },
    { id: "Homework", label: "Homework", icon: BookOpen },
    { id: "Results", label: "Results", icon: Award },
    { id: "Events", label: "Events", icon: ClipboardList },
    { id: "Announcements", label: "Announcements", icon: Bell },
    { id: "Profile", label: "Profile", icon: User },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col p-4">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
          <Building2 className="w-5 h-5" />
        </div>
        <span className="font-black text-xl tracking-tight text-slate-800">
          Edumanage
        </span>
      </div>

      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeItem === item.id
                ? "bg-blue-50 text-blue-600"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-600">
              {studentName.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{studentName}</p>
            <p className="text-xs text-slate-500">Student</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;