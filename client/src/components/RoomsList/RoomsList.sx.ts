import { SxProps, Theme } from '@mui/material';

export const styles: Record<string, SxProps<Theme>> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: { xs: '100dvh', sm: '100vh' },
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'background.default',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    padding: { xs: '12px 16px', sm: '14px 20px' },
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    zIndex: 2,
    flexShrink: 0,
    minHeight: { xs: '56px', sm: '64px' },
    gap: { xs: 1, sm: 1.5 },
    width: '100%',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 700,
    fontSize: { xs: '1.25rem', sm: '1.5rem' },
    letterSpacing: '-0.01em',
    flex: 1,
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: { xs: '20px 16px', sm: '24px' },
    WebkitOverflowScrolling: 'touch',
    backgroundColor: 'background.default',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: { xs: 3, sm: 4 },
  },
  logoutButton: {
    color: 'white',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    '&:hover': {
      borderColor: 'white',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    fontSize: { xs: '0.875rem', sm: '1rem' },
  },
  formCard: {
    marginBottom: { xs: 3, sm: 4 },
    padding: { xs: '20px', sm: '24px' },
    borderRadius: { xs: 2, sm: 3 },
    backgroundColor: 'background.paper',
    boxShadow: (theme) =>
      theme.palette.mode === 'dark'
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid',
    borderColor: 'divider',
  },
  formRow: {
    display: 'flex',
    gap: 2,
    flexDirection: { xs: 'column', sm: 'row' },
  },
  input: {
    flex: 1,
  },
  createButton: {
    minWidth: { xs: '100%', sm: '180px' },
    height: '56px',
    color: 'white !important',
    '& .MuiSvgIcon-root': {
      color: 'white !important',
    },
    '& .MuiButton-label': {
      color: 'white',
    },
  },
  alert: {
    marginTop: 2,
    borderRadius: 2,
  },
  roomsGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(3, 1fr)',
      lg: 'repeat(4, 1fr)',
    },
    gap: { xs: 2, sm: 3 },
  },
  roomCard: {
    padding: { xs: '20px', sm: '24px' },
    borderRadius: { xs: 2, sm: 3 },
    backgroundColor: 'background.paper',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid',
    borderColor: 'divider',
    minHeight: { xs: '140px', sm: 'auto' },
    boxShadow: (theme) =>
      theme.palette.mode === 'dark'
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '&:hover': {
      transform: { xs: 'none', sm: 'translateY(-2px)' },
      boxShadow: (theme) =>
        theme.palette.mode === 'dark'
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)'
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      borderColor: 'primary.main',
    },
    '&:active': {
      transform: { xs: 'scale(0.98)', sm: 'translateY(-1px)' },
    },
  },
  roomIcon: {
    width: { xs: 48, sm: 56 },
    height: { xs: 48, sm: 56 },
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: { xs: 1.5, sm: 2 },
    color: 'white',
    fontSize: { xs: '1.25rem', sm: '1.5rem' },
    fontWeight: 600,
  },
  roomName: {
    fontWeight: 600,
    marginBottom: 1,
    color: 'text.primary',
    fontSize: { xs: '1rem', sm: '1.125rem' },
  },
  roomMeta: {
    color: 'text.secondary',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    flexWrap: 'wrap',
  },
  empty: {
    padding: { xs: 4, sm: 6 },
    textAlign: 'center',
    color: 'text.primary',
    backgroundColor: 'background.paper',
    borderRadius: 3,
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: (theme) =>
      theme.palette.mode === 'dark'
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  emptyIcon: {
    fontSize: { xs: '3rem', sm: '4rem' },
    marginBottom: 2,
    opacity: 0.6,
    color: 'text.secondary',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: 4,
    color: 'text.primary',
  },
  spacer: {
    flex: 1,
  },
};

