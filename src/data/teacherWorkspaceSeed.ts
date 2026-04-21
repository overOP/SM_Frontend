/** Demo hierarchy + roster for teacher workspace (frontend only). */

export const DEPARTMENTS = [
  { id: "cse", label: "Computer Science" },
  { id: "ece", label: "Electronics & Communication" },
  { id: "me", label: "Mechanical" },
] as const;

export const BATCHES = [
  { id: "2024", label: "2024" },
  { id: "2023", label: "2023" },
  { id: "2022", label: "2022" },
] as const;

export const SECTIONS = [
  { id: "a", label: "Section A" },
  { id: "b", label: "Section B" },
  { id: "c", label: "Section C" },
] as const;

export interface WorkspaceStudent {
  id: string;
  name: string;
  roll: string;
  deptId: string;
  batchId: string;
  sectionId: string;
  /** Default max marks for assessment column */
  maxMarks: number;
}

const mk = (
  id: string,
  name: string,
  roll: string,
  deptId: string,
  batchId: string,
  sectionId: string,
  maxMarks: number
): WorkspaceStudent => ({
  id,
  name,
  roll,
  deptId,
  batchId,
  sectionId,
  maxMarks,
});

/** Dense roster — filter by dept + batch + section. */
export const WORKSPACE_STUDENTS: WorkspaceStudent[] = [
  ...Array.from({ length: 12 }, (_, i) =>
    mk(`cse24a_${i + 1}`, `Student ${i + 1}`, `CS24A${String(i + 1).padStart(2, "0")}`, "cse", "2024", "a", 100)
  ),
  ...Array.from({ length: 8 }, (_, i) =>
    mk(`cse24b_${i + 1}`, `Learner ${i + 1}`, `CS24B${String(i + 1).padStart(2, "0")}`, "cse", "2024", "b", 100)
  ),
  ...Array.from({ length: 6 }, (_, i) =>
    mk(`ece23a_${i + 1}`, `Trainee ${i + 1}`, `EC23A${String(i + 1).padStart(2, "0")}`, "ece", "2023", "a", 100)
  ),
];

export function filterStudents(
  deptId: string,
  batchId: string,
  sectionId: string
): WorkspaceStudent[] {
  return WORKSPACE_STUDENTS.filter(
    (s) => s.deptId === deptId && s.batchId === batchId && s.sectionId === sectionId
  );
}

/** Curriculum tags per subject (for syllabus session log). */
export const SUBJECT_CURRICULUM: Record<string, string[]> = {
  cs301: [
    "Arrays & complexity",
    "Linked lists",
    "Stacks & queues",
    "Trees & BST",
    "Heaps & graphs",
    "Sorting algorithms",
    "Hashing",
  ],
  cs302: [
    "ER modelling",
    "SQL DDL/DML",
    "Normalization",
    "Transactions",
    "Indexing",
  ],
};

export const ASSIGNED_SUBJECTS = [
  { id: "cs301", code: "CS-301", name: "Data Structures", curriculumKey: "cs301" as const },
  { id: "cs302", code: "CS-302", name: "Database Systems", curriculumKey: "cs302" as const },
];
