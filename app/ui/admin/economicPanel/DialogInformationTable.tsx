'use client';
import React from 'react'
import { fromValueSubscription } from '@/lib/enums';
import { SubscriptionDataDTO } from '@prisma/client';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormGroup, IconButton } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import TableCustomPanel from '../../shared/custom/components/table/TableCustomPanel';
import ButtonCustom from '../../shared/custom/components/button/ButtonCustom';
import dayjs from 'dayjs';
import useMediaQueryData from '../../shared/hooks/useMediaQueryData';
dayjs.locale('es');

type SubscriptionAdminTableInformationProps = {
  data: Record<string, any>[]; 
  contentText?: string;
  open: boolean;
  setOpen: (value: boolean) => void; 
}

export const DetailsAdminTableInformation: React.FC<SubscriptionAdminTableInformationProps> = (
  { data, contentText, open, setOpen }
) => {

  const { mediaQuery } = useMediaQueryData();

  if (!data) return null;

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={setOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        fullScreen={!mediaQuery}
        maxWidth='lg'
      >
        <DialogTitle id="alert-dialog-title">
          Detalles de la subscrición
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {contentText ?? ''}
          </DialogContentText>
          <TableCustomPanel data={data} />
        </DialogContent>
        <DialogActions>
          <ButtonCustom
            variant='outlined'
            title='Cancelar'
            color='secondary'
            onClick={() => setOpen(false)} 
            loading={false}
            disable={false}
          />
          <ButtonCustom 
            variant='contained' 
            onClick={() => {
              
            }}
            color='primary'
            title='Aceptar'  
            loading={false}
            disable={false}
          />
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}