'use client';
import { useEffect, useState } from 'react'

const useNetworkStatus = () => {
  const [isOnline, setOnline] = useState<boolean | undefined>(undefined);
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<'error'|'success'>('success')
  
  const updateNetwork = () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine){ 
      setMessage('Ooops! Parece que has perdido tu conexión a internet, por favor comprueba tu red wifi o de datos.');
      setSeverity('error');
      setOnline(navigator.onLine);
    }
  }
  const updateNetworkStatus = (status: string) => {
    if (typeof navigator !== 'undefined'){ 
      if(status == 'online') {
        setMessage('Parece que has recuperado tu conexión a internet.');
        setSeverity('success');
        setOnline(navigator.onLine);
      } else if (status == 'offline') {
        setMessage('Ooops! Parece que has perdido tu conexión a internet, por favor comprueba tu red wifi o de datos.');
        setSeverity('error')
        setOnline(navigator.onLine);
      } else {
        setOnline(undefined)
      }
    }
  }

  const updateStatusBase = () => {
    setOnline(undefined);
    setMessage('');
  }

  useEffect(() => {
    updateNetwork();
  }, []);

  useEffect(() => {
    window.addEventListener("load", updateNetwork);
    window.addEventListener("online", () => updateNetworkStatus('online'));
    window.addEventListener("offline", () => updateNetworkStatus('offline'));


    return () => {
      window.removeEventListener("load", updateNetwork);
      window.removeEventListener("online", () => updateNetworkStatus('online'));
      window.removeEventListener("offline", () => updateNetworkStatus('offline'));
    }
  }, [])

  return {isOnline, message, severity, updateStatusBase}

}

export default useNetworkStatus
