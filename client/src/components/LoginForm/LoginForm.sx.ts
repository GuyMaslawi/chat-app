import { SxProps, Theme } from '@mui/material';

export const styles: Record<string, SxProps<Theme>> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: { xs: '100dvh', sm: '100vh' },
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: { xs: '16px', sm: '32px' },
    paddingTop: { xs: 'max(16px, env(safe-area-inset-top))', sm: '32px' },
    paddingBottom: { xs: 'max(16px, env(safe-area-inset-bottom))', sm: '32px' },
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    '&::before': {
      content: '""',
      position: 'absolute',
      width: '200%',
      height: '200%',
      background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
      backgroundSize: '50px 50px',
      animation: 'moveBackground 20s linear infinite',
      '@keyframes moveBackground': {
        '0%': { transform: 'translate(0, 0)' },
        '100%': { transform: 'translate(50px, 50px)' },
      },
    },
  },
  form: {
    width: '100%',
    maxWidth: { xs: '100%', sm: 440 },
    padding: { xs: '24px', sm: '32px' },
    backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.paper : '#ffffff',
    borderRadius: { xs: 3, sm: 4 },
    border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
    boxShadow: (theme) => theme.palette.mode === 'dark'
      ? '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
      : '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    zIndex: 1,
  },
  title: {
    marginBottom: 1,
    textAlign: 'center',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 700,
  },
  subtitle: {
    textAlign: 'center',
    color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
    marginBottom: 4,
    fontSize: '0.875rem',
  },
  alert: {
    marginBottom: 2,
    borderRadius: '12px',
    border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
  },
  field: {
    marginBottom: 2.5,
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
      '& fieldset': {
        borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
        borderWidth: '1.5px',
      },
      '&:hover fieldset': {
        borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.5)' : '#6366f1',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#6366f1',
        borderWidth: '2px',
      },
      '&.Mui-focused': {
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.02)',
      },
    },
    '& .MuiInputLabel-root': {
      color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
      '&.Mui-focused': {
        color: '#6366f1',
      },
    },
    '& .MuiOutlinedInput-input': {
      color: (theme) => theme.palette.mode === 'dark' ? '#f1f5f9' : '#1e293b',
    },
  },
  button: {
    marginTop: 3,
    marginBottom: 2,
    height: '48px',
    fontSize: '1rem',
    fontWeight: 600,
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: 'white !important',
    boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3), 0 2px 4px -1px rgba(99, 102, 241, 0.2)',
    '&:hover': {
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      transform: 'translateY(-1px)',
      boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.4), 0 4px 6px -2px rgba(99, 102, 241, 0.3)',
    },
    '&:disabled': {
      background: (theme) => theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.4)',
      color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.7)',
    },
    transition: 'all 0.2s ease',
  },
  oauthButton: {
    marginBottom: 1.5,
    textTransform: 'none',
    height: '48px',
    fontSize: '1rem',
    fontWeight: 600,
    borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : '#e2e8f0',
    borderWidth: '1.5px',
    color: (theme) => theme.palette.mode === 'dark' ? '#f1f5f9' : '#1e293b',
    backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    '& .MuiButton-startIcon': {
      margin: 0,
      marginRight: '12px',
    },
    '&:hover': {
      borderColor: '#6366f1',
      borderWidth: '1.5px',
      backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)',
      transform: 'translateY(-1px)',
      boxShadow: (theme) => theme.palette.mode === 'dark'
        ? '0 4px 6px -1px rgba(99, 102, 241, 0.2)'
        : '0 4px 6px -1px rgba(99, 102, 241, 0.15)',
    },
    transition: 'all 0.2s ease',
  },
  linkButton: {
    textTransform: 'none',
    color: '#6366f1',
    '&:hover': {
      backgroundColor: 'rgba(99, 102, 241, 0.08)',
    },
  },
  divider: {
    my: 2,
    '&::before, &::after': {
      borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)',
    },
    '& .MuiDivider-wrapper': {
      color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
      fontSize: '0.875rem',
      fontWeight: 500,
    },
  },
};
