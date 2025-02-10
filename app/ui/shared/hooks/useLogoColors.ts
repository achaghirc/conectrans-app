'use client';
import { usePathname } from 'next/navigation';
import React from 'react'

const useLogoColors = () => {
  const pathname = usePathname();
  const [color, setColor] = React.useState({
    logoColor: 'white',
    proColor: '#C701C7',
    conduColor: '#04A0AC',
    starColor: '#0B2C38',
    iconColor: 'action'
  });
  const handleColorsLogo = () => {
    if (pathname === '/' || pathname === '/home') {
      setColor({...color, logoColor: '#0B2C38', starColor: 'white', proColor: '#C701C7', conduColor: '#04A0AC', iconColor: 'white'});
    }
  }

  React.useEffect(() => {
    handleColorsLogo();
  }, [pathname]);

  return { color, setColor };
}

export default useLogoColors
