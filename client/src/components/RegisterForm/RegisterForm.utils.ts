export function validateRegisterForm(username: string, email: string, password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!username.trim()) {
    errors.push('Username is required');
  }

  if (!email.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Invalid email format');
  }

  if (!password.trim()) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

