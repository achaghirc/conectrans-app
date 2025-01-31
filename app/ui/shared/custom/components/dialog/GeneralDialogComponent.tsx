import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ButtonCustom from '../button/ButtonCustom';

type AlertDialogProps = {
  title: string;
  message: string;
  open: boolean;
  handleClose: () => void;
  handleAccept: () => void;
}

export const GeneralDialogComponent: React.FC<AlertDialogProps> = (
  {title, message, open, handleClose, handleAccept}
) => {
  const [loading, setLoading] = React.useState(false);

  React.useEffect (() => {
    return () => {
      setLoading(false);
    }
  }, []);

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonCustom 
            variant='outlined'
            title='Cancelar'
            color='secondary'
            onClick={handleClose} 
            loading={false}
            disable={false}
          />
          <ButtonCustom 
            variant='contained' 
            onClick={() => {
              setLoading(true);
              handleAccept();
              setTimeout(() => {
                setLoading(false);
                handleClose();
              }, 10000);
            }}
            color='primary'
            title='Aceptar'  
            loading={loading}
            disable={false}
          />
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}