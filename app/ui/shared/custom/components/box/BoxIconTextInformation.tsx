import { Box, Typography } from "@mui/material";
import React from "react";

type BoxIconTextInformationProps = {
  icon: React.ReactNode;
  text: string | React.ReactNode;
  fontSize?: number;
  fontWeight?: number;
  onClick?: () => void;
}

const BoxIconTextInformation : React.FC<BoxIconTextInformationProps> = ({
  icon,
  text,
  fontSize,
  fontWeight,
  onClick
}) => {
  return (
    <Box component={'div'} onClick={() => onClick?.()} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer', justifyContent: 'flex-start', gap: 1 }}>
      {icon}
      <Typography variant='subtitle1' fontWeight={fontWeight ?? 400} fontSize={fontSize ?? 26} color='textPrimary'>{text}</Typography>
    </Box>
  )
}

export default BoxIconTextInformation