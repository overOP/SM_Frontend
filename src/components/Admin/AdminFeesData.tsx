import React, { useState, useMemo } from 'react';
import { 
  Search, 
  IndianRupee, 
  Download, 
  Plus, 
  FileText,
  CreditCard,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { 
  StatCard, 
  DataTable, 
  StatusBadge, 
  Card, 
  Input, 
  Select, 
  Button, 
   
} from '../ui';
import { Modal } from '../ui/Modal';

// --- Types ---
interface FeeRecord {
  id: number;
  name: string;
  roll: string;
  class: string;
  total: number;
  paid: number;
  due: number;
  status: 'Paid' | 'Partial' | 'Unpaid';
  lastPaymentDate?: string;
}

// --- Utilities ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const AdminFeesData: React.FC = () => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<FeeRecord | null>(null);

  // Memoized filter for performance
  const filtered = useMemo(() => {
    return FEE_DATA.filter(item => {
      const matchesQuery = 
        item.name.toLowerCase().includes(query.toLowerCase()) || 
        item.roll.includes(query);
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter]);

  const columns = [
    { 
      header: 'Student Details', 
      render: (row: FeeRecord) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xs font-black text-blue-600 border border-blue-100">
            {row.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="font-bold text-slate-800 leading-tight">{row.name}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Roll: {row.roll} • {row.class}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Total Amount', 
      render: (row: FeeRecord) => (
        <span className="text-slate-500 font-medium">{formatCurrency(row.total)}</span>
      )
    },
    { 
      header: 'Paid', 
      render: (row: FeeRecord) => (
        <div className="flex flex-col">
          <span className="text-emerald-600 font-black">{formatCurrency(row.paid)}</span>
          {row.lastPaymentDate && <span className="text-[9px] text-slate-400 font-bold">Updated {row.lastPaymentDate}</span>}
        </div>
      )
    },
    { 
      header: 'Balance Due', 
      render: (row: FeeRecord) => (
        <span className={`font-black ${row.due > 0 ? 'text-rose-500' : 'text-slate-300'}`}>
          {row.due > 0 ? formatCurrency(row.due) : 'Settled'}
        </span>
      )
    },
    { 
      header: 'Status', 
      render: (row: FeeRecord) => (
        <StatusBadge 
          status={row.status} 
          variant={row.status === 'Paid' ? 'success' : row.status === 'Partial' ? 'warning' : 'danger'} 
        />
      )
    },
    { 
      header: 'Actions', 
      render: (row: FeeRecord) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => { setSelectedStudent(row); setIsPaymentModalOpen(true); }}>
            <CreditCard size={14} className="text-blue-500 mr-1" /> Pay
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Download size={14} className="text-slate-400" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Fee Management</h1>
          <p className="text-sm text-slate-400 font-medium">Track collections, outstanding balances, and invoices</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white"><FileText size={16} className="mr-2"/> Reports</Button>
          <Button variant="primary" className="shadow-lg shadow-blue-100"><Plus size={16} className="mr-2"/> Collect Fees</Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Collection" 
          value="₹4,20,500" 
          icon={TrendingUp} 
          colorClass="text-emerald-600"
        />
        <StatCard 
          title="Outstanding Dues" 
          value="₹85,200" 
          icon={IndianRupee} 
          colorClass="text-rose-600" 
          bgClass="bg-rose-50"
        />
        <StatCard 
          title="Collection Rate" 
          value="82.4%" 
          icon={ArrowUpRight} 
          colorClass="text-blue-600" 
          bgClass="bg-blue-50"
        />
      </div>

      {/* Main Table Section */}
      <Card noPadding className="border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 bg-white">
          <div className="flex-1">
            <Input 
              icon={Search}
              placeholder="Search by student name or roll number..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
               <Button 
                variant={statusFilter === 'All' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setStatusFilter('All')}
                className="text-[10px] font-black uppercase"
               >All</Button>
               <Button 
                variant={statusFilter === 'Unpaid' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setStatusFilter('Unpaid')}
                className="text-[10px] font-black uppercase"
               >Unpaid</Button>
            </div>
            <Select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)} 
              options={['All', 'Paid', 'Partial', 'Unpaid']} 
              className="w-40"
            />
          </div>
        </div>

        <DataTable columns={columns} data={filtered} />
      </Card>

      {/* Quick Payment Modal */}
      <Modal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)}
        title="Record Fee Payment"
      >
        {selectedStudent && (
          <form className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Student Information</p>
              <h4 className="font-bold text-slate-800">{selectedStudent.name} ({selectedStudent.roll})</h4>
              <div className="flex justify-between mt-3 pt-3 border-t border-slate-200/50">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total Due</p>
                  <p className="text-lg font-black text-rose-600">{formatCurrency(selectedStudent.due)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Class</p>
                  <p className="font-bold text-slate-700">{selectedStudent.class}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Input label="Amount to Pay" type="number" icon={IndianRupee} placeholder="Enter amount" />
              <Select label="Payment Method" options={['Cash', 'Bank Transfer', 'UPI', 'Cheque']} />
              <Input label="Reference Number (Optional)" placeholder="Transaction ID or Cheque No." />
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="ghost" className="flex-1" onClick={() => setIsPaymentModalOpen(false)}>Cancel</Button>
              <Button variant="primary" className="flex-1 shadow-lg shadow-blue-100">Confirm Payment</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

const FEE_DATA: FeeRecord[] = [
  { id: 1, name: 'Arjun Mehta', roll: '101', class: '10-A', total: 45000, paid: 45000, due: 0, status: 'Paid', lastPaymentDate: '12 Mar' },
  { id: 2, name: 'Sana Shaikh', roll: '102', class: '10-A', total: 45000, paid: 20000, due: 25000, status: 'Partial', lastPaymentDate: '05 Feb' },
  { id: 3, name: 'Rohan Varma', roll: '105', class: '10-C', total: 45000, paid: 0, due: 45000, status: 'Unpaid' },
  { id: 4, name: 'Meera Iyer', roll: '110', class: '12-B', total: 55000, paid: 55000, due: 0, status: 'Paid', lastPaymentDate: '20 Mar' },
];

export default AdminFeesData;