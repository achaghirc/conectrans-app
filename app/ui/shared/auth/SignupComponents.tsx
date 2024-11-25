import MuiCard from '@mui/material/Card';
import { Stack, styled } from "@mui/material";

export const SignUpContainer = styled(Stack)(({ theme }) => ({
	width: '100%',
	minHeight: '100%',
	padding: theme.spacing(2),
	gap: theme.spacing(5),
	[theme.breakpoints.up('sm')]: {
		gap: theme.spacing(0),
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


export const CardSignUp = styled(MuiCard)(({ theme, sx }) => ({
	mt: 2,
	display: 'flex',
	flexDirection: 'column',
	alignSelf: 'center',
	width: '100%',
	padding: theme.spacing(4),
	gap: theme.spacing(2),
	borderRadius: '15px',
	margin: 'auto',
	[theme.breakpoints.up('sm')]: {
		maxWidth: '95%',
		boxShadow:
		'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
		...theme.applyStyles('dark', {
			boxShadow:
			'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
		}),
	},
}));

export const SignUpMobileForm = ({children}: Readonly<{children: React.ReactNode;}>) => {
	return (
		<SignUpContainer direction="column" justifyContent="space-between">
			{children}
		</SignUpContainer>
	)
}

export const SignUpForm = ({ children }: Readonly<{ children: React.ReactNode }>) => {
	return (
		<SignUpContainer direction="row" justifyContent="space-between">
			<CardSignUp variant="elevation">
				{children}
			</CardSignUp>	
		</SignUpContainer>
	)
}
