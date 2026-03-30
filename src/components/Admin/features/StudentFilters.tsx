import React from "react";
import { Search, Download, ChevronDown } from "lucide-react";

interface StudentFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedClass: string;
  onClassChange: (className: string) => void;
  classOptions: string[];
  onExport: () => void;
}

const StudentFilters: React.FC<StudentFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedClass,
  onClassChange,
  classOptions,
  onExport,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div className="relative">
        <select
          value={selectedClass}
          onChange={(e) => onClassChange(e.target.value)}
          className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-8 outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          {classOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
      </div>

      <button
        onClick={onExport}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all shadow-lg shadow-green-100"
      >
        <Download size={18} />
        Export
      </button>
    </div>
  );
};

export default StudentFilters;