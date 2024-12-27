import { Button, CircularProgress } from '@mui/material'
import React from 'react'

type ButtonCustomProps = {
  title: string;
  loading: boolean;
  onClick?: () => void;
  disable?: boolean;
  color: 'primary' | 'secondary';
  type?: 'button' | 'submit';
}

const ButtonCustom = (
  {title, loading, color, disable, type, onClick}
  : ButtonCustomProps
) => {
  return (
    <Button 
      endIcon={loading ? <CircularProgress size={20} /> : null}
      variant='outlined' 
      color={color}
      onClick={onClick} 
      disabled={disable}
      type={type ?? 'button'}
    >
      {title}
    </Button>
  )
}

export default ButtonCustom
