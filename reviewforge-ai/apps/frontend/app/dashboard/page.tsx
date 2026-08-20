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
  const [showGitHubConnectedMessage, setShowGitHubConnectedMessage] =
    useState(false);

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
  const handleDisconnectGitHub = async () => {
    try {
      await apiClient("/api/github/connection", {
        method: "DELETE",
      });
      setGithubConnection(null);
      setShowGitHubConnectedMessage(false);
    } catch (error) {
      console.log(`Couldn't delete the GitHub connection : ${error}`);
    }
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

  useEffect(() => {
    if (searchParams.get("github") === "connected") {
      setShowGitHubConnectedMessage(true);
      router.replace("/dashboard");
    }
  }, [searchParams, router]);
  return (
    <ProtectedRoute>
      <main>
        <h1>ReviewForge</h1>

        {auth.isAuthenticated ? (
          <>
            <p>Welcome, {auth.user?.name}</p>

            <p>Role: {auth.user?.role}</p>

            <hr />
            <h2>GitHub details</h2>

            {isGitHubLoading ? (
              <p> Checking Github connection... </p>
            ) : showGitHubConnectedMessage ? (
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
            <hr />

            <button onClick={handleLogOut}>Logout</button>
          </>
        ) : (
          <p>You are not authenticated.</p>
        )}
        {githubConnection && (
          <button onClick={handleDisconnectGitHub}>Disconnect GitHub</button>
        )}
      </main>
    </ProtectedRoute>
  );
}
