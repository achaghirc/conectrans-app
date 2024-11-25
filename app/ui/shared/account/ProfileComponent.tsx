import React from 'react'
import Grid from '@mui/material/Grid2'
import Image from 'next/image';
import { Box, IconButton, Typography } from '@mui/material';
import { AddPhotoAlternateOutlined } from '@mui/icons-material';

export type ProfileProps = {
  assetUrl?: string | null;
  title: string;
  subtitle: string;
}
const ProfileComponent: React.FC<ProfileProps> = ({assetUrl, title, subtitle}) =>  {
  return (
    <Grid container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            gap: 1,
            mt: {xs: 2, sm: 5},
          }}
        >
          <Grid size={{ xs:12 }} sx={{}}>
            <Box
              sx={{
                position: 'relative',
                width: 150,
                height: 150,
              }}
            >
              <Image
                src={assetUrl ?? 'http://res.cloudinary.com/dgmgqhoui/image/upload/v1730571413/yxthq41pzcbfdij5btlr.png'} 
                alt="Profile Picture"
                width={150}
                height={150}
                style={{
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 10,
                  backgroundColor: 'white',
                  boxShadow: 2,
                  '&:hover': { backgroundColor: 'lightgray' },
                }}
              >
                <AddPhotoAlternateOutlined fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
          <Grid size={{ xs:10 }}>
            <Box>
              <Typography
                variant='h4' 
                component={'h1'} 
                fontWeight={'bold'} 
                textAlign={'center'}
              >
                {title}
              </Typography>
              <Typography variant='subtitle2' component={'p'} color='textSecondary' textAlign={'center'}>
                {subtitle}
              </Typography>
            </Box>
          </Grid>
        </Grid>
  )
}

export default ProfileComponent;