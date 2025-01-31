import BoxIconTextInformation from '@/app/ui/shared/custom/components/box/BoxIconTextInformation'
import useMediaQueryData from '@/app/ui/shared/hooks/useMediaQueryData'
import { cardMobileStyles, paperStyles } from '@/app/ui/shared/styles/styles'
import { BusinessOutlined, EventBusyOutlined, TextSnippetOutlined } from '@mui/icons-material'
import { Box, Chip, Paper, Typography } from '@mui/material'
import { ApplicationOfferDTO, OfferDTO } from '@prisma/client'
import Image from 'next/image'
import React from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { Session } from 'next-auth'
import { DEFAULT_COMPANY_LOGO_URI } from '@/lib/constants'
type ApplicationOfferCardComponentProps = {
  session: Session | null;
  data: ApplicationOfferDTO;
}

const ApplicationOfferCardComponent: React.FC<ApplicationOfferCardComponentProps> = (
  { session, data }
) => {
  dayjs.locale('es');
  const { mediaQuery } = useMediaQueryData(); 

  const getStatusChip = () => {
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

  // if(isLoading) {
  //   return (
  //     <>
  //     <Box sx={{
  //       display: {xs: 'none', md: 'block'},
  //     }}>
  //       <OfferCardSkeleton />
  //     </Box>
  //     <Box sx={{
  //       display: {xs: 'block', md: 'none'},
  //     }}>
  //       <OfferCardSkeletonMobile />
  //     </Box>
  //     </>
  //   )
  // }

  // if(!offer) {
  //   return notFound()
  // }

  return (
    <>
      <Box sx={cardMobileStyles}>
        <Box sx={{ p: {xs: 1, md: 2}, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image
            src={data.Offer.User?.Company?.Asset?.url ?? DEFAULT_COMPANY_LOGO_URI} 
            alt={data.Offer.User?.Company?.name ?? ''}
            width={60}
            height={60}
            style={{ borderRadius: '50%' }}
            />
        </Box>
        <Box sx={{ textAlign: 'start', p: { xs: 1, md: 2 }, flexGrow: 1 }}>
          <Typography variant='h4' fontWeight={600} fontSize={{xs: 20, md: 26}}>{data.Offer.title}</Typography>
          <Typography variant='subtitle1' fontWeight={400} color='textSecondary'>{data.Offer.User?.Company?.name}</Typography>
          <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'flex-start' }}>
            <BoxIconTextInformation
              icon={<BusinessOutlined sx={{ fontSize: {xs: 16, md: 20} }}/>}
              text={data.Offer.Location.state}
              fontSize={!mediaQuery ? 13 : 16}
              fontWeight={!mediaQuery ? 400 : 200}
            />
            <BoxIconTextInformation
              icon={<TextSnippetOutlined sx={{ fontSize: {xs: 16, md: 20} }}/>}
              text={data.Offer.OfferPreferences.filter((preferences) => preferences.type == 'CARNET').map((licence) => licence.EncoderType.name).join(", ") ?? ''}
              fontSize={!mediaQuery ? 13 : 16}
              fontWeight={!mediaQuery ? 400 : 200}
            />
            </Box>
        </Box>
        <Box sx={{ m: {xs: 1, md: 0}, p: {xs: 0, md: 2}, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between'}}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
            {getStatusChip()}
          </Box>
        </Box>
      </Box>
      <Paper elevation={2} sx={paperStyles}>
        <Box sx={{ p: {xs: 1, md: 2}, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image
            src={data.Offer.User?.Company?.Asset?.url ?? DEFAULT_COMPANY_LOGO_URI} 
            alt={data.Offer.User?.Company?.name ?? ''}
            width={mediaQuery ? 100 : 60}
            height={mediaQuery ? 100 : 60}
            style={{ borderRadius: '50%' }}
            />
        </Box>
        <Box sx={{ textAlign: 'start', p: { xs: 1, md: 2 }, flexGrow: 1 }}>
          <Typography variant='h4' fontWeight={600} fontSize={{xs: 20, md: 26}}>{data.Offer.title}</Typography>
          <Typography variant='subtitle1' fontWeight={400} color='textSecondary'>{data.Offer.User?.Company?.name}</Typography>
          <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'flex-start' }}>
            <BoxIconTextInformation
              icon={<BusinessOutlined sx={{ fontSize: {xs: 16, md: 20} }}/>}
              text={data.Offer.Location.state}
              fontSize={!mediaQuery ? 13 : 16}
              fontWeight={!mediaQuery ? 400 : 200}
              />
            <BoxIconTextInformation
              icon={<TextSnippetOutlined sx={{ fontSize: {xs: 16, md: 20} }}/>}
              text={data.Offer.OfferPreferences.filter((preferences) => preferences.type == 'CARNET').map((licence) => licence.EncoderType.name).join(", ") ?? ''}
              fontSize={!mediaQuery ? 13 : 16}
              fontWeight={!mediaQuery ? 400 : 200}
              />
            <BoxIconTextInformation
              icon={<EventBusyOutlined sx={{ fontSize: {xs: 16, md: 20} }}/>}
              text={dayjs(data.Offer.endDate).format('LL')}  
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
    </>
  )
}

export default ApplicationOfferCardComponent
