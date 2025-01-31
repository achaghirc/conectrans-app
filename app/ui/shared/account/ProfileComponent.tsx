import React from 'react'
import Grid from '@mui/material/Grid2'
import Image from 'next/image';
import { Box, IconButton, Typography } from '@mui/material';
import { AddPhotoAlternateOutlined } from '@mui/icons-material';
import { DEFAULT_COMPANY_LOGO_URI } from '@/lib/constants';
import useMediaQueryData from '../hooks/useMediaQueryData';

export type ProfileProps = {
  assetUrl?: string | null;
  title: string;
  subtitle: string;
  direction?: 'row' | 'column';
  justify?: 'flex-start' | 'center' | 'flex-end';
  editable?: boolean;
}
const ProfileComponent: React.FC<ProfileProps> = ({assetUrl, title, subtitle, direction, justify, editable}) =>  {
  const { mediaQuery } = useMediaQueryData();
  return (
    <Box component={'div'}
      sx={{
        display: 'flex',
        flexDirection: direction ?? 'column',
        justifyContent: justify ?? 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        gap: 1
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          position: 'relative',
          width: mediaQuery ? 150 : 100,
          height: mediaQuery ? 150 : 100,
        }}
      >
        <Image
          src={assetUrl ?? DEFAULT_COMPANY_LOGO_URI } 
          alt="Profile Picture"
          width={mediaQuery ? 150 : 100}
          height={mediaQuery ? 150 : 100}
          style={{
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
        {editable ? (
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              bottom: direction === 'row' ? 10 : 0,
              right: direction === 'row' ? 0 : -18,
              backgroundColor: 'white',
              boxShadow: 2,
              '&:hover': { backgroundColor: 'lightgray' },
            }}
            >
            <AddPhotoAlternateOutlined fontSize="small" />
          </IconButton>
        ): null}
      </Box>
      <Box>
        <Typography
          variant='h4' 
          component={'h1'} 
          fontWeight={'bold'} 
          textAlign={'center'}
          fontSize={mediaQuery ? 36 : 20}
        >
          {title}
        </Typography>
        <Typography variant='subtitle2' component={'p'} color='textSecondary' textAlign={'center'}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  )
}

export default ProfileComponent;