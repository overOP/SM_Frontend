import { useContext, useMemo } from "react";
import { AuthContext } from "../../context/AuthContext";

import { 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  LogOut, 
  X
} from "lucide-react";
import { useNavigate } from "react-router";

import { Button } from "../ui/Button";
import type { AdminSidebarGroup } from "../../data/dashboardData";

function initialsFromName(name?: string): string {
  if (!name) return "AD";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AD";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  sidebarGroups: AdminSidebarGroup[];
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
  activeItem: string;
  setActiveItem: (value: string) => void;
}

const AdminSidebar = ({
  collapsed,
  setCollapsed,
  sidebarGroups,
  mobileOpen,
  setMobileOpen,
  activeItem,
  setActiveItem,
}: AdminSidebarProps) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const displayName = auth?.user?.name ?? "Admin User";
  const initials = useMemo(() => initialsFromName(displayName), [displayName]);

  const handleLogout = () => {
    auth?.logout();
    navigate("/login");
  };

  return (
    <>
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
        <div className={`flex items-center gap-3 p-5 border-b border-slate-50 ${collapsed ? 'justify-center' : ''}`}>
          <div className="min-w-[40px] w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100 shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>

          {!collapsed && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-300">
              <h2 className="font-black text-slate-800 text-sm tracking-tight leading-none">Sikshyanetra</h2>
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

        <nav className="flex-1 space-y-4 overflow-y-auto p-3 no-scrollbar">
          {sidebarGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {!collapsed && (
                <p className="px-3 pb-1 pt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {group.title}
                </p>
              )}
              {group.items.map((item) => {
                const isActive = activeItem === item.label;
                return (
                  <button
                    key={item.label}
                    title={item.description ?? item.label}
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
                    {isActive && collapsed && (
                      <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}

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

        <div className="p-4 border-t border-slate-50 bg-slate-50/30">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-200 shrink-0">
              <span className="text-xs font-black text-blue-600">{initials}</span>
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                <p className="text-sm font-bold text-slate-800 truncate leading-none">{displayName}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Super Admin</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
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