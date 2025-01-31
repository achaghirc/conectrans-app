import { Autocomplete, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, IconButton, InputAdornment, styled, TextField, Typography } from '@mui/material';
import React, { ChangeEvent, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { UserDTO } from '@prisma/client';
import ButtonCustom from '../custom/components/button/ButtonCustom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const CustomDialog =  styled(Dialog)(({ theme }) => ({
	'& .MuiDialog-paper': {
		width: '100% !important',
		maxWidth: '700px',
		borderRadius: '15px',
	},
	'& .MuiDialogContent-root': {
		padding: theme.spacing(2),
	},
	'& .MuiDialogActions-root': {
		padding: theme.spacing(1),
	},
}));

type ModalCheckPassComponentProps = {
  userData: UserDTO;
  open: boolean;
  setOpen: (value:boolean) => void
  onSave: (userData: UserDTO) => void;
}


const ModalCheckPassComponent: React.FC<ModalCheckPassComponentProps> = (
  {userData, open, setOpen, onSave}
) => {

  const [pass, setPass] = useState<string | undefined>(userData.confirmPassword);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPass(value);
  }

  const handleSubmit = () => {
    const userDataCopy = userData;
    userDataCopy.confirmPassword = pass;

    onSave(userDataCopy);
    setOpen(false)
    setPass('');
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
    <CustomDialog
			onClose={() => setOpen(false)}
			open={open}
			aria-label='password-dialog'
		>
			<DialogTitle sx={{ m: 0, p: 2 }} id="password-dialog-title">Constraseña actual</DialogTitle>
			<Divider variant='middle' />
			<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap : 2}}>
        <Typography variant='caption' component={'p'}>
          Debido a nuestra política interna de seguridad debes introducir tu contraseña actual para poder 
          realizar modificaciones sobre tu cuenta. Si no recuerdas tu contraseña actual, por favor, reestablece
          la constraseña lo antes posible mediante los mecanismos facilitados
        </Typography>
        <TextField
          fullWidth
          label="Contraseña actual"
          variant="outlined"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={pass ?? ''}
          onChange={handleChange}
          required={true}
          slotProps={{
            input: {
              endAdornment: inputPropShowPassword()
            }
          }}
        />
        </DialogContent>
        <DialogActions>
        <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end'}}>
            <ButtonCustom
              title='Guardar'
              loading={false}
              color='secondary'
              onClick={() => handleSubmit()}
              disable={false}
            />
          </Grid>
        </DialogActions>
    </CustomDialog>
  )
}

export default ModalCheckPassComponent
