import { Switch, styled } from '@mui/material';

// Custom styled switch
export const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 60,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 3,
    padding: 0,
    transform: 'translateX(4px)',
    '&.Mui-checked': {
      color: theme.palette.primary.main,
      transform: 'translateX(22px)',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: 'primary',
    width: 28,
    height: 28,
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

