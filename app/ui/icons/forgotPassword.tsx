
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import ButtonCustom from '../shared/custom/components/button/ButtonCustom';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          handleClose();
        },
      }}
    >
      <DialogTitle>Reestablecer contraseña</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Introduce la cuenta de email de tu cuenta y te enviaremos un enlace para
          reestablecer tu contraseña.
        </DialogContentText>
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          label="Email address"
          placeholder="Email address"
          type="email"
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <ButtonCustom 
          title='Cerrar'
          color='secondary'
          variant='outlined'
          onClick={handleClose}
          loading={false}
          disable={false}
        />
        <ButtonCustom 
          variant="contained" 
          type="submit"
          color="primary"
          onClick={handleClose}   
          loading={false}
          disable={false}
          title='Continuar'       
        />
      </DialogActions>
    </Dialog>
  );
}
