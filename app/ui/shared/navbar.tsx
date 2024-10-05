'use client';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

import { Button, Divider } from '@mui/material';
import Logo from '../../../public/Logo_conectrans.svg';
import Image from 'next/image';

export default function Navbar() {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
                onClick={handleClick}
            >
                <AccountCircle />
            </IconButton>
            <Menu
                sx={{ mt: 1 }}
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
            >
                <Box>
                    <MenuItem onClick={handleClose}>
                        <Typography variant='body1' sx={{ color: 'black'}}>
                            Empresa
                        </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <Typography variant='body1' sx={{ color: 'black'}}>
                            FAQS
                        </Typography>
                    </MenuItem>
                    <Divider />
                    {!auth ? (
                        <MenuItem onClick={handleClose}>
                            <LogoutIcon color='error' sx={{ mr: 1}}/>                    
                            <Typography variant='body1' color='error'>
                                Cerrar Sesión
                            </Typography>
                        </MenuItem>
                    ) : (
                        <MenuItem onClick={handleClose}>
                            <LoginIcon sx={{ mr: 1, color: 'black'}}/>  
                            <Typography variant='body1' sx={{ color: 'black'}}>
                                Iniciar Sesión
                            </Typography>
                        </MenuItem>
                    )}
                </Box>
            </Menu>
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
                onClick={handleClick}
            >
                <MenuIcon />
            </IconButton>
            <Menu
                sx={{ mt: 1 }}
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
            >
                <Box>
                    <Typography variant='body2' sx={{ ml: 1, mb: 1 }}>
                        Menu
                    </Typography>
                    <Divider />
                    <MenuItem onClick={handleClose}>
                        <Typography variant='body1' sx={{ color: 'black'}}>
                            Blog
                        </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <Typography variant='body1' sx={{ color: 'black'}}>
                            Ofertas
                        </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <Typography variant='body1' sx={{ color: 'black'}}>
                            Empresa
                        </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <Typography variant='body1' sx={{ color: 'black'}}>
                            FAQS
                        </Typography>
                    </MenuItem>
                    <Divider />
                    {!auth ? (
                        <MenuItem onClick={handleClose}>
                            <LogoutIcon color='error' sx={{ mr: 1}}/>                    
                            <Typography variant='body1' color='error'>
                                Cerrar Sesión
                            </Typography>
                        </MenuItem>
                    ) : (
                        <MenuItem onClick={handleClose}>
                            <LoginIcon sx={{ mr: 1, color: 'black'}}/>  
                            <Typography variant='body1' sx={{ color: 'black'}}>
                                Iniciar Sesión
                            </Typography>
                        </MenuItem>
                    )}
                </Box>
            </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  </Box>
  );
}
