'use client';
import React from 'react'
import Logo from '../../../public/Banner_2.jpg'
import Image from 'next/image'
import { Box, Button, Paper, Typography } from "@mui/material";
import { styled } from '@mui/material/styles'
import { ButtonContainer, TextContainer } from '../shared/custom/bannerContainer';

export default function Banner() {
  return (
    <div>
      <Paper 
        square={false}
        elevation={2}
        sx={{ 
          width: '100%',
          height: '500px',
          borderRadius: "20px", margin: "20px 0px", position: 'relative', overflow: 'hidden' }}
      >
        <Image 
          src={Logo} 
          fill={true}
          layout="fill" 
          objectFit="cover" 
          alt="Banner Home Conectrans" 
          quality={100}
          priority
          />
          <TextContainer>
            <Typography variant="h3" 
              component={"h1"} 
              gutterBottom 
              sx={{ display: { xs: 'none', sm: 'block'}}}
            >
              CONECTRAMOS OFERTAS <br /> CONECTAMOS TRANSPORTE
            </Typography>
            <Typography variant="h4" 
              component={"h5"} 
              gutterBottom 
              sx={{ display: { xs: 'block', sm: 'none'}, textAlign: 'left', fontSize: '1.5rem'}}
            >
              CONECTRAMOS OFERTAS <br /> CONECTAMOS TRANSPORTE
            </Typography>

            <Typography variant="h6" component="p">
              Conectrans es la plataforma ideal para encontrar y publicar todo tipo 
              de ofertas del sector del transporte.
            </Typography>
          </TextContainer>
          <ButtonContainer>
            <Button 
              variant="contained" 
              color="primary" 
              size="medium" 
              sx={{ display: {xs: 'block', sm: 'none'} }}
            >
              <Typography variant="body2" component="p" sx={{ display: {xs: 'block', sm: 'none'} }}>
                Ofertas para empresas
              </Typography>
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              sx={{ display: {xs: 'none', sm: 'block'} }}
            > 
              <Typography 
                variant="h6" component="p" 
                sx={{ display: {xs: 'none', sm: 'block'} }}
                color='white'
              >
                Ofertas para conductores
              </Typography>
            </Button>
          </ButtonContainer>
      </Paper>
    </div>
  )
}
