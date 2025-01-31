import { PAYMENT_WARN_MESSAGE } from "@/lib/constants";
import { InfoOutlined } from "@mui/icons-material";
import { Avatar, Box, Tooltip, Typography } from "@mui/material";

export type SubscriptionItemComponentProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
  principal?: boolean;
  warning?: boolean;
}

const  SubscriptionItemComponent: React.FC<SubscriptionItemComponentProps> = ({icon, title, text, principal, warning}) => {
  return (
    <Box
      sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: 90,
      maxWidth: 300,
      textAlign: 'start',
      boxShadow: principal ? '0px 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
      borderRadius: 5,
      border: principal ?'1px solid rgba(0, 0, 0, 0.05)': 'none',
      gap: 3,
      p: 1,
      mt: 2
      }}
    >
      <Avatar sx={{ width: 60, height: 60, bgcolor: 'rgba(217, 217, 217, 0.4)'}}>
        {icon}
      </Avatar>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'start',
          gap: 1
        }}
      >
        <Typography variant="caption" component={"h2"} fontWeight={200}>{title}</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 1}}>
          <Typography variant="h6" component={"h3"} fontWeight={700}>{text}</Typography>
          {warning && (
            <Tooltip title={PAYMENT_WARN_MESSAGE}>
              <InfoOutlined color="warning"/>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default SubscriptionItemComponent;


