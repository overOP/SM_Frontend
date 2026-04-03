import * as XLSX from 'xlsx';

/** Exports an array of objects to an .xlsx file. */
export const exportToExcel = (data: object[], sheetName: string, filename: string): void => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
};
