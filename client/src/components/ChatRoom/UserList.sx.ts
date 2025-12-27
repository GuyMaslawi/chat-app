import { SxProps, Theme } from '@mui/material';

export const styles: Record<string, SxProps<Theme>> = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'background.paper',
    overflow: 'hidden',
  },
  header: {
    padding: { xs: '16px', sm: '20px' },
    borderBottom: '1px solid',
    borderColor: 'divider',
    backgroundColor: 'background.default',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 700,
    fontSize: { xs: '0.9375rem', sm: '1.0625rem' },
    letterSpacing: '-0.01em',
    color: 'text.primary',
  },
  list: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: { xs: '12px', sm: '16px' },
    WebkitOverflowScrolling: 'touch',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: (theme) =>
        theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
      borderRadius: '3px',
      '&:hover': {
        background: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
      },
    },
  },
  listItem: {
    marginBottom: { xs: '6px', sm: '8px' },
    borderRadius: { xs: '10px', sm: '12px' },
    overflow: 'hidden',
    '&:last-child': {
      marginBottom: 0,
    },
  },
  listItemButton: {
    borderRadius: { xs: '10px', sm: '12px' },
    padding: { xs: '12px', sm: '14px 16px' },
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'action.hover',
      transform: 'translateX(2px)',
    },
    '&:active': {
      transform: 'translateX(1px)',
    },
    '&:disabled': {
      opacity: 0.7,
      cursor: 'default',
    },
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: { xs: 1.25, sm: 1.5 },
    width: '100%',
  },
  avatarContainer: {
    position: 'relative',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: { xs: 40, sm: 44 },
    height: { xs: 40, sm: 44 },
    fontSize: { xs: '0.9375rem', sm: '1.0625rem' },
    fontWeight: 600,
    border: '2px solid',
    borderColor: 'divider',
    transition: 'all 0.2s ease',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: { xs: '-2px', sm: '-1px' },
    right: { xs: '-2px', sm: '-1px' },
    fontSize: { xs: '12px', sm: '14px' },
    backgroundColor: 'background.paper',
    borderRadius: '50%',
    padding: '2px',
    border: '2px solid',
    borderColor: 'background.paper',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  userDetails: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: { xs: '3px', sm: '4px' },
    justifyContent: 'center',
  },
  username: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: { xs: '0.9375rem', sm: '1rem' },
    lineHeight: 1.3,
  },
  status: {
    fontSize: { xs: '0.75rem', sm: '0.8125rem' },
    color: 'text.secondary',
    lineHeight: 1.2,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
};

