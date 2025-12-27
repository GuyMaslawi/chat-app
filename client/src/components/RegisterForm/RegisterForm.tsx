'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { authApi } from '@/lib/api';
import { setToken } from '@/lib/auth';
import { styles } from './RegisterForm.sx';

export function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: authApi.register,
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
    mutation.mutate({ username, email, password });
  }, [username, email, password, mutation]);

  const handleNavigateToLogin = useCallback(() => {
    router.push('/login');
  }, [router]);

  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }, []);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.form}>
        <Typography variant="h4" sx={styles.title}>
          Create Account
        </Typography>
        <Typography variant="body2" sx={styles.subtitle}>
          Join the conversation and start chatting
        </Typography>
        {error && (
          <Alert severity="error" sx={styles.alert}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={handleUsernameChange}
            required
            sx={styles.field}
            autoComplete="username"
          />
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
            autoComplete="new-password"
          />
          <Button type="submit" variant="contained" fullWidth sx={styles.button} disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
        <Button onClick={handleNavigateToLogin} sx={styles.linkButton} fullWidth>
          Already have an account? Sign In
        </Button>
      </Box>
    </Box>
  );
}

