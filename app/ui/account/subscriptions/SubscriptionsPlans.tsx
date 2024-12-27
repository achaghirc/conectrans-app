'use client';
import React from 'react'
import Grid from '@mui/material/Grid2'
import SubscriptionCard from '../../shared/custom/components/subscription/SubscriptionCard';
import SubscriptionCardSkeleton from '../../shared/custom/components/skeleton/SubscriptionCardSkeleton';
import { getAllPlans } from '@/lib/data/plan';
import { useQuery } from '@tanstack/react-query';
import { PlanDTO } from '@prisma/client';

export type SubscriptionsPlansProps = {
  activePlanId: number;
}

const SubscriptionsPlans: React.FC<SubscriptionsPlansProps> = ({activePlanId}) => {
  const { data, isLoading, isError } = useQuery({queryKey: ['plans'], queryFn: (): Promise<PlanDTO[] | undefined> => getAllPlans()});
  const [selectedPlanId, setSelectedPlanId] = React.useState<number>(activePlanId);

  const onSelectPlan = (plan: PlanDTO) => {
    setSelectedPlanId(plan.id);
  }
  if (isError) {
    throw new Error('Error al cargar los planes');
  }

  return (
    <div>
      <Grid container spacing={3} justifyContent="center" mt={3}>
        {!isLoading && data ? (
          data?.map((plan: PlanDTO, index: number) => (
              <Grid size={{xs: 12, sm: 6, lg: 3}} key={index}>
                <SubscriptionCard
                  plan={plan}
                  selected={plan.id === selectedPlanId}
                  onSelectPlan={onSelectPlan}
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
