'use client'
import { Box, Button, Card, CardContent, SwipeableDrawer, SxProps, Typography } from '@mui/material'
import { set } from 'nprogress'
import React from 'react'
import useCookieBannerHook from '../shared/hooks/useCookieBannerHook'
import { CookieOutlined } from '@mui/icons-material'

const cookieBannerStyle: SxProps = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  pt: '1.5rem',
  pr: '1.5rem',
  pl: '1.5rem',
  backgroundColor: '#0B2C38',
  color: 'white',
  textAlign: 'start',
  zIndex: 9999,
  //Backgorund not clickable
  pointerEvents: 'none',
  borderRadius: 5,
  m: 2, 
  gap: 0.5,
  display: 'flex',
  flexDirection: 'column',
}

const CoockieBanner = () => {
  const { open, setOpen } = useCookieBannerHook()
  
  const handleAccept = (response: boolean) => {
    sessionStorage.setItem('cookieBannerAccepted', Boolean(response).toString())
    setOpen(false);
  }

  return (
    <div style={{
      maxWidth: '100%',
    }}>

    <SwipeableDrawer 
      anchor="top" 
      open={open} onClose={() => setOpen(false)} 
      onOpen={() => setOpen(true)} 
      >
        <Box component="div" sx={cookieBannerStyle}>
          <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: 1 }}>
            <CookieOutlined /> 
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Utilizamos Cookies</Typography>
          </Box>
          <Typography variant="body1">Este sitio web utiliza cookies y otras tecnologías de seguimiento para mejorar su experiencia de navegación con los siguientes fines: para habilitar la funcionalidad básica del sitio web, para brindar una mejor experiencia en el sitio web, medir su interés en nuestros productos y servicios y personalizar las interacciones de marketing, para mostrar anuncios que sean más relevantes para usted.</Typography>
          <Typography variant="body1">Puede aceptar todas las cookies haciendo clic en el botón &quot;Aceptar&quot; o rechazar su uso haciendo clic en `&quot;`Rechazar`&quot;`. Para obtener más información sobre las cookies que utilizamos, consulte nuestra Política de Cookies.</Typography>
          <Box component="div" sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', padding: '1rem', pointerEvents: 'auto' }}>
            <Button variant='contained' onClick={() => handleAccept(true)}>Aceptar</Button>
            <Button variant='outlined' color='error' onClick={() => handleAccept(false)}>Rechazar</Button>
          </Box>
        </Box>
    </SwipeableDrawer>
    </div>
  )
}

export default CoockieBanner
