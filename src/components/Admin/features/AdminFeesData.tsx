


import { useState } from "react";
import { Search, Eye, Download, X, Printer, Calendar } from "lucide-react";
import { exportToExcel } from "../../../utils/excel";

type FeeStatus = "Paid" | "Partial" | "Unpaid";

interface FeeRecord {
  id: number;
  name: string;
  roll: string;
  class: string;
  total: string;
  paid: string;
  due: string;
  status: FeeStatus;
  lastPaymentDate?: string;
  paymentMethod?: string;
}

const AdminFeesData = () => {
  const [feeRecords] = useState<FeeRecord[]>([
    { id: 1, name: "Arjun Mehta", roll: "101", class: "10-A", total: "45,000", paid: "45,000", due: "0", status: "Paid", lastPaymentDate: "12 Mar 2026", paymentMethod: "UPI" },
    { id: 2, name: "Sana Shaikh", roll: "102", class: "10-A", total: "45,000", paid: "20,000", due: "25,000", status: "Partial", lastPaymentDate: "05 Feb 2026", paymentMethod: "Cash" },
    { id: 3, name: "Rahul Verma", roll: "105", class: "10-B", total: "42,000", paid: "0", due: "42,000", status: "Unpaid", lastPaymentDate: "N/A", paymentMethod: "N/A" },
    { id: 4, name: "Priya Das", roll: "108", class: "9-C", total: "38,000", paid: "38,000", due: "0", status: "Paid", lastPaymentDate: "20 Jan 2026", paymentMethod: "Bank Transfer" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<FeeRecord | null>(null);

  // --- Search Logic ---
  const filteredData = feeRecords.filter((record) =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.roll.includes(searchTerm) ||
    record.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Excel Export Logic ---
  const handleExport = () => {
    exportToExcel(filteredData, "FeeRecords", `Fee_Report_${new Date().toLocaleDateString()}.xlsx`);
  };

  // --- Print Receipt Logic ---
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-900 animate-in fade-in duration-500">
      
      {/* Header with Global Export */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Financial Overview</h1>
          <p className="text-sm text-slate-500">Manage student fees and collection reports</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
        >
          <Download size={18} className="text-emerald-600" /> Export All to Excel
        </button>
      </div>

      {/* Stats Cards (Condensed for brevity, same as previous) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 print:hidden">
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Collected</span>
          <h2 className="text-2xl font-bold text-emerald-600 mt-1">Rs.8,12,000</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Pending</span>
          <h2 className="text-2xl font-bold text-red-500 mt-1">Rs.4,33,000</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Collection Rate</span>
          <h2 className="text-2xl font-bold text-blue-600 mt-1">65%</h2>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden print:hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by name or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="p-4 text-[11px] font-bold text-slate-500 uppercase">Student</th>
              <th className="p-4 text-[11px] font-bold text-slate-500 uppercase">Class</th>
              <th className="p-4 text-[11px] font-bold text-slate-500 uppercase">Total</th>
              <th className="p-4 text-[11px] font-bold text-slate-500 uppercase">Paid</th>
              <th className="p-4 text-[11px] font-bold text-slate-500 uppercase text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/50">
                <td className="p-4 text-sm font-bold">{student.name}</td>
                <td className="p-4 text-sm text-slate-600">{student.class}</td>
                <td className="p-4 text-sm">Rs.{student.total}</td>
                <td className="p-4 text-sm text-emerald-600 font-bold">Rs.{student.paid}</td>
                <td className="p-4 flex justify-center gap-2">
                  <button onClick={() => setSelectedStudent(student)} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Eye size={16}/></button>
                  <button onClick={handleExport} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Download size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL / PRINT RECEIPT --- */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          {/* We add a specific ID for printing if needed, but window.print() usually takes the whole viewport. 
              To hide background elements during print, we use 'print:hidden' classes above. */}
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300 print:shadow-none print:m-0">
            
            {/* Modal Header (Hide on print if you want a clean receipt) */}
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center print:bg-white print:text-black print:border-b print:pb-4">
              <div>
                <h2 className="text-xl font-bold">Fee Receipt</h2>
                <p className="text-xs opacity-70">Transaction ID: #PAY-{(selectedStudent.id * 8923)}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="print:hidden p-2 hover:bg-white/10 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
                {/* Branding for print */}
                <div className="hidden print:block text-center mb-6">
                    <h1 className="text-2xl font-black uppercase tracking-widest">Excel Academy</h1>
                    <p className="text-sm">Official Tuition Fee Receipt - 2026</p>
                </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Student Name</p>
                  <p className="font-bold text-slate-800">{selectedStudent.name}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Roll & Class</p>
                  <p className="font-bold text-slate-800">{selectedStudent.roll} | {selectedStudent.class}</p>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-slate-200 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Total Fees</span>
                  <span className="font-bold">Rs.{selectedStudent.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Amount Paid</span>
                  <span className="font-bold text-emerald-600">₹{selectedStudent.paid}</span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800">Remaining Balance</span>
                  <span className="font-black text-red-500">Rs.{selectedStudent.due}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center text-xs italic text-slate-500">
                <div className="flex items-center gap-2"><Calendar size={12}/> Date: {selectedStudent.lastPaymentDate}</div>
                <div>Method: {selectedStudent.paymentMethod}</div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 print:hidden">
                <button 
                  onClick={handlePrint}
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 transition-all"
                >
                  <Printer size={18} /> Print Receipt
                </button>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="px-6 py-3 font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
                >
                  Close
                </button>
              </div>

              <div className="hidden print:block text-center mt-12 pt-8 border-t border-slate-100">
                <p className="text-xs text-slate-400">This is a computer-generated document. No signature required.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeesData;