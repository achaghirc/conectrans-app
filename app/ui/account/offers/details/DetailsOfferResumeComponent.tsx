import BoxIconTextInformation from '@/app/ui/shared/custom/components/text/BoxIconTextInformation';
import { LocationOnOutlined } from '@mui/icons-material';
import { Box, Paper, Typography } from '@mui/material';
import { OfferDTO } from '@prisma/client';
import React from 'react'
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import useMediaQueryData from '@/app/ui/shared/hooks/useMediaQueryData';

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
              {offer.company.name}
            </Typography>
          </Box>
          <BoxIconTextInformation
            icon={<LocationOnOutlined sx={{ fontSize: 20 }} />}
            text={`${offer.location.city}, ${offer.location.state}, ${offer.location.countryName}`}
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
            src={offer.company.assetUrl} 
            alt={offer.company.name}
            width={!mediaQuery ? 50 : 100}
            height={!mediaQuery ? 50 : 100}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default DetailsOfferResumeComponent
