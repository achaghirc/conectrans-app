import { Avatar, Box, Chip, ChipOwnProps, Divider, Typography } from "@mui/material";
type BoxAvatarItemProps = {
  title: string;
  text: string;
  direction?: 'row' | 'column';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
}

const colors: Array<ChipOwnProps['color']> = ['primary', 'secondary', 'warning', 'info', 'success'];

const BoxAvatarItem: React.FC<BoxAvatarItemProps> = ({ title, text, direction, justifyContent }) => {
  return (
    <Box component={'div'} sx={{ display: 'flex', flexDirection: direction ?? 'row', alignItems: 'center', justifyContent: justifyContent ?? 'flex-start' }}>
      <Typography variant='body1' fontWeight={700} fontSize={16} color='textPrimary'>{title}</Typography>
      <Divider orientation='horizontal' flexItem />
      <Avatar sx={{ width: 30, height: 30, backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant='subtitle1' fontWeight={400} fontSize={16} color='textPrimary'>{text}</Typography>
      </Avatar>
    </Box>
  )
}

type BoxAvatarMultiItemProps = {
  title: string;
  items: string[];
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  direction?: 'row' | 'column';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
}

const BoxAvatarMultiItem: React.FC<BoxAvatarMultiItemProps> = ({ title, items,alignItems, direction, justifyContent }) => {
  return (
    <Box component={'div'} sx={{ display: 'flex', flexDirection: direction ?? 'row', alignItems: alignItems ?? 'center', justifyContent: justifyContent ?? 'flex-start' }}>
      <Typography variant='body1' fontWeight={700} fontSize={16} color='textPrimary'>{title}</Typography>
      <Divider orientation='horizontal' flexItem sx={{ mb: 1 }}/>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
        {items.map((item, index: number) => (
          <Avatar key={index} sx={{ width: 50, height: 50, backgroundColor: 'primary.main', color: 'white' }}>
            <Typography variant='subtitle1' fontWeight={400} fontSize={16} color='white'>{item}</Typography>
          </Avatar>
        ))}
      </Box>
    </Box>
  )
}
const BoxChipMultiItem: React.FC<BoxAvatarMultiItemProps> = ({ title, items,alignItems, direction, justifyContent }) => {
  return (
    <Box component={'div'} sx={{ display: 'flex', flexDirection: direction ?? 'row', alignItems: alignItems ?? 'center', justifyContent: justifyContent ?? 'flex-start' }}>
      <Typography variant='body1' fontWeight={700} fontSize={16} color='textPrimary'>{title}</Typography>
      <Divider orientation='horizontal' flexItem sx={{ mb: 1 }}/>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
        {items.map((item, index: number) => (
          <Chip key={index} title={item} label={item} color={colors[index]} />
        ))}
      </Box>
    </Box>
  )
}

export { BoxAvatarItem, BoxAvatarMultiItem, BoxChipMultiItem};