import { Users, BookOpen } from "lucide-react";

interface ClassEntry {
  id: number;
  name: string;
  room: string;
  subject: string;
  students: number;
  schedule: string;
  subjects: string[];
  color: string;
  badgeColor: string;
}

// Only the classes this teacher is assigned to teach
const myClasses: ClassEntry[] = [
  {
    id: 1,
    name: "Class 10A",
    room: "101",
    subject: "Mathematics",
    students: 7,
    schedule: "Mon, Wed, Fri — 8:50 AM",
    subjects: ["Mathematics", "Applied Maths", "Statistics"],
    color: "border-blue-500",
    badgeColor: "bg-blue-50 text-blue-600",
  },
  {
    id: 2,
    name: "Class 10B",
    room: "102",
    subject: "Mathematics",
    students: 5,
    schedule: "Mon, Wed, Fri — 10:50 AM",
    subjects: ["Mathematics", "Applied Maths"],
    color: "border-indigo-500",
    badgeColor: "bg-indigo-50 text-indigo-600",
  },
  {
    id: 3,
    name: "Class 9A",
    room: "103",
    subject: "Mathematics",
    students: 9,
    schedule: "Tue, Thu — 9:40 AM",
    subjects: ["Mathematics", "Pre-Calculus"],
    color: "border-emerald-500",
    badgeColor: "bg-emerald-50 text-emerald-600",
  },
];

const TeacherClassData = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-700">
      <div className="mb-6">
        <p className="text-sm text-slate-500">You are assigned to teach <span className="font-bold text-slate-700">{myClasses.length} classes</span> this academic year.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myClasses.map((cls) => (
          <div key={cls.id} className={`bg-white rounded-2xl shadow-sm border-t-8 ${cls.color} p-6 hover:shadow-md transition-shadow`}>
            <div className="flex justify-between items-start mb-1">
              <h2 className="text-xl font-bold text-slate-800">{cls.name}</h2>
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${cls.badgeColor}`}>
                {cls.subject}
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-4">Room {cls.room}</p>

            <div className="bg-slate-50 rounded-xl px-4 py-3 mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">My Schedule</p>
              <p className="text-sm font-semibold text-slate-700">{cls.schedule}</p>
            </div>

            <div className="flex items-center gap-6 mb-6 text-slate-500">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">{cls.students} students</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">{cls.subjects.length} topics</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Topics Covered</p>
              <div className="flex flex-wrap gap-2">
                {cls.subjects.map((sub, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[11px] font-bold text-slate-700">
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherClassData;
