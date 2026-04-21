import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WorkspaceTab = "attendance" | "marks" | "syllabus";

interface TeacherWorkspaceState {
  departmentId: string;
  batchId: string;
  sectionId: string;
  activeTab: WorkspaceTab;
  setDepartmentId: (id: string) => void;
  setBatchId: (id: string) => void;
  setSectionId: (id: string) => void;
  setContext: (ctx: Partial<Pick<TeacherWorkspaceState, "departmentId" | "batchId" | "sectionId">>) => void;
  setActiveTab: (tab: WorkspaceTab) => void;
}

export const useTeacherWorkspaceStore = create<TeacherWorkspaceState>()(
  persist(
    (set) => ({
      departmentId: "cse",
      batchId: "2024",
      sectionId: "a",
      activeTab: "attendance",
      setDepartmentId: (departmentId) => set({ departmentId }),
      setBatchId: (batchId) => set({ batchId }),
      setSectionId: (sectionId) => set({ sectionId }),
      setContext: (ctx) => set(ctx),
      setActiveTab: (activeTab) => set({ activeTab }),
    }),
    {
      name: "sm-teacher-workspace",
      partialize: (s) => ({
        departmentId: s.departmentId,
        batchId: s.batchId,
        sectionId: s.sectionId,
        activeTab: s.activeTab,
      }),
    }
  )
);
