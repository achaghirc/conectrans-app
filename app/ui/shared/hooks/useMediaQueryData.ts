import React from 'react'

const useMediaQueryData = () => {
  const [mediaQuery, setMediaQuery] = React.useState<boolean>(false);
    React.useEffect(() => {
      const mediaQuery = window.matchMedia('(min-width: 600px)');
      setMediaQuery(mediaQuery.matches);
      mediaQuery.addEventListener('change', (e) => {
        setMediaQuery(e.matches);
      });
      return () => {
        mediaQuery.removeEventListener('change', (e) => {
          setMediaQuery(e.matches);
        });
      }
    },[]);
  return {mediaQuery}
}

export default useMediaQueryData
