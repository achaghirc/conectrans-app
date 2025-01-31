import ButtonCustom from '@/app/ui/shared/custom/components/button/ButtonCustom';
import useMediaQueryData from '@/app/ui/shared/hooks/useMediaQueryData';
import { ApplicationOfferStatusEnum } from '@/lib/enums';
import { CloseOutlined } from '@mui/icons-material';
import { Box, IconButton, SwipeableDrawer, Typography } from '@mui/material';
import { ApplicationOfferDTO } from '@prisma/client';
import React from 'react'

type CandidateDrawerComponentProps = {
  data: ApplicationOfferDTO | null;
  open: boolean;
  action: ApplicationOfferStatusEnum;
  isLoading?: boolean;
  setOpen: (value: boolean, event?: React.KeyboardEvent | React.MouseEvent) => void
  onAction: (candidate: ApplicationOfferDTO, status: ApplicationOfferStatusEnum) => void;
}

type ButtonAction = {
  title: string;
  color: 'primary' | 'secondary';
  isLoading?: boolean;
  action: () => void;
}

const CandidateDrawerComponent: React.FC<CandidateDrawerComponentProps> = (
  { data, open, action, isLoading, setOpen, onAction }
) => {
  const { mediaQuery } = useMediaQueryData();
  if (!data) {
    return;
  }
  const getTitleDialog = (action: ApplicationOfferStatusEnum) => {
    if (action === ApplicationOfferStatusEnum.ACCEPTED) {
      return 'Aceptar candidatura'
    } else if (action === ApplicationOfferStatusEnum.REJECTED) {
      return 'Rechazar candidatura'
    } else if (action === ApplicationOfferStatusEnum.IN_PROCESS) {
      return 'Pasar a siguiente etapa'
    }
  }
  const getTextContent = (action: ApplicationOfferStatusEnum, text: string) => {
    if (action === ApplicationOfferStatusEnum.ACCEPTED) {
      return (
        <Typography variant='body1' color='textSecondary'>
          Vas a aceptar la candidatura de {text}. Recuerda que esta acción es irreversible.
          Si estás de acuerdo, se le enviará un correo electrónico con la confirmación de la aceptación al candidato y podrás ponerte en contacto con él para continuar con el proceso de selección.
        </Typography>
      )
    } else if (action === ApplicationOfferStatusEnum.REJECTED) {
      return (
        <Typography variant='body1' color='textSecondary'>
          Vas a rechazar la candidatura de {text}. Recuerda que esta acción es irreversible.
          Si estás de acuerdo, se le enviará un correo electrónico con la confirmación del rechazo al candidato.
        </Typography>
      )
    } else if (action === ApplicationOfferStatusEnum.IN_PROCESS) {
      return (
        <Typography variant='body1' color='textSecondary'>
          Vas a pasar la candidatura de {text} al siguiente paso del proceso. Recuerda que esta acción es irreversible.
          A partir de este momento podrás ponerte en contacto con el candidato y en la siguiente etapa del proceso de selección podrás 
          aceptar o rechazar la candidatura.
        </Typography>
      )
    } else {
      return (
        <Typography variant='body1' color='textSecondary'>
          No hay información disponible
        </Typography>
      )
    }
  }
  const getButtonActions = (action: ApplicationOfferStatusEnum) => {
    const actions: ButtonAction[] = [];
    actions.push({ title: 'Cerrar', color: 'secondary', action: () => setOpen(false) });
    if (action === ApplicationOfferStatusEnum.ACCEPTED) {
      actions.push({ title: 'Aceptar', color: 'primary', isLoading: isLoading ?? false, action: () => onAction(data, action) });
    } else if (action === ApplicationOfferStatusEnum.REJECTED) {
      actions.push({ title: 'Rechazar', color: 'secondary', isLoading: isLoading ?? false, action: () => onAction(data, action) });
    } else if (action === ApplicationOfferStatusEnum.IN_PROCESS) {
      actions.push({ title: 'Continuar', color: 'primary', isLoading: isLoading ?? false, action: () => onAction(data, action) });
    }
    
    return actions.map(({ title, color, isLoading, action }) => (
      <ButtonCustom
        key={title}
        title={title}
        loading={isLoading ?? false}
        onClick={action}
        color={color}
      />
    ));
  };

  return (
    <SwipeableDrawer
      anchor={'top'}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Box sx={{ display: 'flex', p: 2, justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h6' fontSize={ mediaQuery ? 20 : 26 } fontWeight={700} component={'h4'}>
          {getTitleDialog(action)}
        </Typography>
        <Box>
          <IconButton onClick={() => setOpen(false)}>
            <CloseOutlined color='secondary' />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ pl: 2, pr: 2 }}>
        {getTextContent(action, data?.Person?.name ?? '')}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, gap: 2 }}>
        {getButtonActions(action)}
      </Box>
    </SwipeableDrawer>
  )
}

export default CandidateDrawerComponent
