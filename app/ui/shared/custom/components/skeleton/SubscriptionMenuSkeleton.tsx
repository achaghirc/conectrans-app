import React from 'react';
import { Box, Typography, Button, Skeleton } from '@mui/material';
import { ChatOutlined, EditOutlined, BusinessCenterOutlined, AccountBalanceOutlined } from '@mui/icons-material';
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid2'; // Import Grid2
import SubscriptionItemSkeleton from './SubscriptionItemComponentSkeleton';

const SubscriptionMenuSkeleton: React.FC = () => {
  return (
    <Box 
      sx={{
        p: 2,
        mt: 3,
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        minWidth: '100%',
        minHeight: 200,
        borderRadius: 3,
      }}
    > 
      <Grid container spacing={4} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        <Grid size={{ xs:12, sm:6, md:6 }} >
          <Typography variant="h4" component="h1" fontWeight={900}>Subscripción</Typography>
        </Grid>
        <Grid size={{ xs:12, sm:6, md:6 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Skeleton variant="rounded" width={120} height={40} sx={{ mr:2, borderRadius: 5}}/>
          <Skeleton variant="rounded" width={190} height={40} sx={{ borderRadius: 5}}/>
        </Grid>
      </Grid>
      <Grid container mt={1}>
        <Grid size={{ xs:12, sm:6, md:4 }}>
          <SubscriptionItemSkeleton/>
        </Grid>
        <Grid size={{ xs:12, sm:6, md:4 }}>
          <SubscriptionItemSkeleton/>
        </Grid>
        <Grid size={{ xs:12, sm:6, md:4 }}>
          <SubscriptionItemSkeleton/>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SubscriptionMenuSkeleton;