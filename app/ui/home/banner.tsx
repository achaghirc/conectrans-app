'use client';
import React from 'react'
import BigLogo from '../../../public/Banner_5.png'
import Image from 'next/image'
import { Button, Paper, Typography } from "@mui/material";
import { ButtonContainer, TextContainer } from '../shared/custom/bannerContainer';
import useMediaQueryData from '../shared/hooks/useMediaQueryData';
import { useRouter } from 'next/navigation';

export default function Banner() {
  const {mediaQuery} = useMediaQueryData();
  const router = useRouter();

  const handleRedirect = (licenseType: string) => {
    const url = new URLSearchParams();
    url.append('page', '1');
    url.append('limit', '10');
    url.append('licenseType', licenseType);

    router.push(`offers?${url.toString()}`);
  }

  return (
    <div>
      <Paper 
        square={false}
        elevation={2}
        sx={{ 
          width: '100%',
          height: '600px',
          borderRadius: "20px", margin: "20px 0px", position: 'relative', overflow: 'hidden' }}
      >
        <Image 
          src={BigLogo} 
          objectFit="fill" 
          alt="Banner Home Conectrans" 
          quality={100}
          layout="fill"
          priority
          />
          <TextContainer
            sx={{
              position: 'relative',
              top: '15%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}
          
          >
            <Typography variant="h1"
              component={"h1"}
              gutterBottom
              sx={{ display: { xs: 'none', sm: 'block'},
              position: 'relative', top: '0%', left: '0%',
              fontWeight: 'bold', textAlign: 'left'}}
            >
              CONDUPRO
            </Typography>
          </TextContainer>
          <TextContainer>
            <Typography variant="h5" 
              component={"h1"} 
              gutterBottom 
              sx={{ display: { xs: 'none', sm: 'block'},
              position: 'relative', top: '0%', left: '0%',
              fontWeight: 'bold', textAlign: 'left'}}
            >
              ACERCAMOS OFERTAS Y CONDUCTORES PROFESIONALES
            </Typography>
            <Typography variant="h4" 
              component={"h5"} 
              gutterBottom 
              sx={{ display: { xs: 'block', sm: 'none'}, textAlign: 'left', fontSize: '1.5rem'}}
            >
              ACERCAMOS OFERTAS Y CONDUCTORES PROFESIONALES
            </Typography>

            <Typography 
                variant="h6" 
                component="p" 
                fontWeight={'500'} 
                sx={{ 
                  width: '80%',
                  textAlign: 'left', 
                  textEmphasis: 'bold', 
                  whiteSpace: 'pre-line' 
                }}
              >
              Condupro es la plataforma ideal para encontrar y publicar todo tipo 
              de ofertas del sector de la mobilidad profesional.
            </Typography>
          </TextContainer>
          <ButtonContainer sx={{ display: 'flex', gap: 2, flexDirection: 'column', position: 'absolute', top: '60%', right: '30%', transform: 'translate(-40%, -0%)'}}>
            <Button 
              variant="contained" 
              color="primary" 
              size="medium" 
              sx={{ display: {xs: 'block', sm: 'block'} }}
              onClick={() => handleRedirect('C,C+E')}
            >
              <Typography 
                variant="h6" component="p" 
                sx={{ display: {xs: 'none', sm: 'block'} }}
                color='white'
              >
                Transporte de Mercancías
              </Typography>
            </Button>
            <Button 
              variant="outlined" 
              color="secondary"
              size="large"
              sx={{ display: {xs: 'none', sm: 'block'}, }}
              onClick={() => handleRedirect('D1,D')}
            > 
              <Typography 
                variant="h6" component="p" 
                sx={{ display: {xs: 'none', sm: 'block'} }}
                color='white'
              >
                Transporte de viajeros
              </Typography>
            </Button>
            <Button 
              variant="outlined" 
              color="info" 
              size="large"
              sx={{ display: {xs: 'none', sm: 'block'} }}
            > 
              <Typography 
                variant="h6" component="p" 
                sx={{ display: {xs: 'none', sm: 'block'} }}
                color='white'
                onClick={() => handleRedirect('B')}
              >
                Transporte de vehiculo ligero
              </Typography>
            </Button>
          </ButtonContainer>
      </Paper>
    </div>
  )
}
