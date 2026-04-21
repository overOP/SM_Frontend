import type {
  AcademicRecord,
  FinancialLedgerEntry,
  Student,
  StudentFilters,
  VerificationDocument,
} from "../types";

const CLASS_SECTION_MAP: Record<string, string[]> = {
  "10": ["A", "B"],
  "9": ["A", "B", "C"],
  "8": ["A", "B"],
};

let STUDENT_DB: Student[] = [
  {
    id: "stu_1",
    admissionId: "STU001",
    name: "Alex Thompson",
    email: "alex.thompson@school.edu",
    className: "10",
    section: "A",
    guardian: "John Thompson",
    fatherPhone: "+1 222 111 0091",
    passportId: "P1023941",
    attendancePct: 96,
    status: "active",
  },
  {
    id: "stu_2",
    admissionId: "STU002",
    name: "Emma Watson",
    email: "emma.watson@school.edu",
    className: "10",
    section: "A",
    guardian: "Mary Watson",
    fatherPhone: "+1 222 111 0092",
    passportId: "P1023942",
    attendancePct: 94,
    status: "active",
  },
  {
    id: "stu_3",
    admissionId: "STU003",
    name: "James Miller",
    email: "james.miller@school.edu",
    className: "9",
    section: "B",
    guardian: "Robert Miller",
    fatherPhone: "+1 222 111 0093",
    passportId: "P1023943",
    attendancePct: 88,
    status: "inactive",
  },
  {
    id: "stu_4",
    admissionId: "STU004",
    name: "Sophie Brown",
    email: "sophie.brown@school.edu",
    className: "8",
    section: "A",
    guardian: "David Brown",
    fatherPhone: "+1 222 111 0094",
    passportId: "P1023944",
    attendancePct: 92,
    status: "active",
  },
];

const ACADEMIC_DB: Record<string, AcademicRecord[]> = {
  stu_1: [
    { id: "a1", subject: "Mathematics", credits: 4, grade: "A" },
    { id: "a2", subject: "Physics", credits: 4, grade: "B+" },
    { id: "a3", subject: "English", credits: 2, grade: "A-" },
  ],
  stu_2: [
    { id: "a4", subject: "Mathematics", credits: 4, grade: "A+" },
    { id: "a5", subject: "Chemistry", credits: 4, grade: "A" },
  ],
};

const LEDGER_DB: Record<string, FinancialLedgerEntry[]> = {
  stu_1: [
    {
      id: "l1",
      date: "2026-04-01",
      type: "invoice",
      description: "Term fee invoice",
      amount: 450,
      balanceAfter: 450,
    },
    {
      id: "l2",
      date: "2026-04-03",
      type: "payment",
      description: "Online payment",
      amount: -250,
      balanceAfter: 200,
    },
  ],
  stu_2: [
    {
      id: "l3",
      date: "2026-04-02",
      type: "invoice",
      description: "Term fee invoice",
      amount: 450,
      balanceAfter: 450,
    },
  ],
};

const DOCUMENT_DB: Record<string, VerificationDocument[]> = {
  stu_1: [
    {
      id: "d1",
      name: "Passport",
      type: "image",
      url: "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?w=1200",
      status: "pending",
    },
    {
      id: "d2",
      name: "Birth Certificate",
      type: "pdf",
      url: "https://example.com/mock-birth-certificate.pdf",
      status: "approved",
    },
  ],
};

export async function fetchClassSectionOptions() {
  await new Promise((r) => setTimeout(r, 120));
  return {
    classes: Object.keys(CLASS_SECTION_MAP),
    sectionsByClass: CLASS_SECTION_MAP,
  };
}

export async function fetchStudents(filters: StudentFilters) {
  await new Promise((r) => setTimeout(r, 180));

  const q = filters.search.trim().toLowerCase();
  const filtered = STUDENT_DB.filter((student) => {
    const matchSearch =
      q.length === 0 ||
      student.name.toLowerCase().includes(q) ||
      student.admissionId.toLowerCase().includes(q);
    const matchClass =
      filters.className === "all" || student.className === filters.className;
    const matchSection =
      filters.section === "all" || student.section === filters.section;
    return matchSearch && matchClass && matchSection;
  });

  const pageSize = 10;
  const total = filtered.length;
  const start = (Math.max(1, filters.page) - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);

  return {
    rows,
    total,
    pageSize,
    stats: {
      totalStudents: STUDENT_DB.length,
      activeStudents: STUDENT_DB.filter((s) => s.status === "active").length,
      avgAttendance:
        STUDENT_DB.length === 0
          ? 0
          : Math.round(
              STUDENT_DB.reduce((acc, s) => acc + s.attendancePct, 0) /
                STUDENT_DB.length
            ),
    },
  };
}

export function getAdmissionIdsSet() {
  return new Set(STUDENT_DB.map((s) => s.admissionId.toLowerCase()));
}

export function applyBulkStudents(students: Student[]) {
  const next = [...STUDENT_DB];
  for (const student of students) {
    const existingIndex = next.findIndex(
      (s) => s.admissionId.toLowerCase() === student.admissionId.toLowerCase()
    );
    if (existingIndex >= 0) {
      next[existingIndex] = { ...next[existingIndex], ...student };
    } else {
      next.push(student);
    }
  }
  STUDENT_DB = next;
}

export async function fetchStudentById(studentId: string) {
  await new Promise((r) => setTimeout(r, 120));
  return STUDENT_DB.find((s) => s.id === studentId) ?? null;
}

export async function fetchAcademicRecords(studentId: string) {
  await new Promise((r) => setTimeout(r, 140));
  return ACADEMIC_DB[studentId] ?? [];
}

export async function fetchFinancialLedger(studentId: string) {
  await new Promise((r) => setTimeout(r, 180));
  return LEDGER_DB[studentId] ?? [];
}

export async function fetchVerificationDocuments(studentId: string) {
  await new Promise((r) => setTimeout(r, 160));
  return DOCUMENT_DB[studentId] ?? [];
}

export async function updateEnrollmentStatus(studentId: string, next: Student["status"]) {
  await new Promise((r) => setTimeout(r, 350));
  if (Math.random() < 0.15) {
    throw new Error("Status update failed. Please retry.");
  }
  STUDENT_DB = STUDENT_DB.map((s) =>
    s.id === studentId ? { ...s, status: next } : s
  );
  return STUDENT_DB.find((s) => s.id === studentId) ?? null;
}

export async function saveGradeOverride(
  studentId: string,
  recordId: string,
  grade: string
) {
  await new Promise((r) => setTimeout(r, 150));
  ACADEMIC_DB[studentId] = (ACADEMIC_DB[studentId] ?? []).map((r) =>
    r.id === recordId ? { ...r, grade } : r
  );
}

export async function addManualAdjustment(
  studentId: string,
  amount: number,
  description: string
) {
  await new Promise((r) => setTimeout(r, 150));
  const list = [...(LEDGER_DB[studentId] ?? [])];
  const currentBalance = list.length ? list[list.length - 1].balanceAfter : 0;
  const nextBalance = currentBalance + amount;
  const entry: FinancialLedgerEntry = {
    id: `adj_${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    type: "adjustment",
    description,
    amount,
    balanceAfter: nextBalance,
  };
  LEDGER_DB[studentId] = [...list, entry];
  return entry;
}
