import Grid from "@mui/material/Grid2";
import { Box, Divider, Skeleton } from "@mui/material";

const AccountSkeleton = () => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: 3,
				padding: 2,
				margin: '20px auto',
				height: '100%',
				width: '98%',
				borderRadius: 5,
			}}
		>
			<Box>
				<Skeleton variant="text" width="60%" height={40} />
				<Divider />
			</Box>
			<Grid container spacing={2}>
				<Grid size={{ xs: 12, sm: 6 }}>
					<Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2}}/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2}}/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<Skeleton variant="rectangular" width="20%" height={40} sx={{ borderRadius: 2}}/>
				</Grid>
			</Grid>
			<Box>
				<Skeleton variant="text" width="60%" height={40} />
				<Divider />
			</Box>
			<Grid container spacing={2}>
				<Grid size={{ xs: 12, sm: 6 }}>
					<Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2}}/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2}}/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2}}/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2}}/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2}}/>
				</Grid>
				<Grid size={{ xs: 12, sm: 12 }}>
					<Skeleton variant="rectangular" width="10%" height={40} />
				</Grid>
			</Grid>
		</Box>
	);
}

export default AccountSkeleton;