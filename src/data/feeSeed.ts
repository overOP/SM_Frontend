import type { Invoice, Payment } from "../types/fees";

export const seedInvoices: Invoice[] = [
  {
    id: "inv_1",
    studentId: "stu_1",
    studentName: "Arjun Mehta",
    roll: "101",
    className: "10-A",
    dueDate: "2025-03-15",
    totalAmount: 45000,
    lines: [
      { id: "l1a", priority: 1, category: "Tuition", amount: 35000 },
      { id: "l1b", priority: 2, category: "Lab Fee", amount: 7000 },
      { id: "l1c", priority: 3, category: "Sports", amount: 3000 },
    ],
  },
  {
    id: "inv_2",
    studentId: "stu_2",
    studentName: "Sana Shaikh",
    roll: "102",
    className: "10-A",
    dueDate: "2025-01-10",
    totalAmount: 45000,
    lines: [
      { id: "l2a", priority: 1, category: "Tuition", amount: 36000 },
      { id: "l2b", priority: 2, category: "Lab Fee", amount: 9000 },
    ],
  },
  {
    id: "inv_3",
    studentId: "stu_3",
    studentName: "Rohan Varma",
    roll: "105",
    className: "10-C",
    dueDate: "2025-04-01",
    totalAmount: 45000,
    disputed: true,
    lines: [
      { id: "l3a", priority: 1, category: "Tuition", amount: 40000 },
      { id: "l3b", priority: 2, category: "Lab Fee", amount: 5000 },
    ],
  },
];

export const seedPayments: Payment[] = [
  {
    id: "pay_1",
    invoiceId: "inv_1",
    amount: 45000,
    status: "success",
    method: "UPI",
    reference: "UPI-9921",
    createdAt: "2025-03-12T10:00:00.000Z",
  },
  {
    id: "pay_2",
    invoiceId: "inv_2",
    amount: 20000,
    status: "success",
    method: "Bank Transfer",
    reference: "NEFT-44002",
    createdAt: "2025-03-01T14:30:00.000Z",
  },
];
