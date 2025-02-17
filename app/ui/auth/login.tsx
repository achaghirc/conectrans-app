'use client';
import { FormEvent, Fragment, useLayoutEffect, useState, useTransition } from 'react'
import { Box, Button, Divider, FormControl, IconButton, InputAdornment, Link, TextField, Typography } from '@mui/material';
import Logo from '../../../public/Conectrans_Logo_White.svg';
import Image from 'next/image';
import ForgotPassword from '../icons/forgotPassword';
import { ArrowBack, BusinessOutlined, LockOutlined, PeopleOutline, Visibility, VisibilityOff } from '@mui/icons-material';
import { authenticate } from '@/lib/actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthenticateMessage, State } from '@/lib/definitions';
import { SignInForm, SignInMobileForm, TextFieldCustom } from '../shared/auth/LoginComponents';
import ButtonCustom from '../shared/custom/components/button/ButtonCustom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ZodIssue } from 'zod';
import { ControllerTextFieldComponent } from '../shared/custom/components/form/ControllersReactHForm';
import { validateSignInData } from '@/lib/validations/loginValidations';

type LoginForm = {
  email: string;
  password: string;
}


export default function LoginModal() {
	const [mediaQuery, setMediaQuery] = useState<boolean | null>(null);
	//Manage media query for responsive design when the screen is resized
	useLayoutEffect(() => {
		const mediaQuery = window.matchMedia('(min-width: 600px)');
		setMediaQuery(mediaQuery.matches);
		mediaQuery.addEventListener('change', (e) => {
			setMediaQuery(e.matches);
		});
    return () => {
      mediaQuery.removeEventListener('change', (e) => {
        setMediaQuery(e.matches);
      });
    }
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
  const redirectParam = useSearchParams()?.get('redirect') ?? '/';
  const [loading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>({
    message: '',
    errors: []
  })
  const router = useRouter();

  const { 
    control, 
    handleSubmit
  } = useForm<LoginForm>();

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

  const onSubmit: SubmitHandler<LoginForm> = async(data) => {
    setIsLoading(true);
    const { email, password } = data;
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const validate:State = await validateSignInData(state, formData);
    if (validate.errors && validate.errors.length > 0) {
      setState(validate);
      return;
    }
		try {
			const response: AuthenticateMessage | undefined = await authenticate(undefined, formData);
			if (!response) {
				return;
			}
			if (response.success) {
				if (redirectParam) {
          console.log('Redirecting to:', redirectParam);
          router.push(redirectParam);
          return;
        }
        router.push('/');
				return;
			}
      switch (response.type) {
        case 'email':
          setState({
            ...state,
            message: response.message ?? 'No user found with that email',
            errors: [{
              message: response.message ?? 'No user found with that email',
              path: ['email'],
              code: 'invalid_literal',
              expected: '',
              received: ''
            }]
          });
          break;
        case 'password':
          setState({
            ...state,
            message: response.message ?? 'Incorrect password',
            errors: [{
              message: response.message ?? 'Incorrect password',
              path: ['password'],
              code: 'invalid_literal',
              expected: '',
              received: ''
            }]
          });
          break;
        default:
          setState({
            ...state,
            message: response.message ?? 'Error en el inicio de sesión. Por favor, inténtalo de nuevo.',
            errors: [{
              message: response.message ?? 'Error en el inicio de sesión. Por favor, inténtalo de nuevo.',
              path: ['email'],
              code: 'invalid_literal',
              expected: '',
              received: ''
            }]
          });
          break;
      }
		} catch (error: any) {
			console.error('Authentication error:', error.cause);
      setState({
        ...state,
        message: 'An unexpected error occurred. Please try again.',
        errors: [{
          message: 'An unexpected error occurred. Please try again.',
          expected: '',
          received: '',
          code: 'invalid_literal',
          path: ['general']
        }]
      }); 
		} finally {
      setIsLoading(false);
    }
  }

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
		<form onSubmit={handleSubmit(onSubmit)}>
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
				component="div"
				sx={{
					display: 'flex',
					flexDirection: 'column',
					width: '100%',
					gap: 2,
				}}
			>
        <ControllerTextFieldComponent 
          control={control}
          label='Correo electrónico'
          formState={state}
          name="email"
          placeholder='example@gmail.com'
        />
        <ControllerTextFieldComponent
          label='Contraseña'
          formState={state}
          name="password"
          type={!showPassword ? "password" : "text"}
          placeholder='Contraseña'
          inputAdornment={inputPropShowPassword()}
          control={control}
        />
				<ButtonCustom
					type="submit"
					title="Iniciar sesión"
          loading={loading}
          color="primary"
				/>
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
			<Divider sx={{ mt: 2, mb: 2 }}></Divider>
			<Typography sx={{ textAlign: 'center', mb: 2 }}>
				¿Aún no tienes una cuenta?{' '}
			</Typography>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          fullWidth
          variant="contained"
          sx={{ backgroundColor: '#0B2C38', borderColor: '#0B2C38' }}
          startIcon={<BusinessOutlined />}
          onClick={() => router.push('/auth/signup/company')}
          >
          Comenzar como empresa
        </Button>
				<Button
					fullWidth
					variant="outlined"
					sx={{ color: '#0B2C38', borderColor: '#0B2C38' }}
					startIcon={<PeopleOutline />}
          onClick={() => router.push(`/auth/signup/candidate?redirect=${redirectParam}`)}
				>
					Comenzar como candidato
				</Button>
			</Box>
      <ForgotPassword open={open} handleClose={handleClose} />
		</form>
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