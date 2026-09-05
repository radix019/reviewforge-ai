'use client';

import { Box } from '@mui/material';
import ButtonAppBar from '../../components/ButtonAppBar';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';
import { logout } from '../../features/auth/authSlice';
import { API_AUTH } from './dashboard/page';
import LoadingSkeletons from '../../components/LoadingSkeletons';
import { LOGIN_URL, LOGOUT_URL, POST } from '../../components/constants';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogOut = async () => {
    try {
      await apiClient(`${API_AUTH}${LOGOUT_URL}`, {
        method: POST,
      });
    } catch (error) {
      console.log('Logout failed!', error);
    } finally {
      dispatch(logout());
      router.replace(LOGIN_URL);
    }
  };

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.replace(LOGIN_URL);
    }
  }, [isAuthenticated, router, isLoading]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <ButtonAppBar userName={user?.name ?? ''} handleLogOut={handleLogOut} />
      {isLoading ? <LoadingSkeletons /> : <Box component="main">{children}</Box>}
    </>
  );
}
