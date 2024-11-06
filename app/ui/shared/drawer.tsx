import React from 'react'
import { Box, Divider, MenuItem, Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import Logo from '../../../public/Conectrans_Logo_Black.png';
import Image from 'next/image';
import Link from 'next/link';
import { Session } from 'next-auth';
import { logout } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { AccountCircleOutlined } from '@mui/icons-material';

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

	const router = useRouter();

	return (
    <>
			<Box sx={{ marginTop: 2 }}>
					<Image
						src={Logo}
						alt="Conectrans Logo Black"
						width={180}
						height={100}
					/>
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
					<MenuItem onClick={handleClose} sx={{ mt: 1 }}>
							<Typography variant='body1' sx={{ color: 'black'}}>
									Ofertas
							</Typography>
					</MenuItem>
					<MenuItem onClick={handleClose} sx={{ mt: 1 }}>
							<Typography variant='body1' sx={{ color: 'black'}}>
									Empresa
							</Typography>
					</MenuItem>
					<MenuItem onClick={handleClose} sx={{ mt: 1 }}>
							<Typography variant='body1' sx={{ color: 'black'}}>
									FAQS
							</Typography>
					</MenuItem>
					<Divider variant={'middle'} />
					{session ? (
						  <>
							<MenuItem onClick={() => router.push('/account')} sx={{ mt: 1 }}>
								<AccountCircleOutlined  sx={{ mr: 1}} />
								<Typography variant='body1' sx={{ color: 'black'}}>
										Cuenta
								</Typography>
							</MenuItem>
							<MenuItem 
								onClick={async () => {
									await logout();
									router.push('/');
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
