"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { logout } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { apiClient } from "../../lib/apiClient";
import { useEffect, useState } from "react";
import { GitHubConnection } from "../../interfaces";

export default function DashboardPage() {
  const auth = useAppSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const [githubConnection, setGithubConnection] =
    useState<GitHubConnection | null>(null);

  const [isGitHubLoading, setIsGitHubLoading] = useState(true);

  const githubConnected = searchParams.get("github") === "connected";
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

  useEffect(() => {
    apiClient("/api/github/connection")
      .then((data) => {
        setGithubConnection(data.connection);
      })
      .catch(() => {
        setGithubConnection(null);
      })
      .finally(() => {
        setIsGitHubLoading(false);
      });
  }, []);
  console.log("githubConnection", githubConnection);
  return (
    <ProtectedRoute>
      <main>
        <h1>ReviewForge</h1>

        {auth.isAuthenticated ? (
          <>
            <p>Welcome, {auth.user?.name}</p>

            <p>Role: {auth.user?.role}</p>

            {isGitHubLoading ? (
              <p> Checking Github connection... </p>
            ) : githubConnected ? (
              <div>
                <p>
                  GitHub connected as:{" "}
                  <strong>@{githubConnection?.username}</strong>
                </p>
                <p>Connected</p>
              </div>
            ) : (
              <button onClick={handleConnectGithub}>Connect GitHub</button>
            )}
            <button onClick={handleLogOut}>Logout</button>
          </>
        ) : (
          <p>You are not authenticated.</p>
        )}
      </main>
    </ProtectedRoute>
  );
}
