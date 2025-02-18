import { CheckOutlined } from '@mui/icons-material';
import { Alert, Button, Snackbar } from '@mui/material';
import React, { useRef } from 'react'
import useMediaQueryData from '../../hooks/useMediaQueryData';

export type SnackbarCustomProps = {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
    handleClose: () => void;
    timeToClose?: number;
  }
  
  
  export default function SnackbarCustom({open, message, severity, timeToClose, handleClose}: SnackbarCustomProps) {
    const { mediaQuery } = useMediaQueryData();
    const startX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const touchX = e.touches[0].clientX;
    const distance = startX.current - touchX;

    // Apply threshold for swipe detection
    if (distance > 100) {
      handleClose();
      startX.current = null;
    }
  };

  const handleTouchEnd = () => {
    startX.current = null;
  };
    return (
      <Snackbar 
        open={open} 
        autoHideDuration={timeToClose} 
        onClose={handleClose}
        onDragEnd={handleClose}
        anchorOrigin={ mediaQuery ? { vertical: 'bottom', horizontal: 'left' } : { vertical: 'top', horizontal: 'center' }}
        sx={{ display: 'flex'}}
      >
        <Alert
            onClose={handleClose}
            severity={severity}
            variant="filled"
            sx={{ 
              width: "100%", 
              borderRadius: 10, 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              touchAction: "pan-x" 
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {message}
        </Alert>
      </Snackbar>
  )
}
