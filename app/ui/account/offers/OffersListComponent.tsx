import { Box, TablePagination, } from '@mui/material';
import { OfferDTO } from '@prisma/client';
import React, { useEffect } from 'react'
import EditOfferComponent from './edit/EditOfferComponent';
import SnackbarCustom, { SnackbarCustomProps } from '../../shared/custom/components/snackbarCustom';
import { Session } from 'next-auth';
import OfferCardComponent from './OfferCardComponent';
import Link from 'next/link';
import PaginationComponent from '../../shared/custom/components/pagination/PaginationComponent';

type OffersListComponentProps = {
  session: Session;
  offers: OfferDTO[] | [];
}

const OffersListComponent: React.FC<OffersListComponentProps> = (
  { session, offers }
) => {
  const [paginatedOffers, setPagginatedOffers] = React.useState<OfferDTO[]>(offers);
  const [page, setPage] = React.useState(0);
  const rowsPerPage = 5;
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

  const handleEditSuccess = (offer: OfferDTO) => {
    setOfferSelected(null);
    // set the new Offer in the list in the same position as the previous one
    const index = offers.findIndex(o => o.id === offer.id);
    if (index !== -1) {
      const updatedOffers = [...offers];
      updatedOffers[index] = offer;
      const updatedOffersOrderedByIsFeaturedAndCreatedAt = updatedOffers.sort((a, b) => {
        if (a.isFeatured === b.isFeatured) {
          return b.createdAt.toISOString().localeCompare(a.createdAt.toISOString());
        }
        return a.isFeatured ? -1 : 1;
      });
      setPagginatedOffers(updatedOffersOrderedByIsFeaturedAndCreatedAt.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
    }
  }

  const handleDelete = (offer: OfferDTO) => {
    console.log('delete', offer);
  }

  const handleOnPageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
    const paginatedOffers = offers.slice(newPage * rowsPerPage, newPage * rowsPerPage + rowsPerPage);
    setPagginatedOffers(paginatedOffers);
  }

  useEffect(() => {
    if(!offers || offers.length == 0) return;
    const paginatedOffers = offers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    setPagginatedOffers(paginatedOffers);
  }, [offers, page])

  return (
    <>
      {offerSelected && (
        <EditOfferComponent 
          open={open}
          setOpen={() => setOpen(!open)}
          setSnackbarProps={handleSnackbarSons}
          offer={offerSelected} 
          onSuccess={handleEditSuccess}
        />
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: {xs: 2, md: 0}, mr: {xs: 1, md: 0}, ml: {xs: 1, md: 0}}}>
        {paginatedOffers.map((offer) => (
          <Link 
            key={offer.id} 
            href={`/account-company/offers/${offer.id}`} 
            style={{ textDecoration: 'none', color: 'inherit'}}
            >
            <div
              onClick={(e) => {
                //Prevent the event from bubbling up the DOM tree, preventing any parent handlers from being notified of the event.
                e.stopPropagation();
              }}
            >
              <OfferCardComponent key={offer.id} session={session} offer={offer} handleEdit={handleEdit} handleDelete={handleDelete} />
            </div>
          </Link>
        ))} 
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: {xs: 'center', md: 'flex-end'},
          alignItems: 'center',
          mt: 2,
          mb: 2
        }}
      >
        <PaginationComponent
          count={offers.length}
          rowsPerPage={rowsPerPage}
          currentPage={page}
          handleRowsPerPageChange={() => {}}
          rowsPerPageOptions={[3,5,10,15,20]}
        />
      </Box>
      <SnackbarCustom {...snackbarProps}/>
    </>
  )
}
export default OffersListComponent