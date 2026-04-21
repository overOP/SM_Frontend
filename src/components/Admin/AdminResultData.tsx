import React, { useCallback, useContext, useMemo, useRef, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  User,
  Hash,
  Award,
  Upload,
  Download,
  AlertCircle,
} from "lucide-react";

import {
  Button,
  Input,
  Select,
  Card,
  StatusBadge,
  DataTable,
  type Column,
} from "../ui";
import { Modal } from "../ui/Modal";
import { AuthContext } from "../../context/AuthContext";
import { adminDirectoryStudents, createInitialAdminResults } from "../../data/adminResultsSeed";
import { demoSemesters, demoSubjects } from "../../data/studentResultsData";
import {
  finalizeAcademicResult,
  parseResultsCsv,
  RESULTS_CSV_TEMPLATE,
} from "../../lib/adminCsvResults";
import { canAdminManageResults } from "../../lib/resultsPermissions";
import { rowMaxTotal, rowPercentage } from "../../lib/gpa";
import type { AcademicResultDTO, ResultPublishStatus } from "../../types/results";

function gradeClass(pct: number, letter: string): string {
  if (letter === "F" || pct < 40) return "bg-rose-50 border-rose-100 text-rose-700";
  if (pct >= 90 || letter === "A+") return "bg-amber-50 border-amber-200 text-amber-900 ring-1 ring-amber-200/60";
  if (pct >= 80) return "bg-emerald-50 border-emerald-100 text-emerald-800";
  return "bg-slate-50 border-slate-100 text-slate-700";
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

const STATUS_OPTIONS = ["Draft", "Published", "UnderReview"] as const;

const AdminResultData = () => {
  const auth = useContext(AuthContext);
  const isAdmin = canAdminManageResults(auth?.user?.role);

  const [results, setResults] = useState<AcademicResultDTO[]>(createInitialAdminResults);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<AcademicResultDTO | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("All classes");
  const [filterSemester, setFilterSemester] = useState("All semesters");
  const [csvMessage, setCsvMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const studentById = useMemo(
    () => new Map(adminDirectoryStudents.map((s) => [s.id, s])),
    []
  );
  const studentByRoll = useMemo(
    () => new Map(adminDirectoryStudents.map((s) => [s.rollNo, s])),
    []
  );
  const subjectById = useMemo(() => new Map(demoSubjects.map((s) => [s.id, s])), []);
  const subjectByCode = useMemo(
    () => new Map(demoSubjects.map((s) => [s.code.toUpperCase(), s])),
    []
  );
  const semesterById = useMemo(() => new Map(demoSemesters.map((s) => [s.id, s])), []);

  const classLabels = useMemo(() => {
    const u = new Set<string>();
    adminDirectoryStudents.forEach((s) => u.add(s.className));
    return ["All classes", ...[...u].sort()];
  }, []);

  const semesterLabels = useMemo(
    () => ["All semesters", ...demoSemesters.sort((a, b) => a.order - b.order).map((s) => s.label)],
    []
  );

  const [formData, setFormData] = useState({
    id: "",
    studentId: "",
    subjectId: "",
    semesterId: "",
    internalMarks: "",
    practicalMarks: "",
    theoryMarks: "",
    maxInternal: "",
    maxPractical: "",
    maxTheory: "",
    status: "Published" as ResultPublishStatus,
    facultyId: "",
  });

  const openCreate = () => {
    setIsViewModalOpen(false);
    setSelectedRow(null);
    setFormData({
      id: "",
      studentId: adminDirectoryStudents[0]?.id ?? "",
      subjectId: demoSubjects[0]?.id ?? "",
      semesterId: demoSemesters[demoSemesters.length - 1]?.id ?? "",
      internalMarks: "",
      practicalMarks: "",
      theoryMarks: "",
      maxInternal: "20",
      maxPractical: "20",
      maxTheory: "60",
      status: "Published",
      facultyId: "",
    });
    setIsModalOpen(true);
  };

  const openEdit = (row: AcademicResultDTO) => {
    setIsViewModalOpen(false);
    setSelectedRow(row);
    setFormData({
      id: row.id,
      studentId: row.studentId,
      subjectId: row.subjectId,
      semesterId: row.semesterId,
      internalMarks: String(row.internalMarks),
      practicalMarks: String(row.practicalMarks),
      theoryMarks: String(row.theoryMarks),
      maxInternal: String(row.maxInternal),
      maxPractical: String(row.maxPractical),
      maxTheory: String(row.maxTheory),
      status: row.status,
      facultyId: row.facultyId ?? "",
    });
    setIsModalOpen(true);
  };

  const saveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const maxI = Number(formData.maxInternal);
    const maxP = Number(formData.maxPractical);
    const maxT = Number(formData.maxTheory);
    const i = Number(formData.internalMarks);
    const p = Number(formData.practicalMarks);
    const t = Number(formData.theoryMarks);
    if ([maxI, maxP, maxT, i, p, t].some((x) => Number.isNaN(x))) {
      window.alert("Enter valid numbers for all marks and maxima.");
      return;
    }
    if (i < 0 || i > maxI || p < 0 || p > maxP || t < 0 || t > maxT) {
      window.alert(
        `Marks must be within ranges: internal 0–${maxI}, practical 0–${maxP}, theory 0–${maxT}.`
      );
      return;
    }

    const newId = () =>
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `r_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const base: AcademicResultDTO = {
      id: selectedRow?.id ?? (formData.id.trim() || newId()),
      studentId: formData.studentId,
      subjectId: formData.subjectId,
      semesterId: formData.semesterId,
      internalMarks: i,
      practicalMarks: p,
      theoryMarks: t,
      totalMarks: 0,
      maxInternal: maxI,
      maxPractical: maxP,
      maxTheory: maxT,
      gradeLetter: "F",
      status: formData.status,
      facultyId: formData.facultyId.trim() || undefined,
    };
    const finalized = finalizeAcademicResult(base);

    if (selectedRow) {
      setResults((prev) => prev.map((x) => (x.id === selectedRow.id ? finalized : x)));
    } else {
      setResults((prev) => [finalized, ...prev]);
    }
    setIsModalOpen(false);
  };

  const updateInline = useCallback((id: string, patch: Partial<AcademicResultDTO>) => {
    setResults((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const next = { ...r, ...patch };
        if ("internalMarks" in patch || "practicalMarks" in patch || "theoryMarks" in patch) {
          next.internalMarks = clamp(next.internalMarks, 0, next.maxInternal);
          next.practicalMarks = clamp(next.practicalMarks, 0, next.maxPractical);
          next.theoryMarks = clamp(next.theoryMarks, 0, next.maxTheory);
        }
        return finalizeAcademicResult(next);
      })
    );
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this result row?")) {
      setResults((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const filteredResults = useMemo(() => {
    const semId =
      filterSemester === "All semesters"
        ? null
        : demoSemesters.find((s) => s.label === filterSemester)?.id ?? null;

    return results.filter((row) => {
      const st = studentById.get(row.studentId);
      if (!st) return false;
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const hit =
          st.name.toLowerCase().includes(q) ||
          st.rollNo.includes(q) ||
          (subjectById.get(row.subjectId)?.name.toLowerCase().includes(q) ?? false);
        if (!hit) return false;
      }
      if (filterClass !== "All classes" && st.className !== filterClass) return false;
      if (semId && row.semesterId !== semId) return false;
      return true;
    });
  }, [results, searchQuery, filterClass, filterSemester, studentById, subjectById]);

  const handleCsvFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    setCsvMessage(null);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const { rows, errors } = parseResultsCsv(text, {
        studentsById: new Map(adminDirectoryStudents.map((s) => [s.id, s])),
        studentsByRoll: studentByRoll,
        subjectsById: subjectById,
        subjectsByCode: subjectByCode,
        validSemesterIds: new Set(demoSemesters.map((s) => s.id)),
      });
      if (rows.length === 0 && errors.length > 0) {
        setCsvMessage({ type: "err", text: errors.map((x) => `Line ${x.line}: ${x.reason}`).join("\n") });
        return;
      }
      setResults((prev) => {
        const map = new Map(prev.map((r) => [r.id, r]));
        rows.forEach((r) => map.set(r.id, r));
        return Array.from(map.values());
      });
      const ok = `Imported ${rows.length} row(s).${errors.length ? ` Skipped ${errors.length} line(s).` : ""}`;
      setCsvMessage({
        type: errors.length ? "err" : "ok",
        text:
          errors.length > 0
            ? `${ok}\n${errors.map((x) => `Line ${x.line}: ${x.reason}`).join("\n")}`
            : ok,
      });
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const downloadTemplate = () => {
    const blob = new Blob([RESULTS_CSV_TEMPLATE], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "results-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns: Column<AcademicResultDTO>[] = useMemo(
    () => [
      {
        header: "Student",
        render: (row) => {
          const st = studentById.get(row.studentId);
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <User size={14} />
              </div>
              <span className="font-bold text-slate-800">{st?.name ?? row.studentId}</span>
            </div>
          );
        },
      },
      { header: "Roll", render: (row) => <span className="text-slate-600">{studentById.get(row.studentId)?.rollNo}</span> },
      {
        header: "Class",
        render: (row) => (
          <StatusBadge status={studentById.get(row.studentId)?.className ?? "—"} variant="default" />
        ),
      },
      {
        header: "Subject",
        render: (row) => (
          <div>
            <p className="font-semibold text-slate-800">{subjectById.get(row.subjectId)?.name}</p>
            <p className="text-[10px] font-bold text-slate-400">{subjectById.get(row.subjectId)?.code}</p>
          </div>
        ),
      },
      {
        header: "Semester",
        render: (row) => <span className="text-sm text-slate-600">{semesterById.get(row.semesterId)?.label}</span>,
      },
      {
        header: "Int",
        render: (row) =>
          isAdmin ? (
            <input
              type="number"
              className="w-14 rounded border border-slate-200 px-1 py-0.5 text-xs font-bold"
              value={row.internalMarks}
              min={0}
              max={row.maxInternal}
              title={`Internal marks for ${studentById.get(row.studentId)?.name ?? row.studentId}`}
              aria-label={`Internal marks for ${studentById.get(row.studentId)?.name ?? row.studentId}`}
              placeholder="0"
              onChange={(e) =>
                updateInline(row.id, { internalMarks: Number(e.target.value) })
              }
            />
          ) : (
            <span>{row.internalMarks}</span>
          ),
      },
      {
        header: "Pra",
        render: (row) =>
          isAdmin ? (
            <input
              type="number"
              className="w-14 rounded border border-slate-200 px-1 py-0.5 text-xs font-bold"
              value={row.practicalMarks}
              min={0}
              max={row.maxPractical}
              title={`Practical marks for ${studentById.get(row.studentId)?.name ?? row.studentId}`}
              aria-label={`Practical marks for ${studentById.get(row.studentId)?.name ?? row.studentId}`}
              placeholder="0"
              onChange={(e) =>
                updateInline(row.id, { practicalMarks: Number(e.target.value) })
              }
            />
          ) : (
            <span>{row.practicalMarks}</span>
          ),
      },
      {
        header: "The",
        render: (row) =>
          isAdmin ? (
            <input
              type="number"
              className="w-14 rounded border border-slate-200 px-1 py-0.5 text-xs font-bold"
              value={row.theoryMarks}
              min={0}
              max={row.maxTheory}
              title={`Theory marks for ${studentById.get(row.studentId)?.name ?? row.studentId}`}
              aria-label={`Theory marks for ${studentById.get(row.studentId)?.name ?? row.studentId}`}
              placeholder="0"
              onChange={(e) =>
                updateInline(row.id, { theoryMarks: Number(e.target.value) })
              }
            />
          ) : (
            <span>{row.theoryMarks}</span>
          ),
      },
      {
        header: "Total",
        render: (row) => (
          <span className="font-black text-slate-800">
            {row.totalMarks}/{rowMaxTotal(row)}
          </span>
        ),
      },
      {
        header: "Grade",
        render: (row) => {
          const pct = rowPercentage(row);
          return (
            <span className={`rounded-md border px-2 py-0.5 text-[10px] font-black ${gradeClass(pct, row.gradeLetter)}`}>
              {row.gradeLetter}
            </span>
          );
        },
      },
      {
        header: "Publish",
        render: (row) =>
          isAdmin ? (
            <select
              className="max-w-[120px] rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-bold text-slate-700"
              value={row.status}
              title={`Publish status for ${studentById.get(row.studentId)?.name ?? row.studentId}`}
              aria-label={`Publish status for ${studentById.get(row.studentId)?.name ?? row.studentId}`}
              onChange={(e) =>
                updateInline(row.id, { status: e.target.value as ResultPublishStatus })
              }
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === "UnderReview" ? "Under Review" : s}
                </option>
              ))}
            </select>
          ) : (
            <StatusBadge
              status={row.status === "UnderReview" ? "Under Review" : row.status}
              variant={row.status === "Published" ? "success" : row.status === "Draft" ? "warning" : "info"}
            />
          ),
      },
      {
        header: "Actions",
        render: (row) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => {
                setSelectedRow(row);
                setIsViewModalOpen(true);
              }}
            >
              <Eye size={14} className="text-slate-400" />
            </Button>
            <Button variant="ghost" size="sm" type="button" onClick={() => openEdit(row)} disabled={!isAdmin}>
              <Edit2 size={14} className="text-blue-500" />
            </Button>
            <Button variant="ghost" size="sm" type="button" onClick={() => handleDelete(row.id)} disabled={!isAdmin}>
              <Trash2 size={14} className="text-rose-500" />
            </Button>
          </div>
        ),
      },
    ],
    [isAdmin, studentById, subjectById, semesterById, updateInline]
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans md:p-8">
      <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">Examination results</h1>
          <p className="text-sm font-medium text-slate-400">
            Academic result rows (Student × Subject × Semester). Inline edit & CSV import (demo, frontend only).
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Input
            placeholder="Search name, roll, subject..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select
            options={classLabels}
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="w-full sm:w-44"
          />
          <Select
            options={semesterLabels}
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            className="w-full sm:w-44"
          />
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            title="Import result CSV"
            aria-label="Import result CSV"
            onChange={handleCsvFile}
          />
          <Button
            variant="outline"
            type="button"
            className="gap-2"
            onClick={() => fileRef.current?.click()}
            disabled={!isAdmin}
          >
            <Upload size={18} />
            Import CSV
          </Button>
          <Button variant="outline" type="button" className="gap-2" onClick={downloadTemplate}>
            <Download size={18} />
            Template
          </Button>
          <Button
            variant="primary"
            type="button"
            className="gap-2 shadow-lg shadow-blue-100"
            onClick={openCreate}
            disabled={!isAdmin}
          >
            <Plus size={18} />
            Add result
          </Button>
        </div>
      </div>

      {csvMessage && (
        <div
          className={`mb-6 flex gap-3 rounded-2xl border p-4 text-sm ${
            csvMessage.type === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-amber-200 bg-amber-50 text-amber-950"
          }`}
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          <pre className="whitespace-pre-wrap font-sans">{csvMessage.text}</pre>
        </div>
      )}

      <Card noPadding className="overflow-hidden border-none bg-white shadow-xl shadow-slate-200/50">
        <DataTable
          columns={columns}
          data={filteredResults}
          emptyMessage="No examination records found matching your filters."
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRow ? "Update result" : "New result entry"}
      >
        <form onSubmit={saveForm} className="space-y-4">
          <Select
            label="Student"
            options={adminDirectoryStudents.map((s) => `${s.name} (${s.rollNo})`)}
            value={
              adminDirectoryStudents.find((s) => s.id === formData.studentId)
                ? `${adminDirectoryStudents.find((s) => s.id === formData.studentId)!.name} (${adminDirectoryStudents.find((s) => s.id === formData.studentId)!.rollNo})`
                : ""
            }
            onChange={(e) => {
              const picked = adminDirectoryStudents.find(
                (s) => `${s.name} (${s.rollNo})` === e.target.value
              );
              if (picked) setFormData((f) => ({ ...f, studentId: picked.id }));
            }}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Subject"
              options={demoSubjects.map((s) => `${s.name} (${s.code})`)}
              value={
                demoSubjects.find((s) => s.id === formData.subjectId)
                  ? `${demoSubjects.find((s) => s.id === formData.subjectId)!.name} (${demoSubjects.find((s) => s.id === formData.subjectId)!.code})`
                  : ""
              }
              onChange={(e) => {
                const picked = demoSubjects.find((s) => `${s.name} (${s.code})` === e.target.value);
                if (picked) setFormData((f) => ({ ...f, subjectId: picked.id }));
              }}
              required
            />
            <Select
              label="Semester"
              options={demoSemesters.map((s) => s.label)}
              value={demoSemesters.find((s) => s.id === formData.semesterId)?.label ?? ""}
              onChange={(e) => {
                const picked = demoSemesters.find((s) => s.label === e.target.value);
                if (picked) setFormData((f) => ({ ...f, semesterId: picked.id }));
              }}
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Internal"
              type="number"
              icon={Award}
              value={formData.internalMarks}
              onChange={(e) => setFormData({ ...formData, internalMarks: e.target.value })}
              required
            />
            <Input
              label="Practical"
              type="number"
              icon={Award}
              value={formData.practicalMarks}
              onChange={(e) => setFormData({ ...formData, practicalMarks: e.target.value })}
              required
            />
            <Input
              label="Theory"
              type="number"
              icon={Award}
              value={formData.theoryMarks}
              onChange={(e) => setFormData({ ...formData, theoryMarks: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Max internal"
              type="number"
              icon={Hash}
              value={formData.maxInternal}
              onChange={(e) => setFormData({ ...formData, maxInternal: e.target.value })}
              required
            />
            <Input
              label="Max practical"
              type="number"
              icon={Hash}
              value={formData.maxPractical}
              onChange={(e) => setFormData({ ...formData, maxPractical: e.target.value })}
              required
            />
            <Input
              label="Max theory"
              type="number"
              icon={Hash}
              value={formData.maxTheory}
              onChange={(e) => setFormData({ ...formData, maxTheory: e.target.value })}
              required
            />
          </div>
          <Select
            label="Status"
            options={STATUS_OPTIONS.map((s) => (s === "UnderReview" ? "Under Review" : s))}
            value={formData.status === "UnderReview" ? "Under Review" : formData.status}
            onChange={(e) => {
              const v = e.target.value;
              setFormData((f) => ({
                ...f,
                status: v === "Under Review" ? "UnderReview" : (v as ResultPublishStatus),
              }));
            }}
          />
          <Input
            label="Faculty id (optional)"
            icon={User}
            placeholder="usr_teacher"
            value={formData.facultyId}
            onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
          />

          <div className="mt-8 flex justify-end gap-3 border-t border-slate-50 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Discard
            </Button>
            <Button variant="primary" type="submit" className="px-10">
              {selectedRow ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

      {selectedRow && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Result detail"
        >
          {(() => {
            const st = studentById.get(selectedRow.studentId);
            const sub = subjectById.get(selectedRow.subjectId);
            const sem = semesterById.get(selectedRow.semesterId);
            const pct = rowPercentage(selectedRow);
            return (
              <div className="space-y-6">
                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-black text-white shadow-lg shadow-blue-100">
                    {(st?.name ?? "?").charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-black leading-none text-slate-800">{st?.name}</h2>
                    <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                      Roll {st?.rollNo} · {st?.className}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-100 bg-white p-4">
                    <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Subject</p>
                    <p className="font-bold text-slate-700">{sub?.name}</p>
                    <p className="text-xs text-slate-400">{sub?.code}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-white p-4">
                    <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Semester</p>
                    <p className="font-bold text-slate-700">{sem?.label}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3 text-center">
                    <p className="text-[10px] font-black text-slate-400">Internal</p>
                    <p className="font-black text-slate-800">
                      {selectedRow.internalMarks}/{selectedRow.maxInternal}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 text-center">
                    <p className="text-[10px] font-black text-slate-400">Practical</p>
                    <p className="font-black text-slate-800">
                      {selectedRow.practicalMarks}/{selectedRow.maxPractical}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 text-center">
                    <p className="text-[10px] font-black text-slate-400">Theory</p>
                    <p className="font-black text-slate-800">
                      {selectedRow.theoryMarks}/{selectedRow.maxTheory}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center justify-between rounded-2xl border p-4 ${
                    pct >= 40 ? "border-emerald-100 bg-emerald-50" : "border-rose-100 bg-rose-50"
                  }`}
                >
                  <div>
                    <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">Grade</p>
                    <p className="text-2xl font-black text-slate-900">{selectedRow.gradeLetter}</p>
                    <p className="text-xs text-slate-500">{pct.toFixed(1)}% aggregate</p>
                  </div>
                  <StatusBadge
                    status={selectedRow.status === "UnderReview" ? "Under Review" : selectedRow.status}
                    variant={
                      selectedRow.status === "Published"
                        ? "success"
                        : selectedRow.status === "Draft"
                          ? "warning"
                          : "info"
                    }
                  />
                </div>

                <Button variant="outline" className="w-full" type="button" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
};

export default AdminResultData;
