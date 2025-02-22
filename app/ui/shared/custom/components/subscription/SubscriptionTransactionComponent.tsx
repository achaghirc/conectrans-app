import { getTransactionsBySubscriptionId } from '@/lib/data/transactions';
import { CheckCircleOutline, CloseOutlined, CreditCardOffOutlined, FirstPageOutlined, KeyboardArrowLeftOutlined, KeyboardArrowRightOutlined, LastPageOutlined, PaymentsOutlined, RemoveShoppingCartOutlined, WarningOutlined } from '@mui/icons-material';
import { Box, Dialog, DialogContent, DialogTitle, FormGroup, Icon, IconButton, MenuItem, Pagination, Paper, Select, SelectChangeEvent, Stack, SxProps, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Tooltip, useTheme } from '@mui/material';
import { TransactionDTO } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TransactionStatusEnum } from '@/lib/enums';
import React from 'react';
import { PAYMENT_CANCEL_MESSAGE, PAYMENT_CANCEL_MESSAGE_CONFIRM, PAYMENT_CANCELED_MESSAGE, PAYMENT_ERROR_MESSAGE, PAYMENT_REFOUND_MESSAGE, PAYMENT_SUCCESS_TITLE } from '@/lib/constants';
import useMediaQueryData from '../../../hooks/useMediaQueryData';
import { GeneralDialogComponent } from '../dialog/GeneralDialogComponent';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { SnackbarCustomProps } from '../snackbarCustom';
import PaginationComponent from '../pagination/PaginationComponent';
dayjs.locale('es');

type SubscriptionTransactionComponentProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  subscriptionId: number;
  handleSnackbarSons: (snackbarProps: Partial<SnackbarCustomProps>) => void;
}


const SubscriptionTransactionComponent: React.FC<SubscriptionTransactionComponentProps> = (
  {open, setOpen, subscriptionId, handleSnackbarSons}
) => {
  const { mediaQuery } = useMediaQueryData();
  const queryClient = useQueryClient();

  const [selectedTransaction, setSelectedTransaction] = React.useState<TransactionDTO | undefined>();
  const [openDialog, setOpenDialog] = React.useState(false);

  const { data: transactions, isError, isLoading } = useQuery({
    queryKey: ['transactions', subscriptionId],
    queryFn: (): Promise<TransactionDTO[] | undefined> => getTransactionsBySubscriptionId(subscriptionId)
  })

  if(isLoading) {
    return <div>Loading...</div>
  }
  if(isError) {
    return <div>Error...</div>
  } 

  const handleShow = (transaction: TransactionDTO) => {
    setSelectedTransaction(transaction);
    setOpenDialog(true);
  }

  const handleCancelTransaction = async () => {
    if (!selectedTransaction) return;
    console.log('Cancel transaction', selectedTransaction);
    const res = await fetch('/api/payment_refound', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        transactionId: selectedTransaction.id,
        payment_intent: selectedTransaction.stripe_payment_intent_id,
      }),
    });
    const data = await res.json();
    if (res.status != 200) {
      const severity = res.status == 400 ? 'warning' : 'error';
      console.log('Error cancel transaction', data);
      handleSnackbarSons({message: data.error, open: true, severity: severity});
      setOpenDialog(false);
      return;
    }
    if (data && data == 'OK'){
      console.log('Refund success');
      queryClient.invalidateQueries({queryKey: ['transactions', subscriptionId]});
      handleSnackbarSons({message: PAYMENT_CANCELED_MESSAGE, open: true, severity: 'success'});
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xl"
        fullScreen={!mediaQuery}
        fullWidth
        >
        <DialogTitle>
          Historial de transacciones
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', right: 10, top: 10 }}
            >
            <CloseOutlined color='error' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TablePaginatedComponent 
            rows={transactions ?? []}
            handleShow={() => {}}
            handleCancelTransaction={handleShow}
            />
        </DialogContent>
      </Dialog>
      <GeneralDialogComponent
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        title='Cancelar y devolución de la transacción'
        message={PAYMENT_CANCEL_MESSAGE_CONFIRM}
        handleAccept={handleCancelTransaction}
      />
    </>
  )
}
export default SubscriptionTransactionComponent






type TablePaginatedActionProps = { 
  // Define props here
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}
type TablePaginatedComponentProps = { 
  rows: TransactionDTO[];
  handleShow: (transaction: TransactionDTO) => void;
  handleCancelTransaction: (transaction: TransactionDTO) => void;
}

function TablePaginationActions(props: TablePaginatedActionProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };
  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageOutlined /> : <FirstPageOutlined />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRightOutlined /> : <KeyboardArrowLeftOutlined />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeftOutlined /> : <KeyboardArrowRightOutlined />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageOutlined /> : <LastPageOutlined />}
      </IconButton>
    </Box>
  );
}

const TablePaginatedComponent: React.FC<TablePaginatedComponentProps> = (
  { rows, handleShow, handleCancelTransaction}
) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | React.ChangeEvent<unknown> | null,
    newPage: number,
  ) => {
    event?.preventDefault();
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: SelectChangeEvent<any>,
  ) => {
    const targetPageNumber = Number(event.target.value);
    setRowsPerPage(targetPageNumber);
    setPage(0);
  };

  const fileActions = (row: TransactionDTO) => {
    const status = row.status;
  
    if (status === TransactionStatusEnum.PENDING || status === TransactionStatusEnum.FAILED) {
      return (
        <Tooltip title={PAYMENT_ERROR_MESSAGE}>
          <WarningOutlined color="warning" />
        </Tooltip>
      )
    } else if (status === TransactionStatusEnum.PAID) {
      return (
        <Tooltip title={PAYMENT_SUCCESS_TITLE}>
          <CheckCircleOutline color="success" sx={{
            pointerEvents: 'none',
          }}/>
        </Tooltip>
      )
    } else {
      return (
        <Tooltip title={PAYMENT_REFOUND_MESSAGE}>
          <RemoveShoppingCartOutlined color="action" />
        </Tooltip>
      )
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case TransactionStatusEnum.PENDING:
        return 'Pendiente';
      case TransactionStatusEnum.PAID:
        return 'Pagado';
      case TransactionStatusEnum.FAILED:
        return 'Fallido';
      case TransactionStatusEnum.REFUNDED:
        return 'Reembolsado';
      default:
        return 'Desconocido';
    }
  }
    
  return (
    <Box sx={{ pl: {xs: 1, sm: 0}, pr: {xs: 1, sm: 0} }}>
      <TableContainer component={Paper} sx={{ width: '100%', overflow: 'auto'}}>
        <Table sx={{ minWidth: '100%' }} aria-label="simple table">
          <TableHead sx={{ display: {xs: 'none', sm: 'table-header-group', bgcolor: 'Highlight', color: 'white'}}}>
            <TableRow>
              <TableCell align="center">Plan</TableCell>
              <TableCell align="center">Importe</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Ofertas pagadas</TableCell>
              <TableCell align="center">Fecha de realización</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
            
          </TableHead>
          <TableHead sx={{ display: {xs: 'flex', sm: 'none'}, flexDirection: {xs: 'column'}}}>
            <TableRow>
              <TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="left">Plan</TableCell>
              <TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="right">Importe</TableCell>
              <TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="right">Estado</TableCell>
              <TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="right">Ofertas pagadas</TableCell>
              <TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="right">Fecha de realización</TableCell>
              <TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{ 
              display: {xs: 'flex', sm: 'table-row-group'},
              flexDirection: {xs: 'column', sm: 'row'},
            }}
            >
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row: TransactionDTO, index: number) => (
              <TableRow 
                key={row.id || index}
                sx={{
                  borderBottom: index % 2 != 0 ? '1px solid #ffffff' : '1px solid rgb(239, 239, 239)',
                  backgroundColor: {xs: index % 2 != 0 ? '#F1F1F1' : '#ffffff', sm: 'inherit'},
                  '&:last-child td, &:last-child th': { border: 0 },
                  cursor: 'pointer',
                  //Generate Onclick efect
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    transition: 'all 0.3s',
                  },
                }}
                onClick={() => handleShow(row)}
              >
                <TableCell sx={tableCellStyles} component="th" scope="row" align='center'>
                  <Box component={'span'} sx={cellHeaderMobile}>Nombre</Box>{row.Plan?.title ?? ''}
                </TableCell>
                <TableCell sx={tableCellStyles} align="center">
                  <Box component={'span'} sx={cellHeaderMobile} >Importe</Box>{`${row.amount} ${row.currency}`}
                </TableCell>
                <TableCell sx={tableCellStyles} align="center">
                  <Box component={'span'} sx={cellHeaderMobile} >Estado</Box>{getStatusText(row.status)}
                </TableCell>
                <TableCell sx={tableCellStyles} align="center">
                  <Box component={'span'} sx={cellHeaderMobile} >Ofertas pagadas</Box>{row.paidOffers}
                </TableCell>
                <TableCell sx={tableCellStyles} align="center">
                  <Box component={'span'} sx={cellHeaderMobile} >Fecha de realización</Box>{row.updatedAt ? dayjs(row.updatedAt).format('DD/MM/YYYY') : ''}
                </TableCell>
                <TableCell sx={tableCellStyles} align="center">
                  <Box component={'span'} sx={cellHeaderMobile} >Acciones</Box>
                  <FormGroup row sx={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {fileActions(row)}
                    {
                      dayjs().diff(dayjs(row.updatedAt), 'day') < 14 && row.status === TransactionStatusEnum.PAID && (
                        <Tooltip title={PAYMENT_CANCEL_MESSAGE}>
                          <IconButton onClick={() => handleCancelTransaction(row)}>
                            <CreditCardOffOutlined color='error'/>
                          </IconButton>
                        </Tooltip>
                      )
                    }
                  </FormGroup>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Stack sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }} direction='row' spacing={1}>
          <PaginationComponent
            count={Math.ceil(rows.length / rowsPerPage)} 
            currentPage={page + 1} 
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5,10,15,20]}
            handleRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Stack>
      </TableContainer>
    </Box>
  );
}

const cellHeaderMobile: SxProps = {
  display: {xs: 'block', sm: 'none'},
  fontWeight: 'bold',
}

const tableCellStyles: SxProps = {
  display: {xs: 'flex', sm: 'table-cell'},
  flexDirection: {xs: 'row', sm: 'column'},
  justifyContent: 'space-between',
}
