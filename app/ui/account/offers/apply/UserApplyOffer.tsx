'use client';
import ButtonCustom from '@/app/ui/shared/custom/components/button/ButtonCustom';
import { SnackbarCustomProps } from '@/app/ui/shared/custom/components/snackbarCustom';
import useMediaQueryData from '@/app/ui/shared/hooks/useMediaQueryData';
import { OFFER_APPLY_INFO_MESSAGE } from '@/lib/constants';
import { createApplicationOffer, existsApplicationOfferByPerson } from '@/lib/data/applicationOffers';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { ApplicationOffer, ApplicationOfferDTO } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';
import { Session } from 'next-auth';
import React from 'react'
import { set } from 'zod';

type UserApplyOfferProps = {
  session: Session | null;
  offerId: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  setSnackbarProps: (snackbarProps: Partial<SnackbarCustomProps>) => void;
}

const UserApplyOffer: React.FC<UserApplyOfferProps> = (
  {session, offerId, open, setOpen, setSnackbarProps}
) => {
  const { mediaQuery } = useMediaQueryData();
  const queryClient = useQueryClient();
  const applyToOffer = async () => {
    try {
      const res: boolean = await existsApplicationOfferByPerson(session?.user.personId ?? 0, offerId);
      if (res) {
        setSnackbarProps({
          open: true,
          message: 'Ya estás inscrito en esta oferta',
          severity: 'error'
        });
        return;
      }
      const personId = session?.user.personId;
      const application = {
        id: 0,
        offerId,
        personId: personId ?? 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'PENDING'
      }
      await createApplicationOffer(application);
      setSnackbarProps({
        open: true,
        message: 'Inscripción realizada con éxito',
        severity: 'success'
      });
      queryClient.invalidateQueries({
        queryKey: ['existsApplicationOfferByPerson', personId, offerId]
      });
      setOpen(false);
    } catch (error) {
      setSnackbarProps({
        open: true,
        message: 'Error al inscribirse en la oferta',
        severity: 'error'
      });
    }
  }



  return (
    <Dialog
      open={open} 
      onClose={() => setOpen(false)}
      aria-labelledby="create-offers-modal"
      aria-describedby="Allows companies to creates offers"
      PaperProps={{
        style: {
          width: mediaQuery ? '60%' : '800%',
          maxWidth: '100%',
          maxHeight: '100%',
          margin: 0,
          overflow: 'scroll'
        }
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <DialogTitle sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 2}}>
        Inscribir a la oferta
      </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: '80%'}}>
          <DialogContentText fontSize={12}>
            {OFFER_APPLY_INFO_MESSAGE}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonCustom 
            onClick={() => {
              setOpen(false);
            }}
            title='Volver'
            loading={false}
            disable={false}
            type='button'
            color='secondary'
          />
          <ButtonCustom 
            onClick={() => {
              applyToOffer();
            }}
            title='Inscribirme'
            loading={false}
            disable={false}
            type='button'
            color='primary'
          />
        </DialogActions>
      </Dialog>
  )
}

export default UserApplyOffer
