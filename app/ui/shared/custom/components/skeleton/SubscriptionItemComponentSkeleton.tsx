import React from 'react';
import { Skeleton, Box } from "@mui/material";



export const SubscriptionItemSkeleton: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 90,
        maxWidth: 300,
        textAlign: 'start',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: 5,
        border: '1px solid rgba(0, 0, 0, 0.05)',
        gap: 3,
        p: 1,
        mt: 2
      }}
    >
      <Skeleton variant="circular" width={60} height={60} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'start',
          gap: 1
        }}
      >
        <Skeleton variant="text" width={100} height={20} />
        <Skeleton variant="text" width={150} height={30} />
      </Box>
    </Box>
  );
};

export default SubscriptionItemSkeleton;