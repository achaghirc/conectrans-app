'use client';

import { Box, Button, CircularProgress, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Grid from "@mui/material/Grid2";
import SubscriptionCardSkeleton from "../../shared/custom/components/skeleton/SubscriptionCardSkeleton";
import { AccountBalanceOutlined, BusinessCenterOutlined, CancelOutlined, ChatBubbleOutlined, ChatBubbleTwoTone, ChatOutlined, CheckCircleOutline, CircleOutlined, CloseOutlined, ContactMailOutlined, EditOutlined, MailOutlineOutlined, MoreVertOutlined, PhoneAndroidOutlined, PhoneForwardedOutlined, RemoveShoppingCartOutlined, StarOutlineOutlined, WarningOutlined, WhatsApp } from "@mui/icons-material";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { assignPlanFreeToSubscripcition, getSubscriptionByUserIdAndActive } from "@/lib/data/subscriptions";
import SubscriptionItemComponent from "../../shared/custom/components/subscription/SubscriptionItemComponent";
import SubscriptionMenuSkeleton from "../../shared/custom/components/skeleton/SubscriptionMenuSkeleton";
import { PlanDTO, SubscriptionDTO } from "@prisma/client";
import SubscriptionsPlans from "./SubscriptionsPlans";
import { SubscriptionStatusEnum } from "@/lib/enums";
import { loadStripe } from "@stripe/stripe-js";
import { StripeSession } from "@/lib/stripe/session";
import { createTransaction, getTransactionsBySubscriptionId } from "@/lib/data/transactions";
import React, { useEffect } from "react";
import SnackbarCustom, { SnackbarCustomProps } from "../../shared/custom/components/snackbarCustom";
import { PAYMENT_TEMPORAL_MESSAGE, PAYMENT_WARN_MESSAGE, PHONE_NUMBER } from "@/lib/constants";
import SubscriptionTransactionComponent from "../../shared/custom/components/subscription/SubscriptionTransactionComponent";
import { set } from "nprogress";
import useLocalStorage from "../../shared/hooks/useLocalStorage";
import BoxIconTextInformation from "../../shared/custom/components/box/BoxIconTextInformation";
dayjs.extend(LocalizedFormat);

export type SubscriptionsPageProps = {
  session: Session | null;
};


const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

const SubscriptionComponent: React.FC<SubscriptionsPageProps> = ({ session }) => {
  const { setValue } = useLocalStorage('transactionId', ''); 
  if (!session) {
    return;
  }
  const [openDialog, setOpenDialog] = React.useState({
    transactions: false,
    delete: false,
  });
  const [openWarning, setOpenWarning] = React.useState<boolean>(false);
  const [isPaying, setIsPaying] = React.useState<boolean>(false);
  const [plan, setPlan] = React.useState<PlanDTO | undefined>(undefined);
  
  const handleCloseSnackbar = () => {
    setSnackbarProps({...snackbarProps, open: false})
  }  
  const [snackbarProps, setSnackbarProps] = React.useState<SnackbarCustomProps>({
    open: false, 
    handleClose: handleCloseSnackbar,
    message: '',
    severity: 'success'
  })
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
  const { data: subscription, isLoading: subscriptionLoading, isError: isSubscriptionError, isFetched } = useQuery({
    queryKey: ['userPlan', session?.user.id], 
    queryFn: (): Promise<SubscriptionDTO | undefined> => getSubscriptionByUserIdAndActive(session?.user.id ?? '')
  });

  useQuery({
    queryKey: ['transactions', subscription?.id ?? 0],
    queryFn: () => getTransactionsBySubscriptionId(subscription?.id ?? 0),
    enabled: !!subscription?.id,
  })

  
  useEffect(() => {
    if (isFetched) {
      if (subscription?.status !== SubscriptionStatusEnum.ACTIVE) {
        setOpenWarning(true);
      }
      setPlan(subscription?.Plan as PlanDTO);
    }
  }, [isFetched]);

  const statusStartIcon = () => {
    if (subscription?.status == SubscriptionStatusEnum.ACTIVE) {
      return <CheckCircleOutline color="info" />;
    } else if (subscription?.status == SubscriptionStatusEnum.TEMPORAL) { 
      return (
        <Tooltip title={PAYMENT_TEMPORAL_MESSAGE}>
          <WarningOutlined color="warning" />
        </Tooltip>
      ) 
    } else if (subscription?.status == SubscriptionStatusEnum.PENDING) {
      return (
        <Tooltip title={PAYMENT_WARN_MESSAGE}>
          <WarningOutlined color="warning" />
        </Tooltip>
      )
    } else {
      return <CloseOutlined color="error" />;
    }
  }
  const statusText = () => {
    switch (subscription?.status) {
      case SubscriptionStatusEnum.ACTIVE:
        return 'Activa';
      case SubscriptionStatusEnum.INACTIVE:
        return 'Inactiva';
      case SubscriptionStatusEnum.TEMPORAL:
        return 'Temporal';
      case SubscriptionStatusEnum.PENDING:
        return 'Pendiente';
      case SubscriptionStatusEnum.CANCELLED:
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  }

  const handlePlanChange = (plan: PlanDTO) => {
    setPlan(plan);
  }

  const handlePayNewPlan = async (plan: PlanDTO) => {
    if (plan.title.includes('Gratuito')) {
      await assignPlanFreeToSubscripcition(subscription?.id, session.user.id);
      handleSnackbarSons({open: true, message: 'Plan gratuito asignado correctamente', severity: 'success'});
    } else {
      await handleCheckout(plan);
    }
  }

  const handleCheckout = async (newPlan?: PlanDTO) => {
    setIsPaying(true);
    try {
      const planToSave = newPlan ?? plan;
      const stripe = await stripePromise;
      if (!stripe) { 
        return;
      }
      const userEmail = session?.user.email;
      if (!userEmail) {
        return;
      }
      if (!planToSave) {
        return;
      }

      const response = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          plan: planToSave,
          success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/account-company/subscriptions?success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/payment/checkout?success=false&planId=${planToSave.id}`,
          email: userEmail,
        }),
      });
      const stripeSession: StripeSession = await response.json();
      // When the customer clicks on the button, create a current transaction and redirect them to Checkout.
      const transaction = await createTransaction(stripeSession, planToSave, userEmail);
      if (transaction) {
        setValue(transaction.id.toString());
      }
      const result = await stripe.redirectToCheckout({
        sessionId: stripeSession.id,
      });
      if (result.error) {
        console.log(result.error.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsPaying(false);
    }
  }

  const handleOpenDeleteDialog = () => {
    console.log('Delete');
    setOpenDialog({ ...openDialog, delete: true, transactions: false });
  }

  const handleShowTransactionPayments = () => {
    console.log('Show transactions');
    setOpenDialog({ ...openDialog, transactions: true, delete: false });
  }


  if (subscriptionLoading) {
    return (
    <Box>
      <Box component='div' sx={{ display: 'flex', flexDirection: 'column', maxWidth: '100%', mb: 3, p: 2 }}>
        <Box sx={{ mt: {xs: 3, sm: 3}}}>
          <Typography variant="h3" component={"h1"} textAlign={'center'} fontWeight={'bold'}>
            Elige tu pack y maximiza tu rendimiento
          </Typography>
        </Box>
        <Box sx={{ mt: 1}}>
          <Typography variant="h6" component={"h2"} textAlign={'center'} color="text.secondary" fontWeight={'bold'}>
            Elige el pack que mejor se adapte a tus necesidades
          </Typography>
        </Box>
      </Box>
      <SubscriptionMenuSkeleton />
      <Grid container spacing={3} justifyContent="center" mt={3}>
        {
          [...Array(4)].map((_, index) => (
            <Grid size={{xs: 12, sm: 6, lg: 3}} key={index}>
              <SubscriptionCardSkeleton />
            </Grid>
          ))
        }
      </Grid>
    </Box>  

    )
  }

  return (
    <Box
      sx={{
        position: 'relative',
        ...(isPaying && {
          backgroundColor: {xs: 'rgba(184, 184, 184, 0.5)', md: 'transparent'}, // Add a semi-transparent white background
          pointerEvents: 'none', // Disable all interactions
        }),
        pr: {xs: 2, sm: 0},
        pl: {xs: 2, sm: 0}
      }}
    >
      {subscription?.status !== SubscriptionStatusEnum.ACTIVE && (
        <Button 
          startIcon={<WarningOutlined />}
          variant="contained" 
          color="warning"
          onClick={() => handleCheckout()} 
          sx={{
            width: '100%',
          }}
          >  
          Realizar pago
        </Button>
      )}
      <SnackbarCustom 
        handleClose={() => setOpenWarning(false)}
        open={openWarning}
        severity="warning"
        message={PAYMENT_WARN_MESSAGE}
        timeToClose={10000}
      />
      <Box component='div' sx={{ display: 'flex', flexDirection: 'column', maxWidth: '100%', mb: 3, p: 2 }}>
        <Box sx={{ mt: {xs: 3, sm: 3}}}>
          <Typography variant="h3" component={"h1"} textAlign={'center'} fontWeight={'bold'}>
            Elige tu pack y maximiza tu rendimiento
          </Typography>
        </Box>
        <Box sx={{ mt: 1}}>
          <Typography variant="h6" component={"h2"} textAlign={'center'} color="text.secondary" fontWeight={'bold'}>
            Elige el pack que mejor se adapte a tus necesidades
          </Typography>
        </Box>
      </Box>
      <Box>
        {isPaying &&  (
          <Box 
            sx={{ 
              display: 'flex', 
              position: 'absolute',
              top: {xs: 'auto', md: '30%'},
              left: '50%',
              zIndex: 100
            }}>
            <CircularProgress size={40} />
          </Box>
        )}
        <Box 
          sx={{
            mt: 3,
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            minWidth: '100%',
            minHeight: 200,
            borderRadius: 5,
            pb: 2
          }}
        > 
          <Grid container spacing={4} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 2}}>
            <Grid size={{xs: 6, sm: 6, md: 6}}>
              <Typography variant="h4" component={"h1"} sx={{ fontSize: { xs: 28, sm: 34}}} fontWeight={900}>Subscripción</Typography>
            </Grid>
            <Grid size={{xs: 6, sm: 6, md: 6}} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box sx={{ display: { xs: 'flex', sm: 'none'}, flexDirection: 'row', justifyContent: 'center', alignContent: 'center'}}>
                <IconButton
                  onClick={async () => {
                    await navigator.clipboard.writeText(PHONE_NUMBER);
                    handleSnackbarSons({open: true, message: 'Número de contacto copiado a portapapeles', severity: 'success'});
                  }}
                > 
                  <ChatBubbleOutlined color="action"/>
                </IconButton>
                <Tooltip placement="top" title={statusText()}>
                  <IconButton 
                    onClick={() => {
                      if (subscription?.status == SubscriptionStatusEnum.PENDING) {
                        handleCheckout();
                      }
                    }}
                  >
                    {statusStartIcon()}
                  </IconButton>
                </Tooltip>
                <SubscriptionOptionsMenu options={[
                    {
                      title: 'Ver transacciones',
                      icon: <RemoveShoppingCartOutlined color="info" />,
                      action: handleShowTransactionPayments,
                    }
                  ]}
                />
              </Box>
              <Box sx={{ display: { xs: 'none', sm: 'flex'}, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 1}}>
                <Button 
                  startIcon={<ChatOutlined />}
                  variant="outlined"
                  sx={{ textTransform: 'capitalize', 
                    borderColor: 'ButtonText', 
                    borderRadius: 5,
                    color: 'ButtonText', fontWeight: 'bold'}}
                >
                  <a style={{ textDecoration: 'none', color: 'inherit'}} href="mailto:nfo@condupro.es">Contáctanos</a>
                </Button>
                <Button 
                  startIcon={statusStartIcon()}  
                  variant="outlined"
                  sx={{ display: { xs: 'none', sm: 'flex'}, 
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textTransform: 'capitalize', borderRadius: 5, fontWeight: 'bold'}}
                  onClick={() => {
                    if (subscription?.status == SubscriptionStatusEnum.PENDING) {
                      handleCheckout();
                    }
                  }}
                >
                  {statusText()}
                </Button>
                <SubscriptionOptionsMenu options={[
                    {
                      title: 'Ver transacciones',
                      icon: <RemoveShoppingCartOutlined color="info" />,
                      action: handleShowTransactionPayments,
                    }
                  ]}
                />
              </Box>
            </Grid>
          </Grid>
          <Grid 
            container mt={1} 
            spacing={2}
            sx={{
              display: 'flex',
              flexDirection: {xs: 'column', sm: 'row'},
              justifyContent: 'flex-start',
              alignItems: 'center',
              alignContent: 'center',
              p: 2,
              mt: 1,
            }}
          >
            <Grid size={{ xs: 12, sm: 6, md: 3}}>
              <SubscriptionItemComponent
                icon={<BusinessCenterOutlined color="action"/>}
                title={'Pack actual'}
                text={subscription?.Plan.title.toString()?? ''}
                principal
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3}}>
              <SubscriptionItemComponent
                icon={<BusinessCenterOutlined color="action"/>}
                title={'Ofertas creadas'}
                text={`${subscription?.status != SubscriptionStatusEnum.ACTIVE ? 0 : subscription?.usedOffers ?? '0'}`}
                warning={subscription?.status != SubscriptionStatusEnum.ACTIVE}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3}}>
              <SubscriptionItemComponent
                icon={<BusinessCenterOutlined color="action"/>}
                title={'Ofertas restantes'}
                text={`${subscription?.status != SubscriptionStatusEnum.ACTIVE ? 0 : subscription?.remainingOffers ?? '0'}`}
                warning={subscription?.status != SubscriptionStatusEnum.ACTIVE}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3}}>
              <SubscriptionItemComponent
                icon={<StarOutlineOutlined color="action"/>}
                title={'Destacadas restantes'}
                text={`${subscription?.status != SubscriptionStatusEnum.ACTIVE ? 0 : subscription?.principalOffers ?? '0'}`}
                warning={subscription?.status != SubscriptionStatusEnum.ACTIVE}
              />
            </Grid>
          </Grid>
        </Box>
        <SubscriptionsPlans activePlanId={subscription?.Plan.id ?? 0} handleChange={handlePlanChange} handlePayNewPlan={handlePayNewPlan}/>
      </Box>
      <Box sx={{ 
        mt: 3, 
        bgcolor: '#FAFAFA', 
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        borderRadius: 5,
        p: 2
        }} >
        <Typography variant="h6" component={"h2"} textAlign={'start'} color="text.secondary" fontWeight={'bold'}>
          ¿Tienes dudas, necesitas ayuda o consultas en particular?
        </Typography>
        <Box sx={{ pt: 2, pb: 2, pr: 5, display: 'flex', justifyContent: 'space-between', flexDirection: {xs: 'column', sm: 'row' }, gap: 2}}>
          <BoxIconTextInformation
            icon={<MailOutlineOutlined />}
            text={<a style={{ textDecoration: 'none', color: 'inherit'}} href="mailto:aminechaghir1999@gmail.com">info@condupro.es</a>}
            fontSize={18}
          />
          <BoxIconTextInformation
            icon={<PhoneForwardedOutlined />}
            text={PHONE_NUMBER}
            fontSize={18}
            onClick={ async () => {
              await navigator.clipboard.writeText(PHONE_NUMBER);
              handleSnackbarSons({open: true, message: 'Copiado a portapapeles', severity: 'success'});
            }}
          />
          <BoxIconTextInformation
            icon={<WhatsApp />}
            text={PHONE_NUMBER}
            fontSize={18}
            onClick={ async () => {
              await navigator.clipboard.writeText(PHONE_NUMBER);
              handleSnackbarSons({open: true, message: 'Copiado a portapapeles', severity: 'success'});
            }}
          />
        </Box>
      </Box>
      <SubscriptionTransactionComponent 
        open={openDialog.transactions}
        setOpen={() => setOpenDialog({...openDialog, transactions: false})}        
        subscriptionId={subscription?.id ?? 0}
        handleSnackbarSons={handleSnackbarSons}
      />
      <SnackbarCustom 
        message={snackbarProps.message}
        open={snackbarProps.open}
        severity={snackbarProps.severity}
        timeToClose={6000}
        handleClose={snackbarProps.handleClose}
      />
    </Box>
  )
}

export default SubscriptionComponent;

type OptionMenu = {
  title: string;
  icon: React.ReactNode;
  action?: () => void;
}
type SubscriptionOptionsMenuProps = {
  options: OptionMenu[]
}

const SubscriptionOptionsMenu: React.FC<SubscriptionOptionsMenuProps> = (
  { options }
) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleSelectedOption = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, option: OptionMenu) => { 
    setAnchorEl(null);
    if(option.action) {
      option.action();
    }
  }

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box component={'div'}>
      <IconButton 
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertOutlined />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: 25 * 4.5,
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.title} onClick={(e:  React.MouseEvent<HTMLLIElement, MouseEvent>) => handleSelectedOption(e, option)}>
            <ListItemIcon>
              {option.icon}
            </ListItemIcon>
            <ListItemText>{option.title}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}