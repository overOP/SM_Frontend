import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import type { AttendanceStatus, AttendanceStudent } from "../types";

interface AttendanceDataTableProps {
  rows: AttendanceStudent[];
  selectedIds: Set<string>;
  onToggleOne: (id: string) => void;
  onToggleAllPage: () => void;
  onSetStatus: (id: string, status: AttendanceStatus) => void;
  onOpenDetail: (id: string) => void;
}

function badge(status: AttendanceStatus) {
  if (status === "Present") return "bg-emerald-50 border-emerald-100 text-emerald-700";
  if (status === "Absent") return "bg-rose-50 border-rose-100 text-rose-700";
  return "bg-amber-50 border-amber-100 text-amber-700";
}

export function AttendanceDataTable({
  rows,
  selectedIds,
  onToggleOne,
  onToggleAllPage,
  onSetStatus,
  onOpenDetail,
}: AttendanceDataTableProps) {
  const allSelected = rows.length > 0 && rows.every((r) => selectedIds.has(r.id));

  const columns: ColumnDef<AttendanceStudent>[] = [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          checked={allSelected}
          onChange={onToggleAllPage}
          aria-label="Select all rows"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedIds.has(row.original.id)}
          onChange={() => onToggleOne(row.original.id)}
          aria-label={`Select ${row.original.name}`}
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Student",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onOpenDetail(row.original.id)}
          className="font-semibold text-slate-800 hover:text-blue-700"
        >
          {row.original.name}
        </button>
      ),
    },
    { accessorKey: "roll", header: "Roll" },
    { accessorKey: "className", header: "Class" },
    { accessorKey: "section", header: "Section" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${badge(row.original.status)}`}>
          {row.original.status}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              aria-label={`Open actions for ${row.original.name}`}
              title={`Open actions for ${row.original.name}`}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              sideOffset={6}
              className="z-30 min-w-[140px] rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
            >
              <DropdownMenu.Item
                className="cursor-pointer rounded px-2 py-1.5 text-xs font-medium text-slate-700 outline-none hover:bg-slate-50"
                onSelect={() => onOpenDetail(row.original.id)}
              >
                View Detail
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="cursor-pointer rounded px-2 py-1.5 text-xs font-medium text-emerald-700 outline-none hover:bg-emerald-50"
                onSelect={() => onSetStatus(row.original.id, "Present")}
              >
                Mark Present
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="cursor-pointer rounded px-2 py-1.5 text-xs font-medium text-rose-700 outline-none hover:bg-rose-50"
                onSelect={() => onSetStatus(row.original.id, "Absent")}
              >
                Mark Absent
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="cursor-pointer rounded px-2 py-1.5 text-xs font-medium text-amber-700 outline-none hover:bg-amber-50"
                onSelect={() => onSetStatus(row.original.id, "On Leave")}
              >
                Mark Leave
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      ),
    },
  ];

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id} className="border-b border-slate-100 bg-slate-50">
              {group.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-3 py-2 text-xs font-black uppercase tracking-wider text-slate-400"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={table.getAllColumns().length}
                className="px-3 py-6 text-center text-sm text-slate-400"
              >
                No attendance rows for current filters.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/70">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-1.5 text-slate-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
