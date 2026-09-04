"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { logout } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { apiClient } from "../../lib/apiClient";
import { useEffect, useState } from "react";
import { GitHubConnection, Repositories } from "../../interfaces";
import { Box, Button, Card, Grid, Stack, Typography } from "@mui/material";
import ButtonAppBar from "../../components/ButtonAppBar";
import VerifiedIcon from "@mui/icons-material/Verified";
export const API_GTHUB = "/api/github";
export const API_AUTH = "/api/auth";

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
  const [repositories, setRepositories] = useState<Repositories[]>([]);

  const handleLogOut = async () => {
    try {
      await apiClient(`${API_AUTH}/logout`, {
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
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}${API_GTHUB}/connect`;
  };
  const handleDisconnectGitHub = async () => {
    try {
      await apiClient(`${API_GTHUB}/connection`, {
        method: "DELETE",
      });
      setGithubConnection(null);
      setShowGitHubConnectedMessage(false);
    } catch (error) {
      console.log(`Couldn't delete the GitHub connection : ${error}`);
    }
  };
  const handleImportRepository = async (repo: Repositories) => {
    console.log("repo", repo);
    try {
      const data = await apiClient(`${API_GTHUB}/repositories`, {
        method: "POST",
        body: JSON.stringify({
          name: repo.name,
          fullName: repo.fullName,
          url: repo.url,
          provider: "github",
        }),
      });
      console.log("IMPORTED REPO: ", data.repository);
    } catch (error) {
      console.error("Import failed:", error);
    }
  };

  useEffect(() => {
    apiClient(`${API_GTHUB}/connection`)
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

  useEffect(() => {
    if (!githubConnection) return;
    apiClient(`${API_GTHUB}/repositories`)
      .then((data) => {
        setRepositories(data.repositories);
      })
      .catch(console.error);
  }, [githubConnection]);

  return (
    <ProtectedRoute>
      <Box component="main">
        <ButtonAppBar userName={auth.user?.name} handleLogOut={handleLogOut} />
        <Grid container>
          <Grid size={4}>
            <Box sx={{ backgroundColor: "primary.200", height: "90vh" }}>
              {auth.isAuthenticated ? (
                <Stack
                  direction="row"
                  sx={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "2rem",
                  }}
                >
                  {githubConnection ? (
                    <Typography variant="h4" component="h1">
                      {githubConnection?.username}{" "}
                      <VerifiedIcon color="success" />
                    </Typography>
                  ) : (
                    <Typography variant="h4" component="h1">
                      Connect GitHub repository
                    </Typography>
                  )}
                  <Box>
                    {githubConnection ? (
                      <Button
                        onClick={handleDisconnectGitHub}
                        variant="contained"
                        sx={{
                          backgroundColor: "secondary.dark",
                          color: "#000",
                        }}
                      >
                        Disconnect GitHub
                      </Button>
                    ) : (
                      <Button
                        onClick={handleConnectGithub}
                        variant="contained"
                        color="primary"
                      >
                        Connect GitHub
                      </Button>
                    )}
                  </Box>
                </Stack>
              ) : (
                <Typography component="text">
                  You are not authenticated.
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid size={8}>
            <Box
              sx={{
                backgroundColor: "primary.light",
                height: "90vh",
                padding: "2rem",
                overflowY: "scroll",
              }}
            >
              <Stack direction="column">
                {repositories.length &&
                  repositories.map((repo: Repositories) => (
                    <Card
                      key={repo.githubId}
                      sx={{ padding: "2rem", marginBottom: "1rem" }}
                    >
                      {repo.fullName}
                      <button onClick={() => handleImportRepository(repo)}>
                        Import
                      </button>
                    </Card>
                  ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ProtectedRoute>
  );
}
