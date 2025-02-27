import React, { useEffect } from 'react'
import { Box, Divider, MenuItem, Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import Logo from '../../../public/Conectrans_Logo_Black.png';
import Image from 'next/image';
import Link from 'next/link';
import { Session } from 'next-auth';
import { logout } from '@/lib/actions';
import { AccountCircleOutlined } from '@mui/icons-material';
import { Url } from 'next/dist/shared/lib/router/router';
import ConectransLogo from './svg/conectransLogo';
import useLogoColors from './hooks/useLogoColors';

type DrawerProps = {
		session: Session | null;
    handleClose: () => void;
    handleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}

export default function DrawerCustom(
	{
		handleDrawer, handleClose, session
	} : DrawerProps
) {
  const { color } = useLogoColors();
  const [route, setRoute] = React.useState<Url>('/auth/login');
  const navigate = (): Url => {
    switch(session?.user.roleCode) {
      case 'USER':
        return '/account-user/user';
      case 'COMPANY':
        return '/account-company/company';
      case 'ADMIN':
        return '/admin';
      default:
        return '/auth/login';
    }
  }

  useEffect(() => {
    setRoute(navigate);
  }, [session])


	return (
    <>
			<Box sx={{ m: '10px auto' }}>
					<ConectransLogo width={'100px'} height={'auto'} colors={color} />
			</Box>
			<Divider variant={'middle'} />
			<Box
					sx={{ width: 250 }}
					role="presentation"
					onClick={handleDrawer(false)}
					onKeyDown={handleDrawer(false)}
					>
					<MenuItem onClick={handleClose}>
							<Typography variant='body1' sx={{ color: 'black'}}>
									Blog
							</Typography>
					</MenuItem>
					<Link href='/offers?page=1&limit=10' style={{ textDecoration: 'none' }} >
            <MenuItem sx={{ mt: 1 }}>
                <Typography variant='body1' sx={{ color: 'black'}}>
                    Ofertas
                </Typography>
            </MenuItem>
          </Link>
          <Link href='/about' style={{ textDecoration: 'none' }} >
            <MenuItem sx={{ mt: 1 }}>
                <Typography variant='body1' sx={{ color: 'black'}}>
                    Empresa
                </Typography>
            </MenuItem>
          </Link>

					<MenuItem onClick={handleClose} sx={{ mt: 1 }}>
							<Typography variant='body1' sx={{ color: 'black'}}>
									FAQS
							</Typography>
					</MenuItem>
					<Divider variant={'middle'} />
					{session ? (
						  <>
              <Link href={route} style={{ textDecoration: 'none' }} >
                <MenuItem sx={{ mt: 1 }}>
                  <AccountCircleOutlined  sx={{ mr: 1, color: 'black'}} />
                  <Typography variant='body1' sx={{ color: 'black'}}>
                      Cuenta
                  </Typography>
                </MenuItem>
              </Link>
							<MenuItem 
								onClick={async () => {
									await logout();
								}} 
								sx={{ mt: 1 }}>
									<LogoutIcon color='error' sx={{ mr: 1}}/>                    
									<Typography variant='body1' color='error'>
											Cerrar Sesión
									</Typography>
							</MenuItem>
							</>
					) : (
						<Link href={'/auth/login'} style={{ textDecoration: 'none' }} >
							<MenuItem sx={{ mt: 1 }}>
									<LoginIcon sx={{ mr: 1, color: 'black'}}/>  
									<Typography variant='body1' sx={{ color: 'black'}}>
											Iniciar Sesión
									</Typography>
							</MenuItem>
						</Link>
					)}
			</Box>
    </>
  )
}
