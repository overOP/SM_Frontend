/**
 * Frontend domain DTOs for academic results (Student × Subject × Semester).
 * Wire to your API client / React Query when a backend exists.
 */

export type ResultPublishStatus = "Draft" | "Published" | "UnderReview";

export interface SemesterDTO {
  id: string;
  label: string;
  order: number;
}

export interface SubjectDTO {
  id: string;
  code: string;
  name: string;
  /** Subject category for filtering (Core, Elective, Lab, etc.) */
  category: string;
  credits: number;
}

export interface StudentDTO {
  id: string;
  email: string;
  name: string;
  rollNo: string;
  className: string;
}

/** One graded enrollment: student × subject × semester. */
export interface AcademicResultDTO {
  id: string;
  studentId: string;
  subjectId: string;
  semesterId: string;
  internalMarks: number;
  practicalMarks: number;
  theoryMarks: number;
  totalMarks: number;
  maxInternal: number;
  maxPractical: number;
  maxTheory: number;
  gradeLetter: string;
  status: ResultPublishStatus;
  /** Optional faculty assigned to this subject offering (RBAC). */
  facultyId?: string;
}

export interface StudentResultsOverview {
  cgpa: number;
  creditsEarned: number;
  currentRank: number;
  /** Last four semesters SGPA for chart */
  semesterTrend: { semesterLabel: string; sgpa: number; order: number }[];
}

export interface StudentResultsBundle {
  student: StudentDTO;
  overview: StudentResultsOverview;
  semesters: SemesterDTO[];
  subjects: SubjectDTO[];
  results: AcademicResultDTO[];
}
