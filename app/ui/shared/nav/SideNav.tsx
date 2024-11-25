'use client';
import { auth } from '@/auth';
import { getUserDataSideNav } from '@/lib/data/user';
import { NavbarSessionData } from '@/lib/types/nav-types';
import { AccountCircleOutlined, DoorBackOutlined } from '@mui/icons-material'
import { AppBar, Box, Drawer, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material'
import { Session } from 'next-auth';
import Image from 'next/image';
import React from 'react'
import NavLinks from './Navlinks';
import { NavLinksSkeleton } from '../custom/components/skeleton/NavLinksSkeleton';
import { logout } from '@/lib/actions';
import { useQuery } from '@tanstack/react-query';
import MobileNavScreen from './MobileNavScreen';
import { useRouter } from 'next/navigation';
import ConectransLogo from '../logo/conectransLogo';

const drawerWidth = 240;

type SideNavProps = {
	session: Session | null,
  children: React.ReactNode
}

const Sidenav: React.FC<SideNavProps> = ({session, children}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
    

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

	const {data, isLoading, isError} = useQuery({queryKey: ['getUserData', session!.user.id], queryFn: () => getUserDataSideNav(session!.user.id ?? '')});
	if(isError) {
		throw Error('Error al cargar los datos del usuario');
	}

  const drawer = (
    <div>
      {!isLoading && data ? 
        <ToolbarComponent data={data} /> 
      : 
        <NavbarToolbarSkeleton />
			}
      <Box sx={{ overflow: 'auto', mt: 2 }}>
						{!isLoading && data ? <NavLinks role={data.role} /> : <NavLinksSkeleton />}
      </Box>
      <Box sx={{ flexGrow: 1, position: 'absolute', bottom: 20, width: drawerWidth}} >
        <ListItem disablePadding sx={{ width: '100%' }}>
            <ListItemButton onClick={async() => {
              await logout();
            }}>
            <ListItemIcon>
                <DoorBackOutlined />
            </ListItemIcon>
            <ListItemText 
                primary={'Cerrar sesión'} 
                />
            </ListItemButton>
        </ListItem>
        <Typography variant='caption' sx={{ textAlign: 'center', mt: 2, ml: 2, color: 'text.secondary'}}>
          © 2024 - Todos los derechos reservados
        </Typography>
      </Box>
    </div>
  )

	return (
    <Box sx={{ display: 'flex', marginTop: {xs: 0, sm: 0}}}>
        <AppBar
          position="fixed"
          color='inherit'
          sx={{
            display: { xs: 'flex', sm: 'none' },
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
            <MobileNavScreen title="" session={session} drawerOpen={handleDrawerToggle} />
        </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          // container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, mt: {xs: 7, md: 0}, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default Sidenav

const NavbarToolbarSkeleton = () => (
	<Toolbar
		sx={{
			display: 'flex',
			flexDirection: 'row',
			alignContent: 'center',
			alignItems: 'center',
			justifyContent: 'space-between',
			mt: 2,
			mr: 0.5,
			ml: 0.5,
			border: '1px solid #f0f0f0',
			borderRadius: 4,
			cursor: 'pointer',
			height: 64,
		}}
	>
		<Box sx={{ width: 50, height: 50, borderRadius: '50%' }} />
		<Typography variant="subtitle1" component="h2" sx={{ flexGrow: 1, fontWeight: 'bold', backgroundColor: '#e0e0e0', height: 24, width: '60%' }} />
	</Toolbar>
);

function ToolbarComponent({ data }: { data: NavbarSessionData }) {
	const router = useRouter();
	return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-evenly',
      mt: 2,
      borderRadius: 5,
    }}>
    <Toolbar
      tabIndex={0}
      sx={{
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        '& .MuiToolbar-root': {
          paddingLeft: '0 !important',
        },
      }}
      onClick={() => router.push('/')}
    >
      <IconButton
          size="small"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
        >
            <ConectransLogo width={'120px'} height={'auto'} fill='white' />
            {/* <Image priority src={Logo} alt='Logo conectrans' width={130}/> */}
        </IconButton>
    </Toolbar>
    </Box>
	);
}