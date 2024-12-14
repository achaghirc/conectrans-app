import { FormControl, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid2';
export const DriverLicencesComponentSkeleton: React.FC = () => {
  return (
    <Grid container spacing={4} p={1}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControl fullWidth>
          <Skeleton variant="rectangular" width="100%" height={56} />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControl fullWidth>
          <Skeleton variant="rectangular" width="100%" height={56} />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 12 }}>
        <FormControl fullWidth>
          <Skeleton variant="rectangular" width="100%" height={56} />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}
        sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: { xs: 'space-between', sm: 'flex-start' } }}
      >
        <Skeleton variant="text" width={150} height={40} />
        <Skeleton variant="circular" width={40} height={40} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}
        sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: { xs: 'space-between', sm: 'flex-start' } }}
      >
        <Skeleton variant="text" width={150} height={40} />
        <Skeleton variant="circular" width={40} height={40} />
      </Grid>
      <Grid size={{ xs: 12 }} display={'flex'} justifyContent={'flex-end'}>
        <Skeleton variant="rectangular" width={100} height={40} />
      </Grid>
    </Grid>
  );
};