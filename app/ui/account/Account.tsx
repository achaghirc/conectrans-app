'use client';
import { getCompanyUserAccountData, getUserDataSideNav } from '@/lib/data/user'
import { CompanyUserAccountDTO } from '@/lib/definitions';
import { NavbarSessionData } from '@/lib/types/nav-types'
import { Avatar, Box, Button, Divider, Paper, Skeleton, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Session } from 'next-auth'
import Image from 'next/image'
import React, { use, useEffect } from 'react'
import { set } from 'zod'

export type AccountProps = {
    session: Session | null      
}

export default function Account({session} : AccountProps) {
		const [userData, setUserData] = React.useState<CompanyUserAccountDTO | null>(null);
		const [loading, setLoading] = React.useState<boolean>(true);
    if (!session) {
        return;
    }
    const getUserData = async () => {
        const userData = await getCompanyUserAccountData(session.user.id ?? '');
        if (!userData) {
            return;
        }
        const data: CompanyUserAccountDTO = userData;
        setUserData(data);
				setLoading(false);
    }
    useEffect( () => {
        if (session) {
            getUserData();
        }
    }, [])

	if (loading) {
			return <AccountSkeleton />
	}
  return (
    <Paper
			variant='outlined'
			elevation={2}
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: 3,
				padding: 2,
				margin: '20px auto',
				height: '100%',
				width: '98%',
				borderRadius: 5,
				
			}}
		>
			<Box>
				<Typography variant='h4' component={'h1'} fontWeight={'bold'} color='textPrimary'>
					Bienvenido a tu cuenta
				</Typography>
			</Box>
			<Box>
				<Typography variant='h6' component={'h1'} fontWeight={'bold'} color='secondary'>
						Datos de la cuenta
					</Typography>
					<Divider />
			</Box>
			<Grid container spacing={2}>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="Email"
						name="email"
						value={userData?.userEmail}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="Contraseña"
						name="password"
						type='password'
						placeholder={'********'}
						value={userData?.userPassword.substring(0, 10)}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<Button variant='outlined' color='secondary'>Guardar</Button>
				</Grid>
			</Grid>
			<Box>
				<Typography variant='h6' component={'h1'} fontWeight={'bold'} color='secondary'>
					Persona de contacto
				</Typography>
				<Divider sx={{ mt: 1 }}/>
			</Box>
			<Grid container spacing={2}>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="Nombre"
						name="name"
						value={userData?.contactPersonName}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="Apellidos"
						name="lastname"
						value={userData?.contactPersonLastname}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="DNI/NIE"
						name="document"
						value={userData?.contactPersonDocument ?? ''}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="Puesto en la empresa"
						name="companyPosition"
						value={userData?.contactPersonCompanyPosition}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="Email"
						name="email"
						value={userData?.contactPersonEmail}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 12 }}>
					<Button variant='outlined' color='secondary'>Guardar</Button>
				</Grid>
			</Grid>
    </Paper>
  )
}

function AccountSkeleton() {
	return (
		<Paper
			variant='outlined'
			elevation={2}
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: 3,
				padding: 2,
				margin: '20px auto',
				height: '100%',
				width: '98%',
				borderRadius: 5,
			}}
		>
			<Box>
				<Typography variant='h4' component={'h1'} fontWeight={'bold'} color='textPrimary'>
					Bienvenido a tu cuenta
				</Typography>
			</Box>
			<Box>
				<Skeleton variant="text" width="60%" height={40} />
				<Divider />
			</Box>
			<Grid container spacing={2}>
				<Grid size={{ xs: 12, sm: 6 }}>
					<Skeleton variant="rectangular" width="100%" height={56} />
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<Skeleton variant="rectangular" width="100%" height={56} />
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<Skeleton variant="rectangular" width="20%" height={40} />
				</Grid>
			</Grid>
			<Box>
				<Skeleton variant="text" width="60%" height={40} />
				<Divider />
			</Box>
			<Grid container spacing={2}>
				<Grid size={{ xs: 12, sm: 6 }}>
					<Skeleton variant="rectangular" width="100%" height={56} />
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<Skeleton variant="rectangular" width="100%" height={56} />
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<Skeleton variant="rectangular" width="100%" height={56} />
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<Skeleton variant="rectangular" width="100%" height={56} />
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<Skeleton variant="rectangular" width="100%" height={56} />
				</Grid>
				<Grid size={{ xs: 12, sm: 12 }}>
					<Skeleton variant="rectangular" width="10%" height={40} />
				</Grid>
			</Grid>
		</Paper>
	);
}

