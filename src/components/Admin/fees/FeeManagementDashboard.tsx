import { useCallback, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  CreditCard,
  FileText,
  IndianRupee,
  Search,
  TrendingUp,
  Upload,
  Wallet,
} from "lucide-react";

import { seedInvoices, seedPayments } from "../../../data/feeSeed";
import { useFeeLedger } from "../../../hooks/useFeeLedger";
import type { EnrichedInvoice, Invoice, Payment } from "../../../types/fees";
import { Button, Card, DataTable, Input, Select, StatCard, type Column } from "../../ui";
import { Modal } from "../../ui/Modal";
import { CurrencyInput } from "./CurrencyInput";
import { EmptyFeeState } from "./EmptyFeeState";
import { FeeReceiptPrint } from "./FeeReceiptPrint";
import { FeeStatusBadge } from "./FeeStatusBadge";
import type { FeeBadgeVariant } from "./FeeStatusBadge";
import { PaymentSplitterModal } from "./PaymentSplitterModal";
import { resolveInvoiceBadgeVariant } from "./resolveInvoiceBadge";

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function paymentRecordBadge(status: Payment["status"]): FeeBadgeVariant {
  if (status === "success") return "settled";
  if (status === "pending_verification") return "pending_verification";
  return "disputed";
}

export default function FeeManagementDashboard() {
  const [invoices] = useState<Invoice[]>(seedInvoices);
  const [payments, setPayments] = useState<Payment[]>(seedPayments);

  const { metrics, enriched } = useFeeLedger(invoices, payments);

  const firstUnpaid = useMemo(() => enriched.find((r) => r.balance > 0), [enriched]);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const [payOpen, setPayOpen] = useState(false);
  const [splitterOpen, setSplitterOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState("UPI");
  const [payRef, setPayRef] = useState("");
  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);

  const paySlipRef = useRef<HTMLInputElement>(null);
  const quickSlipRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    return enriched.filter((row) => {
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        row.studentName.toLowerCase().includes(q) ||
        row.roll.includes(q) ||
        row.className.toLowerCase().includes(q);
      const v = resolveInvoiceBadgeVariant(row, payments);
      const matchS =
        statusFilter === "All" ||
        (statusFilter === "Settled" && v === "settled") ||
        (statusFilter === "Overdue" && v === "overdue") ||
        (statusFilter === "Pending verification" && v === "pending_verification") ||
        (statusFilter === "Disputed" && v === "disputed") ||
        (statusFilter === "Partial" && v === "partial") ||
        (statusFilter === "Outstanding" && v === "outstanding");
      return matchQ && matchS;
    });
  }, [enriched, query, statusFilter, payments]);

  const openPay = useCallback((inv: Invoice) => {
    const e = enriched.find((x) => x.id === inv.id);
    setActiveInvoice(inv);
    setPayAmount(e?.balance ?? 0);
    setPayRef("");
    setPayOpen(true);
  }, [enriched]);

  const addPayment = useCallback(
    (invoiceId: string, amount: number, method: string, reference: string, status: Payment["status"]) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `pay_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const row: Payment = {
        id,
        invoiceId,
        amount,
        status,
        method,
        reference: reference || undefined,
        createdAt: new Date().toISOString(),
        clientId: status === "pending_verification" ? `client_${id}` : undefined,
      };
      setPayments((p) => [...p, row]);
    },
    []
  );

  const confirmPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInvoice || payAmount <= 0) return;
    addPayment(activeInvoice.id, payAmount, payMethod, payRef, "success");
    setPayOpen(false);
    setActiveInvoice(null);
    setPayAmount(0);
  };

  const onPaySlipUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeInvoice) return;
    const assumed =
      payAmount > 0 ? payAmount : enriched.find((x) => x.id === activeInvoice.id)?.balance ?? 0;
    if (assumed <= 0) {
      window.alert("Enter an amount before uploading a slip (optimistic demo).");
      e.target.value = "";
      return;
    }
    addPayment(activeInvoice.id, assumed, "Bank transfer (slip)", file.name, "pending_verification");
    setPayOpen(false);
    setActiveInvoice(null);
    setPayAmount(0);
    e.target.value = "";
  };

  const onQuickSlipUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file || !firstUnpaid) {
      window.alert("No outstanding balance to attach a slip to.");
      e.target.value = "";
      return;
    }
    const inv = invoices.find((i) => i.id === firstUnpaid.id);
    if (!inv || firstUnpaid.balance <= 0) {
      e.target.value = "";
      return;
    }
    addPayment(inv.id, firstUnpaid.balance, "Bank slip (upload)", file.name, "pending_verification");
    e.target.value = "";
  };

  const ledgerRows = useMemo(() => {
    return [...payments].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [payments]);

  const columns: Column<EnrichedInvoice>[] = useMemo(
    () => [
      {
        header: "Student",
        render: (row) => (
          <div>
            <p className="font-bold text-slate-800">{row.studentName}</p>
            <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">
              Roll {row.roll} · {row.className}
            </p>
          </div>
        ),
      },
      {
        header: "Billed",
        render: (row) => <span className="font-medium text-slate-600">{formatMoney(row.totalAmount)}</span>,
      },
      {
        header: "Paid",
        render: (row) => (
          <span className="font-black text-emerald-600">{formatMoney(row.paidFromSuccess)}</span>
        ),
      },
      {
        header: "Balance",
        render: (row) => (
          <span className={`font-black ${row.balance > 0 ? "text-rose-600" : "text-slate-300"}`}>
            {row.balance > 0 ? formatMoney(row.balance) : "—"}
          </span>
        ),
      },
      {
        header: "Status",
        render: (row) => (
          <FeeStatusBadge variant={resolveInvoiceBadgeVariant(row, payments)} />
        ),
      },
      {
        header: "Actions",
        render: (row) => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="sm" type="button" onClick={() => openPay(row)}>
              <CreditCard size={14} className="mr-1 text-blue-500" />
              Pay
            </Button>
          </div>
        ),
      },
    ],
    [openPay, payments]
  );

  return (
    <div className="min-h-screen space-y-8 bg-slate-50/50 p-6 md:p-8">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">Fee management</h1>
          <p className="text-sm font-medium text-slate-400">
            Reactive ledger · split allocation · optimistic bank slips
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="bg-white">
            <FileText size={16} className="mr-2" />
            Reports
          </Button>
          <Button
            variant="primary"
            className="shadow-lg shadow-blue-100"
            type="button"
            onClick={() => firstUnpaid && openPay(firstUnpaid)}
          >
            <Wallet size={16} className="mr-2" />
            Collect fees
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total billed"
          value={formatMoney(metrics.totalBilled)}
          icon={TrendingUp}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
        />
        <StatCard
          title="Total paid (verified)"
          value={formatMoney(metrics.totalPaid)}
          icon={IndianRupee}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50"
        />
        <StatCard
          title="Current balance"
          value={formatMoney(metrics.currentBalance)}
          icon={ArrowUpRight}
          colorClass="text-slate-800"
        />
        <StatCard
          title="Overdue exposure"
          value={formatMoney(metrics.overdueAmount)}
          icon={IndianRupee}
          colorClass="text-rose-600"
          bgClass="bg-rose-50"
        />
      </div>

      {metrics.totalPendingVerification > 0 && (
        <p className="text-xs font-bold text-amber-700">
          Pending verification: {formatMoney(metrics.totalPendingVerification)} across slips awaiting finance
          approval.
        </p>
      )}

      <Card noPadding className="overflow-hidden border-none bg-white shadow-xl shadow-slate-200/50">
        <div className="flex flex-col gap-4 border-b border-slate-50 bg-white p-6 md:flex-row">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search by name, roll, or class..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select
            className="w-full md:w-56"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              "All",
              "Settled",
              "Outstanding",
              "Partial",
              "Overdue",
              "Pending verification",
              "Disputed",
            ]}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="p-8">
            <EmptyFeeState
              onPay={firstUnpaid ? () => openPay(firstUnpaid) : undefined}
              description="Try clearing filters or record a new payment from the table when students exist."
            />
          </div>
        ) : (
          <DataTable columns={columns} data={filtered} emptyMessage="" />
        )}
      </Card>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <Card className="border-none p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">Transaction ledger</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Newest first · optimistic rows appear immediately
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {ledgerRows.length === 0 ? (
              <EmptyFeeState title="No payments yet" description="Record a payment or upload a bank slip." />
            ) : (
              ledgerRows.map((p) => {
                const inv = invoices.find((i) => i.id === p.invoiceId);
                return (
                  <div
                    key={p.id}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-black text-slate-900">{formatMoney(p.amount)}</p>
                      <p className="text-xs font-medium text-slate-500">
                        {inv?.studentName ?? p.invoiceId} · {p.method}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(p.createdAt).toLocaleString("en-IN")}
                        {p.clientId && (
                          <span className="ml-2 font-bold text-amber-600">· optimistic id</span>
                        )}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <FeeStatusBadge variant={paymentRecordBadge(p.status)} />
                      {p.status === "success" && inv && (
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          className="rounded-xl"
                          onClick={() => {
                            setReceiptPayment(p);
                            setReceiptOpen(true);
                          }}
                        >
                          Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        <Card className="border-none p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-900">Quick slip upload</h3>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Attaches to the first invoice with an outstanding balance — pending verification appears instantly in the
            ledger.
          </p>
          <input
            ref={quickSlipRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            title="Upload bank slip"
            aria-label="Upload bank slip"
            onChange={onQuickSlipUpload}
          />
          <Button
            variant="outline"
            className="mt-6 w-full gap-2 rounded-2xl"
            type="button"
            onClick={() => quickSlipRef.current?.click()}
          >
            <Upload size={18} />
            Upload bank slip
          </Button>
        </Card>
      </div>

      <Modal isOpen={payOpen} onClose={() => setPayOpen(false)} title="Record fee payment">
        {activeInvoice && (
          <form onSubmit={confirmPay} className="space-y-6">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Student
              </p>
              <h4 className="font-bold text-slate-800">
                {activeInvoice.studentName} ({activeInvoice.roll})
              </h4>
              <div className="mt-3 flex justify-between border-t border-slate-200/50 pt-3">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Balance (verified)</p>
                  <p className="text-lg font-black text-rose-600">
                    {formatMoney(enriched.find((x) => x.id === activeInvoice.id)?.balance ?? 0)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Due</p>
                  <p className="font-bold text-slate-700">{activeInvoice.dueDate}</p>
                </div>
              </div>
            </div>

            <CurrencyInput label="Amount" value={payAmount} onChange={setPayAmount} />
            <Select
              label="Method"
              options={["UPI", "Bank Transfer", "Cash", "Cheque"]}
              value={payMethod}
              onChange={(e) => setPayMethod(e.target.value)}
            />
            <Input
              label="Reference (optional)"
              placeholder="Txn id / cheque no."
              value={payRef}
              onChange={(e) => setPayRef(e.target.value)}
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setSplitterOpen(true)}
              >
                Preview allocation
              </Button>
              <input
                ref={paySlipRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                title="Upload payment slip"
                aria-label="Upload payment slip"
                onChange={onPaySlipUpload}
              />
              <Button
                type="button"
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => paySlipRef.current?.click()}
              >
                <Upload size={16} />
                Upload slip (pending)
              </Button>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="ghost" className="flex-1" onClick={() => setPayOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1 shadow-lg shadow-blue-100">
                Confirm payment
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <PaymentSplitterModal
        open={splitterOpen}
        onClose={() => setSplitterOpen(false)}
        invoice={activeInvoice}
        paymentAmount={payAmount}
        allPayments={payments}
        onConfirm={() => setSplitterOpen(false)}
      />

      <Modal isOpen={receiptOpen} onClose={() => setReceiptOpen(false)} title="Receipt preview">
        {receiptPayment && (
          <FeeReceiptPrint
            payment={receiptPayment}
            invoice={invoices.find((i) => i.id === receiptPayment.invoiceId)!}
          />
        )}
      </Modal>
    </div>
  );
}
