import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

// Styled Components
const SpeedDialContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'inline-flex',
  flexDirection: 'column-reverse',
  alignItems: 'center',
}));

const MainFab = styled(Button)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  fontSize: '24px',
  boxShadow: theme.shadows[4],
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  transition: 'transform 0.3s ease-in-out',
}));

const ChildFab = styled(Button)(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: '50%',
  backgroundColor: theme.palette.secondary.main,
  color: '#fff',
  marginBottom: 8,
  fontSize: '18px',
  boxShadow: theme.shadows[3],
  transform: 'translateY(20px)',
  opacity: 0,
  transition: 'opacity 0.3s, transform 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));
interface FabOptionsProps {
  open: boolean;
}
const FabOptions = styled(Box)<FabOptionsProps>(({ open }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  ...(open && {
    transform: 'translateY(0)',
    opacity: 1,
    pointerEvents: 'auto',
  }),
}));

// React Component
const ButtonSpeedDialCustom = () => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prevOpen) => !prevOpen);

  return (
    <SpeedDialContainer>
      <FabOptions open={open}>
        <ChildFab>A</ChildFab>
        <ChildFab>B</ChildFab>
        <ChildFab>C</ChildFab>
      </FabOptions>
      <MainFab
        onClick={handleToggle}
        style={{
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
        }}
      >
        +
      </MainFab>
    </SpeedDialContainer>
  );
};

export default ButtonSpeedDialCustom;