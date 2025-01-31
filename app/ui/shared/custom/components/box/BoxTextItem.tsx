import { Avatar, Box, Divider, Typography } from "@mui/material";

type BoxTextItemProps = {
  title: string;
  text: string;
  direction?: 'row' | 'column';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
}

const BoxTextItem: React.FC<BoxTextItemProps> = ({ title, text, direction, justifyContent }) => {
  return (
    <Box component={'div'} sx={{ display: 'flex', flexDirection: direction ?? 'column', alignItems: 'flex-start', justifyContent: justifyContent ?? 'flex-start' }}>
      <Typography variant='body1' fontWeight={700} fontSize={16} color='textPrimary'>{title}</Typography>
      <Divider orientation='horizontal' flexItem />
      <Typography variant='subtitle1' fontWeight={400} fontSize={16} color='textPrimary'>{text}</Typography>
    </Box>
  )
}
export default BoxTextItem;


