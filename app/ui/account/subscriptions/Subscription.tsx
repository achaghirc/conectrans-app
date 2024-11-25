'use client';

import { Avatar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { Session } from "next-auth";
import SubscriptionCard from "../../shared/custom/components/subscription/SubscriptionCard";
import { Plan } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { getAllPlans } from "@/lib/data/plan";
import { useQuery } from "@tanstack/react-query";
import Grid from "@mui/material/Grid2";
import { Suspense } from "react";
import SubscriptionCardSkeleton from "../../shared/custom/components/skeleton/SubscriptionCardSkeleton";
import { AccountBalanceOutlined, BusinessCenterOutlined, CancelOutlined, ChatBubbleOutlined, ChatBubbleTwoTone, ChatOutlined, ContactMailOutlined, EditOutlined, RemoveShoppingCartOutlined } from "@mui/icons-material";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { getSubscriptionByUserIdAndActive } from "@/lib/data/subscriptions";
import SubscriptionItemComponent from "../../shared/custom/components/subscription/SubscriptionItemComponent";
import SubscriptionMenuSkeleton from "../../shared/custom/components/skeleton/SubscriptionMenuSkeleton";
import { SubscriptionDTO } from "@prisma/client";
import SubscriptionsPlans from "./SubscriptionsPlans";
dayjs.extend(LocalizedFormat);

export type SubscriptionsPageProps = {
  session: Session | null;
};

const SubscriptionComponent: React.FC<SubscriptionsPageProps> = ({ session }) => {
  const router = useRouter();
  
  if (!session) {
    return;
  }
  
  const { data: subscription, isLoading: subscriptionLoading, isError: isSubscriptionError } = useQuery({queryKey: ['userPlan', session?.user.id], queryFn: (): Promise<SubscriptionDTO | undefined> => getSubscriptionByUserIdAndActive(session?.user.id ?? '')});

  if (subscriptionLoading) {
    return (
    <Box>
      <SubscriptionMenuSkeleton />;
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
    <Box>
      <Box 
        sx={{
          mt: 3,
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          minWidth: '100%',
          minHeight: 200,
          borderRadius: 3,
        }}
      > 
        <Grid container spacing={4} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 2}}>
          <Grid size={{xs: 6, sm: 6, md: 6}}>
            <Typography variant="h4" component={"h1"} fontWeight={900}>Subscripción</Typography>
          </Grid>
          <Grid size={{xs: 6, sm: 6, md: 6}} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ display: { xs: 'flex', sm: 'none'}, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 1}}>
              <IconButton>
                <ChatBubbleOutlined color="action"/>
              </IconButton>
              <IconButton>
                <RemoveShoppingCartOutlined color="error"/>
              </IconButton>
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
                Contáctanos
              </Button>
              <Button 
                startIcon={<RemoveShoppingCartOutlined />}
                variant="contained"
                color="error"
                sx={{ display: { xs: 'none', sm: 'flex'}, 
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textTransform: 'capitalize', borderRadius: 5, fontWeight: 'bold'}}
              >
                Cancelar suscripción
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Grid 
          container mt={1} 
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
          <Grid size={{ xs: 12, sm: 6, md: 4}}>
            <SubscriptionItemComponent
              icon={<BusinessCenterOutlined color="action"/>}
              title={'Plan actual'}
              text={subscription?.Plan.title.toString()?? ''}
              principal
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4}}>
            <SubscriptionItemComponent
              icon={<AccountBalanceOutlined color="action"/>}
              title={'Coste'}
              text={`${subscription?.Plan.price ?? '0'}€/mes`}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4}}>
            <SubscriptionItemComponent
              icon={<AccountBalanceOutlined color="action"/>}
              title={'Fecha renovación'}
              text={dayjs(subscription?.endDate).format('LL')}
            />
          </Grid>
        </Grid>
      </Box>
      <SubscriptionsPlans activePlanId={subscription?.Plan.id ?? 0} />
    </Box>
  )
}

export default SubscriptionComponent;
