import { BookOpen, ClipboardCheck, GraduationCap } from "lucide-react";
import { useTeacherWorkspaceStore, type WorkspaceTab } from "../../../stores/teacherWorkspaceStore";
import { cn } from "../../../lib/utils";
import { ContextBar } from "./ContextBar";
import { AttendanceGrid } from "./AttendanceGrid";
import { MarksSpreadsheet } from "./MarksSpreadsheet";
import { SyllabusTracker } from "./SyllabusTracker";

const TABS: { id: WorkspaceTab; label: string; icon: typeof ClipboardCheck }[] = [
  { id: "attendance", label: "Attendance", icon: ClipboardCheck },
  { id: "marks", label: "Marks", icon: GraduationCap },
  { id: "syllabus", label: "Syllabus", icon: BookOpen },
];

export default function TeacherWorkspace() {
  const activeTab = useTeacherWorkspaceStore((s) => s.activeTab);
  const setActiveTab = useTeacherWorkspaceStore((s) => s.setActiveTab);

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-xl font-black tracking-tight text-slate-900">Teaching workspace</h2>
        <p className="text-sm font-medium text-slate-500">
          High-density entry · keyboard marks · context persists across Attendance and Marks
        </p>
      </div>

      <ContextBar />

      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-100/80 p-1.5">
        {TABS.map((t) => {
          const Icon = t.icon;
          const on = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2.5 text-[11px] font-black uppercase tracking-widest transition",
                on
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-[420px]">
        {activeTab === "attendance" && <AttendanceGrid />}
        {activeTab === "marks" && <MarksSpreadsheet />}
        {activeTab === "syllabus" && <SyllabusTracker />}
      </div>
    </div>
  );
}
