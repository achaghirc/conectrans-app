import { Box, Typography } from "@mui/material";

type BoxIconTextInformationProps = {
  icon: React.ReactNode;
  text: string;
  fontSize?: number;
  fontWeight?: number;
}

const BoxIconTextInformation : React.FC<BoxIconTextInformationProps> = ({
  icon,
  text,
  fontSize,
  fontWeight
}) => {
  return (
    <Box component={'div'} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 1 }}>
      {icon}
      <Typography variant='subtitle1' fontWeight={fontWeight ?? 400} fontSize={fontSize ?? 26} color='textPrimary'>{text}</Typography>
    </Box>
  )
}

export default BoxIconTextInformation