import { Box, Card, CardActions, CardContent, Divider, Skeleton } from "@mui/material";

const SubscriptionCardSkeleton = () => {
    return (
        <Card sx={{ 
            maxWidth: 300, 
            minHeight: 350,
            height: '100%', 
            mx: "auto", 
            borderRadius: 3,
            boxShadow: 3, 
            textAlign: "center",
            display: 'flex',
            flexDirection: 'column', 
            justifyContent: 'space-between' 
        }}>
            <CardContent>
                <Skeleton sx={{ margin: '0 auto' }} variant="text" width="60%" height={40} />
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                    <Box>
                        <Divider sx={{ my: 2 }} />
                        {[...Array(3)].map((_, index) => (
                            <Box key={index} sx={{ display: 'flex', alignContent: 'center', alignItems: 'center', justifyContent: 'flex-start', mt: 1}}>
                                <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
                                <Skeleton variant="text" width="80%" height={20} />
                            </Box>
                        ))}
                        <Divider sx={{ my: 2 }} />
                    </Box>
                </Box>
            </CardContent>
            <CardActions sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mb: 2}}>
                <Box>
                    <Skeleton variant="text" width={120} height={40} sx={{ mb: 3 }} />
                    <Divider sx={{ my: 2 }} variant="fullWidth" />
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 2 }}>
                        <Skeleton variant="text" width={50} height={20} sx={{ mb: 3 }} />
                        <Skeleton variant="text" width={50} height={20} sx={{ mb: 3 }} />
                    </Box>
                </Box>
                <Skeleton variant="rectangular" width="80%" height={40} sx={{ borderRadius: 3 }} />
            </CardActions>
        </Card>
    );
};

export default SubscriptionCardSkeleton;