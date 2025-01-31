import BoxIconTextInformation from '@/app/ui/shared/custom/components/box/BoxIconTextInformation';
import { LocationOnOutlined } from '@mui/icons-material';
import { Box, Paper, Typography } from '@mui/material';
import { OfferDTO } from '@prisma/client';
import React from 'react'
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import useMediaQueryData from '@/app/ui/shared/hooks/useMediaQueryData';
import { DEFAULT_COMPANY_LOGO_URI } from '@/lib/constants';

type OfferInformationComponentProps = {
  offer: OfferDTO;
}

const DetailsOfferResumeComponent: React.FC<OfferInformationComponentProps> = (
  { offer }
) => {

  const { mediaQuery } = useMediaQueryData();

  return (
    <Box
      sx={{
        padding: 2,
        margin: 2,
        borderRadius: 5,
        boxShadow: 1,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        
      }}
    >
      <Grid container spacing={1}>
        <Grid size={{ xs: 10 }}>
          <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
              {offer.title}
            </Typography>
            <Typography variant="body1" component="p" fontWeight={200} fontSize={18} mt={-1} ml={0}>
              {offer.User.Company?.name}
            </Typography>
          </Box>
          <BoxIconTextInformation
            icon={<LocationOnOutlined sx={{ fontSize: 20 }} />}
            text={`${offer.Location.city}, ${offer.Location.state}, ${offer.Location.Country?.name_es}`}
            fontSize={16}
            fontWeight={700}
          />
          <br></br>
          <Box component={'div'}>
            <Typography variant="body1" component="pre" fontWeight={200} fontSize={16} sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', overflowWrap: 'break-word', ellipsis: 'wrap', textAlign: 'justify' }}>
                  {offer.description}
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 2 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <Image 
            src={offer.User.Company?.Asset?.url ?? DEFAULT_COMPANY_LOGO_URI} 
            alt={offer.User.Company?.name ?? ''}
            width={!mediaQuery ? 50 : 100}
            height={!mediaQuery ? 50 : 100}
            style={{ borderRadius: '50%' }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default DetailsOfferResumeComponent
