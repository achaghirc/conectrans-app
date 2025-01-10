'use client';

import * as React from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

import { Button, Drawer } from '@mui/material';
//es-lint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import DrawerCustom from './drawer';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import ConectransLogo from './logo/conectransLogo';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


type NavbarProps = {
  session: Session | null;
}

export default function Navbar({session}: NavbarProps) {
  const [state, setState] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
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
    <SessionProvider>
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
            size="small"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            <Link href='/'>
              <ConectransLogo width={'100px'} height={'auto'} fill='white' />
            </Link>
              {/* <Image priority src={Logo} alt='Logo conectrans' width={130}/> */}
          </IconButton>
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
          >
            <Link href='/'>
              <ConectransLogo width={'100px'} height={'auto'} fill='white' />
            </Link>
              {/* <Image priority src={Logo} alt='Logo conectrans' width={130}/> */}
          </IconButton>
          {/* Only show on large screens otherwise show a menu options of mobile screens */}
          <Box sx={{
              display: { xs: 'none', md: 'flex' }  
          }}>
            <Link href='/offers?page=1&limit=10'>
              <Button color="inherit" variant='outlined'>
                Blog
              </Button>
            </Link>
            <Link href='/offers?page=1&limit=10'>
              <Button 
                variant="outlined" 
                color="primary"
                sx={{ ml: 2 }}
              >
                Ofertas
              </Button>
            </Link>
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
                    session={session}
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
                      session={session}
                      handleClose={() => handleClose()} 
                      handleDrawer={() => handleDrawer(false)}
                  />
              </Drawer>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  </SessionProvider>
  );
}