import { Box, Skeleton, Stack } from '@mui/material';
import React from 'react';

const LoadingSkeletons = () => {
  return (
    <Box
      component="main"
      sx={{ height: 'calc(100vh - 64px)', boxSizing: 'border-box', p: { xs: 2, md: 4 } }}
      aria-label="Loading content"
    >
      <Skeleton variant="rounded" sx={{ width: '50%', height: '5%', marginBottom: '2rem' }} />
      <Stack component="div" direction="row" spacing={3} sx={{ height: '100%', justifyContent: 'space-between' }}>
        <Skeleton variant="rounded" sx={{ width: '30%', height: '100%' }} />
        <Skeleton variant="rounded" sx={{ width: '70%', height: '100%' }} />
      </Stack>
    </Box>
  );
};

export default LoadingSkeletons;
