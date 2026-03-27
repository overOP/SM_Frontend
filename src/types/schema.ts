// src/types/schema.ts

export type Priority = "High" | "Medium" | "Low";

export type AnnouncementAudience = "Everyone" | "Students" | "Faculty" | "Parents";

export interface Announcement {
  id: number;
  priority: Priority;
  audience: AnnouncementAudience;
  title: string;
  author: string;
  content: string;
  date: string;
  isPinned: boolean;
  avatarUrl?: string; // Optional field for user photos
}

// specific helper for UI components
export interface AnnouncementProps {
  data: Announcement;
  onAction?: (id: number) => void;
}