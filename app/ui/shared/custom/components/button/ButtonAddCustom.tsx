import { AddCircleOutline, AddOutlined } from '@mui/icons-material'
import { Box, Button, IconButton, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material'
import React from 'react'

type ActionDTO = {
  name: string;
  icon: React.ReactElement;
  onClick: () => void;
}

type ButtonSpeedDialCustomProps = {
  actions: ActionDTO[];
}

const ButtonAddCustom: React.FC<ButtonSpeedDialCustomProps> = (
  { actions }
) => {
  return (
    <Box sx={{ 
      height: 'auto', 
      transform: 'transalteX(-50px)', 
      position: 'fixed', 
      bottom: 0, // Espaciado desde la parte inferior de la pantalla
      right: {sx: '0px', md: '40%'}, // Centrado horizontalmente
      zIndex: 1000, // Capa de visualización  
      }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 10, right: 16 }}
        icon={<SpeedDialIcon />}
        onClick={() => actions[0].onClick()}
      >
        {actions.length > 1 && actions.map((action: ActionDTO, index: number) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
    </Box>
  )
}

export default ButtonAddCustom
