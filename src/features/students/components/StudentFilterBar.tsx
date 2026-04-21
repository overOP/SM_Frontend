import { Download, Upload } from "lucide-react";
import { Button, Select } from "../../../components/ui";
import { AdminSectionToolbar } from "../../../components/Admin/shared/AdminSectionToolbar";
import { RoleGuard } from "../../../components/auth/RoleGuard";

interface StudentFilterBarProps {
  search: string;
  className: string;
  section: string;
  classOptions: string[];
  sectionOptions: string[];
  onSearchChange: (value: string) => void;
  onClassChange: (value: string) => void;
  onSectionChange: (value: string) => void;
  onOpenImport: () => void;
  onExport: () => void;
  totalInView: number;
}

export function StudentFilterBar({
  search,
  className,
  section,
  classOptions,
  sectionOptions,
  onSearchChange,
  onClassChange,
  onSectionChange,
  onOpenImport,
  onExport,
  totalInView,
}: StudentFilterBarProps) {
  return (
    <AdminSectionToolbar
      title="Student Registry"
      description={`Compact operations desk · ${totalInView} records in current filter`}
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search by name or admission ID"
      filters={
        <>
          <Select
            value={className}
            onChange={(e) => onClassChange(e.target.value)}
            options={classOptions}
            className="w-36"
          />
          <Select
            value={section}
            onChange={(e) => onSectionChange(e.target.value)}
            options={sectionOptions}
            className="w-36"
          />
        </>
      }
      actions={
        <>
          <Button variant="outline" size="sm" onClick={onExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <RoleGuard role="admin">
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenImport}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Bulk Import
            </Button>
          </RoleGuard>
        </>
      }
    />
  );
}
