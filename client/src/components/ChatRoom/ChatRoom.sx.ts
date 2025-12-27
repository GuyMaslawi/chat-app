import { SxProps, Theme } from '@mui/material';

export const styles: Record<string, SxProps<Theme>> = {
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: { xs: '100dvh', sm: '100vh' },
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'background.default',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
  sidebar: {
    display: { xs: 'none', md: 'flex' },
    width: { md: '280px', lg: '320px' },
    flexShrink: 0,
    borderRight: '1px solid',
    borderColor: 'divider',
    height: '100%',
    overflow: 'hidden',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
    height: '100%',
    backgroundColor: 'background.default',
    overflow: 'hidden',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: { xs: '14px 16px', sm: '18px 24px' },
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    zIndex: 1,
    flexShrink: 0,
    minHeight: { xs: '60px', sm: '68px' },
    gap: { xs: 1, sm: 1.5 },
  },
  headerButton: {
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  headerTitle: {
    color: 'white',
    fontWeight: 700,
    marginLeft: { xs: 0.5, sm: 1 },
    fontSize: { xs: '1.0625rem', sm: '1.25rem' },
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
    minWidth: 0,
    letterSpacing: '-0.01em',
    lineHeight: 1.2,
  },
  spacer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#0f172a' : '#f1f5f9'),
    backgroundImage: (theme) =>
      theme.palette.mode === 'dark'
        ? 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)'
        : 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.03) 0%, transparent 50%)',
    minHeight: 0,
  },
  messagesList: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: { xs: '16px 12px', sm: '24px 20px' },
    WebkitOverflowScrolling: 'touch', 
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#cbd5e1',
      borderRadius: '4px',
      '&:hover': {
        background: '#94a3b8',
      },
    },
  },
  messageItem: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: { xs: 1.5, sm: 2 },
    animation: 'fadeIn 0.3s ease-in',
    '@keyframes fadeIn': {
      from: {
        opacity: 0,
        transform: 'translateY(10px)',
      },
      to: {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
  },
  messageBubble: {
    display: 'inline-flex',
    flexDirection: 'column',
    maxWidth: { xs: '85%', sm: '70%' },
    padding: { xs: '10px 14px', sm: '12px 16px' },
    borderRadius: '18px',
    wordBreak: 'break-word',
    position: 'relative',
    boxShadow: (theme) =>
      theme.palette.mode === 'dark'
        ? '0 2px 8px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.3)'
        : '0 2px 6px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
  },
  messageContent: {
    fontSize: '0.95rem',
    lineHeight: 1.5,
    fontWeight: 400,
  },
  messageTime: {
    fontSize: '0.75rem',
    color: '#64748b',
    marginTop: '4px',
    alignSelf: 'flex-end',
  },
  alert: {
    margin: 2,
    borderRadius: 2,
  },
  inputContainer: {
    padding: { xs: '16px', sm: '20px 24px' },
    paddingBottom: { xs: 'max(16px, env(safe-area-inset-bottom))', sm: '20px' },
    backgroundColor: 'background.paper',
    borderTop: '1px solid',
    borderColor: 'divider',
    boxShadow: (theme) =>
      theme.palette.mode === 'dark'
        ? '0 -4px 6px -1px rgba(0, 0, 0, 0.3)'
        : '0 -4px 6px -1px rgba(0, 0, 0, 0.05)',
    flexShrink: 0,
    width: '100%',
  },
  inputForm: {
    display: 'flex',
    gap: { xs: 2, sm: 2.5 },
    alignItems: 'center',
    width: '100%',
  },
  sendButton: {
    minWidth: { xs: '80px', sm: '100px' },
    height: { xs: '48px', sm: '56px' },
    fontSize: { xs: '0.875rem', sm: '1rem' },
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: 'white !important',
    '& .MuiSvgIcon-root': {
      color: 'white !important',
    },
    '& .MuiButton-label': {
      color: 'white',
    },
    '&:hover': {
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      transform: 'translateY(-1px)',
      boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
    },
    '&:disabled': {
      background: (theme) => theme.palette.mode === 'dark' 
        ? 'rgba(99, 102, 241, 0.3)' 
        : 'rgba(99, 102, 241, 0.4)',
      color: (theme) => theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.5) !important' 
        : 'rgba(255, 255, 255, 0.7) !important',
      cursor: 'not-allowed',
      '& .MuiSvgIcon-root': {
        color: (theme) => theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.5) !important' 
          : 'rgba(255, 255, 255, 0.7) !important',
      },
      '&:hover': {
        background: (theme) => theme.palette.mode === 'dark' 
          ? 'rgba(99, 102, 241, 0.3)' 
          : 'rgba(99, 102, 241, 0.4)',
        transform: 'none',
        boxShadow: 'none',
      },
    },
    transition: 'all 0.2s ease',
    flexShrink: 0,
  },
};

