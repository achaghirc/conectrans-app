import { Box, Divider, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid2';

const CompanyDataSkeleton: React.FC = () => {
  return (
    <Box textAlign={'center'} gap={2}>
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