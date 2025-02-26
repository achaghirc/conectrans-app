import { getTransactionsBySubscriptionId } from '@/lib/data/transactions';
import { CheckCircleOutline, CloseOutlined, CreditCardOffOutlined, RemoveShoppingCartOutlined, WarningOutlined } from '@mui/icons-material';
import { Alert, Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material';
import { TransactionDTO } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TransactionStatusEnum } from '@/lib/enums';
import React, { useCallback, useMemo, useState } from 'react';
import { PAYMENT_CANCEL_MESSAGE_CONFIRM, PAYMENT_CANCELED_MESSAGE, PAYMENT_ERROR_MESSAGE, PAYMENT_REFOUND_MESSAGE, PAYMENT_SUCCESS_TITLE } from '@/lib/constants';
import useMediaQueryData from '../../../hooks/useMediaQueryData';
import { GeneralDialogComponent } from '../dialog/GeneralDialogComponent';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { SnackbarCustomProps } from '../snackbarCustom';
import TableCustomPanel from '../table/TableCustomPanel';
dayjs.locale('es');

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  subscriptionId: number;
  handleSnackbarSons: (snackbarProps: Partial<SnackbarCustomProps>) => void;
}


const getFileActions = (row: TransactionDTO) => {
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

const CenteredBox = ({ children }: { children: React.ReactNode }) => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100%">{children}</Box>
);
const SubscriptionTransactionComponent: React.FC<Props> = (
  {open, setOpen, subscriptionId, handleSnackbarSons}
) => {
  const { mediaQuery } = useMediaQueryData();
  const queryClient = useQueryClient();
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDTO | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const { data: transactions, isError, isLoading, isFetched } = useQuery({
    queryKey: ['transactions', subscriptionId],
    queryFn: (): Promise<TransactionDTO[] | undefined> => getTransactionsBySubscriptionId(subscriptionId)
  })

  const handleShow = useCallback((transaction: TransactionDTO) => {
    setSelectedTransaction(transaction);
    setOpenDialog(true);
  },[]);

  const handleCancelTransaction = async () => {
    if (!selectedTransaction) return;
    try {
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
      if (!res.ok) {
        handleSnackbarSons({ message: data.error, open: true, severity: res.status === 400 ? 'warning' : 'error' });
      } else {
        queryClient.invalidateQueries({queryKey: ['transactions', subscriptionId]});
        handleSnackbarSons({ message: PAYMENT_CANCELED_MESSAGE, open: true, severity: 'success' });
      }
    } catch (error) {
      console.log('Error cancel transaction', error);
      handleSnackbarSons({message: 'Error cancel transaction', open: true, severity: 'error'});
    } finally {
      setOpenDialog(false);
    }
  }

  const tableData = useMemo(() => transactions?.map(transaction => ({
    ID: { content: transaction.id },
    Plan: { content: transaction.Plan?.title ?? '' },
    Importe: { content: `${transaction.amount} ${transaction.currency}` },
    Estado: { content: getStatusText(transaction.status) },
    'Ofertas pagadas': { content: transaction.paidOffers },
    'Fecha de realización': { content: transaction.updatedAt ? dayjs(transaction.updatedAt).format('DD/MM/YYYY') : '' },
    Acciones: {
      content: (
        <>
          {getFileActions(transaction)}
          {dayjs().diff(dayjs(transaction.updatedAt), 'day') < 14 && transaction.status === TransactionStatusEnum.PAID && (
            <Tooltip title="Cancelar Pago">
              <IconButton onClick={() => handleShow(transaction)}>
                <CreditCardOffOutlined color='error' />
              </IconButton>
            </Tooltip>
          )}
        </>
      )
    }
  })) || [], [transactions, handleShow]);
  
  if (isLoading) return <CenteredBox><CircularProgress /></CenteredBox>;
  if (isError) return <CenteredBox><Alert severity="error">Error cargando las transacciones...</Alert></CenteredBox>;

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xl" fullScreen={!mediaQuery} fullWidth>
        <DialogTitle>
          Historial de transacciones
          <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 10, top: 10 }}>
            <CloseOutlined color='error' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TableCustomPanel data={tableData} onClick={() => {}} />
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
  );
};
export default SubscriptionTransactionComponent