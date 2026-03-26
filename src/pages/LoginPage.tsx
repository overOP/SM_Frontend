import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { Building2 } from "lucide-react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { MdMailOutline } from "react-icons/md";
import { useNavigate } from "react-router";
import gsap from "gsap";

export default function LoginPage() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // Updated to .com to match your AuthContext USERS mock data
  const [email, setEmail] = useState("admin@edumanage.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState("Admin");

  // Refs for GSAP
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Call the context login method
    const result = auth?.login(email, password);

    if (result?.success) {
      // Navigate to the route returned by the auth logic
      navigate(`/${result.role}`);
    } else {
      alert(result?.message);
    }
  };

  useEffect(() => {
    const tl = gsap.timeline();
    tl.from(leftRef.current, {
      x: -100,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
    });
    tl.from(
      rightRef.current,
      {
        x: 100,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.5"
    );
  }, []);

  return (
    <div className="min-h-screen font-sans flex">
      {/* LEFT SECTION */}
      <div
        ref={leftRef}
        className="hidden lg:flex flex-1 bg-[#0057ff] text-white px-24 py-16 items-center justify-center"
      >
        <div className="w-full max-w-md text-left">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Building2 size={24} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold">EduManage</h1>
          </div>
          <p className="text-lg opacity-90 mb-16">School Management System</p>
          <h2 className="text-5xl font-extrabold leading-tight tracking-tight mb-7">
            Streamline Your <br />
            Educational Journey
          </h2>
          <p className="text-lg leading-relaxed opacity-95 mb-11">
            A comprehensive platform designed to manage students, teachers,
            attendance, and academic activities with ease.
          </p>
          <ul className="space-y-3 text-lg">
            {[
              "Role-based access control",
              "Real-time attendance tracking",
              "Event management",
              "Performance analytics",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-3xl text-blue-500 leading-none">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div
        ref={rightRef}
        className="flex-1 bg-slate-50 flex items-center justify-center p-8 sm:p-16"
      >
        <div className="w-full max-w-2xl bg-white p-8 sm:p-16 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.05),0_20px_60px_rgba(0,0,0,0.06)] flex flex-col">
          <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
          <p className="text-center text-slate-500 text-sm mb-8">
            Sign in to access your portal
          </p>

          <div className="flex gap-3 mb-6 flex-wrap justify-center">
            {["Admin", "Teacher", "Student", "Parent"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setActiveRole(role)}
                className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  activeRole === role
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-none shadow-md"
                    : "bg-slate-100 border-slate-200 hover:bg-slate-200"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="bg-slate-100 p-4 rounded-xl text-sm mb-7 text-center lg:text-left">
            <strong className="block font-semibold">{activeRole}</strong>
            <span className="text-slate-600">
              Full system access and management
            </span>
          </div>

          {/* FIX: Use handleLogin directly in onSubmit */}
          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="admin@school.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-200 transition"
                />
                <MdMailOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-200 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg"
                >
                  {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                Remember me
              </label>
              <a href="#" className="text-blue-600 font-medium hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="mt-3 py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              Login
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Demo: Use admin@school.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
