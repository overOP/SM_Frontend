import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Calendar, BookOpen, User, Edit2, Shield, X, Check } from "lucide-react";
import { Button, Input, Select } from "../../ui";

interface StudentProfile {
  name: string;
  classSection: string;
  rollNo: string;
  status: string;
  initials: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  gender: string;
  studentId: string;
  admissionYear: string;
  gpa: string;
  attendance: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  relation: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  gender: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  relation: string;
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <div className="flex items-center gap-4 py-3.5 border-b border-slate-50 last:border-0">
    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 text-slate-500">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-slate-800 mt-0.5">{value}</p>
    </div>
  </div>
);

const StudentProfileData = () => {
  const [profile, setProfile] = useState<StudentProfile>({
    name: "Alex Johnson",
    classSection: "Class 10A",
    rollNo: "24",
    status: "Active",
    initials: "AJ",
    email: "alex.johnson@school.edu",
    phone: "+91 98765 43210",
    address: "12, Sector 5, Noida, UP - 201301",
    dob: "15 March 2009",
    gender: "Male",
    studentId: "STU-2024-0024",
    admissionYear: "2022",
    gpa: "3.8 / 4.0",
    attendance: "92.7%",
    guardianName: "Robert Johnson",
    guardianPhone: "+91 99887 76655",
    guardianEmail: "robert.johnson@email.com",
    relation: "Father",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    gender: "",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    relation: "",
  });

  const handleEditClick = () => {
    // Pre-populate form with current data
    setFormData({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
      dob: profile.dob,
      gender: profile.gender,
      guardianName: profile.guardianName,
      guardianPhone: profile.guardianPhone,
      guardianEmail: profile.guardianEmail,
      relation: profile.relation,
    });
    setIsEditing(true);
  };

  const handleClose = () => setIsEditing(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update profile with new data (simulate API call)
    setProfile({
      ...profile,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      dob: formData.dob,
      gender: formData.gender,
      guardianName: formData.guardianName,
      guardianPhone: formData.guardianPhone,
      guardianEmail: formData.guardianEmail,
      relation: formData.relation,
      // Recalculate initials
      initials: formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2),
    });
    setIsEditing(false);
    // Could add toast notification here
    alert('Profile updated successfully!');
  };

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

  const relationOptions = [
    { value: 'Father', label: 'Father' },
    { value: 'Mother', label: 'Mother' },
    { value: 'Guardian', label: 'Guardian' },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-blue-600 to-blue-500" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center">
              <span className="text-2xl font-black text-blue-600">{profile.initials}</span>
            </div>
            <button 
              onClick={handleEditClick}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-semibold text-slate-600 transition-colors"
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
          </div>
          <h2 className="text-xl font-black text-slate-800">{profile.name}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">{profile.classSection}</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">Roll No. {profile.rollNo}</span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-bold">{profile.status}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-800">Personal Information</h3>
          </div>
          <InfoRow icon={<Mail className="w-4 h-4" />} label="Email Address" value={profile.email} />
          <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone Number" value={profile.phone} />
          <InfoRow icon={<MapPin className="w-4 h-4" />} label="Address" value={profile.address} />
          <InfoRow icon={<Calendar className="w-4 h-4" />} label="Date of Birth" value={profile.dob} />
          <InfoRow icon={<User className="w-4 h-4" />} label="Gender" value={profile.gender} />
        </div>

        {/* Academic Information */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-800">Academic Information</h3>
          </div>
          <InfoRow icon={<BookOpen className="w-4 h-4" />} label="Student ID" value={profile.studentId} />
          <InfoRow icon={<BookOpen className="w-4 h-4" />} label="Class & Section" value={profile.classSection} />
          <InfoRow icon={<BookOpen className="w-4 h-4" />} label="Admission Year" value={profile.admissionYear} />
          <InfoRow icon={<BookOpen className="w-4 h-4" />} label="Current GPA" value={profile.gpa} />
          <InfoRow icon={<BookOpen className="w-4 h-4" />} label="Overall Attendance" value={profile.attendance} />
        </div>

        {/* Guardian Information */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-800">Guardian Information</h3>
          </div>
          <InfoRow icon={<User className="w-4 h-4" />} label="Guardian Name" value={profile.guardianName} />
          <InfoRow icon={<Phone className="w-4 h-4" />} label="Guardian Phone" value={profile.guardianPhone} />
          <InfoRow icon={<Mail className="w-4 h-4" />} label="Guardian Email" value={profile.guardianEmail} />
          <InfoRow icon={<User className="w-4 h-4" />} label="Relation" value={profile.relation} />
          <InfoRow icon={<MapPin className="w-4 h-4" />} label="Occupation" value="Software Engineer" />
        </div>

        {/* Subjects Enrolled */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-800">Subjects Enrolled</h3>
          </div>
          {[
            { name: "Mathematics", teacher: "Dr. Sarah Johnson", code: "MATH-10" },
            { name: "English", teacher: "Ms. Emily Davis", code: "ENG-10" },
            { name: "Physics", teacher: "Prof. Michael Chen", code: "PHY-10" },
            { name: "Chemistry", teacher: "Mr. Robert Wilson", code: "CHEM-10" },
            { name: "Biology", teacher: "Dr. Lisa Anderson", code: "BIO-10" },
            { name: "History", teacher: "Mrs. Patricia Brown", code: "HIST-10" },
          ].map((subject) => (
            <div key={subject.code} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
              <div>
                <p className="text-sm font-semibold text-slate-800">{subject.name}</p>
                <p className="text-xs text-slate-400">{subject.teacher}</p>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">{subject.code}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">Edit Profile</h2>
              <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                <Input
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                <Select
                  label="Gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  options={['Male', 'Female', 'Other']}
                />
                <Input
                  label="Date of Birth"
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                />
                <Input
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-lg font-bold text-slate-800 mb-4">Guardian Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Guardian Name"
                    value={formData.guardianName}
                    onChange={(e) => setFormData({...formData, guardianName: e.target.value})}
                  />
                  <Input
                    label="Guardian Phone"
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({...formData, guardianPhone: e.target.value})}
                  />
                  <Input
                    label="Guardian Email"
                    type="email"
                    value={formData.guardianEmail}
                    onChange={(e) => setFormData({...formData, guardianEmail: e.target.value})}
                  />
                  <Select
                    label="Relation"
                    value={formData.relation}
                    onChange={(e) => setFormData({...formData, relation: e.target.value})}
                    options={['Father', 'Mother', 'Guardian']}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfileData;

