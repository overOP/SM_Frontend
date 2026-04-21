import type { AcademicResultDTO, StudentDTO } from "../types/results";
import { STUDENT_DEMO_ID, demoAcademicResults } from "./studentResultsData";

/** Students shown in admin directory (demo). */
export const adminDirectoryStudents: StudentDTO[] = [
  {
    id: STUDENT_DEMO_ID,
    email: "student@sikshyanetra.com",
    name: "Ayush Tiwari",
    rollNo: "CS24-0142",
    className: "B.Tech CSE — Year 2",
  },
  {
    id: "stu_002",
    email: "ishan@demo.com",
    name: "Ishan Awasthi",
    rollNo: "205",
    className: "12-B",
  },
  {
    id: "stu_003",
    email: "sandip@demo.com",
    name: "Sandip Bhatta",
    rollNo: "102",
    className: "12-A",
  },
  {
    id: "stu_004",
    email: "rohan@demo.com",
    name: "Rohan Mehta",
    rollNo: "208",
    className: "12-B",
  },
];

function extraRow(
  id: string,
  studentId: string,
  subjectId: string,
  semesterId: string,
  internal: number,
  practical: number,
  theory: number,
  maxI: number,
  maxP: number,
  maxT: number,
  gradeLetter: string,
  status: AcademicResultDTO["status"]
): AcademicResultDTO {
  const totalMarks = internal + practical + theory;
  return {
    id,
    studentId,
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
  };
}

/** Extra rows for non-demo students; merged with demo bundle for admin view. */
export const adminExtraResultRows: AcademicResultDTO[] = [
  extraRow("adm_r1", "stu_002", "sub_math", "sem_4", 18, 0, 55, 20, 0, 80, "B+", "Published"),
  extraRow("adm_r2", "stu_003", "sub_phys", "sem_4", 14, 10, 28, 20, 20, 60, "C", "Published"),
  extraRow("adm_r3", "stu_004", "sub_cs", "sem_4", 8, 8, 18, 20, 20, 60, "F", "Published"),
];

export function createInitialAdminResults(): AcademicResultDTO[] {
  return [...demoAcademicResults, ...adminExtraResultRows];
}
