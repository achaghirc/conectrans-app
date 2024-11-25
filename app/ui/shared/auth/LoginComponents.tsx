import MuiCard from '@mui/material/Card';
import { Stack, styled, TextField } from "@mui/material";

export const SignInContainer = styled(Stack)(({ theme }) => ({
	width: '100%',
    minHeight: '100%',
	padding: theme.spacing(3),
	gap: theme.spacing(3),
	[theme.breakpoints.up('sm')]: {
		display: 'flex',
		marginTop: 20,
		padding: theme.spacing(4),
		'&::before': {
			content: '""',
			display: 'block',
			position: 'absolute',
			zIndex: -1,
			inset: 0,
			backgroundImage:
				'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
			backgroundRepeat: 'no-repeat',
			...theme.applyStyles('dark', {
				backgroundImage:
					'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
			}),
		},
	},
}));
export const CardLogin = styled(MuiCard)(({ theme, sx }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignSelf: 'center',
	width: '100%',
	padding: theme.spacing(5),
	gap: theme.spacing(2),
	borderRadius: '15px',
	margin: 'auto',
	[theme.breakpoints.up('sm')]: {
		maxWidth: '500px',
	},
	boxShadow:
		'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
	...theme.applyStyles('dark', {
		boxShadow:
			'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
	}),
}));

export const TextFieldCustom = styled(TextField)(({ theme }) => ({
	'& .MuiOutlinedInput-root': {
		'& fieldset': {
			borderColor: theme.palette.grey[300],
		},
		'&:hover fieldset': {
			borderColor: theme.palette.grey[500],
		},
		'&.Mui-focused fieldset': {
			borderColor: theme.palette.primary.main,
		},
	},
	color: '#ffffff',
	'&:-webkit-autofill': {
		WebkitBoxShadow: '0 0 0 100px #307ECC inset !important',
		WebkitTextFillColor: '#ffffff !important',
	},
}));


export const SignInMobileForm = ({children}: Readonly<{children: React.ReactNode;}>) => {
	return (
		<SignInContainer direction="column" justifyContent="space-between">
			{children}
		</SignInContainer>
	)
}

export const SignInForm = ({
	children
  }: Readonly<{
	children: React.ReactNode;
  }>) => {
	return (
		<SignInContainer direction="row" justifyContent="space-between">
			<CardLogin variant="elevation">
				{children}
			</CardLogin>	
		</SignInContainer>
	)
}


