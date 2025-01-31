import { FormControl, Skeleton, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
export const DriverWorkPreferencesComponentSkeleton: React.FC = () => {
  return (
    <Grid container spacing={4} p={1}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Skeleton variant="rounded" width={80} height={30} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControl fullWidth>
          <Skeleton variant="rounded" width={80} height={30} />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Skeleton variant="rounded" width={30} height={30} />
      </Grid>
    </Grid>
  );
};