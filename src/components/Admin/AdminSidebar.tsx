import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import type { LucideIcon } from "lucide-react";

import { 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  LogOut, 
  X,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router";

// Importing your Reusable UI Components
import { Button } from "../ui/Button";

interface SidebarItem {
  icon: LucideIcon;
  label: string;
}

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  sidebarItems: SidebarItem[];
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
  activeItem: string;
  setActiveItem: (value: string) => void;
}

const AdminSidebar = ({
  collapsed,
  setCollapsed,
  sidebarItems,
  mobileOpen,
  setMobileOpen,
  activeItem,
  setActiveItem,
}: AdminSidebarProps) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth?.logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static z-50 top-0 left-0 h-full
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          bg-white border-r border-slate-100
          flex flex-col
          transition-all duration-300 ease-in-out
        `}
      >
        {/* Brand Header */}
        <div className={`flex items-center gap-3 p-5 border-b border-slate-50 ${collapsed ? 'justify-center' : ''}`}>
          <div className="min-w-[40px] w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100 shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>

          {!collapsed && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-300">
              <h2 className="font-black text-slate-800 text-sm tracking-tight leading-none">EduManage</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Admin Portal</p>
            </div>
          )}

          {!collapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(true)}
              className="ml-auto p-1 text-slate-300 hover:text-slate-600 hidden lg:flex"
            >
              <ChevronLeft size={18} />
            </Button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
          {sidebarItems.map((item) => {
            const isActive = activeItem === item.label;
            return (
              <button
                key={item.label}
                title={collapsed ? item.label : ""}
                onClick={() => {
                  setActiveItem(item.label);
                  setMobileOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 rounded-xl text-sm font-bold transition-all duration-200 group relative
                  ${collapsed ? "justify-center px-0 py-3" : "px-4 py-3"}
                  ${isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }
                `}
              >
                <item.icon className={`shrink-0 ${collapsed ? "w-6 h-6" : "w-5 h-5"} ${isActive ? "text-white" : "group-hover:text-blue-600"}`} />
                {!collapsed && (
                  <span className="truncate animate-in fade-in slide-in-from-left-2 duration-300">
                    {item.label}
                  </span>
                )}
                {/* Visual indicator for active item when collapsed */}
                {isActive && collapsed && (
                   <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
                )}
              </button>
            );
          })}

          {/* Expand Toggle (Visible only when collapsed) */}
          {collapsed && (
            <Button
              variant="ghost"
              onClick={() => setCollapsed(false)}
              className="w-full flex items-center justify-center py-6 text-slate-300 hover:text-blue-600 hidden lg:flex"
            >
              <ChevronRight size={20} />
            </Button>
          )}
        </nav>

        {/* Footer / User Profile */}
        <div className="p-4 border-t border-slate-50 bg-slate-50/30">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-200 shrink-0">
              <span className="text-xs font-black text-blue-600">SJ</span>
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                <p className="text-sm font-bold text-slate-800 truncate leading-none">Dr. Sarah Johnson</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Super Admin</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-1">
            <Button 
            onClick={() => {setActiveItem("Settings")
              if(mobileOpen) 
                setMobileOpen(false); 
            }
              
              
            }
              variant="ghost" 
              className={`justify-start gap-3 font-bold text-slate-500 hover:text-slate-800 ${collapsed ? 'px-0 justify-center' : 'px-2'}`}
            >
              <Settings size={18} />
              {!collapsed && <span>Settings</span>}
            </Button>
            
            <Button 
              variant="ghost"
              onClick={handleLogout} 
              className={`justify-start gap-3 font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600 ${collapsed ? 'px-0 justify-center' : 'px-2'}`}
            >
              <LogOut size={18} />
              {!collapsed && <span>Log out</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Toggle Button (Close) */}
{mobileOpen && (
  <div className="fixed top-4 right-4 z-[60] lg:hidden animate-in fade-in zoom-in duration-200">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setMobileOpen(false)}
      className="h-12 w-12 rounded-2xl shadow-2xl border-slate-200 text-slate-500 hover:text-rose-500"
    >
      <X size={28} strokeWidth={2.5} />
    </Button>
  </div>
)}
    </>
  );
};

export default AdminSidebar;