'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { getToken, isTokenExpired, logout } from '@/lib/auth';
import { styles } from './AuthGuard.sx';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = getToken();
    
    
    if (!token || isTokenExpired(token)) {
      logout();
      return;
    }
    
    setIsAuthenticated(true);

    
    const checkInterval = setInterval(() => {
      const currentToken = getToken();
      if (!currentToken || isTokenExpired(currentToken)) {
        logout();
      }
    }, 60000); 

    return () => {
      clearInterval(checkInterval);
    };
  }, [router]);

  
  
  if (!mounted) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <Box sx={styles.container}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}

