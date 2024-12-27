import { Box, } from '@mui/material';
import { OfferDTO } from '@prisma/client';
import React from 'react'
import EditOfferComponent from './edit/EditOfferComponent';
import SnackbarCustom, { SnackbarCustomProps } from '../../shared/custom/components/snackbarCustom';
import { Session } from 'next-auth';
import OfferCardComponent from './OfferCardComponent';

type OffersListComponentProps = {
  session: Session;
  offers: OfferDTO[] | [];
}

const OffersListComponent: React.FC<OffersListComponentProps> = (
  { session, offers }
) => {

  const [open, setOpen] = React.useState(false);
  const [snackbarProps, setSnackbarProps] = React.useState<SnackbarCustomProps>({
    open: false,
    message: '',
    severity: 'success',
    handleClose: () => handleCloseSnackbar()
  });

  const handleCloseSnackbar = () => {
    setSnackbarProps({...snackbarProps, open: false})
  }
  const handleSnackbarSons = (snackbarProps: Partial<SnackbarCustomProps>) => {
      const {open, message, severity} = snackbarProps;
      setSnackbarProps({
        ...snackbarProps,
        open: open ?? false,
        message: message ?? '',
        severity: severity ?? 'success',
        handleClose: handleCloseSnackbar
      })
    }

  const [offerSelected, setOfferSelected] = React.useState<OfferDTO | null>(null);
  
  const handleEdit = (offer: OfferDTO) => {
    setOfferSelected(offer);
    setOpen(true);
  }
  const handleDelete = (offer: OfferDTO) => {
    console.log('delete', offer);
  }

  return (
    <>
      {offerSelected && (
        <EditOfferComponent 
          open={open}
          setOpen={() => setOpen(!open)}
          session={session}
          setSnackbarProps={() => {}}
          offer={offerSelected} 
        />
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: {xs: 2, md: 0}, mr: {xs: 1, md: 0}, ml: {xs: 1, md: 0}}}>
        {offers.map((offer) => (
          <OfferCardComponent key={offer.id} offer={offer} handleEdit={handleEdit} handleDelete={handleDelete}/>
        ))} 
      </Box>
      <SnackbarCustom {...snackbarProps}/>
    </>
  )
}
export default OffersListComponent