'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; // Importar los estilos de la barra de progreso
import '../globals.css'; // Tus estilos globales

import { AppProps } from 'next/app';
import Loader from './ui/shared/custom/components/Loader';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // 
  useEffect(() => {
    // Configurar NProgress
    NProgress.configure({ showSpinner: false });

    const handleStart = (url: string) => {
      console.log(`Iniciando navegación a ${url}`);
      setLoading(true);
      NProgress.start();
    };

    const handleStop = () => {
      setLoading(false);
      NProgress.done();
    };

    // Escuchar los eventos del router
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    // Cleanup: Desactivar los listeners al desmontar
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  return (
    <>
      {loading && <Loader /> }
      <Component {...pageProps} />;
    </>
  )
};

export default MyApp;