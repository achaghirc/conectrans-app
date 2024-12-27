import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

export const ProfileComponentSkeleton: React.FC = () => {
  return (
    <Box
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
      <Skeleton variant="circular" width={150} height={150} />
      <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
        <Skeleton variant="text" width={100} height="1.5em" />
        <Skeleton variant="text" width={200} height="1em" sx={{ mt: 1 }} />
      </Box>
    </Box>
  );
};