'use client';

import { Box, Button, CircularProgress, Typography } from "@mui/material";
import Link from "next/link";
import React, { useEffect } from "react";

enum ButtonContainerType {
  PASSANGERS = 'passangers',
  LIGHTVEHICLE = 'lightVehicle',
  WARE = 'ware',
   
}
const types: ButtonContainerType[] = [  
  ButtonContainerType.PASSANGERS,
  ButtonContainerType.LIGHTVEHICLE,
  ButtonContainerType.WARE,
];
const ButtonContainerComponent = () => {
  const [loading, setLoading] = React.useState({
    passangers: false,
    lightVehicle: false,
    ware: false
  });
  const [href, setHref] = React.useState({
    passangers: '/offers?page=1&limit=10&licenseType=D1%2CD%2CD1%2BE%2CD%2BE',
    lightVehicle: '/offers?page=1&limit=10&licenseType=B',
    ware: '/offers?page=1&limit=10&licenseType=C%2CC%2BE%2CC1%2CC1%2BE',
  });

  useEffect(() => {
    for (const type of types) {
      let licenses = '';
      switch (type) {
        case ButtonContainerType.PASSANGERS:
          licenses = 'D1,D,D1+E,D+E';
          break;
        case ButtonContainerType.LIGHTVEHICLE:
          licenses = 'B';
          break;
        case ButtonContainerType.WARE:
          licenses = 'C,C+E,C1,C1+E';
          break;
        default:
          break;
      }
      const url = new URLSearchParams();
      url.append('page', '1');
      url.append('limit', '10');
      url.append('licenseType', licenses);
      setHref(h => ({ ...h, [type]: `offers?${url.toString()}` }));
    }
  }, []);

  const handleRedirect = (licenseType: string, type: ButtonContainerType) => {
    switch (type) {
      case 'passangers':
        setLoading({ ...loading, passangers: true });
        break;
      case 'lightVehicle':
        setLoading({ ...loading, lightVehicle: true });
        break;
      case 'ware':
        setLoading({ ...loading, ware: true });
        break;
    }
    const url = new URLSearchParams();
    url.append('page', '1');
    url.append('limit', '10');
    url.append('licenseType', licenseType);
    setLoading({ ...loading, passangers: false, lightVehicle: false, ware: false });
    if (typeof window !== 'undefined') {
      window.location.href = `offers?${url.toString()}`;
      setLoading({ ...loading, passangers: false, lightVehicle: false, ware: false });
    }
  }
  

  return (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', width: '80%', mx: 'auto', mt: 5, }}>
      <Link href={href.ware} style={{ textDecoration: 'none' }}>
        <Button
          variant="contained" 
          color="primary" 
          size="medium"
          endIcon={loading.ware ? <CircularProgress size={20} color="info" /> : null} 
          sx={{ display: 'flex', flexDirection: 'row', minWidth: '100%', }}
          onClick={() => setLoading({ ...loading, ware: true })}
        >
          <Typography 
            variant="h6" component="p" 
            sx={{ display: 'block', fontSize: {xs: '1rem', sm: '1.25rem', lg: '1.5rem'} }}
            color='white'
          >
            Transporte de Mercancías
          </Typography>
        </Button>
      </Link>
      <Link href="/offers?page=1&limit=10&licenseType=D1%2CD%2CD1%2BE%2CD%2BE" style={{ textDecoration: 'none' }}>
        <Button 
          variant="outlined" 
          endIcon={loading.passangers ? <CircularProgress size={20} color="primary" /> : null}
          sx={{ display: 'flex', flexDirection: 'row', minWidth: '100%'  }}
          onClick={() => setLoading({ ...loading, passangers: true })}
          > 
          <Typography 
            variant="h6" component="p" 
            textAlign={'left'}
            sx={{ display: 'block', fontSize: {xs: '1rem', sm: '1.25rem', lg: '1.5rem'} }}
            color='white'
            >
            Transporte de viajeros
          </Typography>
        </Button>   
      </Link>
      <Link href="/offers?page=1&limit=10&licenseType=B" style={{ textDecoration: 'none' }}>
        <Button
          variant="outlined" 
          size="large"
          endIcon={loading.lightVehicle ? <CircularProgress size={20} color="info" /> : null}
          sx={{ display: 'flex', flexDirection: 'row', minWidth: '100%' }}
          onClick={() => setLoading({ ...loading, lightVehicle: true })}
          > 
          <Typography 
            variant="h6" 
            component="p" 
            sx={{ display: 'block', fontSize: {xs: '1rem', sm: '1.25rem', lg: '1.5rem'} }}
            color='white'
            >
            Transpte de vehiculo ligero
          </Typography>
        </Button>
      </Link>
    </Box>
  )
}

export default ButtonContainerComponent;