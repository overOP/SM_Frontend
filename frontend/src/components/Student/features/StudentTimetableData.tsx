import { useState } from "react";

type SessionType = "class" | "lab" | "break";

interface Session {
  subject:  string;
  teacher?: string;
  time:     string;
  room?:    string;
  type:     SessionType;
}

type DaySchedule = Record<string, Session[]>;
type ClassTimetable = Record<string, DaySchedule>;

const timetables: ClassTimetable = {
  "Class 10A": {
    Monday: [
      { subject: "English",       teacher: "Ms. Emily Davis",       time: "8:00–8:45",   room: "Room 103",     type: "class" },
      { subject: "Mathematics",   teacher: "Dr. Sarah Johnson",     time: "8:50–9:35",   room: "Room 101",     type: "class" },
      { subject: "Biology",       teacher: "Dr. Lisa Anderson",     time: "9:40–10:25",  room: "Room 105",     type: "class" },
      { subject: "Break",         time: "10:25–10:45", type: "break" },
      { subject: "Chemistry Lab", teacher: "Mr. Robert Wilson",     time: "10:50–12:25", room: "Lab 1",        type: "lab"   },
      { subject: "Lunch",         time: "12:25–1:10",  type: "break" },
      { subject: "History",       teacher: "Mrs. Patricia Brown",   time: "1:15–2:00",   room: "Room 104",     type: "class" },
    ],
    Tuesday: [
      { subject: "Physics",           teacher: "Prof. Michael Chen",    time: "8:00–8:45",   room: "Room 102",     type: "class" },
      { subject: "Mathematics",       teacher: "Dr. Sarah Johnson",     time: "8:50–9:35",   room: "Room 101",     type: "class" },
      { subject: "English",           teacher: "Ms. Emily Davis",       time: "9:40–10:25",  room: "Room 103",     type: "class" },
      { subject: "Break",             time: "10:25–10:45", type: "break" },
      { subject: "Biology Lab",       teacher: "Dr. Lisa Anderson",     time: "10:50–12:25", room: "Lab 2",        type: "lab"   },
      { subject: "Lunch",             time: "12:25–1:10",  type: "break" },
      { subject: "Physical Education",teacher: "Coach Miller",           time: "1:15–2:00",   room: "Sports Ground",type: "class" },
    ],
    Wednesday: [
      { subject: "Chemistry",     teacher: "Mr. Robert Wilson",     time: "8:00–8:45",   room: "Room 102",     type: "class" },
      { subject: "History",       teacher: "Mrs. Patricia Brown",   time: "8:50–9:35",   room: "Room 104",     type: "class" },
      { subject: "Mathematics",   teacher: "Dr. Sarah Johnson",     time: "9:40–10:25",  room: "Room 101",     type: "class" },
      { subject: "Break",         time: "10:25–10:45", type: "break" },
      { subject: "Physics Lab",   teacher: "Prof. Michael Chen",    time: "10:50–12:25", room: "Lab 3",        type: "lab"   },
      { subject: "Lunch",         time: "12:25–1:10",  type: "break" },
      { subject: "Art",           teacher: "Ms. Anna White",        time: "1:15–2:00",   room: "Art Room",     type: "class" },
    ],
    Thursday: [
      { subject: "Biology",       teacher: "Dr. Lisa Anderson",     time: "8:00–8:45",   room: "Room 105",     type: "class" },
      { subject: "English",       teacher: "Ms. Emily Davis",       time: "8:50–9:35",   room: "Room 103",     type: "class" },
      { subject: "Chemistry",     teacher: "Mr. Robert Wilson",     time: "9:40–10:25",  room: "Room 102",     type: "class" },
      { subject: "Break",         time: "10:25–10:45", type: "break" },
      { subject: "Mathematics",   teacher: "Dr. Sarah Johnson",     time: "10:50–11:35", room: "Room 101",     type: "class" },
      { subject: "Physics",       teacher: "Prof. Michael Chen",    time: "11:40–12:25", room: "Room 102",     type: "class" },
      { subject: "Lunch",         time: "12:25–1:10",  type: "break" },
      { subject: "Geography",     teacher: "Mr. James Wilson",      time: "1:15–2:00",   room: "Room 106",     type: "class" },
    ],
    Friday: [
      { subject: "History",         teacher: "Mrs. Patricia Brown",   time: "8:00–8:45",   room: "Room 104",     type: "class" },
      { subject: "Physics",         teacher: "Prof. Michael Chen",    time: "8:50–9:35",   room: "Room 102",     type: "class" },
      { subject: "English",         teacher: "Ms. Emily Davis",       time: "9:40–10:25",  room: "Room 103",     type: "class" },
      { subject: "Break",           time: "10:25–10:45", type: "break" },
      { subject: "Mathematics",     teacher: "Dr. Sarah Johnson",     time: "10:50–11:35", room: "Room 101",     type: "class" },
      { subject: "Biology",         teacher: "Dr. Lisa Anderson",     time: "11:40–12:25", room: "Room 105",     type: "class" },
      { subject: "Lunch",           time: "12:25–1:10",  type: "break" },
      { subject: "Computer Science",teacher: "Mr. Tech Guru",         time: "1:15–2:00",   room: "Computer Lab", type: "class" },
    ],
  },
  "Class 10B": {
    Monday: [
      { subject: "Mathematics",   teacher: "Mr. Alan Turing",       time: "8:00–8:45",   room: "Room 201",     type: "class" },
      { subject: "English",       teacher: "Ms. Jane Austen",       time: "8:50–9:35",   room: "Room 202",     type: "class" },
      { subject: "Physics",       teacher: "Dr. Niels Bohr",        time: "9:40–10:25",  room: "Room 203",     type: "class" },
      { subject: "Break",         time: "10:25–10:45", type: "break" },
      { subject: "Biology Lab",   teacher: "Dr. Charles Darwin",    time: "10:50–12:25", room: "Lab 2",        type: "lab"   },
      { subject: "Lunch",         time: "12:25–1:10",  type: "break" },
      { subject: "Chemistry",     teacher: "Ms. Marie Curie",       time: "1:15–2:00",   room: "Room 204",     type: "class" },
    ],
    Tuesday: [
      { subject: "Chemistry",     teacher: "Ms. Marie Curie",       time: "8:00–8:45",   room: "Room 204",     type: "class" },
      { subject: "History",       teacher: "Mr. Howard Zinn",       time: "8:50–9:35",   room: "Room 205",     type: "class" },
      { subject: "Mathematics",   teacher: "Mr. Alan Turing",       time: "9:40–10:25",  room: "Room 201",     type: "class" },
      { subject: "Break",         time: "10:25–10:45", type: "break" },
      { subject: "Physics Lab",   teacher: "Dr. Niels Bohr",        time: "10:50–12:25", room: "Lab 3",        type: "lab"   },
      { subject: "Lunch",         time: "12:25–1:10",  type: "break" },
      { subject: "Art",           teacher: "Ms. Frida Kahlo",       time: "1:15–2:00",   room: "Art Room",     type: "class" },
    ],
    Wednesday: [
      { subject: "Biology",         teacher: "Dr. Charles Darwin",  time: "8:00–8:45",   room: "Room 206",     type: "class" },
      { subject: "Physics",         teacher: "Dr. Niels Bohr",      time: "8:50–9:35",   room: "Room 203",     type: "class" },
      { subject: "English",         teacher: "Ms. Jane Austen",     time: "9:40–10:25",  room: "Room 202",     type: "class" },
      { subject: "Break",           time: "10:25–10:45", type: "break" },
      { subject: "Chemistry Lab",   teacher: "Ms. Marie Curie",     time: "10:50–12:25", room: "Lab 1",        type: "lab"   },
      { subject: "Lunch",           time: "12:25–1:10",  type: "break" },
      { subject: "Geography",       teacher: "Mr. Amundsen",        time: "1:15–2:00",   room: "Room 207",     type: "class" },
    ],
    Thursday: [
      { subject: "History",         teacher: "Mr. Howard Zinn",     time: "8:00–8:45",   room: "Room 205",     type: "class" },
      { subject: "Mathematics",     teacher: "Mr. Alan Turing",     time: "8:50–9:35",   room: "Room 201",     type: "class" },
      { subject: "Biology",         teacher: "Dr. Charles Darwin",  time: "9:40–10:25",  room: "Room 206",     type: "class" },
      { subject: "Break",           time: "10:25–10:45", type: "break" },
      { subject: "English",         teacher: "Ms. Jane Austen",     time: "10:50–11:35", room: "Room 202",     type: "class" },
      { subject: "Chemistry",       teacher: "Ms. Marie Curie",     time: "11:40–12:25", room: "Room 204",     type: "class" },
      { subject: "Lunch",           time: "12:25–1:10",  type: "break" },
      { subject: "Physical Education",teacher:"Coach Bolt",         time: "1:15–2:00",   room: "Sports Ground",type: "class" },
    ],
    Friday: [
      { subject: "Physics",         teacher: "Dr. Niels Bohr",      time: "8:00–8:45",   room: "Room 203",     type: "class" },
      { subject: "Biology",         teacher: "Dr. Charles Darwin",  time: "8:50–9:35",   room: "Room 206",     type: "class" },
      { subject: "Mathematics",     teacher: "Mr. Alan Turing",     time: "9:40–10:25",  room: "Room 201",     type: "class" },
      { subject: "Break",           time: "10:25–10:45", type: "break" },
      { subject: "History",         teacher: "Mr. Howard Zinn",     time: "10:50–11:35", room: "Room 205",     type: "class" },
      { subject: "English",         teacher: "Ms. Jane Austen",     time: "11:40–12:25", room: "Room 202",     type: "class" },
      { subject: "Lunch",           time: "12:25–1:10",  type: "break" },
      { subject: "Computer Science",teacher: "Ms. Ada Lovelace",    time: "1:15–2:00",   room: "Computer Lab", type: "class" },
    ],
  },
  "Class 9A": {
    Monday: [
      { subject: "Mathematics",   teacher: "Mr. Ramanujan",         time: "8:00–8:45",   room: "Room 301",     type: "class" },
      { subject: "Science",       teacher: "Dr. Feynman",           time: "8:50–9:35",   room: "Room 302",     type: "class" },
      { subject: "English",       teacher: "Ms. Woolf",             time: "9:40–10:25",  room: "Room 303",     type: "class" },
      { subject: "Break",         time: "10:25–10:45", type: "break" },
      { subject: "Social Studies",teacher: "Mr. Gandhi",            time: "10:50–11:35", room: "Room 304",     type: "class" },
      { subject: "Hindi",         teacher: "Ms. Tagore",            time: "11:40–12:25", room: "Room 305",     type: "class" },
      { subject: "Lunch",         time: "12:25–1:10",  type: "break" },
      { subject: "Computer Science",teacher:"Mr. Turing Jr.",       time: "1:15–2:00",   room: "Computer Lab", type: "class" },
    ],
    Tuesday: [
      { subject: "English",       teacher: "Ms. Woolf",             time: "8:00–8:45",   room: "Room 303",     type: "class" },
      { subject: "Mathematics",   teacher: "Mr. Ramanujan",         time: "8:50–9:35",   room: "Room 301",     type: "class" },
      { subject: "Hindi",         teacher: "Ms. Tagore",            time: "9:40–10:25",  room: "Room 305",     type: "class" },
      { subject: "Break",         time: "10:25–10:45", type: "break" },
      { subject: "Science Lab",   teacher: "Dr. Feynman",           time: "10:50–12:25", room: "Lab 1",        type: "lab"   },
      { subject: "Lunch",         time: "12:25–1:10",  type: "break" },
      { subject: "Art",           teacher: "Ms. Ravi Varma",        time: "1:15–2:00",   room: "Art Room",     type: "class" },
    ],
    Wednesday: [
      { subject: "Social Studies",teacher: "Mr. Gandhi",            time: "8:00–8:45",   room: "Room 304",     type: "class" },
      { subject: "Science",       teacher: "Dr. Feynman",           time: "8:50–9:35",   room: "Room 302",     type: "class" },
      { subject: "Mathematics",   teacher: "Mr. Ramanujan",         time: "9:40–10:25",  room: "Room 301",     type: "class" },
      { subject: "Break",         time: "10:25–10:45", type: "break" },
      { subject: "English",       teacher: "Ms. Woolf",             time: "10:50–11:35", room: "Room 303",     type: "class" },
      { subject: "Computer Science",teacher:"Mr. Turing Jr.",       time: "11:40–12:25", room: "Computer Lab", type: "class" },
      { subject: "Lunch",         time: "12:25–1:10",  type: "break" },
      { subject: "Physical Education",teacher:"Coach Pele",         time: "1:15–2:00",   room: "Sports Ground",type: "class" },
    ],
    Thursday: [
      { subject: "Hindi",         teacher: "Ms. Tagore",            time: "8:00–8:45",   room: "Room 305",     type: "class" },
      { subject: "Social Studies",teacher: "Mr. Gandhi",            time: "8:50–9:35",   room: "Room 304",     type: "class" },
      { subject: "English",       teacher: "Ms. Woolf",             time: "9:40–10:25",  room: "Room 303",     type: "class" },
      { subject: "Break",         time: "10:25–10:45", type: "break" },
      { subject: "Mathematics",   teacher: "Mr. Ramanujan",         time: "10:50–11:35", room: "Room 301",     type: "class" },
      { subject: "Science",       teacher: "Dr. Feynman",           time: "11:40–12:25", room: "Room 302",     type: "class" },
      { subject: "Lunch",         time: "12:25–1:10",  type: "break" },
      { subject: "Music",         teacher: "Mr. Zakir",             time: "1:15–2:00",   room: "Music Room",   type: "class" },
    ],
    Friday: [
      { subject: "Science",       teacher: "Dr. Feynman",           time: "8:00–8:45",   room: "Room 302",     type: "class" },
      { subject: "Hindi",         teacher: "Ms. Tagore",            time: "8:50–9:35",   room: "Room 305",     type: "class" },
      { subject: "Social Studies",teacher: "Mr. Gandhi",            time: "9:40–10:25",  room: "Room 304",     type: "class" },
      { subject: "Break",         time: "10:25–10:45", type: "break" },
      { subject: "Mathematics",   teacher: "Mr. Ramanujan",         time: "10:50–11:35", room: "Room 301",     type: "class" },
      { subject: "English",       teacher: "Ms. Woolf",             time: "11:40–12:25", room: "Room 303",     type: "class" },
      { subject: "Lunch",         time: "12:25–1:10",  type: "break" },
      { subject: "Library",       teacher: "Ms. Bookworm",          time: "1:15–2:00",   room: "Library",      type: "class" },
    ],
  },
  "Class 9B": {
    Monday: [
      { subject: "English",       teacher: "Mr. Shakespeare",       time: "8:00–8:45",   room: "Room 401",     type: "class" },
      { subject: "Hindi",         teacher: "Mr. Premchand",         time: "8:50–9:35",   room: "Room 402",     type: "class" },
      { subject: "Mathematics",   teacher: "Ms. Hypatia",           time: "9:40–10:25",  room: "Room 403",     type: "class" },
      { subject: "Break",         time: "10:25–10:45", type: "break" },
      { subject: "Science Lab",   teacher: "Dr. Curie",             time: "10:50–12:25", room: "Lab 2",        type: "lab"   },
      { subject: "Lunch",         time: "12:25–1:10",  type: "break" },
      { subject: "Social Studies",teacher: "Mr. Nehru",             time: "1:15–2:00",   room: "Room 404",     type: "class" },
    ],
    Tuesday: [
      { subject: "Mathematics",   teacher: "Ms. Hypatia",           time: "8:00–8:45",   room: "Room 403",     type: "class" },
      { subject: "Science",       teacher: "Dr. Curie",             time: "8:50–9:35",   room: "Room 405",     type: "class" },
      { subject: "Social Studies",teacher: "Mr. Nehru",             time: "9:40–10:25",  room: "Room 404",     type: "class" },
      { subject: "Break",         time: "10:25–10:45", type: "break" },
      { subject: "Computer Science",teacher:"Ms. Hopper",           time: "10:50–11:35", room: "Computer Lab", type: "class" },
      { subject: "English",       teacher: "Mr. Shakespeare",       time: "11:40–12:25", room: "Room 401",     type: "class" },
      { subject: "Lunch",         time: "12:25–1:10",  type: "break" },
      { subject: "Physical Education",teacher:"Coach Tendulkar",    time: "1:15–2:00",   room: "Sports Ground",type: "class" },
    ],
    Wednesday: [
      { subject: "Science",       teacher: "Dr. Curie",             time: "8:00–8:45",   room: "Room 405",     type: "class" },
      { subject: "English",       teacher: "Mr. Shakespeare",       time: "8:50–9:35",   room: "Room 401",     type: "class" },
      { subject: "Hindi",         teacher: "Mr. Premchand",         time: "9:40–10:25",  room: "Room 402",     type: "class" },
      { subject: "Break",         time: "10:25–10:45", type: "break" },
      { subject: "Mathematics Lab",teacher:"Ms. Hypatia",           time: "10:50–12:25", room: "Room 403",     type: "lab"   },
      { subject: "Lunch",         time: "12:25–1:10",  type: "break" },
      { subject: "Art",           teacher: "Ms. Husain",            time: "1:15–2:00",   room: "Art Room",     type: "class" },
    ],
    Thursday: [
      { subject: "Social Studies",teacher: "Mr. Nehru",             time: "8:00–8:45",   room: "Room 404",     type: "class" },
      { subject: "Mathematics",   teacher: "Ms. Hypatia",           time: "8:50–9:35",   room: "Room 403",     type: "class" },
      { subject: "Science",       teacher: "Dr. Curie",             time: "9:40–10:25",  room: "Room 405",     type: "class" },
      { subject: "Break",         time: "10:25–10:45", type: "break" },
      { subject: "Hindi",         teacher: "Mr. Premchand",         time: "10:50–11:35", room: "Room 402",     type: "class" },
      { subject: "English",       teacher: "Mr. Shakespeare",       time: "11:40–12:25", room: "Room 401",     type: "class" },
      { subject: "Lunch",         time: "12:25–1:10",  type: "break" },
      { subject: "Music",         teacher: "Ms. Lata",              time: "1:15–2:00",   room: "Music Room",   type: "class" },
    ],
    Friday: [
      { subject: "Hindi",         teacher: "Mr. Premchand",         time: "8:00–8:45",   room: "Room 402",     type: "class" },
      { subject: "Social Studies",teacher: "Mr. Nehru",             time: "8:50–9:35",   room: "Room 404",     type: "class" },
      { subject: "Computer Science",teacher:"Ms. Hopper",           time: "9:40–10:25",  room: "Computer Lab", type: "class" },
      { subject: "Break",         time: "10:25–10:45", type: "break" },
      { subject: "Science",       teacher: "Dr. Curie",             time: "10:50–11:35", room: "Room 405",     type: "class" },
      { subject: "Mathematics",   teacher: "Ms. Hypatia",           time: "11:40–12:25", room: "Room 403",     type: "class" },
      { subject: "Lunch",         time: "12:25–1:10",  type: "break" },
      { subject: "Library",       teacher: "Mr. Biblio",            time: "1:15–2:00",   room: "Library",      type: "class" },
    ],
  },
  "Class 8A": {
    Monday: [
      { subject: "Mathematics",   teacher: "Ms. Euler",             time: "8:00–8:45",   room: "Room 501",     type: "class" },
      { subject: "English",       teacher: "Mr. Dickens",           time: "8:50–9:35",   room: "Room 502",     type: "class" },
      { subject: "Science",       teacher: "Mr. Edison",            time: "9:40–10:25",  room: "Room 503",     type: "class" },
      { subject: "Break",         time: "10:25–10:45", type: "break" },
      { subject: "Social Studies",teacher: "Ms. Nightingale",       time: "10:50–11:35", room: "Room 504",     type: "class" },
      { subject: "Hindi",         teacher: "Mr. Kabir",             time: "11:40–12:25", room: "Room 505",     type: "class" },
      { subject: "Lunch",         time: "12:25–1:10",  type: "break" },
      { subject: "Computer Science",teacher:"Mr. Gates",            time: "1:15–2:00",   room: "Computer Lab", type: "class" },
    ],
    Tuesday: [
      { subject: "Science",       teacher: "Mr. Edison",            time: "8:00–8:45",   room: "Room 503",     type: "class" },
      { subject: "Mathematics",   teacher: "Ms. Euler",             time: "8:50–9:35",   room: "Room 501",     type: "class" },
      { subject: "Hindi",         teacher: "Mr. Kabir",             time: "9:40–10:25",  room: "Room 505",     type: "class" },
      { subject: "Break",         time: "10:25–10:45", type: "break" },
      { subject: "Science Lab",   teacher: "Mr. Edison",            time: "10:50–12:25", room: "Lab 1",        type: "lab"   },
      { subject: "Lunch",         time: "12:25–1:10",  type: "break" },
      { subject: "Physical Education",teacher:"Coach Federer",      time: "1:15–2:00",   room: "Sports Ground",type: "class" },
    ],
    Wednesday: [
      { subject: "English",       teacher: "Mr. Dickens",           time: "8:00–8:45",   room: "Room 502",     type: "class" },
      { subject: "Social Studies",teacher: "Ms. Nightingale",       time: "8:50–9:35",   room: "Room 504",     type: "class" },
      { subject: "Mathematics",   teacher: "Ms. Euler",             time: "9:40–10:25",  room: "Room 501",     type: "class" },
      { subject: "Break",         time: "10:25–10:45", type: "break" },
      { subject: "Science",       teacher: "Mr. Edison",            time: "10:50–11:35", room: "Room 503",     type: "class" },
      { subject: "Hindi",         teacher: "Mr. Kabir",             time: "11:40–12:25", room: "Room 505",     type: "class" },
      { subject: "Lunch",         time: "12:25–1:10",  type: "break" },
      { subject: "Art",           teacher: "Ms. Picasso",           time: "1:15–2:00",   room: "Art Room",     type: "class" },
    ],
    Thursday: [
      { subject: "Hindi",         teacher: "Mr. Kabir",             time: "8:00–8:45",   room: "Room 505",     type: "class" },
      { subject: "Science",       teacher: "Mr. Edison",            time: "8:50–9:35",   room: "Room 503",     type: "class" },
      { subject: "English",       teacher: "Mr. Dickens",           time: "9:40–10:25",  room: "Room 502",     type: "class" },
      { subject: "Break",         time: "10:25–10:45", type: "break" },
      { subject: "Mathematics",   teacher: "Ms. Euler",             time: "10:50–11:35", room: "Room 501",     type: "class" },
      { subject: "Social Studies",teacher: "Ms. Nightingale",       time: "11:40–12:25", room: "Room 504",     type: "class" },
      { subject: "Lunch",         time: "12:25–1:10",  type: "break" },
      { subject: "Music",         teacher: "Mr. Mozart",            time: "1:15–2:00",   room: "Music Room",   type: "class" },
    ],
    Friday: [
      { subject: "Social Studies",teacher: "Ms. Nightingale",       time: "8:00–8:45",   room: "Room 504",     type: "class" },
      { subject: "Hindi",         teacher: "Mr. Kabir",             time: "8:50–9:35",   room: "Room 505",     type: "class" },
      { subject: "Science",       teacher: "Mr. Edison",            time: "9:40–10:25",  room: "Room 503",     type: "class" },
      { subject: "Break",         time: "10:25–10:45", type: "break" },
      { subject: "English",       teacher: "Mr. Dickens",           time: "10:50–11:35", room: "Room 502",     type: "class" },
      { subject: "Mathematics",   teacher: "Ms. Euler",             time: "11:40–12:25", room: "Room 501",     type: "class" },
      { subject: "Lunch",         time: "12:25–1:10",  type: "break" },
      { subject: "Library",       teacher: "Ms. Read",              time: "1:15–2:00",   room: "Library",      type: "class" },
    ],
  },
};

const CLASS_LIST = ["Class 10A", "Class 10B", "Class 9A", "Class 9B", "Class 8A"];
const WEEK_DAYS  = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const typeStyles: Record<SessionType, string> = {
  class: "border-l-blue-400 bg-white",
  lab:   "border-l-emerald-500 bg-emerald-50",
  break: "border-l-gray-200 bg-gray-50",
};

const StudentTimetableData = () => {
  const today        = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const defaultDay   = WEEK_DAYS.includes(today) ? today : "Monday";

  const [selectedClass, setSelectedClass] = useState("Class 10A");
  const [selectedDay,   setSelectedDay]   = useState(defaultDay);

  const sessions: Session[] =
    timetables[selectedClass]?.[selectedDay] ?? [];

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          {CLASS_LIST.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <div className="flex flex-wrap gap-1.5">
          {WEEK_DAYS.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                d === selectedDay
                  ? "bg-blue-600 text-white shadow-md"
                  : d === today
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {d}{d === today ? " ★" : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className={`px-5 py-3.5 flex items-center justify-between ${selectedDay === today ? "bg-blue-600" : "bg-gray-50"}`}>
          <h3 className={`font-bold ${selectedDay === today ? "text-white" : "text-gray-700"}`}>
            {selectedDay} — {selectedClass}
          </h3>
          {selectedDay === today && (
            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">Today</span>
          )}
        </div>

        <div className="divide-y divide-gray-50">
          {sessions.map((s, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-4 px-5 py-4 border-l-4 ${typeStyles[s.type]}`}
            >
              <div className="w-28 flex-shrink-0">
                <p className="text-xs font-bold text-gray-500">{s.time}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${s.type === "break" ? "text-gray-400 uppercase tracking-widest text-xs" : "text-gray-800"}`}>
                  {s.subject}
                </p>
                {s.teacher && <p className="text-xs text-gray-400 mt-0.5">{s.teacher}</p>}
              </div>
              {s.room && (
                <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg flex-shrink-0">
                  {s.room}
                </span>
              )}
              {s.type === "lab" && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-lg flex-shrink-0">
                  LAB
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentTimetableData;