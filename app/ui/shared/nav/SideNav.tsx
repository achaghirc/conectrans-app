'use client';
import { auth } from '@/auth';
import { getUserDataSideNav } from '@/lib/data/user';
import { NavbarSessionData } from '@/lib/definitions';
import { AccountCircleOutlined, InboxOutlined, MailOutline, MenuOutlined } from '@mui/icons-material'
import { AppBar, Avatar, Box, Button, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material'
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const drawerWidth = 240;

type SideNavProps = {
	session: Session | null
}

const SideNav = ({session} : SideNavProps) => {
  const router = useRouter()
	const [userData, setUserData] = React.useState<NavbarSessionData | null>(null);
	if (!session) {
		router.push('/login')
		return;
	}

	const handleLogout = async () => {
		await signOut();
	}

	const getUserData = async () => {
			if (!session.user.id){
				router.push('/auth/login')
				return;
			}
			const userData = await getUserDataSideNav(session.user.id);
			if (!userData) {
				router.push('/auth/login')
				return;
			}
			const data: NavbarSessionData = userData;
			setUserData(data);
	}


	useEffect(() => {
		if (session) {
			const data = getUserData();
			console.log(data)
		}
	}, [])


  
	return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
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
						backgroundColor: '#f0f0f0',
						padding: 1,
					}}
				>
          <Box>
						{userData && userData.assetUrl ? 
							<Image src={userData.assetUrl} alt="avatar" width={50} height={50} style={{ borderRadius: 50, marginTop: 5}} /> 
							: 
							<AccountCircleOutlined />
						}          
					</Box>
          <Box>
						{userData && 
							<Typography variant="subtitle1" component="h2" sx={{ flexGrow: 1 }}>
								{userData.name}
							</Typography>
						}
					</Box>
        </Toolbar>
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {['Datos Personales', 'Experiencia', 'Subscripciones', 'Ofertas'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxOutlined /> : <MailOutline />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxOutlined /> : <MailOutline />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  )
}

export default SideNav
