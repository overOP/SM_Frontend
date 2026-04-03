import { createContext, useContext, useState, type ReactNode } from "react";

export type ExamStatus = "upcoming" | "ongoing" | "completed";

export const ALL_SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Geography",
  "Physics",
  "Chemistry",
  "Biology",
];

export type Exam = {
  id: string;
  name: string;
  subjects: string[];
  class: string;
  date: string;
  time: string;
  duration: string;
  totalMarks: number;
  status: ExamStatus;
};

export interface ExamFormData {
  name: string;
  subjects: string[];
  class: string;
  date: string;
  time: string;
  duration: string;
  totalMarks: number;
  status: ExamStatus;
}

const initialExams: Exam[] = [
  { id: "EXM001", name: "Mid-Term Exam", subjects: ["Mathematics", "Science", "English", "History", "Geography", "Physics", "Chemistry", "Biology"], class: "10A", date: "2026-04-10", time: "09:00 AM", duration: "3 hrs", totalMarks: 100, status: "upcoming" },
  { id: "EXM002", name: "Unit Test 1", subjects: ["Mathematics", "Science", "English", "History", "Geography", "Physics", "Chemistry", "Biology"], class: "9B", date: "2026-04-05", time: "10:00 AM", duration: "2 hrs", totalMarks: 50, status: "upcoming" },
  { id: "EXM003", name: "Final Exam", subjects: ["Mathematics", "Science", "English", "History", "Geography", "Physics", "Chemistry", "Biology"], class: "8A", date: "2026-03-20", time: "09:00 AM", duration: "3 hrs", totalMarks: 100, status: "completed" },
  { id: "EXM004", name: "Unit Test 2", subjects: ["Mathematics", "Science", "English", "History", "Geography", "Physics", "Chemistry", "Biology"], class: "10A", date: "2026-03-28", time: "11:00 AM", duration: "1.5 hrs", totalMarks: 50, status: "completed" },
];

interface ExamContextType {
  exams: Exam[];
  addExam: (data: ExamFormData) => void;
  deleteExam: (id: string) => void;
}

const ExamContext = createContext<ExamContextType | null>(null);

export const ExamProvider = ({ children }: { children: ReactNode }) => {
  const [exams, setExams] = useState<Exam[]>(initialExams);

  const addExam = (data: ExamFormData) => {
    const newExam: Exam = {
      ...data,
      id: `EXM${Math.floor(100 + Math.random() * 900)}`,
    };
    setExams((prev) => [newExam, ...prev]);
  };

  const deleteExam = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <ExamContext.Provider value={{ exams, addExam, deleteExam }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExamContext = () => {
  const ctx = useContext(ExamContext);
  if (!ctx) throw new Error("useExamContext must be used within ExamProvider");
  return ctx;
};
