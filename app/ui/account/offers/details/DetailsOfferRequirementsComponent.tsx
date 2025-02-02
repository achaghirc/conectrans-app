import { Box, Divider, Typography } from '@mui/material';
import { OfferDTO } from '@prisma/client';
import React from 'react'
import BoxTextItem from '@/app/ui/shared/custom/components/box/BoxTextItem';


type DetailsOfferRequirementsComponentProps = {
  offer: OfferDTO;
}

const DetailsOfferRequirementsComponent: React.FC<DetailsOfferRequirementsComponentProps> = ({
  offer
}) => {
  const licenseType = React.useMemo(() => offer.OfferPreferences.filter((type) => type.type == 'CARNET').map((pref) => pref.EncoderType.name).join(", ") ?? '', [offer]);
  const licenseAdr = React.useMemo(() => offer.OfferPreferences.filter((type) => type.type == 'CARNET_ADR').map((pref) => pref.EncoderType.name).join(", ") ?? '', [offer]);
  const workRange = React.useMemo(() => offer.OfferPreferences.filter((type) => type.type == 'WORK_SCOPE').map((pref) => pref.EncoderType.name).join(", ") ?? '', [offer]);
  const employmentType = React.useMemo(() => offer.OfferPreferences.filter((type) => type.type == 'EMPLOYEE_TYPE').map((pref) => pref.EncoderType.name).join(", ") ?? '', [offer]);
  return (
    <Box
      sx={{
        width: {md: '100%'},
        gap: 2,
        padding: 2,
        margin: 2,
        borderRadius: 5,
        boxShadow: 1,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" component="h4" fontWeight={700} fontSize={18}>
        Requisitos de la oferta
      </Typography>
      <Divider />
      <BoxTextItem title='Tipo de carnet'
        text={licenseType}
        direction='row'
        justifyContent='space-between'
      />
      <BoxTextItem title='Carnet ADR'
        text={licenseAdr}
        direction='row'
        justifyContent='space-between'
      />
      <BoxTextItem title='Ambito de trabajo'
        text={workRange}
        direction='row'
        justifyContent='space-between'
      />
      <BoxTextItem title='Tipo de contrato'
        text={employmentType}
        direction='row'
        justifyContent='space-between'
      />
      <BoxTextItem title='Jornada'
        text={offer.workDay}
        direction='row'
        justifyContent='space-between'
      />


    </Box>
  )
}

export default DetailsOfferRequirementsComponent