import { Box, Paper, Skeleton } from '@mui/material';

const OffersListSkeleton: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mr: { xs: 1, md: 0 }, ml: { xs: 1, md: 0 } }}>
      {[...Array(4)].map((_, index) => (
        <Box key={index} sx={{ display: 'flex', flexDirection: 'column'}}>
            <OfferCardSkeleton />
        </Box>
      ))}
    </Box>
  );
};

export default OffersListSkeleton;

export const OfferCardSkeleton: React.FC = () => {
  return (
    <Paper elevation={2} 
      sx={{ 
        display: 'flex', 
        height: {xs: 170, md: 180},
        flexDirection: 'row', 
        m: {xs: 'none', md: 2},
        borderRadius: 5,
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)'
        },
        '&:first-child': {
          marginTop: {xs: 1, md: 0}
        },
        '&:last-child': {
          marginBottom: 2
        }
      }}
    >
      <Box sx={{ p: {xs: 1, md: 2}, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Skeleton variant="circular" width={100} height={100} />
      </Box>
      <Box sx={{ textAlign: 'start', p: { xs: 1, md: 2 }, flexGrow: 1 }}>
        <Skeleton variant="text" width="60%" height={30} />
        <Skeleton variant="text" width="40%" height={20} />
        <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'flex-start' }}>
          <Skeleton variant="text" sx={{ width: {xs: "80%", md: "20%"}, height: 20 }} />
          <Skeleton variant="text" sx={{ width: {xs: "80%", md: "20%"}, height: 20 }} />
          <Skeleton variant="text" sx={{ width: {xs: "80%", md: "20%"}, height: 20 }} />
        </Box>
      </Box>
      <Box sx={{ m: {xs: 1, md: 0}, p: {xs: 0, md: 2}, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between'}}>
        <Skeleton variant="rounded" width={80} height={30} />
        <Skeleton variant="circular" width={30} height={30} />
      </Box>
    </Paper>
  )
}