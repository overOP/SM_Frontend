import type {
  AcademicResultDTO,
  SemesterDTO,
  StudentDTO,
  StudentResultsBundle,
  SubjectDTO,
} from "../types/results";
import { buildSemesterTrend, computeCGPA, sumCreditsEarned } from "../lib/gpa";

export const STUDENT_DEMO_ID = "stu_demo_001";

export const demoSemesters: SemesterDTO[] = [
  { id: "sem_1", label: "Fall 2023", order: 1 },
  { id: "sem_2", label: "Spring 2024", order: 2 },
  { id: "sem_3", label: "Fall 2024", order: 3 },
  { id: "sem_4", label: "Spring 2025", order: 4 },
];

export const demoSubjects: SubjectDTO[] = [
  { id: "sub_math", code: "MATH101", name: "Calculus I", category: "Core", credits: 4 },
  { id: "sub_phys", code: "PHY101", name: "Physics I", category: "Core", credits: 4 },
  { id: "sub_cs", code: "CS101", name: "Intro to Programming", category: "Core", credits: 4 },
  { id: "sub_eng", code: "ENG101", name: "Technical English", category: "Elective", credits: 2 },
  { id: "sub_lab", code: "CS151", name: "Programming Lab", category: "Lab", credits: 2 },
];

function row(
  id: string,
  semesterId: string,
  subjectId: string,
  internal: number,
  practical: number,
  theory: number,
  maxI: number,
  maxP: number,
  maxT: number,
  gradeLetter: string,
  status: AcademicResultDTO["status"],
  facultyId?: string
): AcademicResultDTO {
  const totalMarks = internal + practical + theory;
  return {
    id,
    studentId: STUDENT_DEMO_ID,
    subjectId,
    semesterId,
    internalMarks: internal,
    practicalMarks: practical,
    theoryMarks: theory,
    totalMarks,
    maxInternal: maxI,
    maxPractical: maxP,
    maxTheory: maxT,
    gradeLetter,
    status,
    facultyId,
  };
}

/** Demo rows: mix of grades; CS/Lab taught by `usr_teacher`. */
export const demoAcademicResults: AcademicResultDTO[] = [
  row("r1", "sem_1", "sub_math", 18, 0, 62, 20, 0, 80, "B+", "Published"),
  row("r2", "sem_1", "sub_phys", 16, 12, 50, 20, 20, 60, "B", "Published"),
  row("r3", "sem_1", "sub_cs", 17, 18, 55, 20, 20, 60, "A", "Published", "usr_teacher"),
  row("r4", "sem_1", "sub_eng", 9, 0, 38, 10, 0, 40, "B+", "Published"),

  row("r5", "sem_2", "sub_math", 19, 0, 68, 20, 0, 80, "A", "Published"),
  row("r6", "sem_2", "sub_phys", 17, 14, 52, 20, 20, 60, "B+", "Published"),
  row("r7", "sem_2", "sub_cs", 18, 19, 58, 20, 20, 60, "A+", "Published", "usr_teacher"),
  row("r8", "sem_2", "sub_lab", 9, 10, 28, 10, 10, 30, "A", "Published", "usr_teacher"),

  row("r9", "sem_3", "sub_math", 19, 0, 72, 20, 0, 80, "A+", "Published"),
  row("r10", "sem_3", "sub_phys", 18, 15, 54, 20, 20, 60, "A", "Published"),
  row("r11", "sem_3", "sub_cs", 19, 19, 59, 20, 20, 60, "A+", "Published", "usr_teacher"),
  row("r12", "sem_3", "sub_eng", 9, 0, 40, 10, 0, 40, "A", "Published"),

  row("r13", "sem_4", "sub_math", 20, 0, 75, 20, 0, 80, "A+", "Published"),
  row("r14", "sem_4", "sub_phys", 18, 16, 55, 20, 20, 60, "A", "Published"),
  row("r15", "sem_4", "sub_cs", 20, 20, 58, 20, 20, 60, "A+", "Published", "usr_teacher"),
  row("r16", "sem_4", "sub_lab", 10, 10, 26, 10, 10, 30, "B+", "Draft", "usr_teacher"),
];

const student: StudentDTO = {
  id: STUDENT_DEMO_ID,
  email: "student@edumanage.com",
  name: "Ayush Tiwari",
  rollNo: "CS24-0142",
  className: "B.Tech CSE — Year 2",
};

function buildBundle(): StudentResultsBundle {
  const cgpa = computeCGPA(demoAcademicResults, demoSubjects, true);
  const creditsEarned = sumCreditsEarned(demoAcademicResults, demoSubjects, true);
  const semesterTrend = buildSemesterTrend(demoAcademicResults, demoSubjects, demoSemesters, 4);

  return {
    student,
    overview: {
      cgpa,
      creditsEarned,
      currentRank: 12,
      semesterTrend,
    },
    semesters: demoSemesters,
    subjects: demoSubjects,
    results: demoAcademicResults,
  };
}

const bundleCache = new Map<string, Promise<StudentResultsBundle>>();

/**
 * Simulated async fetch (replace with `fetch()` + JSON).
 * Resolves after a short delay so Suspense boundaries are visible in dev.
 */
export function loadStudentResultsBundle(userId: string): Promise<StudentResultsBundle> {
  const key = userId || "anon";
  let p = bundleCache.get(key);
  if (!p) {
    p = (async () => {
      await new Promise((r) => setTimeout(r, 350));
      if (userId !== STUDENT_DEMO_ID) {
        return {
          student: { ...student, id: userId, name: "Student", email: "" },
          overview: {
            cgpa: 0,
            creditsEarned: 0,
            currentRank: 0,
            semesterTrend: [],
          },
          semesters: [],
          subjects: [],
          results: [],
        };
      }
      return buildBundle();
    })();
    bundleCache.set(key, p);
  }
  return p;
}

export function getTeacherResultRowsForFaculty(facultyId: string): AcademicResultDTO[] {
  return demoAcademicResults.filter((r) => r.facultyId === facultyId);
}

/** Demo display names for result rows (frontend only). */
export const DEMO_STUDENT_NAMES: Record<string, string> = {
  [STUDENT_DEMO_ID]: "Ayush Tiwari",
  stu_002: "Ishan Awasthi",
  stu_003: "Sandip Bhatta",
  stu_004: "Rohan Mehta",
};
