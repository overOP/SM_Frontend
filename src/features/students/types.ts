import { z } from "zod";

export interface Student {
  id: string;
  admissionId: string;
  name: string;
  email: string;
  className: string;
  section: string;
  guardian: string;
  fatherPhone?: string;
  passportId?: string;
  attendancePct: number;
  status: "active" | "inactive";
}

export const csvStudentRowSchema = z.object({
  Name: z.string().trim().min(1, "Name is required"),
  AdmissionID: z.string().trim().min(1, "Admission ID is required"),
  Class: z.string().trim().min(1, "Class is required"),
  Section: z.string().trim().optional().default("A"),
  Email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  Guardian: z.string().trim().optional().default(""),
});

export type CsvStudentRowInput = z.input<typeof csvStudentRowSchema>;
export type CsvStudentRow = z.output<typeof csvStudentRowSchema>;

export interface CsvPreviewRow {
  rowNumber: number;
  raw: CsvStudentRowInput;
  parsed?: CsvStudentRow;
  isValid: boolean;
  errors: string[];
}

export interface StudentFilters {
  search: string;
  className: string;
  section: string;
  page: number;
}

export interface BulkUploadResult {
  ok: boolean;
  createdCount: number;
  errors: { rowNumber: number; message: string }[];
}

export interface AcademicRecord {
  id: string;
  subject: string;
  credits: number;
  grade: string;
}

export interface FinancialLedgerEntry {
  id: string;
  date: string;
  type: "invoice" | "payment" | "adjustment";
  description: string;
  amount: number;
  balanceAfter: number;
}

export interface VerificationDocument {
  id: string;
  name: string;
  type: "pdf" | "image";
  url: string;
  status: "pending" | "approved" | "rejected";
}
