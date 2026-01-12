'use client';

import { useEffect, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Box, Button, Typography, Alert, Divider } from '@mui/material';
import { authApi } from '@/lib/api';
import { setToken } from '@/lib/auth';
import { Input } from '@/components/shared/Input';
import { GoogleIcon } from '@/components/shared/icons';
import { loginSchema, LoginFormData } from './LoginForm.schema';
import { getGoogleAuthUrl } from './LoginForm.utils';
import { styles } from './LoginForm.sx';

function LoginFormComponent() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      setToken(data.access_token);
      router.push('/rooms');
    },
    onError: (err: { message: string }) => {
      setFormError('root', { message: err.message });
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');
    if (errorParam === 'oauth_failed') {
      setFormError('root', { message: 'OAuth authentication failed. Please try again or use email/password to login.' });
      router.replace('/login');
    }
  }, [router, setFormError]);

  const onSubmit = useCallback(
    (data: LoginFormData) => {
      mutation.mutate(data);
    },
    [mutation]
  );

  const handleGoogleLogin = useCallback(() => {
    window.location.href = getGoogleAuthUrl();
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
        {errors.root && (
          <Alert severity="error" sx={styles.alert}>
            {errors.root.message}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Input
            name="email"
            control={control}
            label="Email"
            type="email"
            sx={styles.field}
            autoComplete="email"
          />
          <Input
            name="password"
            control={control}
            label="Password"
            type="password"
            sx={styles.field}
            autoComplete="current-password"
          />
          <Button type="submit" variant="contained" fullWidth sx={styles.button} disabled={mutation.isPending}>
            {mutation.isPending ? 'Signing in...' : 'Sign In'}
          </Button>
        </Box>
        <Divider sx={styles.divider}>OR</Divider>
        <Button
          variant="outlined"
          fullWidth
          sx={styles.oauthButton}
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
        >
          Sign in with Google
        </Button>
        <Button onClick={handleNavigateToRegister} sx={styles.linkButton} fullWidth>
          Don't have an account? Register
        </Button>
      </Box>
    </Box>
  );
}

export const LoginForm = memo(LoginFormComponent);
