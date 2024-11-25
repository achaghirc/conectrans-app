import { Box, Divider, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid2';

const CompanyDataSkeleton: React.FC = () => {
  return (
    <Box textAlign={'center'} gap={2}>
      <Grid container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          gap: 1,
          mt: { xs: 2, sm: 5 },
        }}
      >
        <Grid size={{ xs: 12 }} sx={{}}>
          <Box
            sx={{
              position: 'relative',
              margin: '0 auto',
              width: 150,
              height: 150,
            }}
          >
            <Skeleton variant="circular" width={150} height={150} />
          </Box>
        </Grid>
        <Grid size={{ xs: 10 }}>
          <Box>
            <Skeleton variant="text" width="40%" height={40} sx={{ m: '0 auto'}} />
            <Skeleton variant="text" width="80%" height={20} sx={{ m: '0 auto'}}  />
          </Box>
        </Grid>
      </Grid>
      <Box margin={3}>
        <Skeleton variant="text" width="40%" height={30} />
        <Divider />
      </Box>
      <Grid container spacing={2} sx={{ pl: 2, pr: 2 }}>
        {Array.from(new Array(10)).map((_, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Skeleton variant="rounded" width="100%" height={56} />
          </Grid>
        ))}
      </Grid>
      <Box sx={{
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        m: 2
      }}>
        <Skeleton variant="rounded" width={100} height={36} />
      </Box>
    </Box>
  );
};

export default CompanyDataSkeleton;