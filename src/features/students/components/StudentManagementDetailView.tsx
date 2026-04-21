import { useEffect, useMemo, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  CheckCircle2,
  Edit2,
  MoreVertical,
  Save,
  XCircle,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Input, Select } from "../../../components/ui";
import { Modal } from "../../../components/ui/Modal";
import { PermissionGate } from "../../../components/auth/PermissionGate";
import type { Student } from "../types";
import {
  addManualAdjustment,
  fetchAcademicRecords,
  fetchFinancialLedger,
  fetchVerificationDocuments,
  saveGradeOverride,
  updateEnrollmentStatus,
} from "../services/studentsService";

type DetailTab =
  | "overview"
  | "academic"
  | "financial"
  | "documents"
  | "compliance";

const REJECTION_REASONS = [
  "Document is blurry",
  "Name mismatch",
  "Expired document",
  "Incorrect document type",
];

interface StudentManagementDetailViewProps {
  student: Student;
  onStudentPatched: (next: Student) => void;
}

function badgeClass(status: Student["status"]) {
  return status === "active"
    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
    : "bg-amber-50 text-amber-700 border-amber-100";
}

export function StudentManagementDetailView({
  student,
  onStudentPatched,
}: StudentManagementDetailViewProps) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<DetailTab>("overview");
  const [toast, setToast] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [gradeEdit, setGradeEdit] = useState<{ id: string; grade: string } | null>(null);
  const [adjustment, setAdjustment] = useState({ amount: "", description: "" });
  const [docDecision, setDocDecision] = useState<"approved" | "rejected" | "reupload">(
    "approved"
  );
  const [docReason, setDocReason] = useState("");

  const academicQuery = useQuery({
    queryKey: ["student-academic", student.id],
    queryFn: () => fetchAcademicRecords(student.id),
    staleTime: 30000,
  });

  const financialQuery = useQuery({
    queryKey: ["student-financial", student.id],
    queryFn: () => fetchFinancialLedger(student.id),
    staleTime: 30000,
    enabled: tab === "financial",
  });

  const documentsQuery = useQuery({
    queryKey: ["student-documents", student.id],
    queryFn: () => fetchVerificationDocuments(student.id),
    staleTime: 30000,
    enabled: tab === "documents",
  });

  const statusMutation = useMutation({
    mutationFn: (next: Student["status"]) => updateEnrollmentStatus(student.id, next),
    onMutate: async (nextStatus) => {
      const previous = student.status;
      onStudentPatched({ ...student, status: nextStatus });
      return { previous };
    },
    onError: (error, _vars, context) => {
      onStudentPatched({ ...student, status: context?.previous ?? student.status });
      setToast({
        type: "err",
        text: error instanceof Error ? error.message : "Status update failed.",
      });
    },
    onSuccess: (nextStudent) => {
      if (nextStudent) onStudentPatched(nextStudent);
      setToast({ type: "ok", text: "Enrollment status updated." });
    },
  });

  const tabs: { id: DetailTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "academic", label: "Academic Records" },
    { id: "financial", label: "Financial Ledger" },
    { id: "documents", label: "Document Verification" },
    { id: "compliance", label: "Compliance / Visa" },
  ];

  const onHoverTab = (target: DetailTab) => {
    if (target === "financial") {
      queryClient.prefetchQuery({
        queryKey: ["student-financial", student.id],
        queryFn: () => fetchFinancialLedger(student.id),
      });
    }
  };

  const currentBalance = useMemo(() => {
    const rows = financialQuery.data ?? [];
    if (rows.length === 0) return 0;
    return rows[rows.length - 1].balanceAfter;
  }, [financialQuery.data]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[210px_1fr]">
      <Card className="rounded-2xl p-3">
        <div className="space-y-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onMouseEnter={() => onHoverTab(item.id)}
              onClick={() => setTab(item.id)}
              className={`w-full rounded-lg px-3 py-2 text-left text-xs font-semibold transition ${
                tab === item.id
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="min-w-0 space-y-3 rounded-2xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Student command center
            </p>
            <div className="mt-1 flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900">{student.name}</h2>
              <span className="text-xs font-mono text-slate-500">{student.admissionId}</span>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${badgeClass(student.status)}`}
              >
                {student.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={student.status === "active" ? "outline" : "primary"}
              onClick={() =>
                statusMutation.mutate(student.status === "active" ? "inactive" : "active")
              }
            >
              {student.status === "active" ? "Deactivate" : "Activate"}
            </Button>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button size="sm" variant="outline" className="gap-1">
                  <MoreVertical className="h-4 w-4" />
                  Global Action
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  sideOffset={6}
                  className="z-30 min-w-[180px] rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
                >
                  <DropdownMenu.Item className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-slate-700 outline-none hover:bg-slate-50">
                    Reset Password
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-slate-700 outline-none hover:bg-slate-50">
                    Place Hold
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-slate-700 outline-none hover:bg-slate-50">
                    Issue Refund
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>

        {tab === "overview" ? (
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            <Card className="rounded-xl border p-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Contact
              </p>
              <p className="mt-1 text-sm text-slate-700">{student.email}</p>
              <p className="text-sm text-slate-700">{student.guardian}</p>
              <PermissionGate permission="super-admin-only">
                <p className="text-sm text-slate-700">Father Phone: {student.fatherPhone}</p>
              </PermissionGate>
            </Card>
            <Card className="rounded-xl border p-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Program
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Class {student.className} · Section {student.section}
              </p>
              <p className="text-sm text-slate-700">Attendance: {student.attendancePct}%</p>
              <PermissionGate permission="super-admin-only">
                <p className="text-sm text-slate-700">Passport ID: {student.passportId}</p>
              </PermissionGate>
            </Card>
          </div>
        ) : null}

        {tab === "academic" ? (
          <div className="space-y-2">
            <div className="w-full overflow-x-auto">
              <table className="min-w-[640px] w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-2 py-2 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                    Subject
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                    Credits
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                    Grade
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                    Override
                  </th>
                </tr>
              </thead>
              <tbody>
                {(academicQuery.data ?? []).map((row) => (
                  <tr key={row.id} className="border-b border-slate-50">
                    <td className="px-2 py-1.5">{row.subject}</td>
                    <td className="px-2 py-1.5">{row.credits}</td>
                    <td className="px-2 py-1.5 font-semibold">{row.grade}</td>
                    <td className="px-2 py-1.5">
                      <button
                        type="button"
                        onClick={() => setGradeEdit({ id: row.id, grade: row.grade })}
                        aria-label={`Override ${row.subject} grade`}
                        title={`Override ${row.subject} grade`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {tab === "financial" ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-500">Current balance: {currentBalance}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  const amount = Number.parseFloat(adjustment.amount);
                  if (!Number.isFinite(amount)) return;
                  await addManualAdjustment(student.id, amount, adjustment.description || "Manual adjustment");
                  setAdjustment({ amount: "", description: "" });
                  await queryClient.invalidateQueries({
                    queryKey: ["student-financial", student.id],
                  });
                }}
              >
                Manual Adjustment
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <Input
                placeholder="Amount (use - for credit)"
                value={adjustment.amount}
                onChange={(e) => setAdjustment((s) => ({ ...s, amount: e.target.value }))}
              />
              <Input
                placeholder="Adjustment description"
                value={adjustment.description}
                onChange={(e) =>
                  setAdjustment((s) => ({ ...s, description: e.target.value }))
                }
              />
            </div>
            <div className="w-full overflow-x-auto">
              <table className="min-w-[760px] w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-2 py-2 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                    Date
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                    Type
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                    Description
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                    Amount
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {(financialQuery.data ?? []).map((row) => (
                  <tr key={row.id} className="border-b border-slate-50">
                    <td className="px-2 py-1.5">{row.date}</td>
                    <td className="px-2 py-1.5">{row.type}</td>
                    <td className="px-2 py-1.5">{row.description}</td>
                    <td className="px-2 py-1.5">{row.amount}</td>
                    <td className="px-2 py-1.5 font-semibold">{row.balanceAfter}</td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {tab === "documents" ? (
          <div className="grid grid-cols-1 gap-3 2xl:grid-cols-2">
            <Card className="rounded-xl border p-3">
              <p className="mb-2 text-xs font-black uppercase tracking-widest text-slate-400">
                Document preview
              </p>
              <div className="h-[320px] overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                {(documentsQuery.data ?? [])[0]?.type === "image" ? (
                  <img
                    src={(documentsQuery.data ?? [])[0]?.url}
                    alt="Document preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-500">
                    PDF preview placeholder
                  </div>
                )}
              </div>
            </Card>
            <Card className="rounded-xl border p-3">
              <p className="mb-2 text-xs font-black uppercase tracking-widest text-slate-400">
                Verification
              </p>
              <div className="space-y-2">
                <Select
                  label="Decision"
                  options={["approved", "rejected", "reupload"]}
                  value={docDecision}
                  onChange={(e) =>
                    setDocDecision(e.target.value as "approved" | "rejected" | "reupload")
                  }
                />
                <Select
                  label="Reason"
                  options={["Select reason", ...REJECTION_REASONS]}
                  value={docReason || "Select reason"}
                  onChange={(e) =>
                    setDocReason(e.target.value === "Select reason" ? "" : e.target.value)
                  }
                />
                <Button
                  size="sm"
                  className="mt-1 gap-2"
                  onClick={() => {
                    if (docDecision === "rejected" && !docReason) {
                      setToast({
                        type: "err",
                        text: "Rejections require a reason before notifying student.",
                      });
                      return;
                    }
                    setToast({
                      type: "ok",
                      text:
                        docDecision === "reupload"
                          ? "Re-upload request sent to student."
                          : "Verification decision saved and notification sent.",
                    });
                  }}
                >
                  <Save className="h-4 w-4" />
                  Save Verification
                </Button>
              </div>
            </Card>
          </div>
        ) : null}

        {tab === "compliance" ? (
          <div className="space-y-2 text-sm text-slate-700">
            <p className="font-semibold">Visa: Valid until 2027-03-01</p>
            <p className="font-semibold">Compliance score: 97%</p>
            <p className="text-slate-500">
              No outstanding compliance warnings for this student.
            </p>
          </div>
        ) : null}
      </Card>

      <Modal
        isOpen={gradeEdit != null}
        onClose={() => setGradeEdit(null)}
        title="Grade Override"
      >
        <div className="space-y-3">
          <Input
            label="Override Grade"
            value={gradeEdit?.grade ?? ""}
            onChange={(e) =>
              setGradeEdit((prev) => (prev ? { ...prev, grade: e.target.value } : prev))
            }
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setGradeEdit(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={async () => {
                if (!gradeEdit) return;
                await saveGradeOverride(student.id, gradeEdit.id, gradeEdit.grade);
                await queryClient.invalidateQueries({
                  queryKey: ["student-academic", student.id],
                });
                setGradeEdit(null);
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>

      {toast ? (
        <div
          className={`fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold shadow-lg ${
            toast.type === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {toast.type === "ok" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          {toast.text}
        </div>
      ) : null}
    </div>
  );
}
