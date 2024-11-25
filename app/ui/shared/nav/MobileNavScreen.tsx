'use client';
import { AccountCircleOutlined, ArrowBackOutlined, MenuOutlined } from '@mui/icons-material';
import { Box, Drawer, IconButton, Typography } from '@mui/material';
import React from 'react'
import DrawerCustom from '../drawer';
import { Session } from 'next-auth';
import { usePathname, useRouter } from 'next/navigation';

export type MobileNavScreenProps = {
  title?: string;
  session: Session | null;
  drawerOpen?: () => void;
}

const getTitleByPath = (pathname: string | null) => {
   switch (pathname) {
    case '/':
      return 'Home';
    case '/account/account-data':
      return 'Cuenta';
    case '/account/company-data':
      return 'Datos Compañia';
    case '/account/experiences':
      return 'Experiencias';
    case '/account/offers':
      return 'Ofertas';
    case '/account/personal-data':
      return 'Datos personales';
    case '/account/subscriptions':
      return 'Suscripciones';
    default:
      return '';
  }
}


export default function MobileNavScreen({session, drawerOpen}: MobileNavScreenProps) {
  const pathname = usePathname(); 
  const router = useRouter();
  const [state, setState] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const title = getTitleByPath(pathname);

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
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 2, mt: 1 }}>
      <Box>
        <IconButton onClick={drawerOpen}>
          <AccountCircleOutlined />
        </IconButton>
      </Box>
      <Typography variant='h6'>{title}</Typography>
      <IconButton
            sx={{ ml: 3 }}
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleDrawer(true)}
        >
            <MenuOutlined />
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
  )
}
