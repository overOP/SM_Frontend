import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import type { LucideIcon } from "lucide-react";
import {
  UserCircle,
  CalendarCheck,
  GraduationCap,
  Clock,
  Megaphone,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Home
} from "lucide-react";
import { useNavigate } from "react-router";

interface SidebarItem {
  icon: LucideIcon;
  label: string;
}

interface ParentSidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
  activeItem: string;
  setActiveItem: (value: string) => void;
}

const ParentSidebar = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  activeItem,
  setActiveItem,
}: ParentSidebarProps) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const sidebarItems: SidebarItem[] = [
    { icon: Home, label: "Overview" },
    { icon: UserCircle, label: "Child Profile" },
    { icon: CalendarCheck, label: "Attendance" },
    { icon: GraduationCap, label: "Grades and Reports" },
    { icon: Clock, label: "Timetable" },
    { icon: Megaphone, label: "Announcements" },
  ];

  const handleLogout = () => {
    auth?.logout();
    navigate("/login");
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
        fixed lg:static z-50 top-0 left-0 h-full
        ${collapsed ? "w-24" : "w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        bg-white border-r border-gray-200
        flex flex-col
        transition-all duration-300
      `}
      >
        <div className="p-5 border-b border-gray-100 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-100">
              <User className="w-5 h-5 text-white" />
            </div>

            {!collapsed && (
              <div className="overflow-hidden">
                <h2 className="font-bold text-gray-800 text-sm truncate">Ishan Awasthi</h2>
                <p className="text-[11px] text-gray-400 font-medium">Grade 10-A • Roll: 24</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-400 shadow-sm hidden lg:flex"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          <button onClick={() => setMobileOpen(false)} className="ml-auto text-gray-500 lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-4">
          {sidebarItems.map((item) => {
            const isActive = activeItem === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActiveItem(item.label);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-100"
                    : "text-gray-500 hover:bg-gray-50 hover:text-blue-500"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-400 hover:text-rose-500 transition-colors"
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default ParentSidebar;
