import { Search } from "lucide-react";
import { Input } from "../../ui";
import type { ReactNode } from "react";

interface AdminSectionToolbarProps {
  title: string;
  description: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  filters?: ReactNode;
  actions?: ReactNode;
}

export function AdminSectionToolbar({
  title,
  description,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters,
  actions,
}: AdminSectionToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">{title}</h1>
          <p className="text-sm font-medium text-slate-400">{description}</p>
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <Input
          placeholder={searchPlaceholder}
          icon={Search}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-md"
        />
        {filters ? <div className="flex flex-wrap items-center gap-3">{filters}</div> : null}
      </div>
    </div>
  );
}
