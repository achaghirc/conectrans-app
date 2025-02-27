'use client';

import React, { useEffect } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import ConectransLogo from '../shared/svg/conectransLogo';
import { usePathname } from 'next/navigation';
import useLogoColors from '../shared/hooks/useLogoColors';
import useCookieBannerHook from '../shared/hooks/useCookieBannerHook';
import { AdsClickOutlined, MailOutline, PhoneOutlined } from '@mui/icons-material';
import Link from 'next/link';

// Estilos para el contenedor del Footer
const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#0B2C38',
  color: 'white',
  padding: '40px 20px',
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
  },
}));

// Estilo para el contenedor de las secciones principales
const FooterSections = styled(Box)(({ theme }) => ({
  marginTop: '20px',
  display: 'flex',
  alignItems: 'start',
  flexDirection: 'column',
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
  },
}));

// Contenedor para la fila inferior con los botones de texto
const BottomRow = styled(Box)(({ theme }) => ({
  borderTop: '1px solid #ffffff44',
  paddingTop: '10px',
  marginTop: '20px',
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: '15px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

// Estilo para los botones en la fila inferior
const FooterButton = styled(Button)(({ theme }) => ({
  color: 'white',
  fontSize: '0.8rem',
  textTransform: 'none',
  padding: '5px 10px',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

export default function Footer() {
  const pathname = usePathname()
  const { removeSessionStorageKey } = useCookieBannerHook();
  const { color, setColor } = useLogoColors();

  useEffect(() => {
    if(pathname !== '/home' && pathname !== '/' ){ 
      setColor({...color, conduColor: '#01717A', starColor: 'white' });
    }
  }, [pathname]);

  return (
    <FooterContainer sx={{ zIndex: 1000}}>
      <Grid container spacing={2} justifyContent="space-between">
        {/* Logo en la esquina izquierda */}
        <Grid size={{xs:12, md:4}}>
          <Box>
            <ConectransLogo width={180} height={120} colors={color}/>
          </Box>
        </Grid>

        {/* Secciones del Footer */}
        <Grid container size={{xs:12, md:8}} spacing={2} justifyContent="space-between">
          {/* Sección Conectrans */}
          <Grid size={{xs:12, sm:4}}>
            <FooterSections>
              <Typography variant="h6" gutterBottom>CONDUPRO</Typography>
              <Button component={Link} href="/about" color="inherit">
              	<Typography variant="body2" component={'p'}>Para Candidatos</Typography>
              </Button>
              <Button component={Link} href="/contact" color="inherit">
								<Typography variant="body2" component={'p'}>Para Empresas</Typography>
							</Button>
              <Button component={Link} href="/blog" color="inherit">
							<Typography variant="body2" component={'p'}>Ver Ofertas</Typography>
							</Button>
            </FooterSections>
          </Grid>

          {/* Sección Contacto */}
          <Grid size={{xs:12, sm:4}}>
            <FooterSections sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 0.5}}>
              <Typography variant="h6" gutterBottom>¿Cómo podemos ayudarte?</Typography>
              <Box component={'div'} sx={{ display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center', gap: 1 }}>
                <MailOutline sx={{ color: 'white' }}/>
                <Typography variant="body2">info@condupro.es</Typography>
              </Box>
              <Box component={'div'} sx={{ display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center', gap: 1 }}>
                <PhoneOutlined sx={{ color: 'white' }}/>
                <Typography variant="body2">+34 123 456 789</Typography>
              </Box>
              <Link href={'/'} style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center', gap: 5, textDecoration: 'none', color: 'inherit' }}>                
                <AdsClickOutlined sx={{ color: 'white'}} />
                <Typography variant='body2'>Formulario de contacto</Typography>
              </Link>
              <Typography variant="body2" mt={1}>Lunes a Viernes de 9:00 a 18:00</Typography>
            </FooterSections>
          </Grid>

          {/* Sección Redes Sociales */}
          <Grid size={{xs:12, sm:4}}>
            <FooterSections>
              <Typography variant="h6" gutterBottom>Redes Sociales</Typography>
              <Typography variant="body2">Facebook</Typography>
              <Typography variant="body2">Twitter</Typography>
              <Typography variant="body2">LinkedIn</Typography>
            </FooterSections>
          </Grid>
        </Grid>
      </Grid>

      {/* Fila inferior con botones de texto */}
      <BottomRow>
        <Link href="/legal/legitimate" style={{ textDecoration: 'none', color: 'inherit' }}>  
          <FooterButton>Aviso Legal</FooterButton>
        </Link>
        <Link href="/legal/cookie-policy" style={{ textDecoration: 'none', color: 'inherit' }}>  
          <FooterButton>Política de Cookies</FooterButton>
        </Link>
        <Link href="/legal/use-conditions" style={{ textDecoration: 'none', color: 'inherit' }}>  
          <FooterButton>Condiciones de uso</FooterButton>
        </Link>
        <Link href="/legal/data-protection" style={{ textDecoration: 'none', color: 'inherit' }}>  
          <FooterButton>Protección de datos</FooterButton>
        </Link>
        <FooterButton
          onClick={() => {
            removeSessionStorageKey('cookieBannerAccepted');
          }}
        >Configuración de Cookies</FooterButton>
      </BottomRow>
    </FooterContainer>
  );
}