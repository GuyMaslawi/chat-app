import { SxProps, Theme } from '@mui/material';

export const styles: Record<string, SxProps<Theme>> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: 2,
  },
  stack: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  text: {
    color: 'text.secondary',
  },
};

