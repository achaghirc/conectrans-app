import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import React, { Suspense } from 'react'
import Grid from '@mui/material/Grid2';
import { Card, CardContent, CardHeader, Skeleton, Typography } from '@mui/material';
import { AccountBalanceOutlined, AccountTreeOutlined, BusinessOutlined, CardMembershipOutlined, EuroOutlined, LocalOffer, PaymentOutlined, PeopleOutline, WalletOutlined } from '@mui/icons-material';
import TableAdminPanel from '../ui/shared/custom/components/table/TableAdminPanel';
import { getActiveOffers, getActiveSubscriptions, getCompanies, getDrivers, getTotalIncome, getTransactionsPaid } from '@/lib/data/dashboardAdmin';
import { getTransactionsByFilter } from '@/lib/data/transactions';
import { FilterTransactionsDTO } from '@/lib/definitions';
import TransactionsAdminTable from '../ui/admin/economicPanel/TransactionsAdminTable';
import SubscriptionAdminTable from '../ui/admin/economicPanel/SubscriptionAdminTable';
import { Decimal } from '@prisma/client/runtime/library';
import { auth } from '@/auth';
/**
 * DASHBOARD ECONOMIC PANEL FOR ADMIN
 */
const queryClient = new QueryClient();
export default async function Page() {

  const session = await auth();
  if (!session || session.user.roleCode != 'ADMIN') {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: true,
      },
    };
  };

  const totalIncome = await getTotalIncome();
  const paidTransactions = await getTransactionsPaid();
  const activeOffers = await getActiveOffers();
  const activeSubscriptions = await getActiveSubscriptions();
  const activeCompanies = await getCompanies();
  const activeDrivers = await getDrivers();
  
  const filter: FilterTransactionsDTO ={
    status: 'PAID',
  }

  const transactions = await queryClient.fetchQuery({
    queryKey: ['transactions'],
    queryFn: () => getTransactionsByFilter(filter),
  });
  const dehydratedState = dehydrate(queryClient);

  const formatCurrencyEur = (value: Decimal | number | null | undefined) => {
    if (!value) return '0,00 €';
    const numberValue = typeof value === 'number' ? value : Number(value);
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(numberValue);
  }


  return (
    <HydrationBoundary state={dehydratedState}>
      <div>
        <h1>Dashboard Panel económico</h1>
        <Grid container spacing={2}>
          <Grid size={{xs: 12, md: 6, lg: 3}}>
            <Suspense fallback={<SkeletonCardComponent />}>
              <SimpleCardComponent 
                title="Ingreso total" 
                text={`${formatCurrencyEur(totalIncome)}`}
                icon={<AccountBalanceOutlined color='primary'/>}
                />
              </Suspense>
          </Grid>
          <Grid size={{xs: 12, md: 6, lg: 3}}>
            <Suspense fallback={<SkeletonCardComponent />}>
              <SimpleCardComponent 
                title="Transacciones pagadas" 
                text={`${paidTransactions}`}
                icon={<AccountTreeOutlined color='primary' />}
              />
            </Suspense>
          </Grid>
          <Grid size={{xs: 12, md: 6, lg: 3}}>
            <Suspense fallback={<SkeletonCardComponent />}>
              <SimpleCardComponent 
                title="Ofertas activas" 
                text={`${activeOffers}`}
                icon={<LocalOffer color='primary' />}
              />
            </Suspense>
          </Grid>
          <Grid size={{xs: 12, md: 6, lg: 3}}>
            <Suspense fallback={<SkeletonCardComponent />}>
              <SimpleCardComponent 
                title="Subscripciones activas" 
                text={`${activeSubscriptions}`}
                icon={<CardMembershipOutlined color='primary' />}
              />
            </Suspense>
          </Grid>
          <Grid size={{xs: 12, md: 6,}}>
            <Suspense fallback={<SkeletonCardComponent />}>
              <SimpleCardComponent 
                title="Empresas activas" 
                text={`${activeCompanies}`}
                icon={<BusinessOutlined color='primary' />}
              />
            </Suspense>
          </Grid>
          <Grid size={{xs: 12, md: 6,}}>
            <Suspense fallback={<SkeletonCardComponent />}>
              <SimpleCardComponent 
                title="Conductores activos" 
                text={`${activeDrivers}`}
                icon={<PeopleOutline color='primary' />}
              />
            </Suspense>
          </Grid>
          
          <Grid size={{xs: 12, md: 6}}>
            <Typography variant="h5" fontWeight={600} sx={{ mt: 2, mb: 2 }}>
              Transacciones
            </Typography>
            <TransactionsAdminTable />
          </Grid>
          <Grid size={{xs: 12, md: 6,}}>
          <Typography variant="h5" fontWeight={600} sx={{ mt: 2, mb: 2 }}>
              Subscripciones
            </Typography>
            <SubscriptionAdminTable />
          </Grid>

        </Grid>
      </div>
    </HydrationBoundary>
  )
}


type SimpleCardComponentProps = {
  title: string;
  text: string;
  icon?: React.ReactNode;
}

const SimpleCardComponent: React.FC<SimpleCardComponentProps> = (
  { title, text, icon }
) => {
  return (
    <Card 
      sx={{
      width: '100%',
      height: 'auto',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 5,
      }}
    >
      <CardHeader 
        title={
          <Typography variant="h6" fontWeight={400}>
            {title}
          </Typography>
        } 
        avatar={icon} 
        sx={{ 
          display: 'flex', 
          alignItems: 'center' 
        }} 
      />
      <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
        <Typography variant="h4">{text}</Typography>
      </CardContent>
    </Card>
  )
}
const SkeletonCardComponent: React.FC = () => {
  return (
    <Card 
      sx={{
      width: 'auto',
      height: 'auto',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 5,
      }}
    >
      <CardHeader 
        title={
          <Typography variant="h6" fontWeight={400}>
            <Skeleton width="80%" />
          </Typography>
        } 
        avatar={<Skeleton variant="circular" width={40} height={40} />} 
        sx={{ 
          display: 'flex', 
          alignItems: 'center' 
        }} 
      />
      <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
        <Typography variant="h4">
          <Skeleton width="60%" />
        </Typography>
      </CardContent>
    </Card>
  )
}
