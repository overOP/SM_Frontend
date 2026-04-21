import { Download, Save } from "lucide-react";
import { Button, Input, Select } from "../../../components/ui";
import { AdminSectionToolbar } from "../../../components/Admin/shared/AdminSectionToolbar";

interface AttendanceFilterBarProps {
  className: string;
  dateIso: string;
  search: string;
  classOptions: string[];
  onClassChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onMarkAllPresent: () => void;
  onMarkAllAbsent: () => void;
  onSave: () => void;
  onExport: () => void;
}

export function AttendanceFilterBar({
  className,
  dateIso,
  search,
  classOptions,
  onClassChange,
  onDateChange,
  onSearchChange,
  onMarkAllPresent,
  onMarkAllAbsent,
  onSave,
  onExport,
}: AttendanceFilterBarProps) {
  return (
    <AdminSectionToolbar
      title="Attendance Console"
      description="High-density attendance operations and audit controls"
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search by student name or roll..."
      filters={
        <>
          <Select
            options={classOptions}
            value={className}
            onChange={(e) => onClassChange(e.target.value)}
            className="w-40"
          />
          <Input
            type="date"
            value={dateIso}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-44"
          />
        </>
      }
      actions={
        <>
          <Button size="sm" variant="outline" onClick={onMarkAllPresent}>
            Mark all present
          </Button>
          <Button size="sm" variant="outline" onClick={onMarkAllAbsent}>
            Mark all absent
          </Button>
          <Button size="sm" variant="outline" className="gap-2" onClick={onExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="gap-2" onClick={onSave}>
            <Save className="h-4 w-4" />
            Save
          </Button>
        </>
      }
    />
  );
}
