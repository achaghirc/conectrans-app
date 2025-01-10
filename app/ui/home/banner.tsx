'use client';
import React from 'react'
import Logo from '../../../public/Banner_3.png'
import BigLogo from '../../../public/Banner_5.png'
import Image from 'next/image'
import { Button, Paper, Typography } from "@mui/material";
import { ButtonContainer, TextContainer } from '../shared/custom/bannerContainer';
import useMediaQueryData from '../shared/hooks/useMediaQueryData';

export default function Banner() {
  const {mediaQuery} = useMediaQueryData();
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
              OFERTAVIAL
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
              CONECTAMOS OFERTAS, CONDUCTORES Y TRANSPORTE
            </Typography>
            <Typography variant="h4" 
              component={"h5"} 
              gutterBottom 
              sx={{ display: { xs: 'block', sm: 'none'}, textAlign: 'left', fontSize: '1.5rem'}}
            >
              CONECTAMOS OFERTAS, CONDUCTORES Y TRANSPORTE
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
              OfertaVial es la plataforma ideal para encontrar y publicar todo tipo 
              de ofertas del sector de la mobilidad profesional.
            </Typography>
          </TextContainer>
          <ButtonContainer sx={{ display: 'flex', gap: 2, flexDirection: 'column', position: 'absolute', top: '60%', right: '30%', transform: 'translate(-40%, -0%)'}}>
            <Button 
              variant="contained" 
              color="primary" 
              size="medium" 
              sx={{ display: {xs: 'block', sm: 'block'} }}
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
              >
                Transporte de vehiculo ligero
              </Typography>
            </Button>
          </ButtonContainer>
      </Paper>
    </div>
  )
}
