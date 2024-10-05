'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    cssVariables: true,
    typography: {
        fontFamily: "Lato, sans-serif",
    },
    palette: {
        primary: {
        main: '#1976d2',
        },
        secondary: {
        main: '#dc004e',
        },
    },
});

export default theme;