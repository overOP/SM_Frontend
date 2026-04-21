import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AttendanceMark = "present" | "absent" | "late";

/** sessionKey = `${dept}|${batch}|${sec}|${yyyy-mm-dd}` */
type SessionMap = Record<string, Record<string, AttendanceMark>>;

let syncTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleBackgroundSync(sessionKey: string) {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    // Demo: replace with fetch('/api/attendance', { body: ... })
    console.info("[attendance] synced session", sessionKey, new Date().toISOString());
  }, 600);
}

interface TeacherAttendanceState {
  /** Optimistic local ledger — keyed by session then student id */
  bySession: SessionMap;
  setMark: (sessionKey: string, studentId: string, mark: AttendanceMark) => void;
  bulkSet: (sessionKey: string, studentIds: string[], mark: AttendanceMark) => void;
  /** Clear session (optional) */
  clearSession: (sessionKey: string) => void;
}

export const useTeacherAttendanceStore = create<TeacherAttendanceState>()(
  persist(
    (set) => ({
      bySession: {},
      setMark: (sessionKey, studentId, mark) => {
        set((state) => {
          const prev = state.bySession[sessionKey] ?? {};
          return {
            bySession: {
              ...state.bySession,
              [sessionKey]: { ...prev, [studentId]: mark },
            },
          };
        });
        scheduleBackgroundSync(sessionKey);
      },
      bulkSet: (sessionKey, studentIds, mark) => {
        set((state) => {
          const prev = state.bySession[sessionKey] ?? {};
          const next = { ...prev };
          for (const id of studentIds) next[id] = mark;
          return {
            bySession: {
              ...state.bySession,
              [sessionKey]: next,
            },
          };
        });
        scheduleBackgroundSync(sessionKey);
      },
      clearSession: (sessionKey) => {
        set((state) => {
          const next = { ...state.bySession };
          delete next[sessionKey];
          return { bySession: next };
        });
      },
    }),
    {
      name: "sm-teacher-attendance",
      partialize: (s) => ({ bySession: s.bySession }),
    }
  )
);

export function buildSessionKey(
  deptId: string,
  batchId: string,
  sectionId: string,
  dateIso: string
): string {
  return `${deptId}|${batchId}|${sectionId}|${dateIso}`;
}

export function getMarkForStudent(
  map: SessionMap,
  sessionKey: string,
  studentId: string,
  fallback: AttendanceMark
): AttendanceMark {
  return map[sessionKey]?.[studentId] ?? fallback;
}
