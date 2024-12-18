import { Alert, Button, Snackbar } from '@mui/material';
import React from 'react'

export type SnackbarCustomProps = {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
    handleClose: () => void;
  }
  
  
  export default function SnackbarCustom({open, message, severity, handleClose}: SnackbarCustomProps) {

    return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
    <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
    >
        {message}
    </Alert>
    </Snackbar>
  )
}
