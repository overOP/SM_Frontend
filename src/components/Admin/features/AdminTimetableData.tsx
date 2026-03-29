import { useState } from "react";
import { ChevronDown, Check, Pencil, Trash2, X, Plus } from "lucide-react";

interface Session {
  subject: string;
  time: string;
  teacher?: string;
  room?: string;
  color?: string;
  bgColor?: string;
  isBreak?: boolean;
}

interface TimetableDay {
  day: string;
  isToday?: boolean;
  sessions: Session[];
}

const classTimetables: Record<string, TimetableDay[]> = {
  "Class 10A": [
    {
      day: "Monday",
      sessions: [
        { subject: "English", teacher: "Ms. Emily Davis", time: "8:00 - 8:45", room: "Room 103", color: "border-blue-500" },
        { subject: "Mathematics", teacher: "Dr. Sarah Johnson", time: "8:50 - 9:35", room: "Room 101", color: "border-blue-500" },
        { subject: "Biology", teacher: "Dr. Lisa Anderson", time: "9:40 - 10:25", room: "Room 105", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "Chemistry Lab", teacher: "Mr. Robert Wilson", time: "10:50 - 11:35", room: "Lab 1", color: "border-emerald-500", bgColor: "bg-emerald-50" },
        { subject: "Chemistry Lab", teacher: "Mr. Robert Wilson", time: "11:40 - 12:25", room: "Lab 1", color: "border-emerald-500", bgColor: "bg-emerald-50" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "History", teacher: "Mrs. Patricia Brown", time: "1:15 - 2:00", room: "Room 104", color: "border-blue-500" },
      ],
    },
    {
      day: "Tuesday",
      sessions: [
        { subject: "English", teacher: "Ms. Emily Davis", time: "8:00 - 8:45", room: "Room 103", color: "border-blue-500" },
        { subject: "Mathematics", teacher: "Dr. Sarah Johnson", time: "8:50 - 9:35", room: "Room 101", color: "border-blue-500" },
        { subject: "Biology", teacher: "Dr. Lisa Anderson", time: "9:40 - 10:25", room: "Room 105", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "Physics", teacher: "Prof. Michael Chen", time: "10:50 - 11:35", room: "Room 102", color: "border-blue-500" },
        { subject: "Geography", teacher: "Mr. James Wilson", time: "11:40 - 12:25", room: "Room 106", color: "border-blue-500" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Physical Education", teacher: "Coach Miller", time: "1:15 - 2:00", room: "Sports Ground", color: "border-blue-500" },
      ],
    },
    {
      day: "Wednesday",
      sessions: [
        { subject: "Chemistry", teacher: "Mr. Robert Wilson", time: "8:00 - 8:45", room: "Room 102", color: "border-blue-500" },
        { subject: "Mathematics", teacher: "Dr. Sarah Johnson", time: "8:50 - 9:35", room: "Room 101", color: "border-blue-500" },
        { subject: "English", teacher: "Ms. Emily Davis", time: "9:40 - 10:25", room: "Room 103", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "Biology Lab", teacher: "Dr. Lisa Anderson", time: "10:50 - 11:35", room: "Lab 2", color: "border-emerald-500", bgColor: "bg-emerald-50" },
        { subject: "Biology Lab", teacher: "Dr. Lisa Anderson", time: "11:40 - 12:25", room: "Lab 2", color: "border-emerald-500", bgColor: "bg-emerald-50" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Art", teacher: "Ms. Anna White", time: "1:15 - 2:00", room: "Art Room", color: "border-blue-500" },
      ],
    },
    {
      day: "Thursday",
      sessions: [
        { subject: "Physics", teacher: "Prof. Michael Chen", time: "8:00 - 8:45", room: "Room 102", color: "border-blue-500" },
        { subject: "English", teacher: "Ms. Emily Davis", time: "8:50 - 9:35", room: "Room 103", color: "border-blue-500" },
        { subject: "Mathematics", teacher: "Dr. Sarah Johnson", time: "9:40 - 10:25", room: "Room 101", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "History", teacher: "Mrs. Patricia Brown", time: "10:50 - 11:35", room: "Room 104", color: "border-blue-500" },
        { subject: "Geography", teacher: "Mr. James Wilson", time: "11:40 - 12:25", room: "Room 106", color: "border-blue-500" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Computer Science", teacher: "Mr. Alan Turing", time: "1:15 - 2:00", room: "Computer Lab", color: "border-purple-500", bgColor: "bg-purple-50" },
      ],
    },
    {
      day: "Friday",
      sessions: [
        { subject: "Mathematics", teacher: "Dr. Sarah Johnson", time: "8:00 - 8:45", room: "Room 101", color: "border-blue-500" },
        { subject: "Chemistry", teacher: "Mr. Robert Wilson", time: "8:50 - 9:35", room: "Room 102", color: "border-blue-500" },
        { subject: "Biology", teacher: "Dr. Lisa Anderson", time: "9:40 - 10:25", room: "Room 105", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "English", teacher: "Ms. Emily Davis", time: "10:50 - 11:35", room: "Room 103", color: "border-blue-500" },
        { subject: "Physical Education", teacher: "Coach Miller", time: "11:40 - 12:25", room: "Sports Ground", color: "border-blue-500" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Art", teacher: "Ms. Anna White", time: "1:15 - 2:00", room: "Art Room", color: "border-blue-500" },
      ],
    },
    {
      day: "Sunday",
      sessions: [
        { subject: "Mathematics", teacher: "Dr. Sarah Johnson", time: "8:00 - 8:45", room: "Room 101", color: "border-blue-500" },
        { subject: "English", teacher: "Ms. Emily Davis", time: "8:50 - 9:35", room: "Room 103", color: "border-blue-500" },
        { subject: "Physics", teacher: "Prof. Michael Chen", time: "9:40 - 10:25", room: "Room 102", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "History", teacher: "Mrs. Patricia Brown", time: "10:50 - 11:35", room: "Room 104", color: "border-blue-500" },
        { subject: "Computer Science", teacher: "Mr. Alan Turing", time: "11:40 - 12:25", room: "Computer Lab", color: "border-purple-500", bgColor: "bg-purple-50" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Geography", teacher: "Mr. James Wilson", time: "1:15 - 2:00", room: "Room 106", color: "border-blue-500" },
      ],
    },
  ],

  "Class 10B": [
    {
      day: "Monday",
      sessions: [
        { subject: "Mathematics", teacher: "Mr. Kevin Hart", time: "8:00 - 8:45", room: "Room 201", color: "border-blue-500" },
        { subject: "Physics", teacher: "Dr. Nancy Reed", time: "8:50 - 9:35", room: "Room 202", color: "border-blue-500" },
        { subject: "English", teacher: "Ms. Julia Roberts", time: "9:40 - 10:25", room: "Room 203", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "Chemistry", teacher: "Mr. Steve Clark", time: "10:50 - 11:35", room: "Room 204", color: "border-blue-500" },
        { subject: "History", teacher: "Mrs. Grace Lee", time: "11:40 - 12:25", room: "Room 205", color: "border-blue-500" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Art", teacher: "Ms. Clara Hill", time: "1:15 - 2:00", room: "Art Room", color: "border-blue-500" },
      ],
    },
    {
      day: "Tuesday",
      sessions: [
        { subject: "Physics", teacher: "Dr. Nancy Reed", time: "8:00 - 8:45", room: "Room 202", color: "border-blue-500" },
        { subject: "English", teacher: "Ms. Julia Roberts", time: "8:50 - 9:35", room: "Room 203", color: "border-blue-500" },
        { subject: "Mathematics", teacher: "Mr. Kevin Hart", time: "9:40 - 10:25", room: "Room 201", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "Physics Lab", teacher: "Dr. Nancy Reed", time: "10:50 - 11:35", room: "Lab 3", color: "border-emerald-500", bgColor: "bg-emerald-50" },
        { subject: "Physics Lab", teacher: "Dr. Nancy Reed", time: "11:40 - 12:25", room: "Lab 3", color: "border-emerald-500", bgColor: "bg-emerald-50" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Geography", teacher: "Mr. Tom Brady", time: "1:15 - 2:00", room: "Room 206", color: "border-blue-500" },
      ],
    },
    {
      day: "Wednesday",
      sessions: [
        { subject: "English", teacher: "Ms. Julia Roberts", time: "8:00 - 8:45", room: "Room 203", color: "border-blue-500" },
        { subject: "Chemistry", teacher: "Mr. Steve Clark", time: "8:50 - 9:35", room: "Room 204", color: "border-blue-500" },
        { subject: "History", teacher: "Mrs. Grace Lee", time: "9:40 - 10:25", room: "Room 205", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "Mathematics", teacher: "Mr. Kevin Hart", time: "10:50 - 11:35", room: "Room 201", color: "border-blue-500" },
        { subject: "Computer Science", teacher: "Mr. Alan Turing", time: "11:40 - 12:25", room: "Computer Lab", color: "border-purple-500", bgColor: "bg-purple-50" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Physical Education", teacher: "Coach Miller", time: "1:15 - 2:00", room: "Sports Ground", color: "border-blue-500" },
      ],
    },
    {
      day: "Thursday",
      sessions: [
        { subject: "Chemistry", teacher: "Mr. Steve Clark", time: "8:00 - 8:45", room: "Room 204", color: "border-blue-500" },
        { subject: "Mathematics", teacher: "Mr. Kevin Hart", time: "8:50 - 9:35", room: "Room 201", color: "border-blue-500" },
        { subject: "Geography", teacher: "Mr. Tom Brady", time: "9:40 - 10:25", room: "Room 206", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "English", teacher: "Ms. Julia Roberts", time: "10:50 - 11:35", room: "Room 203", color: "border-blue-500" },
        { subject: "Art", teacher: "Ms. Clara Hill", time: "11:40 - 12:25", room: "Art Room", color: "border-blue-500" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Physics", teacher: "Dr. Nancy Reed", time: "1:15 - 2:00", room: "Room 202", color: "border-blue-500" },
      ],
    },
    {
      day: "Friday",
      sessions: [
        { subject: "History", teacher: "Mrs. Grace Lee", time: "8:00 - 8:45", room: "Room 205", color: "border-blue-500" },
        { subject: "Physics", teacher: "Dr. Nancy Reed", time: "8:50 - 9:35", room: "Room 202", color: "border-blue-500" },
        { subject: "Chemistry", teacher: "Mr. Steve Clark", time: "9:40 - 10:25", room: "Room 204", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "Mathematics", teacher: "Mr. Kevin Hart", time: "10:50 - 11:35", room: "Room 201", color: "border-blue-500" },
        { subject: "English", teacher: "Ms. Julia Roberts", time: "11:40 - 12:25", room: "Room 203", color: "border-blue-500" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Computer Science", teacher: "Mr. Alan Turing", time: "1:15 - 2:00", room: "Computer Lab", color: "border-purple-500", bgColor: "bg-purple-50" },
      ],
    },
    {
      day: "Sunday",
      sessions: [
        { subject: "Computer Science", teacher: "Mr. Alan Turing", time: "8:00 - 8:45", room: "Computer Lab", color: "border-purple-500", bgColor: "bg-purple-50" },
        { subject: "Mathematics", teacher: "Mr. Kevin Hart", time: "8:50 - 9:35", room: "Room 201", color: "border-blue-500" },
        { subject: "History", teacher: "Mrs. Grace Lee", time: "9:40 - 10:25", room: "Room 205", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "Geography", teacher: "Mr. Tom Brady", time: "10:50 - 11:35", room: "Room 206", color: "border-blue-500" },
        { subject: "English", teacher: "Ms. Julia Roberts", time: "11:40 - 12:25", room: "Room 203", color: "border-blue-500" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Physical Education", teacher: "Coach Miller", time: "1:15 - 2:00", room: "Sports Ground", color: "border-blue-500" },
      ],
    },
  ],

  "Class 9A": [
    {
      day: "Monday",
      sessions: [
        { subject: "Mathematics", teacher: "Ms. Priya Sharma", time: "8:00 - 8:45", room: "Room 301", color: "border-blue-500" },
        { subject: "Science", teacher: "Dr. Neil Patel", time: "8:50 - 9:35", room: "Room 302", color: "border-blue-500" },
        { subject: "English", teacher: "Mr. David Brown", time: "9:40 - 10:25", room: "Room 303", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "Social Studies", teacher: "Mrs. Helen Fox", time: "10:50 - 11:35", room: "Room 304", color: "border-blue-500" },
        { subject: "Hindi", teacher: "Ms. Rekha Joshi", time: "11:40 - 12:25", room: "Room 305", color: "border-blue-500" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Physical Education", teacher: "Coach Miller", time: "1:15 - 2:00", room: "Sports Ground", color: "border-blue-500" },
      ],
    },
    {
      day: "Tuesday",
      sessions: [
        { subject: "English", teacher: "Mr. David Brown", time: "8:00 - 8:45", room: "Room 303", color: "border-blue-500" },
        { subject: "Hindi", teacher: "Ms. Rekha Joshi", time: "8:50 - 9:35", room: "Room 305", color: "border-blue-500" },
        { subject: "Mathematics", teacher: "Ms. Priya Sharma", time: "9:40 - 10:25", room: "Room 301", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "Science Lab", teacher: "Dr. Neil Patel", time: "10:50 - 11:35", room: "Lab 1", color: "border-emerald-500", bgColor: "bg-emerald-50" },
        { subject: "Science Lab", teacher: "Dr. Neil Patel", time: "11:40 - 12:25", room: "Lab 1", color: "border-emerald-500", bgColor: "bg-emerald-50" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Art", teacher: "Ms. Clara Hill", time: "1:15 - 2:00", room: "Art Room", color: "border-blue-500" },
      ],
    },
    {
      day: "Wednesday",
      sessions: [
        { subject: "Social Studies", teacher: "Mrs. Helen Fox", time: "8:00 - 8:45", room: "Room 304", color: "border-blue-500" },
        { subject: "Mathematics", teacher: "Ms. Priya Sharma", time: "8:50 - 9:35", room: "Room 301", color: "border-blue-500" },
        { subject: "Science", teacher: "Dr. Neil Patel", time: "9:40 - 10:25", room: "Room 302", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "English", teacher: "Mr. David Brown", time: "10:50 - 11:35", room: "Room 303", color: "border-blue-500" },
        { subject: "Computer Science", teacher: "Mr. Alan Turing", time: "11:40 - 12:25", room: "Computer Lab", color: "border-purple-500", bgColor: "bg-purple-50" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Hindi", teacher: "Ms. Rekha Joshi", time: "1:15 - 2:00", room: "Room 305", color: "border-blue-500" },
      ],
    },
    {
      day: "Thursday",
      sessions: [
        { subject: "Hindi", teacher: "Ms. Rekha Joshi", time: "8:00 - 8:45", room: "Room 305", color: "border-blue-500" },
        { subject: "Science", teacher: "Dr. Neil Patel", time: "8:50 - 9:35", room: "Room 302", color: "border-blue-500" },
        { subject: "Social Studies", teacher: "Mrs. Helen Fox", time: "9:40 - 10:25", room: "Room 304", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "Mathematics", teacher: "Ms. Priya Sharma", time: "10:50 - 11:35", room: "Room 301", color: "border-blue-500" },
        { subject: "English", teacher: "Mr. David Brown", time: "11:40 - 12:25", room: "Room 303", color: "border-blue-500" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Music", teacher: "Mr. Raj Kapoor", time: "1:15 - 2:00", room: "Music Room", color: "border-blue-500" },
      ],
    },
    {
      day: "Friday",
      sessions: [
        { subject: "Computer Science", teacher: "Mr. Alan Turing", time: "8:00 - 8:45", room: "Computer Lab", color: "border-purple-500", bgColor: "bg-purple-50" },
        { subject: "English", teacher: "Mr. David Brown", time: "8:50 - 9:35", room: "Room 303", color: "border-blue-500" },
        { subject: "Hindi", teacher: "Ms. Rekha Joshi", time: "9:40 - 10:25", room: "Room 305", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "Science", teacher: "Dr. Neil Patel", time: "10:50 - 11:35", room: "Room 302", color: "border-blue-500" },
        { subject: "Social Studies", teacher: "Mrs. Helen Fox", time: "11:40 - 12:25", room: "Room 304", color: "border-blue-500" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Physical Education", teacher: "Coach Miller", time: "1:15 - 2:00", room: "Sports Ground", color: "border-blue-500" },
      ],
    },
    {
      day: "Sunday",
      sessions: [
        { subject: "Mathematics", teacher: "Ms. Priya Sharma", time: "8:00 - 8:45", room: "Room 301", color: "border-blue-500" },
        { subject: "Social Studies", teacher: "Mrs. Helen Fox", time: "8:50 - 9:35", room: "Room 304", color: "border-blue-500" },
        { subject: "English", teacher: "Mr. David Brown", time: "9:40 - 10:25", room: "Room 303", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "Hindi", teacher: "Ms. Rekha Joshi", time: "10:50 - 11:35", room: "Room 305", color: "border-blue-500" },
        { subject: "Art", teacher: "Ms. Clara Hill", time: "11:40 - 12:25", room: "Art Room", color: "border-blue-500" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Music", teacher: "Mr. Raj Kapoor", time: "1:15 - 2:00", room: "Music Room", color: "border-blue-500" },
      ],
    },
  ],

  "Class 9B": [
    {
      day: "Monday",
      sessions: [
        { subject: "Science", teacher: "Dr. Oliver Green", time: "8:00 - 8:45", room: "Room 401", color: "border-blue-500" },
        { subject: "Mathematics", teacher: "Mr. Arjun Mehta", time: "8:50 - 9:35", room: "Room 402", color: "border-blue-500" },
        { subject: "Hindi", teacher: "Ms. Sunita Rao", time: "9:40 - 10:25", room: "Room 403", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "English", teacher: "Mrs. Laura Scott", time: "10:50 - 11:35", room: "Room 404", color: "border-blue-500" },
        { subject: "Social Studies", teacher: "Mr. Raj Kapoor", time: "11:40 - 12:25", room: "Room 405", color: "border-blue-500" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Computer Science", teacher: "Mr. Alan Turing", time: "1:15 - 2:00", room: "Computer Lab", color: "border-purple-500", bgColor: "bg-purple-50" },
      ],
    },
    {
      day: "Tuesday",
      sessions: [
        { subject: "Mathematics", teacher: "Mr. Arjun Mehta", time: "8:00 - 8:45", room: "Room 402", color: "border-blue-500" },
        { subject: "English", teacher: "Mrs. Laura Scott", time: "8:50 - 9:35", room: "Room 404", color: "border-blue-500" },
        { subject: "Science", teacher: "Dr. Oliver Green", time: "9:40 - 10:25", room: "Room 401", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "Hindi", teacher: "Ms. Sunita Rao", time: "10:50 - 11:35", room: "Room 403", color: "border-blue-500" },
        { subject: "Art", teacher: "Ms. Clara Hill", time: "11:40 - 12:25", room: "Art Room", color: "border-blue-500" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Physical Education", teacher: "Coach Miller", time: "1:15 - 2:00", room: "Sports Ground", color: "border-blue-500" },
      ],
    },
    {
      day: "Wednesday",
      sessions: [
        { subject: "English", teacher: "Mrs. Laura Scott", time: "8:00 - 8:45", room: "Room 404", color: "border-blue-500" },
        { subject: "Social Studies", teacher: "Mr. Raj Kapoor", time: "8:50 - 9:35", room: "Room 405", color: "border-blue-500" },
        { subject: "Mathematics", teacher: "Mr. Arjun Mehta", time: "9:40 - 10:25", room: "Room 402", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "Science Lab", teacher: "Dr. Oliver Green", time: "10:50 - 11:35", room: "Lab 2", color: "border-emerald-500", bgColor: "bg-emerald-50" },
        { subject: "Science Lab", teacher: "Dr. Oliver Green", time: "11:40 - 12:25", room: "Lab 2", color: "border-emerald-500", bgColor: "bg-emerald-50" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Hindi", teacher: "Ms. Sunita Rao", time: "1:15 - 2:00", room: "Room 403", color: "border-blue-500" },
      ],
    },
    {
      day: "Thursday",
      sessions: [
        { subject: "Social Studies", teacher: "Mr. Raj Kapoor", time: "8:00 - 8:45", room: "Room 405", color: "border-blue-500" },
        { subject: "Hindi", teacher: "Ms. Sunita Rao", time: "8:50 - 9:35", room: "Room 403", color: "border-blue-500" },
        { subject: "English", teacher: "Mrs. Laura Scott", time: "9:40 - 10:25", room: "Room 404", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "Computer Science", teacher: "Mr. Alan Turing", time: "10:50 - 11:35", room: "Computer Lab", color: "border-purple-500", bgColor: "bg-purple-50" },
        { subject: "Mathematics", teacher: "Mr. Arjun Mehta", time: "11:40 - 12:25", room: "Room 402", color: "border-blue-500" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Science", teacher: "Dr. Oliver Green", time: "1:15 - 2:00", room: "Room 401", color: "border-blue-500" },
      ],
    },
    {
      day: "Friday",
      sessions: [
        { subject: "Hindi", teacher: "Ms. Sunita Rao", time: "8:00 - 8:45", room: "Room 403", color: "border-blue-500" },
        { subject: "Science", teacher: "Dr. Oliver Green", time: "8:50 - 9:35", room: "Room 401", color: "border-blue-500" },
        { subject: "Social Studies", teacher: "Mr. Raj Kapoor", time: "9:40 - 10:25", room: "Room 405", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "Mathematics", teacher: "Mr. Arjun Mehta", time: "10:50 - 11:35", room: "Room 402", color: "border-blue-500" },
        { subject: "English", teacher: "Mrs. Laura Scott", time: "11:40 - 12:25", room: "Room 404", color: "border-blue-500" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Art", teacher: "Ms. Clara Hill", time: "1:15 - 2:00", room: "Art Room", color: "border-blue-500" },
      ],
    },
    {
      day: "Sunday",
      sessions: [
        { subject: "English", teacher: "Mrs. Laura Scott", time: "8:00 - 8:45", room: "Room 404", color: "border-blue-500" },
        { subject: "Mathematics", teacher: "Mr. Arjun Mehta", time: "8:50 - 9:35", room: "Room 402", color: "border-blue-500" },
        { subject: "Art", teacher: "Ms. Clara Hill", time: "9:40 - 10:25", room: "Art Room", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "Science", teacher: "Dr. Oliver Green", time: "10:50 - 11:35", room: "Room 401", color: "border-blue-500" },
        { subject: "Social Studies", teacher: "Mr. Raj Kapoor", time: "11:40 - 12:25", room: "Room 405", color: "border-blue-500" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Physical Education", teacher: "Coach Miller", time: "1:15 - 2:00", room: "Sports Ground", color: "border-blue-500" },
      ],
    },
  ],

  "Class 8A": [
    {
      day: "Monday",
      sessions: [
        { subject: "English", teacher: "Ms. Fiona Grant", time: "8:00 - 8:45", room: "Room 501", color: "border-blue-500" },
        { subject: "Mathematics", teacher: "Mr. Victor Nair", time: "8:50 - 9:35", room: "Room 502", color: "border-blue-500" },
        { subject: "Science", teacher: "Dr. Maya Gupta", time: "9:40 - 10:25", room: "Room 503", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "Hindi", teacher: "Mrs. Usha Pillai", time: "10:50 - 11:35", room: "Room 504", color: "border-blue-500" },
        { subject: "Social Studies", teacher: "Mr. Chris Martin", time: "11:40 - 12:25", room: "Room 505", color: "border-blue-500" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Art", teacher: "Ms. Clara Hill", time: "1:15 - 2:00", room: "Art Room", color: "border-blue-500" },
      ],
    },
    {
      day: "Tuesday",
      sessions: [
        { subject: "Mathematics", teacher: "Mr. Victor Nair", time: "8:00 - 8:45", room: "Room 502", color: "border-blue-500" },
        { subject: "Hindi", teacher: "Mrs. Usha Pillai", time: "8:50 - 9:35", room: "Room 504", color: "border-blue-500" },
        { subject: "English", teacher: "Ms. Fiona Grant", time: "9:40 - 10:25", room: "Room 501", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "Science Lab", teacher: "Dr. Maya Gupta", time: "10:50 - 11:35", room: "Lab 3", color: "border-emerald-500", bgColor: "bg-emerald-50" },
        { subject: "Science Lab", teacher: "Dr. Maya Gupta", time: "11:40 - 12:25", room: "Lab 3", color: "border-emerald-500", bgColor: "bg-emerald-50" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Physical Education", teacher: "Coach Miller", time: "1:15 - 2:00", room: "Sports Ground", color: "border-blue-500" },
      ],
    },
    {
      day: "Wednesday",
      sessions: [
        { subject: "Science", teacher: "Dr. Maya Gupta", time: "8:00 - 8:45", room: "Room 503", color: "border-blue-500" },
        { subject: "Social Studies", teacher: "Mr. Chris Martin", time: "8:50 - 9:35", room: "Room 505", color: "border-blue-500" },
        { subject: "Mathematics", teacher: "Mr. Victor Nair", time: "9:40 - 10:25", room: "Room 502", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "English", teacher: "Ms. Fiona Grant", time: "10:50 - 11:35", room: "Room 501", color: "border-blue-500" },
        { subject: "Music", teacher: "Mr. Raj Kapoor", time: "11:40 - 12:25", room: "Music Room", color: "border-blue-500" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Hindi", teacher: "Mrs. Usha Pillai", time: "1:15 - 2:00", room: "Room 504", color: "border-blue-500" },
      ],
    },
    {
      day: "Thursday",
      sessions: [
        { subject: "Hindi", teacher: "Mrs. Usha Pillai", time: "8:00 - 8:45", room: "Room 504", color: "border-blue-500" },
        { subject: "English", teacher: "Ms. Fiona Grant", time: "8:50 - 9:35", room: "Room 501", color: "border-blue-500" },
        { subject: "Social Studies", teacher: "Mr. Chris Martin", time: "9:40 - 10:25", room: "Room 505", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "Computer Science", teacher: "Mr. Alan Turing", time: "10:50 - 11:35", room: "Computer Lab", color: "border-purple-500", bgColor: "bg-purple-50" },
        { subject: "Science", teacher: "Dr. Maya Gupta", time: "11:40 - 12:25", room: "Room 503", color: "border-blue-500" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Mathematics", teacher: "Mr. Victor Nair", time: "1:15 - 2:00", room: "Room 502", color: "border-blue-500" },
      ],
    },
    {
      day: "Friday",
      sessions: [
        { subject: "Social Studies", teacher: "Mr. Chris Martin", time: "8:00 - 8:45", room: "Room 505", color: "border-blue-500" },
        { subject: "Science", teacher: "Dr. Maya Gupta", time: "8:50 - 9:35", room: "Room 503", color: "border-blue-500" },
        { subject: "Hindi", teacher: "Mrs. Usha Pillai", time: "9:40 - 10:25", room: "Room 504", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "Art", teacher: "Ms. Clara Hill", time: "10:50 - 11:35", room: "Art Room", color: "border-blue-500" },
        { subject: "Mathematics", teacher: "Mr. Victor Nair", time: "11:40 - 12:25", room: "Room 502", color: "border-blue-500" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "English", teacher: "Ms. Fiona Grant", time: "1:15 - 2:00", room: "Room 501", color: "border-blue-500" },
      ],
    },
    {
      day: "Sunday",
      sessions: [
        { subject: "Music", teacher: "Mr. Raj Kapoor", time: "8:00 - 8:45", room: "Music Room", color: "border-blue-500" },
        { subject: "Mathematics", teacher: "Mr. Victor Nair", time: "8:50 - 9:35", room: "Room 502", color: "border-blue-500" },
        { subject: "English", teacher: "Ms. Fiona Grant", time: "9:40 - 10:25", room: "Room 501", color: "border-blue-500" },
        { subject: "Break", time: "10:25 - 10:45", isBreak: true },
        { subject: "Science", teacher: "Dr. Maya Gupta", time: "10:50 - 11:35", room: "Room 503", color: "border-blue-500" },
        { subject: "Hindi", teacher: "Mrs. Usha Pillai", time: "11:40 - 12:25", room: "Room 504", color: "border-blue-500" },
        { subject: "Lunch", time: "12:25 - 1:10", isBreak: true },
        { subject: "Computer Science", teacher: "Mr. Alan Turing", time: "1:15 - 2:00", room: "Computer Lab", color: "border-purple-500", bgColor: "bg-purple-50" },
      ],
    },
  ],
};

type MutableSession = Session & { id: string };
type MutableDay = Omit<TimetableDay, "sessions"> & { sessions: MutableSession[] };

function buildMutableTimetable(cls: string, todayName: string): MutableDay[] {
  return (classTimetables[cls] ?? []).map((day) => ({
    ...day,
    isToday: day.day === todayName,
    sessions: day.sessions.map((s, i) => ({ ...s, id: `${day.day}-${i}` })),
  }));
}

const emptyForm = { subject: "", teacher: "", time: "", room: "", isBreak: false, color: "border-blue-500", bgColor: "" };

const AdminTimetableData = () => {
  const [selectedClass, setSelectedClass] = useState("Class 10A");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const todayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()];
  const classes = ["Class 10A", "Class 10B", "Class 9A", "Class 9B", "Class 8A"];

  const [timetableData, setTimetableData] = useState<Record<string, MutableDay[]>>(() => {
    const init: Record<string, MutableDay[]> = {};
    classes.forEach((c) => { init[c] = buildMutableTimetable(c, todayName); });
    return init;
  });

  const [editTarget, setEditTarget] = useState<{ dayIdx: number; sessionId: string } | null>(null);
  const [addTarget, setAddTarget] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<{ dayIdx: number; sessionId: string } | null>(null);

  const timetable = timetableData[selectedClass] ?? [];

  const openEdit = (dayIdx: number, session: MutableSession) => {
    setForm({ subject: session.subject, teacher: session.teacher ?? "", time: session.time, room: session.room ?? "", isBreak: session.isBreak ?? false, color: session.color ?? "border-blue-500", bgColor: session.bgColor ?? "" });
    setEditTarget({ dayIdx, sessionId: session.id });
  };

  const openAdd = (dayIdx: number) => {
    setForm(emptyForm);
    setAddTarget(dayIdx);
  };

  const saveEdit = () => {
    if (!editTarget) return;
    setTimetableData((prev) => {
      const days = prev[selectedClass].map((day, dIdx) => {
        if (dIdx !== editTarget.dayIdx) return day;
        return { ...day, sessions: day.sessions.map((s) => s.id === editTarget.sessionId ? { ...s, ...form } : s) };
      });
      return { ...prev, [selectedClass]: days };
    });
    setEditTarget(null);
  };

  const saveAdd = () => {
    if (addTarget === null) return;
    setTimetableData((prev) => {
      const days = prev[selectedClass].map((day, dIdx) => {
        if (dIdx !== addTarget) return day;
        const newSession: MutableSession = { ...form, id: `${day.day}-${Date.now()}` };
        return { ...day, sessions: [...day.sessions, newSession] };
      });
      return { ...prev, [selectedClass]: days };
    });
    setAddTarget(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setTimetableData((prev) => {
      const days = prev[selectedClass].map((day, dIdx) => {
        if (dIdx !== deleteTarget.dayIdx) return day;
        return { ...day, sessions: day.sessions.filter((s) => s.id !== deleteTarget.sessionId) };
      });
      return { ...prev, [selectedClass]: days };
    });
    setDeleteTarget(null);
  };

  const isFormOpen = editTarget !== null || addTarget !== null;

  return (
    <div className="w-full min-h-screen bg-slate-50/50 p-4">
      {/* Class selector */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between gap-8 bg-white px-4 py-2 border border-slate-200 rounded-lg min-w-50 text-sm font-medium shadow-sm"
          >
            {selectedClass}
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
              {classes.map((cls) => (
                <button key={cls} onClick={() => { setSelectedClass(cls); setIsDropdownOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm ${cls === selectedClass ? "bg-emerald-500 text-white" : "text-slate-600"}`}>
                  {cls}
                  {cls === selectedClass && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{selectedClass}</span>
      </div>

      {/* Timetable grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6">
        {timetable.map((column, dayIdx) => (
          <div key={dayIdx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className={`p-4 border-b border-slate-100 flex justify-between items-center ${column.isToday ? "bg-blue-600 text-white" : "bg-white text-slate-800"}`}>
              <h3 className="font-bold text-lg">{column.day}</h3>
              {column.isToday
                ? <span className="bg-white/20 px-3 py-0.5 rounded-full text-xs font-medium">Today</span>
                : <button onClick={() => openAdd(dayIdx)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Add session"><Plus className="w-4 h-4" /></button>
              }
            </div>
            <div className="flex flex-col">
              {column.sessions.map((session) => (
                <div key={session.id} className={`p-4 border-b border-slate-50 last:border-0 flex flex-col gap-1 relative group ${session.bgColor ?? ""}`}>
                  <div className={`absolute left-0 top-0 bottom-0 w-1 border-l-4 ${session.isBreak ? "border-l-neutral-400" : (session.color ?? "")}`} />

                  {/* Edit / Delete — appear on hover, hidden for breaks */}
                  {!session.isBreak && (
                    <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                      <button onClick={() => openEdit(dayIdx, session)} className="p-1 rounded bg-white border border-slate-200 text-slate-400 hover:text-blue-500 hover:border-blue-300 shadow-sm transition-colors">
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button onClick={() => setDeleteTarget({ dayIdx, sessionId: session.id })} className="p-1 rounded bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-300 shadow-sm transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <h4 className={`font-bold text-sm pr-12 ${session.isBreak ? "text-slate-500 uppercase tracking-widest" : "text-slate-800"}`}>
                        {session.subject}
                      </h4>
                      {!session.isBreak && <p className="text-xs text-slate-500 mt-0.5">{session.teacher}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-slate-500">{session.time}</p>
                      {!session.isBreak && <p className="text-[10px] text-slate-400 font-medium">{session.room}</p>}
                    </div>
                  </div>
                </div>
              ))}

              {/* Add session button inside card when today */}
              {column.isToday && (
                <button onClick={() => openAdd(dayIdx)} className="flex items-center justify-center gap-1.5 p-3 text-xs text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add session
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* EDIT / ADD SESSION MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-800">{editTarget ? "Edit Session" : "Add Session"}</h2>
              <button onClick={() => { setEditTarget(null); setAddTarget(null); }} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Subject</label>
                <input className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Teacher</label>
                  <input className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Room</label>
                  <input className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Time (e.g. 8:00 - 8:45)</label>
                <input className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="isBreak" checked={form.isBreak} onChange={(e) => setForm({ ...form, isBreak: e.target.checked })} className="rounded" />
                <label htmlFor="isBreak" className="text-sm text-slate-600 font-medium">Mark as Break / Lunch</label>
              </div>
            </div>
            <div className="px-5 pb-5 flex gap-3">
              <button onClick={() => { setEditTarget(null); setAddTarget(null); }} className="flex-1 py-2.5 font-bold text-slate-500 hover:bg-slate-100 rounded-xl text-sm">Cancel</button>
              <button onClick={editTarget ? saveEdit : saveAdd} className="flex-1 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl text-sm shadow-lg shadow-blue-100">
                {editTarget ? "Save Changes" : "Add Session"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">Delete Session?</h3>
            <p className="text-sm text-slate-500 mb-5">This session will be removed from the timetable.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTimetableData;
