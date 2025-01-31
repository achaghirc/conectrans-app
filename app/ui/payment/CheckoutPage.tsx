'use client';
import ButtonCustom from "@/app/ui/shared/custom/components/button/ButtonCustom";
import ConectransLogo from "@/app/ui/shared/logo/conectransLogo";
import { PAYMENT_ERROR_MESSAGE, PAYMENT_ERROR_TITLE, PAYMENT_SUCCESS_MESSAGE, PAYMENT_SUCCESS_TITLE } from "@/lib/constants";
import { updatePaymentTransactionInfo, updateTransactionData } from "@/lib/data/transactions";
import { Box, Paper, Tooltip, Typography } from "@mui/material";
import { Transaction, TransactionDTO, UserDTO } from "@prisma/client";
import { useRouter } from "next/navigation";
import useMediaQueryData from "../shared/hooks/useMediaQueryData";
import { CheckCircleOutline, ErrorOutline } from "@mui/icons-material";
import { useCallback, useEffect } from "react";
import { TransactionStatusEnum } from "@/lib/enums";
import useLocalStorage from "../shared/hooks/useLocalStorage";
import { set } from "nprogress";

type CheckoutPageProps = {
  success: boolean;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  success,
}) => {
  const { storedValue, removeValue } = useLocalStorage('transactionId', '');
  const { mediaQuery } = useMediaQueryData();
  const router = useRouter();

  const handleContinue = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (success) {
      router.push('/');
    } else {
      await handleRejection();
      router.push('/account-company/subscriptions');
    }
  }

  const handleRejection = useCallback(async () => {
    if (storedValue == '') {
      console.log('No transactionId stored');
      return;
    }
      const transaction : Partial<Transaction> = {
        id: Number(storedValue),
        status: TransactionStatusEnum.FAILED,
      }
      await updateTransactionData(transaction as Transaction);
      removeValue();
  }, [storedValue, removeValue]);

  useEffect(() => {
    if (!success) {
      handleRejection();
    }
  },[success, handleRejection])

  return (
    <Box
      component={'form'}
      onSubmit={handleContinue}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100vh',
      }}
    >
      <Box component={'div'} 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          mx: 'auto', 
          width: {sx: '100%', md: '50%'}, 
          mt: 2, 
          gap: 4, 
          p: 2 
        }}>
        <Paper elevation={3} sx={{ p: 4}}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <ConectransLogo 
                width={mediaQuery ? '15%' : '30%'} 
                height={'auto'} 
                fill='white' 
              />
              <Tooltip title={success ? PAYMENT_SUCCESS_TITLE : PAYMENT_ERROR_TITLE}>
                {success ? 
                  <CheckCircleOutline color="success" sx={{ mr: 2 }} /> :
                  <ErrorOutline color="error" sx={{ mr: 2 }} />
                }
              </Tooltip>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 2,
                ml: {xs: 1, md: 2},

              }}
              >
                
                <Typography variant="h5" component={"h1"} textAlign={'start'} fontWeight={400}>
                  {success ? PAYMENT_SUCCESS_TITLE : PAYMENT_ERROR_TITLE}
                </Typography>

                <Typography variant="body1" component={"p"} textAlign={'start'} fontWeight={400}>
                  {success ? PAYMENT_SUCCESS_MESSAGE  : PAYMENT_ERROR_MESSAGE}
                </Typography>
                <ButtonCustom 
                  title="Continuar"
                  loading={false}
                  disable={false}  
                  variant="contained" 
                  color="primary" 
                  type="submit"
                />
                <ButtonCustom 
                  title="Volver"
                  loading={false}
                  disable={false}  
                  variant="outlined" 
                  color="secondary" 
                />
              </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default CheckoutPage
