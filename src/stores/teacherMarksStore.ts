import { create } from "zustand";
import { persist } from "zustand/middleware";

/** `${dept}|${batch}|${sec}` → `${subjectId}|${studentId}` → entered score */
type ScoreMap = Record<string, Record<string, number>>;

/** Stable fallback for Zustand selectors — never use `?? {}` inline (breaks getSnapshot caching). */
export const EMPTY_SCORE_SLICE: Record<string, number> = {};

export function marksEntryKey(subjectId: string, studentId: string): string {
  return `${subjectId}|${studentId}`;
}

interface TeacherMarksState {
  scores: ScoreMap;
  setScore: (
    contextKey: string,
    subjectId: string,
    studentId: string,
    score: number
  ) => void;
  setBulkScores: (contextKey: string, values: Record<string, number>) => void;
}

export const useTeacherMarksStore = create<TeacherMarksState>()(
  persist(
    (set) => ({
      scores: {},
      setScore: (contextKey, subjectId, studentId, score) =>
        set((state) => ({
          scores: {
            ...state.scores,
            [contextKey]: {
              ...(state.scores[contextKey] ?? {}),
              [marksEntryKey(subjectId, studentId)]: score,
            },
          },
        })),
      setBulkScores: (contextKey, values) =>
        set((state) => ({
          scores: {
            ...state.scores,
            [contextKey]: {
              ...(state.scores[contextKey] ?? {}),
              ...values,
            },
          },
        })),
    }),
    {
      name: "sm-teacher-marks",
      partialize: (s) => ({ scores: s.scores }),
    }
  )
);

export function marksContextKey(deptId: string, batchId: string, sectionId: string): string {
  return `${deptId}|${batchId}|${sectionId}`;
}
