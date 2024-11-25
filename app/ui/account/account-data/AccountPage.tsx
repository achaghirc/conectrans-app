'use client';
import React from 'react'
import { getCompanyUserAccountData } from '@/lib/data/user'
import { CompanyUserAccountDTO } from '@/lib/definitions';
import { Box, Button, Divider, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Session } from 'next-auth'
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import AccountSkeleton from '../../shared/custom/components/skeleton/AccountSkeleton';

export type AccountProps = {
    session: Session | null      
}

export default function AccountPage({session} : AccountProps) {
	if (!session) {return;}
	
	const fetchUserData = () : Promise<CompanyUserAccountDTO | undefined> => getCompanyUserAccountData(session.user.id ?? '');
	const { data, isLoading, isError, error} = useQuery({queryKey: ['companyUserAccountData'], queryFn: fetchUserData})
	
	if (isLoading) {
			return <AccountSkeleton />
	}
	if (isError) {
			return <div>Error {error.message} </div>
	}
  return (
    <Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: 3,
				padding: 2,
				margin: '0px auto',
				height: '100%',
				width: '98%',
				borderRadius: 5,
			}}
		>
			<Box>
				<Typography variant='h6' component={'h1'} fontWeight={'bold'} color='textPrimary'>
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
						value={data?.userEmail}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="Contraseña"
						name="password"
						type='password'
						placeholder={'********'}
						value={data?.userPassword.substring(0, 10)}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<Button variant='outlined' color='secondary'>Guardar</Button>
				</Grid>
			</Grid>
			<Box>
				<Typography variant='h6' component={'h1'} fontWeight={'bold'} color='textPrimary'>
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
						value={data?.contactPersonName}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="Apellidos"
						name="lastname"
						value={data?.contactPersonLastname}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="DNI/NIE"
						name="document"
						value={data?.contactPersonDocument ?? ''}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="Puesto en la empresa"
						name="companyPosition"
						value={data?.contactPersonCompanyPosition}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="Email"
						name="email"
						value={data?.contactPersonEmail}
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 12 }}>
					<Button variant='outlined' color='secondary'>Guardar</Button>
				</Grid>
			</Grid>
    </Box>
  )
}



export async function getServerSideProps(context: any) {
	const queryClient = new QueryClient();
	const fetchUserData = () : Promise<CompanyUserAccountDTO | undefined> => getCompanyUserAccountData(context.session.user.id ?? '');
	await queryClient.prefetchQuery({queryKey: ['companyUserAccountData'], queryFn: fetchUserData});

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
	};

}