'use client';
import React from 'react'
import Grid from '@mui/material/Grid2'
import SubscriptionCard from '../../shared/custom/components/subscription/SubscriptionCard';
import { Plan } from '@/lib/definitions';
import SubscriptionCardSkeleton from '../../shared/custom/components/skeleton/SubscriptionCardSkeleton';
import { getAllPlans } from '@/lib/data/plan';
import { useQuery } from '@tanstack/react-query';
import { SubscriptionDTO } from '@prisma/client';
import { getSubscriptionByUserIdAndActive } from '@/lib/data/subscriptions';

export type SubscriptionsPlansProps = {
  activePlanId: number;
}

const SubscriptionsPlans: React.FC<SubscriptionsPlansProps> = ({activePlanId}) => {
  const { data, isLoading, isError } = useQuery({queryKey: ['plans'], queryFn: () => getAllPlans()});
  
  return (
    <div>
      <Grid container spacing={3} justifyContent="center" mt={3}>
        {!isLoading && data ? (
          data?.map((plan: Plan, index: number) => (
              <Grid size={{xs: 12, sm: 6, lg: 3}} key={index}>
                <SubscriptionCard
                  plan={plan}
                  selected={plan.id === activePlanId}
                  onSelectPlan={() => console.log('Plan selected')}
                />
              </Grid>
            ))
        ) : (
          [...Array(4)].map((_, index) => (
            <Grid size={{xs: 12, sm: 6, lg: 3}} key={index}>
              <SubscriptionCardSkeleton />
            </Grid>
          ))
        )}
      </Grid>
    </div>
  )
}

export default SubscriptionsPlans;
