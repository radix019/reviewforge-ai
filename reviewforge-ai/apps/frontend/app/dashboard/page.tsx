"use client";

import { useRouter } from "next/navigation";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { logout } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { apiClient } from "../../lib/apiClient";

export default function DashboardPage() {
  const auth = useAppSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogOut = async () => {
    try {
      await apiClient("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.log("Logout failed!", error);
    } finally {
      dispatch(logout());
      router.replace("/login");
    }
  };
  const handleConnectGithub = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/github/connect`;
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
            <button onClick={handleConnectGithub}>Connect GitHub</button>
          </>
        ) : (
          <p>You are not authenticated.</p>
        )}
      </main>
    </ProtectedRoute>
  );
}
