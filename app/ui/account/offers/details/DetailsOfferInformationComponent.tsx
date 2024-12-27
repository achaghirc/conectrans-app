import ButtonCustom from '@/app/ui/shared/custom/components/button/ButtonCustom';
import BoxTextItem from '@/app/ui/shared/custom/components/text/BoxTextItem';
import { Box, Divider, Typography } from '@mui/material';
import { OfferDTO } from '@prisma/client';
import { Session } from 'next-auth';
import React from 'react'

type DetailsOfferInformationComponentProps = {
  session: Session | null;
  offer: OfferDTO; 
}

const DetailsOfferInformationComponent: React.FC<DetailsOfferInformationComponentProps> = (
  { session, offer }
) => {
  return (
    <Box
      sx={{
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
        Acerca de la oferta
      </Typography>
      <BoxTextItem title='Salario' text={offer.salary} />
      <BoxTextItem title='Tipo de contrato' text={offer.employmentType.map((type) => type.name).join(', ')} />
      <BoxTextItem title='Jornada' text={offer.workDay} />
      <BoxTextItem title='CAP' text={offer.capCertification ? 'Obligatorio' : 'Opcional'} />
      <BoxTextItem title='Tacógrafo digital' text={offer.digitalTachograph ? 'Obligatorio' : 'Opcional'} />
      {session && session.user?.id === offer.userId ? (
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <ButtonCustom 
            title='Editar oferta'
            color='primary'
            disable={false}
            onClick={() => console.log('Editar la oferta')}
            loading={false}
          />
          <ButtonCustom 
            title='Eliminar oferta'
            color='secondary'
            disable={false}
            onClick={() => console.log('Eliminar la oferta')}
            loading={false}
          />
        </Box>
      ): (
        <ButtonCustom 
          title='Inscribirme en la oferta'
          color='primary'
          disable={false}
          onClick={() => console.log('Inscribirme en la oferta')}
          loading={false}
        />
      )}
    </Box>
  )
}

export default DetailsOfferInformationComponent
