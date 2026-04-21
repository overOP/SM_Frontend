import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { AttendanceFilters } from "../types";

function parsePage(value: string | null): number {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isNaN(n) || n < 1 ? 1 : n;
}

function defaultDateIso() {
  return new Date().toISOString().slice(0, 10);
}

export function useAttendanceFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo<AttendanceFilters>(
    () => ({
      className: searchParams.get("class") ?? "all",
      dateIso: searchParams.get("date") ?? defaultDateIso(),
      search: searchParams.get("search") ?? "",
      page: parsePage(searchParams.get("page")),
    }),
    [searchParams]
  );

  const patch = useCallback(
    (partial: Partial<AttendanceFilters>) => {
      const merged = { ...filters, ...partial };
      const next = new URLSearchParams(searchParams);
      if (merged.className === "all") next.delete("class");
      else next.set("class", merged.className);
      next.set("date", merged.dateIso);
      if (merged.search) next.set("search", merged.search);
      else next.delete("search");
      if (merged.page > 1) next.set("page", String(merged.page));
      else next.delete("page");
      setSearchParams(next, { replace: true });
    },
    [filters, searchParams, setSearchParams]
  );

  return {
    filters,
    setClassName: (className: string) => patch({ className, page: 1 }),
    setDateIso: (dateIso: string) => patch({ dateIso, page: 1 }),
    setSearch: (search: string) => patch({ search, page: 1 }),
    setPage: (page: number) => patch({ page }),
    clear: () =>
      patch({ className: "all", dateIso: defaultDateIso(), search: "", page: 1 }),
  };
}
