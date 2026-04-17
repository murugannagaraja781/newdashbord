import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#020617', // Slate 950 - Ultra Deep
      light: '#1E293B', // Slate 800
      dark: '#000000',
      contrastText: '#fff',
    },
    secondary: {
      main: '#4F46E5', // Indigo 600 - High End Accents
      light: '#818CF8',
      dark: '#3730A3',
      contrastText: '#fff',
    },
    success: {
      main: '#10B981', // Emerald 500
      light: '#D1FAE5',
      dark: '#065F46',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
    divider: 'rgba(226, 232, 240, 0.6)',
  },
  typography: {
    fontFamily: '"Inter", "Outfit", "system-ui", -apple-system, sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2 },
    h2: { fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.3 },
    h3: { fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontSize: '1.15rem', fontWeight: 700 },
    subtitle1: { fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.5 },
    subtitle2: { fontSize: '0.9rem', fontWeight: 600, color: '#64748B' },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.6 },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: '0.01em' },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { width: '6px', height: '6px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { 
            background: '#E2E8F0', 
            borderRadius: '10px',
            '&:hover': { background: '#CBD5E1' }
          },
          selection: { background: '#4F46E5', color: '#fff' }
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 20px',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1E293B 0%, #020617 100%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
        },
        elevation1: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(226, 232, 240, 0.4)',
        },
        head: {
          backgroundColor: '#F8FAFC',
          color: '#64748B',
          fontWeight: 700,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
        },
      },
    },
  },
});

export default theme;
