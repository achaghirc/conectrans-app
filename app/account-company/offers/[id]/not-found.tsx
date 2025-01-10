'use client';
import { Box, Button, Typography } from '@mui/material'
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import ComputerError from '@/public/computer-error.png'
import React from 'react'

const NotFound = () => {
  const router = useRouter()
  return (
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        height: '100vh',
        backgroundColor: '#F5F5F5'
    }}>
        <Typography variant="h4" component={"h1"}>
            No se ha encontrado la página solicitada
        </Typography>
        <Image src={ComputerError} alt="Error" width={200} height={200} />
        <Button
            variant='outlined' 
            onClick={router.back} 
            sx={{ backgroundColor: '#0B2C38', borderColor: '#0B2C38', color: 'white'}}
        >
            Volver
        </Button>
    </Box>
  )
}

export default NotFound
