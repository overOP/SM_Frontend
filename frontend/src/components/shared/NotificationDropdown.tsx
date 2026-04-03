import { Bell } from 'lucide-react';
import type { Notification } from '../../types';

interface NotificationDropdownProps {
  notifications: Notification[];
  show: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const NotificationDropdown = ({ notifications, show, onToggle, onClose }: NotificationDropdownProps) => {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`relative p-2 rounded-xl transition-all ${show ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
        )}
      </button>

      {show && (
        <>
          <div className="fixed inset-0 z-10" onClick={onClose} />
          <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-20 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
            <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs bg-blue-100 text-blue-600 font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer flex gap-3 transition-colors ${n.unread ? 'bg-blue-50/20' : ''}`}
                >
                  <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${n.unread ? 'bg-blue-600' : 'bg-transparent'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800 leading-tight">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{n.desc}</p>
                    <p className="text-[10px] text-slate-400 mt-2">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
