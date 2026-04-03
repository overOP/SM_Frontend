import { createContext, useContext, useState, type ReactNode } from "react";

export interface Announcement {
  id: number;
  priority: "High" | "Medium" | "Low";
  audience: string;
  title: string;
  author: string;
  content: string;
  date: string;
  pinned: boolean;
}

const initialAnnouncements: Announcement[] = [
  {
    id: 1,
    priority: "High",
    audience: "Everyone",
    title: "Annual Sports Day 2026",
    author: "Dr. Sarah Johnson",
    content:
      "The annual sports meet is scheduled for next month. Please ensure all student registrations are completed.",
    date: "Oct 24, 2026",
    pinned: true,
  },
  {
    id: 2,
    priority: "High",
    audience: "Students",
    title: "Mid-Term Examination Schedule",
    author: "Academic Office",
    content:
      "The detailed schedule for the upcoming mid-term examinations has been uploaded.",
    date: "Oct 22, 2026",
    pinned: true,
  },
  {
    id: 3,
    priority: "Medium",
    audience: "Students",
    title: "Library New Arrivals",
    author: "Librarian",
    content: "New reference books and fiction titles are now available in the main library.",
    date: "Oct 20, 2026",
    pinned: false,
  },
  {
    id: 4,
    priority: "Medium",
    audience: "Students",
    title: "Canteen Menu Update",
    author: "Admin Staff",
    content: "The weekly menu has been updated with healthier and seasonal options.",
    date: "Oct 19, 2026",
    pinned: false,
  },
  {
    id: 5,
    priority: "Medium",
    audience: "Students",
    title: "Tech Club Meeting",
    author: "John Doe",
    content: "Tech Club members will meet in Lab 2 for upcoming hackathon planning.",
    date: "Oct 18, 2026",
    pinned: false,
  },
];

interface AnnouncementContextType {
  announcements: Announcement[];
  addAnnouncement: (announcement: Announcement) => void;
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
}

const AnnouncementContext = createContext<AnnouncementContextType | null>(null);

export const AnnouncementProvider = ({ children }: { children: ReactNode }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);

  const addAnnouncement = (announcement: Announcement) => {
    setAnnouncements((prev) => [announcement, ...prev]);
  };

  return (
    <AnnouncementContext.Provider value={{ announcements, addAnnouncement, setAnnouncements }}>
      {children}
    </AnnouncementContext.Provider>
  );
};

export const useAnnouncements = () => {
  const ctx = useContext(AnnouncementContext);
  if (!ctx) throw new Error("useAnnouncements must be used within AnnouncementProvider");
  return ctx;
};
