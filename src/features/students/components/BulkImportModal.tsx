import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertTriangle, CheckCircle2, Upload } from "lucide-react";
import type { ParseResult } from "papaparse";

import { Button } from "../../../components/ui";
import { Modal } from "../../../components/ui/Modal";
import {
  csvStudentRowSchema,
  type CsvPreviewRow,
  type CsvStudentRowInput,
} from "../types";
import { bulkUploadStudents } from "../services/bulkUploadStudents.client";

const formSchema = z.object({
  file: z
    .any()
    .refine((f) => f?.length === 1, "CSV file is required"),
});

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImported: () => Promise<void>;
}

type FormValues = z.infer<typeof formSchema>;

export function BulkImportModal({
  isOpen,
  onClose,
  onImported,
}: BulkImportModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const [previewRows, setPreviewRows] = useState<CsvPreviewRow[]>([]);
  const [submitErrors, setSubmitErrors] = useState<{ rowNumber: number; message: string }[]>(
    []
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [isParsing, setIsParsing] = useState(false);

  const summary = useMemo(() => {
    const valid = previewRows.filter((r) => r.isValid).length;
    const invalid = previewRows.length - valid;
    return { valid, invalid };
  }, [previewRows]);

  const parseCsv = async (file: File) => {
    setIsParsing(true);
    setSuccessMessage("");
    setSubmitErrors([]);
    const Papa = (await import("papaparse")).default;

    await new Promise<void>((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: ParseResult<Record<string, string>>) => {
          const nextRows: CsvPreviewRow[] = (results.data ?? []).map((raw: Record<string, string>, idx: number) => {
            const rowNumber = idx + 2;
            const normalizedRaw: CsvStudentRowInput = {
              Name: raw.Name ?? "",
              AdmissionID: raw.AdmissionID ?? "",
              Class: raw.Class ?? "",
              Section: raw.Section ?? "",
              Email: raw.Email ?? "",
              Guardian: raw.Guardian ?? "",
            };
            const parsed = csvStudentRowSchema.safeParse({
              Name: normalizedRaw.Name,
              AdmissionID: normalizedRaw.AdmissionID,
              Class: normalizedRaw.Class,
              Section: normalizedRaw.Section,
              Email: normalizedRaw.Email,
              Guardian: normalizedRaw.Guardian,
            });
            return {
              rowNumber,
              raw: normalizedRaw,
              isValid: parsed.success,
              parsed: parsed.success ? parsed.data : undefined,
              errors: parsed.success
                ? []
                : parsed.error.issues.map((i) => i.message),
            };
          });
          setPreviewRows(nextRows);
          setIsParsing(false);
          resolve();
        },
      });
    });
  };

  const onSubmit = handleSubmit(async (values) => {
    const file = values.file?.[0];
    if (!file) return;
    await parseCsv(file);
  });

  const submitImport = async () => {
    setSubmitErrors([]);
    setSuccessMessage("");
    const result = await bulkUploadStudents(previewRows);
    if (!result.ok) {
      setSubmitErrors(result.errors);
      return;
    }
    setSuccessMessage(`Imported ${result.createdCount} students successfully.`);
    await onImported();
  };

  const close = () => {
    reset();
    setPreviewRows([]);
    setSubmitErrors([]);
    setSuccessMessage("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={close} title="Bulk Import Students">
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="file"
          accept=".csv,text/csv"
          {...register("file")}
          className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
        {errors.file ? (
          <p className="text-xs font-medium text-rose-600">{String(errors.file.message)}</p>
        ) : null}
        <Button
          type="submit"
          size="sm"
          className="gap-2"
          loading={isSubmitting || isParsing}
        >
          <Upload className="h-4 w-4" />
          Parse CSV
        </Button>
      </form>

      {previewRows.length > 0 ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3 text-xs">
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
              Valid: {summary.valid}
            </span>
            <span className="rounded-full bg-rose-50 px-2 py-0.5 font-semibold text-rose-700">
              Invalid: {summary.invalid}
            </span>
          </div>

          <div className="max-h-56 overflow-auto rounded-xl border border-slate-200">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500">
                  <th className="px-2 py-1 text-left">Row</th>
                  <th className="px-2 py-1 text-left">Name</th>
                  <th className="px-2 py-1 text-left">Admission ID</th>
                  <th className="px-2 py-1 text-left">Class</th>
                  <th className="px-2 py-1 text-left">Section</th>
                  <th className="px-2 py-1 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row) => (
                  <tr
                    key={row.rowNumber}
                    className={row.isValid ? "border-t border-slate-100" : "border-t border-rose-100 bg-rose-50/60"}
                  >
                    <td className="px-2 py-1">{row.rowNumber}</td>
                    <td className="px-2 py-1">{row.raw.Name || "-"}</td>
                    <td className="px-2 py-1">{row.raw.AdmissionID || "-"}</td>
                    <td className="px-2 py-1">{row.raw.Class || "-"}</td>
                    <td className="px-2 py-1">{row.raw.Section || "-"}</td>
                    <td className="px-2 py-1">
                      {row.isValid ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Valid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-rose-700">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          {row.errors.join(", ")}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {submitErrors.length > 0 ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
              <p className="text-xs font-bold text-rose-700">Import failed. Rows with issues:</p>
              <ul className="mt-1 space-y-1 text-xs text-rose-700">
                {submitErrors.map((err) => (
                  <li key={`${err.rowNumber}-${err.message}`}>
                    Row {err.rowNumber}: {err.message}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {successMessage ? (
            <p className="text-xs font-semibold text-emerald-700">{successMessage}</p>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={close}>
              Close
            </Button>
            <Button
              size="sm"
              onClick={submitImport}
              disabled={summary.valid === 0 || isParsing}
            >
              Submit Import
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
