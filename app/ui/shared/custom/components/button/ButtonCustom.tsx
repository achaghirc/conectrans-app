import { AccountBalanceOutlined } from '@mui/icons-material';
import { Button, CircularProgress, SxProps } from '@mui/material'
import React from 'react'

type ButtonCustomProps = {
  title: string;
  loading: boolean;
  onClick?: () => void;
  disable?: boolean;
  color: 'primary' | 'secondary';
  type?: 'button' | 'submit';
  variant?: 'outlined' | 'contained';
  sx?: SxProps;
  startIcon?: React.ReactNode;
}

const ButtonCustom = (
  {title, loading, color, disable, type, variant, sx, startIcon, onClick}
  : ButtonCustomProps
) => {
  return (
    <Button 
      startIcon={startIcon}
      endIcon={loading ? <CircularProgress size={20} /> : null}
      variant={variant ?? 'outlined'}
      color={color}
      onClick={onClick} 
      disabled={disable}
      type={type ?? 'button'}
      sx={sx}
    >
      {title}
    </Button>
  )
}

export default ButtonCustom
