'use client';

import React, { useEffect } from 'react';
import { Box, Typography, Button, Link } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import ConectransLogo from '../shared/logo/conectransLogo';
import { usePathname } from 'next/navigation';
import useLogoColors from '../shared/hooks/useLogoColors';

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
            <FooterSections>
              <Typography variant="h6" gutterBottom>Contacto</Typography>
              <Typography variant="body2">Email: info@condupro.es</Typography>
              <Typography variant="body2">Teléfono: +34 123 456 789</Typography>
              <Typography variant="body2">Dirección: Calle Transporte 123, Madrid</Typography>
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
        <FooterButton>Aviso Legal</FooterButton>
        <FooterButton>Política de Cookies</FooterButton>
        <FooterButton>Condiciones de uso</FooterButton>
        <FooterButton>Protección de datos</FooterButton>
        <FooterButton>Configuración de Cookies</FooterButton>
      </BottomRow>
    </FooterContainer>
  );
}