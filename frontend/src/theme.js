import { createTheme } from '@mui/material/styles';

// Color palette based on the README specifications
const colors = {
  primary: {
    main: '#6610F2', // Electric Indigo
    dark: '#311B92', // Deep Purple
    light: '#8540FA',
  },
  secondary: {
    main: '#00D4FF', // Aqua
    dark: '#00A3C9',
    light: '#4ECCA3', // Mint Green
  },
  accent: {
    main: '#FF6B6B', // Coral
    dark: '#E05252',
    light: '#FF8A8A',
  },
  background: {
    default: '#F8F9FA', // Soft Gray
    paper: '#FFFFFF',
    dark: '#151E3F', // Deep navy for dark mode
  },
  text: {
    primary: '#212529',
    secondary: '#6C757D',
    disabled: '#ADB5BD',
  },
  success: {
    main: '#4ECCA3', // Mint Green
  },
  error: {
    main: '#FF6B6B', // Coral
  },
};

// Create theme with the specified design system
const theme = createTheme({
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.error,
    success: colors.success,
    background: colors.background,
    text: colors.text,
  },
  typography: {
    fontFamily: '"Inter", "Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Clash Display", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Clash Display", sans-serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Clash Display", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Clash Display", sans-serif',
      fontWeight: 500,
    },
    h5: {
      fontFamily: '"Clash Display", sans-serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Clash Display", sans-serif',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
    code: {
      fontFamily: '"JetBrains Mono", monospace',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.light} 100%)`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.9)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.9)',
        },
      },
    },
  },
});

export default theme;