import { useContext, useMemo } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChevronLeft, ChevronRight, Building2, LogOut, X } from "lucide-react";
import { useNavigate } from "react-router";

import type { TeacherSidebarGroup } from "../../data/teacherdashboardData";

function initialsFromName(name: string | undefined): string {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (
    parts[0][0] + parts[parts.length - 1][0]
  ).toUpperCase();
}

interface TeacherSidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  sidebarGroups: TeacherSidebarGroup[];
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  activeItem: string;
  setActiveItem: (v: string) => void;
}

const TeacherSidebar = ({
  collapsed,
  setCollapsed,
  sidebarGroups,
  mobileOpen,
  setMobileOpen,
  activeItem,
  setActiveItem,
}: TeacherSidebarProps) => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const displayName = auth?.user?.name ?? "Faculty";
  const initials = useMemo(
    () => initialsFromName(auth?.user?.name),
    [auth?.user?.name]
  );

  const handleLogout = () => {
    auth?.logout();
    navigate("/login");
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
        fixed lg:static z-50 top-0 left-0 h-full
        ${collapsed ? "w-30 " : "w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        bg-white border-r border-gray-200
        flex flex-col
        transition-all duration-300
      `}
      >
        <div className="flex items-center gap-3 p-5 border-b border-gray-200">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>

          {!collapsed && (
            <div>
              <h2 className="font-bold text-gray-800 text-sm">EduManage</h2>
              <p className="text-xs text-gray-500">Faculty portal</p>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-gray-500 hover:text-gray-800 hidden lg:block"
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto text-gray-500 hover:text-gray-800 lg:hidden"
            type="button"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {sidebarGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {!collapsed && (
                <p className="px-3 pt-1 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {group.title}
                </p>
              )}
              {group.items.map((item) => {
                const isActive = activeItem === item.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    title={item.description ?? item.label}
                    onClick={() => {
                      setActiveItem(item.label);
                      setMobileOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {!collapsed && (
                      <span className="truncate text-left">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">{initials}</span>
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500">Teacher</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mt-4"
          >
            <LogOut size={16} />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default TeacherSidebar;
