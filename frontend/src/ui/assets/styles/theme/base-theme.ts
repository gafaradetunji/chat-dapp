
import { createTheme } from '@mui/material/styles';

export const baseTheme = createTheme({
  colorSchemes: {
    dark: true,
  },
    palette: {
      primary: {
        main: '#667eea',
      },
      secondary: {
        main: '#f093fb',
      },
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
    },
  });
