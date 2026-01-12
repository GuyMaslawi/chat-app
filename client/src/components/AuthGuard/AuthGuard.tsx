'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Skeleton, Stack } from '@mui/material';
import { getToken, isTokenExpired, isTokenExpiringSoon, refreshToken, logout } from '@/lib/auth';
import { styles } from './AuthGuard.sx';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const attemptRefresh = async () => {
    const token = getToken();
    if (!token) {
      logout();
      return;
    }

    if (isTokenExpired(token)) {
      logout();
      return;
    }

    if (isTokenExpiringSoon(token, 60)) {
      const success = await refreshToken();
      if (!success) {
        logout();
        return;
      }
    }
  };

  const setupRefreshInterval = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    refreshIntervalRef.current = setInterval(() => {
      attemptRefresh();
    }, 30000);
  };

  const setupActivityListener = () => {
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      attemptRefresh();
      
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
      
      activityTimeoutRef.current = setTimeout(() => {
        setupRefreshInterval();
      }, 1000);
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
    };
  };

  useEffect(() => {
    setMounted(true);
    const token = getToken();
    
    if (!token || isTokenExpired(token)) {
      logout();
      return;
    }
    
    setIsAuthenticated(true);
    
    attemptRefresh();
    setupRefreshInterval();
    const cleanupActivity = setupActivityListener();

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      cleanupActivity();
    };
  }, [router]);

  if (!mounted) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <Box sx={styles.container}>
        <Stack spacing={2} sx={{ width: '100%', maxWidth: 400, p: 3 }}>
          <Skeleton variant="circular" width={64} height={64} sx={{ mx: 'auto' }} />
          <Skeleton variant="text" width="60%" height={32} sx={{ mx: 'auto' }} />
          <Skeleton variant="text" width="40%" height={24} sx={{ mx: 'auto' }} />
        </Stack>
      </Box>
    );
  }

  return <>{children}</>;
}

