import { createTheme } from '@mui/material/styles';

// Design tokens
// Ink navy: sidebar / headers / primary actions
// Paper: cool light background, not the generic warm-cream default
// Copper: accent used sparingly for tags and "in progress" states
// Status colors map to the asset lifecycle: available / assigned / repair / retired
export const tokens = {
  ink: '#1B2A4A',
  inkLight: '#2B3E63',
  paper: '#F4F6F8',
  surface: '#FFFFFF',
  slate: '#5B6472',
  slateLight: '#8A93A1',
  copper: '#C1793F',
  copperDark: '#9C5E2E',
  green: '#2E7D5B',
  greenBg: '#E6F2EC',
  blue: '#3B5BA9',
  blueBg: '#E9EDF7',
  amber: '#B5792E',
  amberBg: '#F7ECDD',
  rust: '#A6432D',
  rustBg: '#F5E6E2',
  border: '#E1E4E9',
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: tokens.ink, light: tokens.inkLight },
    secondary: { main: tokens.copper, dark: tokens.copperDark },
    background: { default: tokens.paper, paper: tokens.surface },
    text: { primary: '#1C2230', secondary: tokens.slate },
    divider: tokens.border,
    success: { main: tokens.green },
    error: { main: tokens.rust },
    warning: { main: tokens.copper },
    info: { main: tokens.blue },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.01em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, boxShadow: 'none' },
        contained: { boxShadow: 'none' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: '0.75rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: tokens.slate,
        },
      },
    },
  },
});
