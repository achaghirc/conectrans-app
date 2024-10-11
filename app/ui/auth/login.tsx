'use client';
import React from 'react'
import { Box, Button, Card, Checkbox, CssBaseline, Divider, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, Link, Stack, TextField, Typography } from '@mui/material';
import Logo from '../../../public/Conectrans_Logo_White.svg';
import Image from 'next/image';
import ForgotPassword from '../icons/forgotPassword';
import { BusinessOutlined, LockOutlined, PeopleOutline, Visibility, VisibilityOff } from '@mui/icons-material';
import { CardLogin, SignInContainer } from '../shared/auth/authComponents';
import { signIn } from '@/auth';
import { authenticate } from '@/lib/actions';
import { useRouter } from 'next/navigation';
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
	const [showPassword, setShowPassword] = React.useState(false);
	const [isPending, setIsPending] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined);
	const router = useRouter();

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

// Update the handleSubmit method in your LoginModal component
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const data = new FormData(event.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    if (emailError || passwordError) {
        return;
    }
	setIsPending(true);  // Set pending state to true

    try {
        const errorMsg = await authenticate(undefined, data);
        if (errorMsg) {
            setErrorMessage(errorMsg);  // Display error message to the user
        } else {
            // Handle successful login
            console.log("Logged in successfully");
			router.push('/');
        }
    } catch (error) {
        console.error('Authentication error:', error);
        setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
        setIsPending(false);  // Reset pending state
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
								name="email"
								placeholder="email@example.com"
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