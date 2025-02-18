'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    cssVariables: true,
    typography: {
        fontFamily: "Lato, sans-serif",
    },
    palette: {
        primary: {
          main: '#04A0AC',
        },
        secondary: {
          main: '#dc004e',
        },
        error: {
          main: '#FF0000',
        },
        warning: {
          main: '#FFA500',
        },
    },
});

export default theme;