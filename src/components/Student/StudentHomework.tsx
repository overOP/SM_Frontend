import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileUp,
  Search,
} from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import { Button, Card, DataTable, Input, StatCard, StatusBadge } from "../ui";
import { Modal } from "../ui/Modal";
import {
  StudentEmptyState,
  StudentFilterHint,
  StudentMetricSkeleton,
  StudentTableSkeleton,
} from "./shared/StudentModuleStates";

type HomeworkStatus = "pending" | "submitted" | "graded" | "overdue";

interface HomeworkItem {
  id: number;
  subject: string;
  title: string;
  dueDate: string;
  status: HomeworkStatus;
  priority: "high" | "medium" | "low";
  description: string;
}

const HOMEWORK_DATA: HomeworkItem[] = [
  {
    id: 1,
    subject: "Mathematics",
    title: "Quadratic Equations Practice",
    dueDate: "2026-03-28",
    status: "pending",
    priority: "high",
    description: "Complete exercises 5.1 to 5.4. Focus on discriminant-based problem solving.",
  },
  {
    id: 2,
    subject: "Physics",
    title: "Newton's Laws Lab Report",
    dueDate: "2026-03-30",
    status: "pending",
    priority: "medium",
    description: "Submit a 500-word summary of the friction experiment with observations.",
  },
  {
    id: 3,
    subject: "English",
    title: "Modern Education Essay",
    dueDate: "2026-03-25",
    status: "submitted",
    priority: "low",
    description: "Final draft of persuasive essay regarding digital literacy in schools.",
  },
  {
    id: 4,
    subject: "Chemistry",
    title: "Organic Worksheet",
    dueDate: "2026-03-22",
    status: "graded",
    priority: "medium",
    description: "Worksheet on alkanes, alkenes, and reaction balancing.",
  },
];

export default function StudentHomework() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState<HomeworkStatus | "all">(
    (searchParams.get("status") as HomeworkStatus | "all") ?? "all"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<HomeworkItem | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 250);

  useEffect(() => {
    const nextParams: Record<string, string> = {};
    if (searchTerm.trim()) nextParams.q = searchTerm.trim();
    if (statusFilter !== "all") nextParams.status = statusFilter;
    setSearchParams(nextParams, { replace: true });
  }, [searchTerm, statusFilter, setSearchParams]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 350);
    return () => clearTimeout(timer);
  }, [debouncedSearch, statusFilter]);

  const filteredData = useMemo(
    () =>
      HOMEWORK_DATA.filter((hw) => {
        const matchesSearch =
          hw.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          hw.subject.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesStatus = statusFilter === "all" || hw.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [debouncedSearch, statusFilter]
  );

  const metrics = useMemo(
    () => ({
      total: HOMEWORK_DATA.length,
      actionRequired: HOMEWORK_DATA.filter((item) => item.status === "pending" || item.status === "overdue").length,
      graded: HOMEWORK_DATA.filter((item) => item.status === "graded").length,
    }),
    []
  );

  const openTaskModal = (task: HomeworkItem) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const columns = [
    {
      header: "Assignment",
      accessor: "title" as keyof HomeworkItem,
      render: (row: HomeworkItem) => (
        <div className="py-1">
          <p className="text-sm font-bold text-slate-800">{row.title}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-blue-600">
              {row.subject}
            </span>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">
              {row.priority}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Due Date",
      accessor: "dueDate" as keyof HomeworkItem,
      render: (row: HomeworkItem) => (
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Calendar size={13} className="text-slate-300" />
          {row.dueDate}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status" as keyof HomeworkItem,
      render: (row: HomeworkItem) => (
        <StatusBadge
          status={row.status}
          variant={
            row.status === "pending"
              ? "warning"
              : row.status === "submitted"
                ? "info"
                : row.status === "overdue"
                  ? "danger"
                  : "success"
          }
        />
      ),
    },
    {
      header: "Action",
      render: (row: HomeworkItem) => (
        <Button
          type="button"
          variant={row.status === "pending" ? "primary" : "outline"}
          size="sm"
          className="h-8 rounded-lg px-4 text-[10px] font-black uppercase tracking-wider"
          onClick={() => openTaskModal(row)}
          title={`Open ${row.title}`}
        >
          {row.status === "pending" ? "Submit" : "Details"}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">Homework</p>
            <h2 className="mt-1 text-xl font-black text-slate-900">Assignments workspace</h2>
            <p className="mt-1 text-sm text-slate-500">Track submissions, deadlines, and graded work in one place.</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Input
              placeholder="Search assignments..."
              icon={Search}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full sm:w-72"
              title="Search assignments"
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as HomeworkStatus | "all")}
              className="h-[42px] rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              title="Filter by status"
              aria-label="Filter by status"
            >
              <option value="all">All status</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="space-y-6">
          <StudentMetricSkeleton cards={3} />
          <StudentTableSkeleton rows={3} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard title="Total Assigned" value={metrics.total} icon={BookOpen} />
            <StatCard title="Action Required" value={metrics.actionRequired} icon={Clock} colorClass="text-amber-600" bgClass="bg-amber-50" />
            <StatCard title="Graded" value={metrics.graded} icon={CheckCircle2} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
            <Card noPadding className="xl:col-span-3 border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">Current assignments</h3>
                <StatusBadge status={`${filteredData.length} in view`} variant="info" />
              </div>
              <DataTable<HomeworkItem> columns={columns} data={filteredData} />
              {filteredData.length === 0 ? (
                <div className="p-4">
                  <StudentEmptyState
                    title="No assignments found"
                    description="No assignments match your current filters."
                  />
                </div>
              ) : null}
            </Card>

            <Card className="border-slate-200">
              <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">Submission guide</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                    <FileUp size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Accepted format</p>
                    <p className="text-xs text-slate-500">Upload PDF files with student ID in footer.</p>
                  </div>
                </div>
                <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    Late submissions may incur penalties based on class policy.
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  Assignment records are read-only in this workspace.
                </div>
              </div>
            </Card>
          </div>

          <StudentFilterHint params={["q", "status"]} />
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Work">
        <div className="space-y-4">
          {selectedTask ? (
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">{selectedTask.subject}</p>
              <h4 className="mt-1 text-base font-black text-slate-900">{selectedTask.title}</h4>
              <p className="mt-2 text-xs text-slate-500">{selectedTask.description}</p>
            </div>
          ) : null}

          <label
            htmlFor="homework-upload"
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center transition-colors hover:border-blue-300 hover:bg-blue-50/40"
          >
            <FileUp size={28} className="text-slate-400" />
            <p className="mt-3 text-sm font-bold text-slate-800">Upload solution</p>
            <p className="text-xs text-slate-500">PDF only, maximum 10MB</p>
            <input id="homework-upload" type="file" accept=".pdf" className="hidden" />
          </label>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="primary">
              Confirm submission
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}