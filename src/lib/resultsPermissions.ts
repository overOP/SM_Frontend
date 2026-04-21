import type { AcademicResultDTO, Role } from "../types";

/** Frontend RBAC helpers — enforce again on the server when an API exists. */
export function canStudentViewResultRow(viewerId: string | undefined, rowStudentId: string): boolean {
  if (!viewerId) return false;
  return viewerId === rowStudentId;
}

export function canTeacherEditResultRow(
  viewerRole: Role | undefined,
  viewerId: string | undefined,
  row: AcademicResultDTO
): boolean {
  if (viewerRole !== "teacher" || !viewerId) return false;
  return row.facultyId === viewerId;
}

export function canAdminManageResults(viewerRole: Role | undefined): boolean {
  return viewerRole === "admin";
}
