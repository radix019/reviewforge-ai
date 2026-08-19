"use client";

import { useRouter } from "next/navigation";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { logout } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function DashboardPage() {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleLogOut = () => {
    dispatch(logout());
    router.replace("/login");
  };
  return (
    <ProtectedRoute>
      <main>
        <h1>ReviewForge</h1>

        {auth.isAuthenticated ? (
          <>
            <p>Welcome, {auth.user?.name}</p>

            <p>Role: {auth.user?.role}</p>
            <p>Backend: {}</p>
            <button onClick={handleLogOut}>Logout</button>
          </>
        ) : (
          <p>You are not authenticated.</p>
        )}
      </main>
    </ProtectedRoute>
  );
}
