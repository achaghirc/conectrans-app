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
        height: '100vh', 
        transform: 'translateZ(0px)', 
        flexGrow: 1,
        position: 'fixed', 
        bottom: 16, // Espaciado desde la parte inferior de la pantalla
        right: 16, // Espaciado desde el borde derecho de la pantalla
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
