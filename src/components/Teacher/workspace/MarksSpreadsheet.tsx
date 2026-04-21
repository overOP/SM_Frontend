import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, Upload } from "lucide-react";
import { ASSIGNED_SUBJECTS, filterStudents } from "../../../data/teacherWorkspaceSeed";
import {
  EMPTY_SCORE_SLICE,
  marksEntryKey,
  marksContextKey,
  useTeacherMarksStore,
} from "../../../stores/teacherMarksStore";
import { useTeacherWorkspaceStore } from "../../../stores/teacherWorkspaceStore";
import { cn } from "../../../lib/utils";

export function MarksSpreadsheet() {
  const departmentId = useTeacherWorkspaceStore((s) => s.departmentId);
  const batchId = useTeacherWorkspaceStore((s) => s.batchId);
  const sectionId = useTeacherWorkspaceStore((s) => s.sectionId);
  const ctxKey = useMemo(
    () => marksContextKey(departmentId, batchId, sectionId),
    [departmentId, batchId, sectionId]
  );

  const scoreSlice = useTeacherMarksStore((s) => s.scores[ctxKey]);
  const scoreMap = scoreSlice ?? EMPTY_SCORE_SLICE;
  const setScore = useTeacherMarksStore((s) => s.setScore);
  const setBulkScores = useTeacherMarksStore((s) => s.setBulkScores);

  const students = useMemo(
    () => filterStudents(departmentId, batchId, sectionId),
    [departmentId, batchId, sectionId]
  );

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [localDraft, setLocalDraft] = useState<Record<string, string>>({});
  const [uploadStatus, setUploadStatus] = useState<string>("");

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(
      0,
      students.length * ASSIGNED_SUBJECTS.length
    );
  }, [students.length]);

  const draftKey = (studentId: string, subjectId: string) =>
    `${studentId}|${subjectId}`;

  const getDisplay = (studentId: string, subjectId: string) => {
    const key = draftKey(studentId, subjectId);
    if (localDraft[key] !== undefined) return localDraft[key];
    const mapped = scoreMap[marksEntryKey(subjectId, studentId)];
    if (mapped === undefined) return "";
    return String(mapped);
  };

  const numericScore = (studentId: string, subjectId: string) =>
    scoreMap[marksEntryKey(subjectId, studentId)] ?? 0;

  const onChangeScore = useCallback(
    (studentId: string, subjectId: string, raw: string) => {
      const key = draftKey(studentId, subjectId);
      setLocalDraft((d) => ({ ...d, [key]: raw }));
      if (raw === "" || raw === ".") {
        setScore(ctxKey, subjectId, studentId, 0);
        return;
      }
      const n = Number.parseFloat(raw);
      if (Number.isNaN(n)) return;
      setScore(ctxKey, subjectId, studentId, n);
    },
    [ctxKey, setScore]
  );

  const onBlurScore = useCallback((studentId: string, subjectId: string) => {
    const key = draftKey(studentId, subjectId);
    setLocalDraft((d) => {
      const next = { ...d };
      delete next[key];
      return next;
    });
  }, []);

  const handleKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement>,
      row: number,
      col: number
    ) => {
      const rowCount = students.length;
      const colCount = ASSIGNED_SUBJECTS.length;
      const currentIndex = row * colCount + col;
      const nextRowIndex = (row + 1) * colCount + col;
      const prevRowIndex = (row - 1) * colCount + col;
      if (e.key === "Enter") {
        e.preventDefault();
        if (row < rowCount - 1) {
          inputRefs.current[nextRowIndex]?.focus();
          inputRefs.current[nextRowIndex]?.select();
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (row < rowCount - 1) inputRefs.current[nextRowIndex]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (row > 0) inputRefs.current[prevRowIndex]?.focus();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (col < colCount - 1) inputRefs.current[currentIndex + 1]?.focus();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (col > 0) inputRefs.current[currentIndex - 1]?.focus();
      }
    },
    [students.length]
  );

  const uploadCsv = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const raw = String(reader.result ?? "").trim();
        if (!raw) {
          setUploadStatus("CSV is empty.");
          return;
        }
        const lines = raw
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean);
        if (lines.length < 2) {
          setUploadStatus("CSV needs a header and at least one row.");
          return;
        }

        const [header, ...rows] = lines.map((line) =>
          line.split(",").map((cell) => cell.trim())
        );
        const rollIndex = header.findIndex((h) => h.toLowerCase() === "roll");
        if (rollIndex === -1) {
          setUploadStatus("CSV must include a 'roll' column.");
          return;
        }

        const subjectColumns = ASSIGNED_SUBJECTS.map((subject) => ({
          subjectId: subject.id,
          index: header.findIndex(
            (h) =>
              h.toLowerCase() === subject.id.toLowerCase() ||
              h.toLowerCase() === subject.code.toLowerCase()
          ),
        })).filter((x) => x.index !== -1);

        if (subjectColumns.length === 0) {
          setUploadStatus(
            "No subject columns found. Use subject ids/codes in header (e.g. CS-301, CS-302)."
          );
          return;
        }

        const byRoll = new Map(students.map((s) => [s.roll.toLowerCase(), s]));
        const bulk: Record<string, number> = {};
        let applied = 0;
        rows.forEach((row) => {
          const roll = row[rollIndex]?.toLowerCase();
          if (!roll) return;
          const student = byRoll.get(roll);
          if (!student) return;
          for (const col of subjectColumns) {
            const value = row[col.index] ?? "";
            if (value === "") continue;
            const n = Number.parseFloat(value);
            if (Number.isNaN(n)) continue;
            bulk[marksEntryKey(col.subjectId, student.id)] = n;
            applied += 1;
          }
        });

        if (applied === 0) {
          setUploadStatus("No valid marks were imported from CSV.");
          return;
        }

        setBulkScores(ctxKey, bulk);
        setUploadStatus(`Uploaded ${applied} marks entries from CSV.`);
      };
      reader.readAsText(file);
    },
    [ctxKey, setBulkScores, students]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
        <Keyboard className="h-4 w-4 text-blue-500" />
        <span>
          <strong className="text-slate-800">Keyboard:</strong> Arrow ↑/↓ move rows, ←/→ switch subjects ·{" "}
          <strong className="text-slate-800">Enter</strong> moves to next student.
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100">
          <Upload className="h-4 w-4 text-blue-500" />
          Upload CSV
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              uploadCsv(file);
              e.currentTarget.value = "";
            }}
          />
        </label>
        <span className="text-[11px] text-slate-500">
          Format: <strong>roll</strong>, then subject columns ({ASSIGNED_SUBJECTS.map((s) => s.code).join(", ")}).
        </span>
        {uploadStatus ? (
          <span className="text-[11px] font-semibold text-blue-700">{uploadStatus}</span>
        ) : null}
      </div>

      {students.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          No students in this context — adjust Department / Batch / Section.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[1080px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="px-2 py-2">#</th>
                <th className="px-2 py-2">Roll</th>
                <th className="px-2 py-2">Name</th>
                {ASSIGNED_SUBJECTS.map((subject) => (
                  <th key={subject.id} className="px-2 py-2">
                    {subject.code}
                  </th>
                ))}
                <th className="px-2 py-2">Total</th>
                <th className="px-2 py-2">%</th>
                <th className="px-2 py-2">Validation</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, row) => {
                const max = s.maxMarks;
                const subjectScores = ASSIGNED_SUBJECTS.map((subject) =>
                  numericScore(s.id, subject.id)
                );
                const total = subjectScores.reduce((acc, n) => acc + n, 0);
                const maxTotal = max * ASSIGNED_SUBJECTS.length;
                const hasOverMax = subjectScores.some((score) => score > max);
                const pct = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
                return (
                  <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                    <td className="px-2 py-1 font-mono text-[10px] text-slate-400">{row + 1}</td>
                    <td className="px-2 py-1 font-mono font-bold text-slate-700">{s.roll}</td>
                    <td className="px-2 py-1 font-semibold text-slate-800">{s.name}</td>
                    {ASSIGNED_SUBJECTS.map((subject, col) => {
                      const score = numericScore(s.id, subject.id);
                      const warn = score > max;
                      const refIndex = row * ASSIGNED_SUBJECTS.length + col;
                      return (
                        <td key={subject.id} className="px-2 py-1">
                          <input
                            ref={(el) => {
                              inputRefs.current[refIndex] = el;
                            }}
                            type="text"
                            inputMode="decimal"
                            autoComplete="off"
                            value={getDisplay(s.id, subject.id)}
                            onChange={(e) =>
                              onChangeScore(s.id, subject.id, e.target.value)
                            }
                            onBlur={() => onBlurScore(s.id, subject.id)}
                            onKeyDown={(e) => handleKeyDown(e, row, col)}
                            aria-label={`${s.name} ${subject.code} score`}
                            title={`${subject.code} marks for ${s.name}`}
                            placeholder="0"
                            className={cn(
                              "w-24 rounded-lg border px-2 py-1 font-mono text-xs font-bold outline-none",
                              warn
                                ? "border-rose-400 bg-rose-50 text-rose-900"
                                : "border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            )}
                          />
                          <p className="mt-1 text-[10px] text-slate-400">/ {max}</p>
                        </td>
                      );
                    })}
                    <td className="px-2 py-1 font-mono font-black text-slate-900">{total.toFixed(1)}</td>
                    <td className="px-2 py-1 font-mono text-slate-700">{pct.toFixed(1)}%</td>
                    <td className="px-2 py-1">
                      {hasOverMax ? (
                        <span className="text-[10px] font-black uppercase text-rose-600">Over max</span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-600">OK</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
