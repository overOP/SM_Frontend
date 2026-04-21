import type { ElementType } from "react";
import { StatCard } from "../../ui";

export interface AdminKpiItem {
  title: string;
  value: string | number;
  icon?: ElementType;
  trend?: number;
  colorClass?: string;
  bgClass?: string;
}

interface AdminKpiRowProps {
  items: AdminKpiItem[];
}

export function AdminKpiRow({ items }: AdminKpiRowProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          icon={item.icon}
          trend={item.trend}
          colorClass={item.colorClass}
          bgClass={item.bgClass}
        />
      ))}
    </div>
  );
}
