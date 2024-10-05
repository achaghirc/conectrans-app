'use client';
import React from 'react'
import MuiCard from '@mui/material/Card';
import { Box, Button, Card, Checkbox, CssBaseline, Divider, FormControl, FormControlLabel, FormLabel, Link, Stack, TextField, Typography } from '@mui/material';
import Logo from '../../../public/Logo_conectrans.svg';
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import ForgotPassword from '../icons/forgotPassword';
import { GoogleIcon } from '../icons/customIcons';
import { BusinessOutlined, LockOutlined, PeopleOutline } from '@mui/icons-material';
import { CardLogin, SignInContainer } from '../shared/auth/authComponents';
type LoginProps = {
    open: boolean;
    handleClose: (open: boolean) => void;
}

export default function LoginModal() {
	const [emailError, setEmailError] = React.useState(false);
	const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
	const [passwordError, setPasswordError] = React.useState(false);
	const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		if (emailError || passwordError) {
			event.preventDefault();
			return;
		}
		const data = new FormData(event.currentTarget);
		console.log({
			email: data.get('email'),
			password: data.get('password'),
		});
	};

	const validateInputs = () => {
		const email = document.getElementById('email') as HTMLInputElement;
		const password = document.getElementById('password') as HTMLInputElement;

		let isValid = true;

		if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
			setEmailError(true);
			setEmailErrorMessage('Please enter a valid email address.');
			isValid = false;
		} else {
			setEmailError(false);
			setEmailErrorMessage('');
		}

		if (!password.value || password.value.length < 6) {
			setPasswordError(true);
			setPasswordErrorMessage('Password must be at least 6 characters long.');
			isValid = false;
		} else {
			setPasswordError(false);
			setPasswordErrorMessage('');
		}

		return isValid;
	};

	return (
		<>
			<CssBaseline enableColorScheme />
			<SignInContainer direction="column" justifyContent="space-between">
				<CardLogin variant="outlined">
					<Box sx={{ display: 'flex', flexDirection:'column', alignItems: 'center'}}>
							<Image
									src={Logo} 
									alt="Conectrans Logo Black" 
									width={130} 
									height={90} 
									/>   
							<Box sx={{ display: 'flex', padding: '4px', mt: 1, color:'white', borderRadius: '50%', backgroundColor: '#0B2C38' }} >
								<LockOutlined />
							</Box>
					</Box>
					<Box
						component="form"
						onSubmit={handleSubmit}
						noValidate
						sx={{
							display: 'flex',
							flexDirection: 'column',
							width: '100%',
							gap: 2,
						}}
					>
						<FormControl>
							<TextField
								label="Correo electrónico"
								error={emailError}
								helperText={emailErrorMessage}
								id="email"
								type="email"
								name="Correo Electrónico"
								placeholder="tu_correo@email.com"
								autoComplete="email"
								autoFocus
								required
								fullWidth
								variant="outlined"
								color={emailError ? 'error' : 'primary'}
								sx={{ ariaLabel: 'email' }}
							/>
						</FormControl>
						<FormControl>
							
							<TextField
								label="Contraseña"
								error={passwordError}
								helperText={passwordErrorMessage}
								name="password"
								placeholder="••••••"
								type="password"
								id="password"
								autoComplete="current-password"
								autoFocus
								required
								fullWidth
								variant="outlined"
								color={passwordError ? 'error' : 'primary'}
							/>
						</FormControl>
						<ForgotPassword open={open} handleClose={handleClose} />
						<Button
							type="submit"
							fullWidth
							variant="outlined"
							onClick={validateInputs}
						>
							Iniciar sesión
						</Button>
						<Box sx={{ display: 'flex', justifyContent: 'center' }}>
								<Link
									color='textSecondary'
									component="button"
									type="button"
									onClick={handleClickOpen}
									variant="body2"
									sx={{ alignSelf: 'baseline' }}
								>
									¿Has olvidado tu contraseña?
								</Link>
						</Box>
					</Box>
					<Divider></Divider>
					<Typography sx={{ textAlign: 'center' }}>
						¿Aún no tienes una cuenta?{' '}
					</Typography>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
						<Link
							href="/auth/signup/company"	
						>
						<Button
							fullWidth
							variant="contained"
							sx={{ backgroundColor: '#0B2C38', borderColor: '#0B2C38' }}
							startIcon={<BusinessOutlined />}
							>
							Comenzar como empresa
						</Button>
						</Link>
						<Link
							href="/auth/signup/candidate"	
						>
						<Button
							fullWidth
							variant="outlined"
							sx={{ color: '#0B2C38', borderColor: '#0B2C38' }}
							startIcon={<PeopleOutline />}
						>
							Comenzar como candidato
						</Button>
						</Link>
					</Box>
				</CardLogin>
			</SignInContainer>
		</>
		);
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };