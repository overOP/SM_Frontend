import { useMemo } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import type { Student } from "../types";
import { RoleGuard } from "../../../components/auth/RoleGuard";

interface StudentDataTableProps {
  rows: Student[];
  selectedIds: Set<string>;
  onToggleOne: (studentId: string) => void;
  onToggleAllPage: () => void;
  onOpenDetail: (studentId: string) => void;
}

function badge(status: Student["status"]) {
  if (status === "active") return "bg-emerald-50 text-emerald-700 border-emerald-100";
  return "bg-amber-50 text-amber-700 border-amber-100";
}

export function StudentDataTable({
  rows,
  selectedIds,
  onToggleOne,
  onToggleAllPage,
  onOpenDetail,
}: StudentDataTableProps) {
  const allSelected =
    rows.length > 0 && rows.every((row) => selectedIds.has(row.id));

  const columns = useMemo<ColumnDef<Student>[]>(
    () => [
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
        header: "Name",
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
      { accessorKey: "admissionId", header: "Admission ID" },
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
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                sideOffset={6}
                className="z-30 min-w-[150px] rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
              >
                <DropdownMenu.Item
                  onSelect={() => onOpenDetail(row.original.id)}
                  className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-slate-700 outline-none hover:bg-slate-50"
                >
                  View Profile
                </DropdownMenu.Item>
                <DropdownMenu.Item className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-slate-700 outline-none hover:bg-slate-50">
                  Edit
                </DropdownMenu.Item>
                <DropdownMenu.Item className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-slate-700 outline-none hover:bg-slate-50">
                  Change Status
                </DropdownMenu.Item>
                <RoleGuard role="admin">
                  <DropdownMenu.Item className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-rose-600 outline-none hover:bg-rose-50">
                    Delete
                  </DropdownMenu.Item>
                </RoleGuard>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        ),
      },
    ],
    [allSelected, onOpenDetail, onToggleAllPage, onToggleOne, selectedIds]
  );

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
              <td colSpan={table.getAllColumns().length} className="px-3 py-6 text-center text-sm text-slate-400">
                No students found for current filters.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/60">
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
