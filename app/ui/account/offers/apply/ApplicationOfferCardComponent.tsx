import SettingButtonMenu from '@/app/ui/shared/custom/components/button/SettingButtonMenu'
import BoxIconTextInformation from '@/app/ui/shared/custom/components/text/BoxIconTextInformation'
import useMediaQueryData from '@/app/ui/shared/hooks/useMediaQueryData'
import { paperStyles } from '@/app/ui/shared/styles/styles'
import { getOfferById, getOfferSlimCardById } from '@/lib/data/offer'
import { BusinessOutlined, EventBusyOutlined, TextSnippetOutlined } from '@mui/icons-material'
import { Box, Chip, Paper, Typography } from '@mui/material'
import { ApplicationOfferDTO, OfferDTO } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import React from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { Session } from 'next-auth'
type ApplicationOfferCardComponentProps = {
  session: Session | null;
  data: ApplicationOfferDTO;
}

const ApplicationOfferCardComponent: React.FC<ApplicationOfferCardComponentProps> = (
  { session, data }
) => {
  dayjs.locale('es');
  const { mediaQuery } = useMediaQueryData(); 
  const {data: offer, isLoading} = useQuery({
    queryKey: ['offer', data.offerId],
    queryFn: (): Promise<OfferDTO | null> => getOfferSlimCardById(data.offerId)
  });

  if(isLoading) {
    return <div>Loading...</div>
  }

  if(!offer) {
    return <div>Error</div>
  }

  const getStatusChip = () => {
    console.log(data.status);
    let title = '';
    let color: "success" | "error" | "warning" = 'warning';
    switch (data.status) {
      case 'ACCEPTED':
        title = 'Aceptada';
        color = 'success';
        break;
      case 'REJECTED':
        title = 'Rechazada';
        color = 'error';
        break;
      case 'PENDING':
        title = 'Pendiente';
        color = 'warning';
        break;
      default:
        title = 'Pendiente';
        color = 'warning';
        break;
    }
    return (
      <Chip variant='outlined' label={title} title={title} color={color} /> 
    )
  }

  return (
    <Paper elevation={2} sx={paperStyles}>
      <Box sx={{ p: {xs: 1, md: 2}, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Image
          src={offer.company!.assetUrl ?? './images/default-company.png'} 
          alt={offer.company!.name ?? ''}
          width={mediaQuery ? 100 : 60}
          height={mediaQuery ? 100 : 60}
          style={{ borderRadius: '50%' }}
        />
      </Box>
      <Box sx={{ textAlign: 'start', p: { xs: 1, md: 2 }, flexGrow: 1 }}>
        <Typography variant='h4' fontWeight={600} fontSize={{xs: 20, md: 26}}>{offer.title}</Typography>
        <Typography variant='subtitle1' fontWeight={400} color='textSecondary'>{offer.company!.name}</Typography>
        <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'flex-start' }}>
          <BoxIconTextInformation
            icon={<BusinessOutlined sx={{ fontSize: {xs: 16, md: 20} }}/>}
            text={offer.location.state}
            fontSize={!mediaQuery ? 13 : 16}
            fontWeight={!mediaQuery ? 400 : 200}
          />
          <BoxIconTextInformation
            icon={<TextSnippetOutlined sx={{ fontSize: {xs: 16, md: 20} }}/>}
            text={offer.licenseType?.map((licence) => licence.name).join(", ") ?? ''}
            fontSize={!mediaQuery ? 13 : 16}
            fontWeight={!mediaQuery ? 400 : 200}
          />
          <BoxIconTextInformation
            icon={<EventBusyOutlined sx={{ fontSize: {xs: 16, md: 20} }}/>}
            text={dayjs(offer.endDate).format('LL')}  
            fontSize={!mediaQuery ? 13 : 16 }
            fontWeight={!mediaQuery ? 400 : 200}
          />
        </Box>
      </Box>
      <Box sx={{ m: {xs: 1, md: 0}, p: {xs: 0, md: 2}, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between'}}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
          {getStatusChip()}
        </Box>
      </Box>
    </Paper>
  )
}

export default ApplicationOfferCardComponent
