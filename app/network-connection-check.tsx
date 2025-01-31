'use client';
import React from 'react'
import useNetworkStatus from './ui/shared/hooks/useNetworkStatus';
import SnackbarCustom from './ui/shared/custom/components/snackbarCustom';

const NetworkConnectionCheck = () => {

  const {isOnline, message, severity, updateStatusBase} = useNetworkStatus();
  
  return (
    <>
      <SnackbarCustom 
        open={isOnline != undefined}
        handleClose={updateStatusBase}
        message={message}
        severity={severity}
      />
    </>
  )
}

export default NetworkConnectionCheck
