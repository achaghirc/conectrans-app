import { auth } from '@/auth';
import React from 'react'
import Navbar from '../ui/shared/navbar';
import SectionCards from '../ui/home/section';
import Footer from '../ui/home/footer';
import { Box, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

export default async function page() {
  const session = await auth();
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      maxWidth: '100%',
      overflowX: 'hidden',
      backgroundColor: '#0B2C38',
      scrollbarWidth: 'none',
    }}>
      <div
        style={{
          maxWidth: '100%',
        }}
      >
        <Box component={'div'} sx={{
          position: 'fixed',
          top: {xs: '-10%', md: '-15%'},
          right: {xs: '-55%', md: '-20%'},
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          
        }}></Box>
      </div>
      <Box component={'div'}>
        <Navbar session={session} />
      </Box>
      <Grid container spacing={0} 
        sx={{ 
          zIndex: 1, 
          direction: {xs: 'column', sm: 'row'}, 
        }}
      >
        <Grid size={{xs: 12, sm: 7, md: 6, lg: 7}} sx={{ display: 'flex', justifyContent: 'center', }}>
          <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column', alignItems: {xs: 'center', sm: 'start'}, width: '100%', }}>
            <Typography variant='h1' 
              sx={{
                color: 'white', 
                textAlign: {xs: 'center', md: 'start'}, 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                width: '100%',
                mt: 5,
                ml: {xs: 0, md: 5},
              }}
            >
              ¡Bienvenido a Condupro!
            </Typography>
            <Typography 
              variant="h6" 
              component="p" 
              fontWeight={'500'} 
              sx={{ 
                width: {xs: '90%', md: '100%'},
                textAlign: 'left', 
                textEmphasis: 'bold', 
                whiteSpace: 'pre-line',
                color: 'white',
                ml: {xs: 0, md: 5},
                mt: {xs: 2, md: 0},
              }}
            >
              Condupro es la plataforma ideal para encontrar y publicar todo tipo 
              de ofertas del sector de movilidad profesional.
            </Typography>
          </Box>
        </Grid>
        <Grid size={{xs: 12, sm: 5, md: 6, lg: 5}}> 
          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', width: '80%', mx: 'auto', mt: 5, }}>
            <Button
              variant="contained" 
              color="primary" 
              size="medium" 
              sx={{ display: 'block', minWidth: '100%', }}
              // onClick={() => handleRedirect('C,C+E')}
            >
              <Typography 
                variant="h6" component="p" 
                sx={{ display: 'block', fontSize: {xs: '1rem', sm: '1.25rem', lg: '1.5rem'} }}
                color='white'
              >
                Transporte de Mercancías
              </Typography>
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ display: 'block', color: '#5B8082'  }}
              // onClick={() => handleRedirect('D1,D')}
            > 
              <Typography 
                variant="h6" component="p" 
                sx={{ display: 'block', fontSize: {xs: '1rem', sm: '1.25rem', lg: '1.5rem'} }}
                color='white'
              >
                Transporte de viajeros
              </Typography>
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ display: 'block'}}
            > 
              <Typography 
                variant="h6" 
                component="p" 
                sx={{ display: 'block', fontSize: {xs: '1rem', sm: '1.25rem', lg: '1.5rem'} }}
                color='white'
                // onClick={() => handleRedirect('B')}
              >
                Transpte de vehiculo ligero
              </Typography>
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Box component={'div'} sx={{ mt: 5, p: {xs: 1 , sm: 2}, zIndex: 1, }}>
        <Typography variant='h4' textAlign={'center'} color={'white'} fontWeight={'bold'}>
          ¿Cual es tu perfil?
        </Typography>
        <SectionCards />
      </Box>
      <Footer />
    </main>
  );
}
