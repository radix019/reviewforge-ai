'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '../../../../lib/apiClient';
import { Box, Button, Typography } from '@mui/material';
import { API_GTHUB } from '../../dashboard/page';

type RepositoryItem = {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size: number;
  sha: string;
};
type SelectedFile = {
  name: string;
  path: string;
  size: number;
  sha: string;
  content: string;
};

export default function RepositoryPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const repositoryId = params.id;
  console.log('repositoryId', repositoryId);
  const [currentPath, setCurrentPath] = useState('');
  const [items, setItems] = useState<RepositoryItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log('items', items);

  const handleItemClick = async (item: RepositoryItem) => {
    console.log('item', item);
    if (item.type === 'dir') {
      setSelectedFile(null);
      setCurrentPath(item.path);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      console.log('PAKKA RUn');
      const data = await apiClient(`/api/repositories/${repositoryId}/file` + `?path=${encodeURIComponent(item.path)}`);

      setSelectedFile(data.files);
      console.log('data', data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedFile(null);
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    setCurrentPath(parts.join('/'));
  };

  useEffect(() => {
    async function loadDirectory() {
      try {
        setIsLoading(true);
        setError(null);
        console.log('currentPath', currentPath);
        const query = currentPath ? `?path=${encodeURIComponent(currentPath)}` : '';
        console.log('query', query);
        const data = await apiClient(`/api/repositories/${repositoryId}/files${query}`);
        console.log('data', data);
        setItems(data.files);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load Repository!');
      } finally {
        setIsLoading(false);
      }
    }
    loadDirectory();
  }, [currentPath, repositoryId]);

  return (
    <Box component="main">
      <Button onClick={() => router.push('/dashboard')}>← Dashboard</Button>

      <Typography variant="h4">Repository Explorer</Typography>

      <Typography variant="h5" sx={{ marginLeft: '1rem' }}>
        /{currentPath || ''}
      </Typography>

      {currentPath && <Button onClick={handleBack}>← Back</Button>}

      {error && <p>{error}</p>}

      {isLoading && <p>Loading...</p>}

      <div
        style={{
          display: 'flex',
          gap: '32px',
          marginTop: '20px',
        }}
      >
        <div
          style={{
            minWidth: '300px',
          }}
        >
          {items.map((item) => (
            <div key={item.sha}>
              <Button onClick={() => handleItemClick(item)}>
                <Typography variant="h4" sx={{ marginBottom: '1rem' }}>
                  {item.type === 'dir' ? '📁' : '📄'} {item.name}
                </Typography>
              </Button>
            </div>
          ))}
        </div>

        <div
          style={{
            flex: 1,
          }}
        >
          {selectedFile && (
            <>
              <h2>{selectedFile.path}</h2>

              <pre
                style={{
                  overflow: 'auto',
                  padding: '16px',
                  background: '#111',
                  color: '#eee',
                }}
              >
                <code>{selectedFile.content}</code>
              </pre>
            </>
          )}
        </div>
      </div>
    </Box>
  );
}
