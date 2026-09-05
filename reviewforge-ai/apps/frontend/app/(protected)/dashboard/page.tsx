'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useAppSelector } from '../../store/hooks';
import { apiClient } from '../../../lib/apiClient';
import { useEffect, useState } from 'react';
import { GitHubConnection, Repositories } from '../../../interfaces';
import { Box, Button, Card, Grid, Stack, Tooltip, Typography } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
export const API_GTHUB = '/api/github';
export const API_AUTH = '/api/auth';

type DashboardAuth = {
  user?: { name?: string };
  isAuthenticated: boolean;
};

export default function DashboardPage() {
  const auth = useAppSelector((state) => (state as { auth: DashboardAuth }).auth);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [githubConnection, setGithubConnection] = useState<GitHubConnection | null>(null);

  const [isGitHubLoading, setIsGitHubLoading] = useState(true);
  const [showGitHubConnectedMessage, setShowGitHubConnectedMessage] = useState(false);
  const [repositories, setRepositories] = useState<Repositories[]>([]);

  const handleConnectGithub = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}${API_GTHUB}/connect`;
  };
  const handleDisconnectGitHub = async () => {
    try {
      await apiClient(`${API_GTHUB}/connection`, {
        method: 'DELETE',
      });
      setGithubConnection(null);
      setShowGitHubConnectedMessage(false);
    } catch (error) {
      console.log(`Couldn't delete the GitHub connection : ${error}`);
    }
  };
  const handleImportRepository = async (repo: Repositories) => {
    try {
      const data = await apiClient(`${API_GTHUB}/repositories`, {
        method: 'POST',
        body: JSON.stringify({
          name: repo.name,
          fullName: repo.fullName,
          url: repo.url,
          provider: 'github',
        }),
      });
      router.push(`/repositories/${data.repository.id}`);
    } catch (error) {
      console.error('Import failed:', error);
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
    if (searchParams.get('github') === 'connected') {
      setShowGitHubConnectedMessage(true);
      router.replace('/dashboard');
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
    <Box component="main">
      <Grid container>
        <Grid size={4}>
          <Stack direction="column">
            <Box sx={{ backgroundColor: 'primary.200' }}>
              {auth.isAuthenticated ? (
                <Stack
                  direction="row"
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '2rem',
                  }}
                >
                  {githubConnection ? (
                    <Typography variant="h4" component="h1">
                      {githubConnection?.username} <VerifiedIcon color="success" />
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
                          backgroundColor: 'secondary.dark',
                          color: '#000',
                        }}
                      >
                        Disconnect GitHub
                      </Button>
                    ) : (
                      <Button onClick={handleConnectGithub} variant="contained" color="primary">
                        Connect GitHub
                      </Button>
                    )}
                  </Box>
                </Stack>
              ) : (
                <Typography component="text">You are not authenticated.</Typography>
              )}
            </Box>
            <Box
              sx={{
                backgroundColor: 'primary.light',
                height: '80vh',
                padding: '2rem',
                overflowY: 'scroll',
              }}
            >
              <Stack direction="column">
                {repositories.length &&
                  repositories.map((repo: Repositories) => (
                    <Card key={repo.githubId} sx={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                      {repo.fullName}
                      <Tooltip title="Import to database">
                        <Button onClick={() => handleImportRepository(repo)}>
                          <SaveAltIcon />
                        </Button>
                      </Tooltip>
                    </Card>
                  ))}
              </Stack>
            </Box>
          </Stack>
        </Grid>
        <Grid size={8}></Grid>
      </Grid>
    </Box>
  );
}
