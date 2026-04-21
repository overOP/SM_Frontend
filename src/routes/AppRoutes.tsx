import { Suspense, lazy, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Pages
const LoginPage = lazy(() => import("../pages/LoginPage"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const TeacherDashboard = lazy(() => import("../pages/TeacherDashboard"));
const StudentDashboard = lazy(() => import("../pages/StudentDashboard"));
const ParentDashboard = lazy(() => import("../pages/ParentDashboard"));

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const fallback = (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-semibold text-slate-500">
      Loading module...
    </div>
  );

  return (
    <Suspense fallback={fallback}>
      <Routes>
        {/* 1. LOGIN ROUTE: If logged in, go to SPECIFIC role dashboard */}
        <Route
          path="/login"
          element={
            user ? <Navigate to={`/${user.role}`} replace /> : <LoginPage />
          }
        />

        {/* 2. ROOT ROUTE: If logged in, go to SPECIFIC role dashboard */}
        <Route
          path="/"
          element={
            user ? <Navigate to={`/${user.role}`} replace /> : <Navigate to="/login" replace />
          }
        />

        {/* 3. PROTECTED ADMIN ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* 4. PROTECTED TEACHER ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
        </Route>

        {/* 5. PROTECTED STUDENT ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student" element={<StudentDashboard />} />
        </Route>

        {/* 6. PROTECTED PARENT ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["parent"]} />}>
          <Route path="/parent" element={<ParentDashboard />} />
        </Route>

        {/* 7. 404 CATCH-ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
