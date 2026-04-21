import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { StudentFilters } from "../types";

function asPositiveInt(value: string | null, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
}

export function useStudentFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<StudentFilters>(
    () => ({
      search: searchParams.get("search") ?? "",
      className: searchParams.get("class") ?? "all",
      section: searchParams.get("section") ?? "all",
      page: asPositiveInt(searchParams.get("page"), 1),
    }),
    [searchParams]
  );

  const patchFilters = useCallback(
    (patch: Partial<StudentFilters>) => {
      const next = new URLSearchParams(searchParams);
      const merged: StudentFilters = { ...filters, ...patch };
      if (merged.search) next.set("search", merged.search);
      else next.delete("search");
      if (merged.className !== "all") next.set("class", merged.className);
      else next.delete("class");
      if (merged.section !== "all") next.set("section", merged.section);
      else next.delete("section");
      if (merged.page > 1) next.set("page", String(merged.page));
      else next.delete("page");
      setSearchParams(next, { replace: true });
    },
    [filters, searchParams, setSearchParams]
  );

  return {
    filters,
    setSearch: (search: string) => patchFilters({ search, page: 1 }),
    setClassName: (className: string) => patchFilters({ className, section: "all", page: 1 }),
    setSection: (section: string) => patchFilters({ section, page: 1 }),
    setPage: (page: number) => patchFilters({ page }),
    clear: () => patchFilters({ search: "", className: "all", section: "all", page: 1 }),
  };
}
