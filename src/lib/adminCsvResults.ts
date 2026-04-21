import type { AcademicResultDTO, ResultPublishStatus, StudentDTO, SubjectDTO } from "../types/results";
import { percentageToLetter, rowPercentage } from "./gpa";

export interface CsvImportLineError {
  line: number;
  reason: string;
}

export interface CsvImportResult {
  rows: AcademicResultDTO[];
  errors: CsvImportLineError[];
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQ = !inQ;
      continue;
    }
    if (c === "," && !inQ) {
      out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += c;
  }
  out.push(cur.trim());
  return out;
}

function normalizeStatus(raw: string): ResultPublishStatus | null {
  const s = raw.trim().toLowerCase().replace(/\s+/g, "");
  if (s === "draft") return "Draft";
  if (s === "published") return "Published";
  if (s === "underreview" || s === "under_review") return "UnderReview";
  return null;
}

function num(v: string): number | null {
  const n = Number(v);
  if (Number.isNaN(n)) return null;
  return n;
}

export function finalizeAcademicResult(r: AcademicResultDTO): AcademicResultDTO {
  const totalMarks = r.internalMarks + r.practicalMarks + r.theoryMarks;
  const pct = rowPercentage({ ...r, totalMarks });
  return {
    ...r,
    totalMarks,
    gradeLetter: percentageToLetter(pct),
  };
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `r_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * CSV with header row. Supported columns (case-insensitive):
 * `id` (optional), `studentId`, `subjectId`, `semesterId`,
 * `internalMarks`, `practicalMarks`, `theoryMarks`,
 * `maxInternal`, `maxPractical`, `maxTheory`, `status`, `facultyId` (optional).
 *
 * Alternate: `rollNo` instead of `studentId`, `subjectCode` instead of `subjectId`.
 */
export function parseResultsCsv(
  text: string,
  ctx: {
    studentsById: Map<string, StudentDTO>;
    studentsByRoll: Map<string, StudentDTO>;
    subjectsById: Map<string, SubjectDTO>;
    subjectsByCode: Map<string, SubjectDTO>;
    validSemesterIds: Set<string>;
  }
): CsvImportResult {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    return { rows: [], errors: [{ line: 1, reason: "CSV must include a header row and at least one data row." }] };
  }

  const header = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const idx = (name: string) => header.indexOf(name);

  const errors: CsvImportLineError[] = [];
  const rows: AcademicResultDTO[] = [];

  const col = {
    id: idx("id"),
    studentId: idx("studentid"),
    rollNo: idx("rollno"),
    subjectId: idx("subjectid"),
    subjectCode: idx("subjectcode"),
    semesterId: idx("semesterid"),
    internal: idx("internalmarks"),
    practical: idx("practicalmarks"),
    theory: idx("theorymarks"),
    maxI: idx("maxinternal"),
    maxP: idx("maxpractical"),
    maxT: idx("maxtheory"),
    status: idx("status"),
    facultyId: idx("facultyid"),
  };

  if (col.studentId < 0 && col.rollNo < 0) {
    return { rows: [], errors: [{ line: 1, reason: "Header must include studentId or rollNo." }] };
  }
  if (col.subjectId < 0 && col.subjectCode < 0) {
    return { rows: [], errors: [{ line: 1, reason: "Header must include subjectId or subjectCode." }] };
  }
  const required = ["semesterId", "internal", "practical", "theory", "maxI", "maxP", "maxT", "status"] as const;
  for (const key of required) {
    if (col[key] < 0) {
      return { rows: [], errors: [{ line: 1, reason: `Missing required column: ${key}` }] };
    }
  }

  for (let i = 1; i < lines.length; i++) {
    const lineNum = i + 1;
    const cells = parseCsvLine(lines[i]);
    const get = (j: number) => (j >= 0 && j < cells.length ? cells[j] : "").trim();

    let studentId = "";
    if (col.studentId >= 0) {
      studentId = get(col.studentId);
    }
    if (!studentId && col.rollNo >= 0) {
      const roll = get(col.rollNo);
      const st = ctx.studentsByRoll.get(roll);
      if (!st) {
        errors.push({ line: lineNum, reason: `Unknown rollNo: ${roll}` });
        continue;
      }
      studentId = st.id;
    }
    if (!studentId || !ctx.studentsById.has(studentId)) {
      errors.push({ line: lineNum, reason: `Unknown or missing studentId` });
      continue;
    }

    let subjectId = "";
    if (col.subjectId >= 0) subjectId = get(col.subjectId);
    if (!subjectId && col.subjectCode >= 0) {
      const code = get(col.subjectCode).toUpperCase();
      const sub = ctx.subjectsByCode.get(code);
      if (!sub) {
        errors.push({ line: lineNum, reason: `Unknown subjectCode: ${code}` });
        continue;
      }
      subjectId = sub.id;
    }
    if (!subjectId || !ctx.subjectsById.has(subjectId)) {
      errors.push({ line: lineNum, reason: `Unknown or missing subjectId` });
      continue;
    }

    const semesterId = get(col.semesterId);
    if (!ctx.validSemesterIds.has(semesterId)) {
      errors.push({ line: lineNum, reason: `Invalid semesterId: ${semesterId}` });
      continue;
    }

    const internalMarks = num(get(col.internal));
    const practicalMarks = num(get(col.practical));
    const theoryMarks = num(get(col.theory));
    const maxInternal = num(get(col.maxI));
    const maxPractical = num(get(col.maxP));
    const maxTheory = num(get(col.maxT));

    if (
      internalMarks === null ||
      practicalMarks === null ||
      theoryMarks === null ||
      maxInternal === null ||
      maxPractical === null ||
      maxTheory === null
    ) {
      errors.push({ line: lineNum, reason: "Non-numeric mark or max field" });
      continue;
    }

    if (
      internalMarks < 0 ||
      internalMarks > maxInternal ||
      practicalMarks < 0 ||
      practicalMarks > maxPractical ||
      theoryMarks < 0 ||
      theoryMarks > maxTheory
    ) {
      errors.push({
        line: lineNum,
        reason: `Marks out of range: internal 0–${maxInternal}, practical 0–${maxPractical}, theory 0–${maxTheory}`,
      });
      continue;
    }

    const stRaw = get(col.status);
    const status = normalizeStatus(stRaw);
    if (!status) {
      errors.push({ line: lineNum, reason: `Invalid status: ${stRaw} (use Draft, Published, UnderReview)` });
      continue;
    }

    const facultyRaw = col.facultyId >= 0 ? get(col.facultyId) : "";
    const facultyId = facultyRaw || undefined;

    let id = col.id >= 0 ? get(col.id) : "";
    if (!id) id = newId();

    const draft: AcademicResultDTO = {
      id,
      studentId,
      subjectId,
      semesterId,
      internalMarks,
      practicalMarks,
      theoryMarks,
      totalMarks: 0,
      maxInternal,
      maxPractical,
      maxTheory,
      gradeLetter: "F",
      status,
      facultyId,
    };
    rows.push(finalizeAcademicResult(draft));
  }

  return { rows, errors };
}

export const RESULTS_CSV_TEMPLATE = `studentId,subjectId,semesterId,internalMarks,practicalMarks,theoryMarks,maxInternal,maxPractical,maxTheory,status,facultyId
stu_demo_001,sub_math,sem_4,18,0,60,20,0,80,Published,
stu_002,sub_phys,sem_4,15,12,40,20,20,60,Draft,`;
