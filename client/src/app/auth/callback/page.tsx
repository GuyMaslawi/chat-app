'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { setToken } from '@/lib/auth';
import { styles } from './page.sx';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setToken(token);
      router.push('/rooms');
    } else {
      router.push('/login');
    }
  }, [searchParams, router]);

  return (
    <Box sx={styles.container}>
      <Stack spacing={2} sx={styles.stack}>
        <Skeleton variant="circular" width={64} height={64} />
        <Skeleton variant="text" width="60%" height={32} />
        <Typography variant="body1" sx={styles.text}>
          Completing authentication...
        </Typography>
      </Stack>
    </Box>
  );
}

