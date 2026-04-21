import React, { useContext, useMemo } from "react";
import { AuthContext } from "../../context/AuthContext";
import type { LucideIcon } from "lucide-react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  LogOut, 
  X 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Using your reusable UI library components
import { Card, Button } from "../ui";

interface SidebarItem {
  icon: LucideIcon;
  label: string;
}

interface StudentSidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  sidebarItems: SidebarItem[];
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
  activeItem: string;
  setActiveItem: (value: string) => void;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({
  collapsed,
  setCollapsed,
  sidebarItems,
  mobileOpen,
  setMobileOpen,
  activeItem,
  setActiveItem,
}) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // --- Logic ---
  
  const handleLogout = (): void => {
    auth?.logout();
    navigate("/login");
  };

  const userInitials = useMemo(() => {
    const name = auth?.user?.name || "Student";
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [auth?.user?.name]);

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300" 
          onClick={() => setMobileOpen(false)} 
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-[70]
          ${collapsed ? "w-24" : "w-72"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          bg-white border-r border-slate-100 flex flex-col
          transition-all duration-300 ease-in-out
        `}
      >
        {/* Branding Section */}
        <div className="flex items-center gap-4 p-6 border-b border-slate-50 min-h-[80px]">
          <div className="shrink-0 w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          
          {!collapsed && (
            <div className="flex-1 overflow-hidden animate-in fade-in slide-in-from-left-4 duration-300">
              <h2 className="font-black text-slate-800 text-lg tracking-tighter truncate uppercase leading-none">EduManage</h2>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Student Portal</p>
            </div>
          )}

          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="hidden lg:flex p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
            title="Close sidebar"
            className="lg:hidden ml-auto text-slate-400 p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-5 space-y-2 overflow-y-auto no-scrollbar">
          {sidebarItems.map((item) => {
            const isActive = activeItem === item.label;
            return (
              <button
                key={item.label}
                onClick={() => { setActiveItem(item.label); setMobileOpen(false); }}
                className={`
                  w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative
                  ${isActive 
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-100" 
                    : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                  }
                `}
              >
                <item.icon className={`shrink-0 w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"}`} />
                
                {!collapsed && (
                  <span className="text-[11px] font-black uppercase tracking-[0.15em] truncate">
                    {item.label}
                  </span>
                )}
                
                {/* Collapsed Tooltip (Blue Theme) */}
                {collapsed && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-[100] whitespace-nowrap shadow-lg shadow-blue-100">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="p-5 mt-auto border-t border-slate-50 bg-slate-50/50">
          <Card 
            className={`
              bg-white border border-blue-50 transition-all duration-300 rounded-2xl
              ${collapsed ? "p-2" : "p-4 shadow-sm"}
            `}
          >
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
              <div className="shrink-0 w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <span className="text-xs font-black text-blue-600">{userInitials}</span>
              </div>
              
              {!collapsed && (
                <div className="flex-1 overflow-hidden animate-in fade-in duration-300">
                  <p className="text-xs font-black text-slate-800 truncate leading-none mb-1">
                    {auth?.user?.name || "Ayush Tiwari"}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Verified Student</p>
                </div>
              )}
            </div>
          </Card>

          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className={`
              w-full mt-4 flex items-center gap-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all h-12 rounded-xl
              ${collapsed ? "justify-center" : "px-5"}
            `}
          >
            <LogOut size={18} />
            {!collapsed && <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>}
          </Button>
        </div>
      </aside>
    </>
  );
};

export default StudentSidebar;