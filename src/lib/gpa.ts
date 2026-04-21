import type { AcademicResultDTO, SemesterDTO, SubjectDTO } from "../types/results";

/** 10-point grade points from percentage (standard credit-weighted SGPA input). */
export function percentageToGradePoint(percentage: number): number {
  if (percentage < 40) return 0;
  if (percentage >= 90) return 10;
  if (percentage >= 80) return 9;
  if (percentage >= 70) return 8;
  if (percentage >= 60) return 7;
  if (percentage >= 50) return 6;
  if (percentage >= 45) return 5;
  return 4;
}

export function percentageToLetter(percentage: number): string {
  if (percentage < 40) return "F";
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 45) return "D";
  return "E";
}

export function rowMaxTotal(r: AcademicResultDTO): number {
  return r.maxInternal + r.maxPractical + r.maxTheory;
}

export function rowPercentage(r: AcademicResultDTO): number {
  const max = rowMaxTotal(r);
  if (max <= 0) return 0;
  return (r.totalMarks / max) * 100;
}

function subjectById(subjects: SubjectDTO[], id: string): SubjectDTO | undefined {
  return subjects.find((s) => s.id === id);
}

/** SGPA = Σ(gradePoint × credits) / Σ(credits) for rows in one semester (published rows only for students). */
export function computeSGPA(
  rows: AcademicResultDTO[],
  subjects: SubjectDTO[],
  semesterId: string,
  options: { onlyPublished?: boolean } = {}
): number {
  const { onlyPublished = true } = options;
  let weighted = 0;
  let credits = 0;
  for (const r of rows) {
    if (r.semesterId !== semesterId) continue;
    if (onlyPublished && r.status !== "Published") continue;
    const sub = subjectById(subjects, r.subjectId);
    if (!sub) continue;
    const gp = percentageToGradePoint(rowPercentage(r));
    weighted += gp * sub.credits;
    credits += sub.credits;
  }
  if (credits <= 0) return 0;
  return Math.round((weighted / credits) * 100) / 100;
}

export function computeCGPA(rows: AcademicResultDTO[], subjects: SubjectDTO[], onlyPublished = true): number {
  const semesterIds = [...new Set(rows.map((r) => r.semesterId))];
  let totalWeighted = 0;
  let totalCredits = 0;
  for (const sem of semesterIds) {
    const rowsSem = rows.filter((r) => r.semesterId === sem);
    for (const r of rowsSem) {
      if (onlyPublished && r.status !== "Published") continue;
      const sub = subjectById(subjects, r.subjectId);
      if (!sub) continue;
      const gp = percentageToGradePoint(rowPercentage(r));
      totalWeighted += gp * sub.credits;
      totalCredits += sub.credits;
    }
  }
  if (totalCredits <= 0) return 0;
  return Math.round((totalWeighted / totalCredits) * 100) / 100;
}

export function sumCreditsEarned(rows: AcademicResultDTO[], subjects: SubjectDTO[], onlyPublished = true): number {
  let sum = 0;
  for (const r of rows) {
    if (onlyPublished && r.status !== "Published") continue;
    const sub = subjectById(subjects, r.subjectId);
    if (!sub) continue;
    if (rowPercentage(r) >= 40) sum += sub.credits;
  }
  return sum;
}

/** Last N semesters by `order`, each SGPA for charts. */
export function buildSemesterTrend(
  rows: AcademicResultDTO[],
  subjects: SubjectDTO[],
  semesters: SemesterDTO[],
  take = 4
): { semesterLabel: string; sgpa: number; order: number }[] {
  const sorted = [...semesters].sort((a, b) => b.order - a.order).slice(0, take);
  return sorted
    .map((sem) => ({
      semesterLabel: sem.label,
      order: sem.order,
      sgpa: computeSGPA(rows, subjects, sem.id, { onlyPublished: true }),
    }))
    .reverse();
}
