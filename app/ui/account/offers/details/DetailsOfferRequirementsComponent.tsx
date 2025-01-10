import { Box, Divider, Typography } from '@mui/material';
import { OfferDTO } from '@prisma/client';
import React from 'react'
import BoxTextItem from '@/app/ui/shared/custom/components/text/BoxTextItem';


type DetailsOfferRequirementsComponentProps = {
  offer: OfferDTO;
}

const DetailsOfferRequirementsComponent: React.FC<DetailsOfferRequirementsComponentProps> = ({
  offer
}) => {

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
        text={offer.licenseType.map((licence) => licence.name).join(", ")}
        direction='row'
        justifyContent='space-between'
      />
      <BoxTextItem title='Carnet ADR'
        text={offer.licenseAdr.map((licence) => licence.name).join(", ")}
        direction='row'
        justifyContent='space-between'
      />
      <BoxTextItem title='Ambito de trabajo'
        text={offer.workRange.map((range) => range.name).join(", ")}
        direction='row'
        justifyContent='space-between'
      />
      <BoxTextItem title='Tipo de contrato'
        text={offer.employmentType.map((type) => type.name).join(", ")}
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