import { AdminTableSkeleton } from "../../shared/components/AdminFeatureStates";

export function StudentTableSkeleton() {
  return <AdminTableSkeleton title="Loading students..." rows={8} />;
}
