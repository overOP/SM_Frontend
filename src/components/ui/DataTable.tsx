import type { ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (row: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export function DataTable<T>({ columns, data, emptyMessage = "No results found" }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            {columns.map((col, i) => (
              <th key={i} className="py-4 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="py-4 px-4 text-sm text-slate-600 font-medium">
                  {col.render ? col.render(row, rowIndex) : (row[col.accessor] as ReactNode)}
                </td>
              ))}
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length} className="py-20 text-center text-slate-400">{emptyMessage}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}