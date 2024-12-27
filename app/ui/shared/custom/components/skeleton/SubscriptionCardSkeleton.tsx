import { Box, Card, CardActions, CardContent, Skeleton } from "@mui/material";

export const SubscriptionCardSkeleton = () => {
  return (
    <Card sx={{ 
      maxWidth: '100%', 
      minHeight: 350,
      height: '100%', 
      mx: "auto", 
      borderRadius: 3,
      boxShadow: 3, 
      display: 'flex',
      flexDirection: 'column',
      }}>
        <Box
          sx={{ 
            p: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 40,
            textAlign: 'start', 
            background: 'linear-gradient(to right,rgb(184, 182, 182),rgb(162, 162, 162),rgb(163, 163, 164))', 
            color: 'white' 
          }}
        >
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="circular" width={24} height={24} />
        </Box>
        <CardContent sx={{ display: 'flex', flexDirection: 'column'}}>
          <Box>
            <Skeleton variant="text" width={80} height={40} />
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', gap: 2 }}>
              <Skeleton variant="text" width={60} height={20} />
              <Skeleton variant="text" width={60} height={20} />
            </Box>
          </Box>
          <Skeleton variant="rounded" width={150} height={40} sx={{ m: '0 auto', borderRadius: 3, mt:2 }} />
        </CardContent>
      <CardActions>
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            alignContent: 'start',
            gap: 1,
          }}
        >
          <Skeleton variant="text" width={200} height={20} />
          <Skeleton variant="text" width={150} height={20} />
          <Skeleton variant="text" width={150} height={20} />
        </Box>
      </CardActions>
    </Card>
  );
};

export default SubscriptionCardSkeleton;