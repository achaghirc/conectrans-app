'use client';
import { FormEvent, Fragment, useLayoutEffect, useState, useTransition } from 'react'
import { Box, Button, Divider, FormControl, IconButton, InputAdornment, Link, TextField, Typography } from '@mui/material';
import Logo from '../../../public/Conectrans_Logo_White.svg';
import Image from 'next/image';
import ForgotPassword from '../icons/forgotPassword';
import { ArrowBack, BusinessOutlined, LockOutlined, PeopleOutline, Visibility, VisibilityOff } from '@mui/icons-material';
import { authenticate } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { AuthenticateMessage } from '@/lib/definitions';
import { SignInForm, SignInMobileForm, TextFieldCustom } from '../shared/auth/LoginComponents';


export default function LoginModal() {
	const [mediaQuery, setMediaQuery] = useState<boolean | null>(null);
	//Manage media query for responsive design when the screen is resized
	useLayoutEffect(() => {
		const mediaQuery = window.matchMedia('(min-width: 600px)');
		setMediaQuery(mediaQuery.matches);
		mediaQuery.addEventListener('change', (e) => {
			setMediaQuery(e.matches);
		});
	},[]);
	return (
		mediaQuery == null ? null : mediaQuery ? (
			<SignInForm>
				<FormLogin />
			</SignInForm>
		) : (
			<SignInMobileForm>
				<FormLogin />
			</SignInMobileForm>
		
		)
	)	
}


const FormLogin = () => {
	const [emailError, setEmailError] = useState(false);
	const [emailErrorMessage, setEmailErrorMessage] = useState('');
	const [passwordError, setPasswordError] = useState(false);
	const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
	const [open, setOpen] = useState(false);

	const [isPending, startTransition] = useTransition();

	const router = useRouter();
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	// Update the handleSubmit method in your LoginModal component
	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setEmailError(false);
		setPasswordError(false);
		setErrorMessage(undefined);
		const data = new FormData(event.currentTarget);
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		if (emailError || passwordError) {
			return;
		}
		try {
			const response: AuthenticateMessage | undefined = await authenticate(undefined, data);
			console.log('Response:', response);
			if (!response) {
				return;
			}
			if (response.success) {
				router.push('/');
				return;
			}
			switch (response.type) {
				case 'email':
					setEmailError(true);
					setEmailErrorMessage(response.message);
					break;
				case 'password':
					setPasswordError(true);
					setPasswordErrorMessage(response.message);
					break;
				default:
					setErrorMessage(response.message);
					break;
			}
		} catch (error: any) {
			console.error('Authentication error:', error.cause);
			setErrorMessage('An unexpected error occurred. Please try again.');
		}
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

	const inputPropShowPassword = () => {
		return (
		  <InputAdornment position="end">
			<IconButton
			  aria-label="toggle password visibility"
			  onClick={() => setShowPassword(!showPassword)}
			  edge="end"
			>
			  {showPassword ? <Visibility /> : <VisibilityOff />}  
			</IconButton>
		  </InputAdornment>
		)
	}
	return (
		<Fragment>
			<ArrowBack sx={{ display: { sm: 'none' } }} onClick={() => router.back()}/>
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
					<TextFieldCustom
						label="Correo electrónico"
						error={emailError}
						helperText={emailErrorMessage}
						id="email"
						type="email"
						name="email"
						placeholder="email@example.com"
						autoComplete="email"
						autoFocus
						required
						fullWidth
						variant="outlined"
						color={emailError ? 'error' : 'primary'}
						sx={{ ariaLabel: 'email'}}	
					/>
				</FormControl>
				<FormControl>
					<TextField
						label="Contraseña"
						error={passwordError}
						helperText={passwordErrorMessage}
						name="password"
						placeholder="••••••"
						type={!showPassword ? "password": "text"}
						id="password"
						autoComplete="current-password"
						autoFocus
						required
						fullWidth
						variant="outlined"
						color={passwordError ? 'error' : 'primary'}
						slotProps={{
							input:{
								endAdornment: inputPropShowPassword()
							}
							}}
					/>
				</FormControl>
				<ForgotPassword open={open} handleClose={handleClose} />
				<Button
					type="submit"
					fullWidth
					variant="outlined"
					onClick={validateInputs}
					aria-disabled={isPending}
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
		</Fragment>
	)
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