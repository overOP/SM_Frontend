import type { BulkUploadResult, CsvPreviewRow, Student } from "../types";
import { applyBulkStudents, fetchClassSectionOptions, getAdmissionIdsSet } from "./studentsService";

function toStudent(row: CsvPreviewRow): Student {
  const parsed = row.parsed!;
  const normalizedAdmissionId = parsed.AdmissionID.trim().toUpperCase();
  return {
    id: `stu_${normalizedAdmissionId.toLowerCase()}`,
    admissionId: normalizedAdmissionId,
    name: parsed.Name.trim(),
    email: parsed.Email?.trim() || `${normalizedAdmissionId.toLowerCase()}@school.edu`,
    className: parsed.Class.trim(),
    section: (parsed.Section?.trim() || "A").toUpperCase(),
    guardian: parsed.Guardian?.trim() || "Guardian",
    attendancePct: 100,
    status: "active",
  };
}

export async function bulkUploadStudents(rows: CsvPreviewRow[]): Promise<BulkUploadResult> {
  const validRows = rows.filter((r) => r.isValid && r.parsed);
  if (validRows.length === 0) {
    return {
      ok: false,
      createdCount: 0,
      errors: [{ rowNumber: 0, message: "No valid rows to import." }],
    };
  }

  const { classes, sectionsByClass } = await fetchClassSectionOptions();
  const existingAdmissionIds = getAdmissionIdsSet();
  const stagedStudents: Student[] = [];
  const errors: { rowNumber: number; message: string }[] = [];
  const seenInUpload = new Set<string>();

  for (const row of validRows) {
    const next = toStudent(row);
    const admissionIdKey = next.admissionId.toLowerCase();
    if (!classes.includes(next.className)) {
      errors.push({
        rowNumber: row.rowNumber,
        message: `Class '${next.className}' does not exist`,
      });
      continue;
    }
    if (!(sectionsByClass[next.className] ?? []).includes(next.section)) {
      errors.push({
        rowNumber: row.rowNumber,
        message: `Section '${next.section}' is invalid for class '${next.className}'`,
      });
      continue;
    }
    if (seenInUpload.has(admissionIdKey)) {
      errors.push({
        rowNumber: row.rowNumber,
        message: `Duplicate Admission ID '${next.admissionId}' within CSV`,
      });
      continue;
    }
    seenInUpload.add(admissionIdKey);
    if (existingAdmissionIds.has(admissionIdKey)) {
      errors.push({
        rowNumber: row.rowNumber,
        message: `Duplicate Admission ID '${next.admissionId}' already exists`,
      });
      continue;
    }
    stagedStudents.push(next);
  }

  if (errors.length > 0) {
    return {
      ok: false,
      createdCount: 0,
      errors,
    };
  }

  applyBulkStudents(stagedStudents);
  return {
    ok: true,
    createdCount: stagedStudents.length,
    errors: [],
  };
}
