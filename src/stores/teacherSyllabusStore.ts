import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SyllabusSessionEntry {
  id: string;
  date: string;
  topicIds: string[];
}

interface TeacherSyllabusState {
  /** subjectId → session log (newest first) */
  logsBySubject: Record<string, SyllabusSessionEntry[]>;
  addSession: (subjectId: string, topicIds: string[]) => void;
}

export const useTeacherSyllabusStore = create<TeacherSyllabusState>()(
  persist(
    (set) => ({
      logsBySubject: {},
      addSession: (subjectId, topicIds) => {
        const id =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `log_${Date.now()}`;
        const date = new Date().toISOString().slice(0, 10);
        const entry: SyllabusSessionEntry = { id, date, topicIds };
        set((state) => {
          const prev = state.logsBySubject[subjectId] ?? [];
          return {
            logsBySubject: {
              ...state.logsBySubject,
              [subjectId]: [entry, ...prev],
            },
          };
        });
      },
    }),
    {
      name: "sm-teacher-syllabus",
      partialize: (s) => ({ logsBySubject: s.logsBySubject }),
    }
  )
);
