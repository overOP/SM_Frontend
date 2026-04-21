import { useMemo, useState } from "react";
import { BookMarked, ListChecks, Plus } from "lucide-react";
import {
  ASSIGNED_SUBJECTS,
  SUBJECT_CURRICULUM,
} from "../../../data/teacherWorkspaceSeed";
import { useTeacherSyllabusStore } from "../../../stores/teacherSyllabusStore";
import { Button } from "../../ui/Button";
import { cn } from "../../../lib/utils";

export function SyllabusTracker() {
  const [subjectId, setSubjectId] = useState(ASSIGNED_SUBJECTS[0]?.id ?? "cs301");
  const logsBySubject = useTeacherSyllabusStore((s) => s.logsBySubject);
  const addSession = useTeacherSyllabusStore((s) => s.addSession);

  const subject = ASSIGNED_SUBJECTS.find((s) => s.id === subjectId);
  const topics = subject ? SUBJECT_CURRICULUM[subject.curriculumKey] ?? [] : [];

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const covered = useMemo(() => {
    const list = logsBySubject[subjectId] ?? [];
    const u = new Set<string>();
    for (const log of list) {
      log.topicIds.forEach((t) => u.add(t));
    }
    return u;
  }, [logsBySubject, subjectId]);

  const progressPct = topics.length ? (covered.size / topics.length) * 100 : 0;

  const toggleTopic = (t: string) => {
    setSelectedTopics((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const commitSession = () => {
    if (selectedTopics.length === 0) return;
    addSession(subjectId, selectedTopics);
    setSelectedTopics([]);
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="space-y-4 xl:col-span-1">
        <label className="block space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Assigned subject
          </span>
          <select
            value={subjectId}
            onChange={(e) => {
              setSubjectId(e.target.value);
              setSelectedTopics([]);
            }}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          >
            {ASSIGNED_SUBJECTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} — {s.name}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Progress</span>
            <span>{covered.size}/{topics.length} topics</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${Math.min(100, progressPct)}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-bold text-slate-600">{progressPct.toFixed(0)}% curriculum touched</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tag this session</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {topics.map((t) => {
              const done = covered.has(t);
              const sel = selectedTopics.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTopic(t)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-[10px] font-bold transition",
                    sel
                      ? "border-blue-600 bg-blue-600 text-white"
                      : done
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  )}
                >
                  {t}
                </button>
              );
            })}
          </div>
          <Button
            type="button"
            variant="primary"
            className="mt-4 w-full gap-2 rounded-xl"
            onClick={commitSession}
            disabled={selectedTopics.length === 0}
          >
            <Plus className="h-4 w-4" />
            Log session
          </Button>
        </div>
      </div>

      <div className="space-y-3 xl:col-span-2">
        <div className="flex items-center gap-2 text-sm font-black text-slate-800">
          <BookMarked className="h-4 w-4 text-blue-500" />
          Session log
        </div>
        {(logsBySubject[subjectId] ?? []).length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            No sessions yet — select topics and log a session.
          </div>
        ) : (
          <ul className="space-y-2">
            {(logsBySubject[subjectId] ?? []).map((log) => (
              <li
                key={log.id}
                className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <ListChecks className="h-4 w-4 text-slate-400" />
                  {log.date}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {log.topicIds.map((t) => (
                    <span
                      key={t}
                      className="rounded-lg bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
