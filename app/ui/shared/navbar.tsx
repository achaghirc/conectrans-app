'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

import { Button, Drawer } from '@mui/material';
import Logo from '../../../public/Logo_conectrans.svg';
import Image from 'next/image';
import DrawerCustom from './drawer';

export default function Navbar() {
  const [state, setState] = React.useState(false);
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawer = (open: boolean) => 
    (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setState(open);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
    <AppBar 
        sx={{
            backgroundColor: 'transparent',
            color: 'black',
            boxShadow: 'none',
        }}
        position="static"
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between'}}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
            <Image priority src={Logo} alt='Logo conectrans' />
        </IconButton>
        {/* Only show on large screens otherwise show a menu options of mobile screens */}
        <Box sx={{
            display: { xs: 'none', md: 'flex' },
            
        }}>
            <Button color="inherit" variant='outlined'>Blog</Button>
            <Button color="primary" variant='outlined' sx={{ ml: 2 }} >Ofertas</Button>
            <IconButton 
                sx={{ ml: 3 }}
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleDrawer(true)}
            >
                <AccountCircle />
            </IconButton>
            <Drawer
                anchor='right'
                open={state}
                onClose={handleDrawer(false)}
            >
                <DrawerCustom
                    auth={auth} 
                    handleClose={() => handleClose()} 
                    handleDrawer={() => handleDrawer(false)}
                />
            </Drawer>
        </Box>
        <Box sx={{
            display: { xs: 'flex', md: 'none' },
        }}>
            <IconButton 
                sx={{ ml: 3 }}
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleDrawer(true)}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                anchor='right'
                open={state}
                onClose={handleDrawer(false)}
            >
                <DrawerCustom 
                    auth={auth} 
                    handleClose={() => handleClose()} 
                    handleDrawer={() => handleDrawer(false)}
                />
            </Drawer>
        </Box>
      </Toolbar>
    </AppBar>
  </Box>
  );
}