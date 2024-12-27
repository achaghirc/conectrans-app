'use client';
import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import { Session } from 'next-auth'
import NavLinks from '../../../shared/nav/Navlinks'
import MobileNavScreen from '../../../shared/nav/MobileNavScreen';
import { logout } from '@/lib/actions';
import { useRouter } from 'next/navigation';

export type AccountMobileMenuProps = {
    session: Session | null      
}

export default function AccountMobileMenu({session} : AccountMobileMenuProps) {
    const router = useRouter();
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    };
    const handleClose = () => {
    };
    return (
        <Box>
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 1,
            gap: 4,
        }}>
            <NavLinks role={session?.user.roleCode ?? 'USER'}/>
            <Button 
                variant='contained' 
                color='error' 
                size='large' 
                sx={{ width: '90%', borderRadius: 5}}
                onClick={async () => {
                    await logout();
                }} 
            >
                <Typography variant='body1' sx={{ }}>
                    Cerrar Sesión
                </Typography>
            </Button>
        </Box>
        </Box>
  )
}