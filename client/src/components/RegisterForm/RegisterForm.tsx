'use client';

import { useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Box, Button, Typography, Alert } from '@mui/material';
import { authApi } from '@/lib/api';
import { setToken } from '@/lib/auth';
import { Input } from '@/components/shared/Input';
import { registerSchema, RegisterFormData } from './RegisterForm.schema';
import { styles } from './RegisterForm.sx';

function RegisterFormComponent() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: async (data) => {
      setToken(data.access_token);
      router.push('/rooms');
    },
    onError: (err: { message: string }) => {
      setFormError('root', { message: err.message });
    },
  });

  const onSubmit = useCallback(
    (data: RegisterFormData) => {
      mutation.mutate(data);
    },
    [mutation]
  );

  const handleNavigateToLogin = useCallback(() => {
    router.push('/login');
  }, [router]);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.form}>
        <Typography variant="h4" sx={styles.title}>
          Create Account
        </Typography>
        <Typography variant="body2" sx={styles.subtitle}>
          Join the conversation and start chatting
        </Typography>
        {errors.root && (
          <Alert severity="error" sx={styles.alert}>
            {errors.root.message}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Input
            name="username"
            control={control}
            label="Username"
            sx={styles.field}
            autoComplete="username"
          />
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
            autoComplete="new-password"
          />
          <Button type="submit" variant="contained" fullWidth sx={styles.button} disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating account...' : 'Create Account'}
          </Button>
        </Box>
        <Button onClick={handleNavigateToLogin} sx={styles.linkButton} fullWidth>
          Already have an account? Sign In
        </Button>
      </Box>
    </Box>
  );
}

export const RegisterForm = memo(RegisterFormComponent);
