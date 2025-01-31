import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Skeleton } from '@mui/material';

export function NavLinksSkeleton() {
	return (
		<List>
			{[...Array(6)].map((_, index) => (
				<ListItem key={index} disablePadding sx={{ mt: 1 }}>
					<ListItemButton>
						<ListItemIcon>
							<Skeleton variant="circular" width={40} height={40} />
						</ListItemIcon>
						<ListItemText 
							primary={<Skeleton variant="text" width="90%" />} 
						/>
					</ListItemButton>
				</ListItem>
			))}
		</List>
	);
}