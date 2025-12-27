'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Box, TextField, Button, Typography, Alert, Divider } from '@mui/material';
import { authApi } from '@/lib/api';
import { setToken } from '@/lib/auth';
import { styles } from './LoginForm.sx';


const GoogleIcon = () => (
  <Box
    component="svg"
    sx={{ width: 20, height: 20, mr: 1.5 }}
    viewBox="0 0 24 24"
  >
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </Box>
);


const MicrosoftIcon = () => (
  <Box
    component="svg"
    sx={{ width: 20, height: 20, mr: 1.5 }}
    viewBox="0 0 23 23"
  >
    <path fill="#F25022" d="M0 0h11v11H0z" />
    <path fill="#00A4EF" d="M12 0h11v11H12z" />
    <path fill="#7FBA00" d="M0 12h11v11H0z" />
    <path fill="#FFB900" d="M12 12h11v11H12z" />
  </Box>
);

import { getGoogleAuthUrl, getMicrosoftAuthUrl } from './LoginForm.utils';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      setToken(data.access_token);
      router.push('/rooms');
    },
    onError: (err: { message: string }) => {
      setError(err.message);
    },
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    mutation.mutate({ email, password });
  }, [email, password, mutation]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleGoogleLogin = useCallback(() => {
    window.location.href = getGoogleAuthUrl();
  }, []);

  const handleMicrosoftLogin = useCallback(() => {
    window.location.href = getMicrosoftAuthUrl();
  }, []);

  const handleNavigateToRegister = useCallback(() => {
    router.push('/register');
  }, [router]);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.form}>
        <Typography variant="h4" sx={styles.title}>
          Welcome Back
        </Typography>
        <Typography variant="body2" sx={styles.subtitle}>
          Sign in to continue to your chat rooms
        </Typography>
        {error && (
          <Alert severity="error" sx={styles.alert}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            sx={styles.field}
            autoComplete="email"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            sx={styles.field}
            autoComplete="current-password"
          />
          <Button type="submit" variant="contained" fullWidth sx={styles.button} disabled={mutation.isPending}>
            {mutation.isPending ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <Divider 
          sx={{ 
            my: 2,
            '&::before, &::after': {
              borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)',
            },
            '& .MuiDivider-wrapper': {
              color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              fontSize: '0.875rem',
              fontWeight: 500,
            },
          }}
        >
          OR
        </Divider>
        <Button
          variant="outlined"
          fullWidth
          sx={styles.oauthButton}
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
        >
          Sign in with Google
        </Button>
        <Button
          variant="outlined"
          fullWidth
          sx={styles.oauthButton}
          startIcon={<MicrosoftIcon />}
          onClick={handleMicrosoftLogin}
        >
          Sign in with Microsoft
        </Button>
        <Button onClick={handleNavigateToRegister} sx={styles.linkButton} fullWidth>
          Don't have an account? Register
        </Button>
      </Box>
    </Box>
  );
}

