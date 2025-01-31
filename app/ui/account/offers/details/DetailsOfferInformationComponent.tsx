import ButtonCustom from '@/app/ui/shared/custom/components/button/ButtonCustom';
import BoxTextItem from '@/app/ui/shared/custom/components/box/BoxTextItem';
import { Box, Button, Divider, Typography } from '@mui/material';
import { OfferDTO } from '@prisma/client';
import { Session } from 'next-auth';
import React from 'react'

import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useQuery } from '@tanstack/react-query';
import { existsApplicationOfferByPerson } from '@/lib/data/applicationOffers';
import { CheckCircleOutline } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
dayjs.locale('es');

type DetailsOfferInformationComponentProps = {
  session: Session | null;
  offer: OfferDTO; 
  handleEditOffer: () => void;
  handleUserApply: VoidFunction
}

const DetailsOfferInformationComponent: React.FC<DetailsOfferInformationComponentProps> = (
  { session, offer, handleEditOffer, handleUserApply }
) => {  
  const router = useRouter();
  const startDate = dayjs(offer.startDate).format('LL');
  const endDate = dayjs(offer.endDate).format('LL');

  const { data: alreadyAppliyed, isLoading } = useQuery({
    queryKey: ['existsApplicationOfferByPerson', session?.user.personId, offer.id],
    queryFn: (): Promise<boolean | undefined > => existsApplicationOfferByPerson(session?.user.personId ?? 0, offer.id),
    enabled: session?.user.personId !== undefined,
    staleTime: 1000 * 60 * 60 * 24 * 7,
  })

  const getButtons = () => {

    if (session && session.user?.id === offer.userId) {
      return (
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
            onClick={handleEditOffer}
            loading={false}
          />
          <ButtonCustom 
            title='Eliminar oferta'
            color='secondary'
            disable={false}
            onClick={() => console.log('Eliminar la oferta')}
            loading={false}
          />
          {/* <Link
            href={`/account-company/offers/${offer.id}/candidates`}
            passHref
            style={{textDecoration: 'none'}}
          > */}
            <ButtonCustom 
              title='Ver candidatos'
              color='primary'
              disable={false}
              onClick={() => router.push(`/account-company/offers/${offer.id}/candidates`)}
              loading={false}
              />
          {/* </Link> */}
        </Box>
      )
    } else if (isLoading) {
      return (
        <ButtonCustom 
          title='Buscando si ya te has inscrito'
          color='primary'
          disable={true}
          loading={isLoading}
        />
      )
    } else if (!alreadyAppliyed) {
      return (
        <ButtonCustom 
          title='Inscribirme en la oferta'
          color='primary'
          disable={false}
          onClick={handleUserApply}
          loading={false}
        />
      )
    } else if (alreadyAppliyed) {
      return (
        <Button
          color='success'
          variant='contained'
          onClick={() => {}}
          endIcon={<CheckCircleOutline />}
        >
          Ya estas inscrito en esta oferta
        </Button>
      )
    }
  }

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
      <BoxTextItem title='Publicada' text={startDate} />
      <BoxTextItem title='Caduca' text={endDate} />
      <BoxTextItem title='CAP' text={offer.capCertification ? 'Obligatorio' : 'Opcional'} />
      <BoxTextItem title='Tacógrafo digital' text={offer.digitalTachograph ? 'Obligatorio' : 'Opcional'} />
      {getButtons()}
    </Box>
  )
}

export default DetailsOfferInformationComponent
