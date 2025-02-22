import React, { useEffect } from 'react'

const useCookieBannerHook = () => {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    // Check sessionStorage for cookie banner status when component mounts
    const cookieAccepted = sessionStorage.getItem('cookieBannerAccepted');
    if (cookieAccepted === null || cookieAccepted === undefined) {
      setOpen(true); // Show banner if the value is not set
    }
  }, []);

  const removeSessionStorageKey = (key: string) => {
    sessionStorage.removeItem(key);;
    setOpen(true);
  }

  return {open, setOpen, removeSessionStorageKey}
}

export default useCookieBannerHook
