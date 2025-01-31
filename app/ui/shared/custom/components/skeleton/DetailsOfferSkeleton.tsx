
import { Box, Card, Paper, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid2';

const DetailsOfferSkeleton: React.FC = () => {
  return (
    <div>
      <Box component={'div'} sx={{ display: {xs: 'none', md: 'flex'}, height: 30, width: '100%' }}></Box>
      <Grid container spacing={2} sx={{ p: 2}}>
        <Grid size={{xs: 12, md: 8}}>
          <Skeleton variant="rounded" height={200} sx={{ borderRadius: 5 }} />
          <Box sx={{ display: 'flex', flexDirection: {xs: 'column', md: 'row'}, justifyContent: 'space-between', mt: 2 }}> 
            <Paper
              elevation={2}
              sx={{
                borderRadius: 5,
                marginRight: 2,
                width: { md: '100%' },
              }}
            >
              <Skeleton
                variant="rounded" height='100%' width="100%" sx={{ borderRadius: 5 }} />
            </Paper>
            <Paper
              elevation={2}
              sx={{
                marginLeft: 2,
                borderRadius: 5,
                boxShadow: 1,
                width: { md: '100%' },
              }}
            >
              <Skeleton variant="rounded" height={300} width="100%" sx={{ borderRadius: 5 }}/>
            </Paper>
          </Box>
          <Skeleton variant="rounded" height={150} width="100%" sx={{ mt: 2, borderRadius: 5 }} />
        </Grid>
        <Grid size={{xs: 12, md: 4}}>
          <Grid container spacing={2} direction={'column'}>
            <Grid size={{xs: 12}}>
              <Skeleton variant="rounded" height={450} sx={{ borderRadius: 5}}/>
            </Grid>
            <Grid size={{xs: 12}}>
              <Box component={'div'} 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 2,
                  m: 1
                }}
              >
                <Card sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 0, borderRadius: 5, boxShadow: 1}}>
                  <Skeleton variant="rounded" height={210} sx={{ borderRadius: 5}}/>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default DetailsOfferSkeleton;