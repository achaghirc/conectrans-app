'use client';
import { Box, Paper, Tooltip, Typography } from "@mui/material";
import { OfferDTO } from "@prisma/client";
import Image from "next/image";
import React from "react";
import BoxIconTextInformation from "../../shared/custom/components/box/BoxIconTextInformation";
import { BusinessOutlined, EventBusyOutlined, PeopleAltOutlined, TextSnippetOutlined } from "@mui/icons-material";
import Chip from "@mui/material/Chip";
import SettingButtonMenu from "../../shared/custom/components/button/SettingButtonMenu";
import useMediaQueryData from "../../shared/hooks/useMediaQueryData";

import dayjs from "dayjs";
import 'dayjs/locale/es';
import { cardMobileStyles, paperStyles } from "../../shared/styles/styles";
import { DEFAULT_COMPANY_LOGO_URI } from "@/lib/constants";
import { Session } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
dayjs.locale('es');

type OfferCardComponentProps = {
  offer: OfferDTO;
  session?: Session | null;
  handleEdit?: (offer: OfferDTO) => void;
  handleDelete?: (offer: OfferDTO) => void;
}

const OfferCardComponent: React.FC<OfferCardComponentProps> = (
  {session, offer, handleEdit, handleDelete}
) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const { mediaQuery } = useMediaQueryData();
  const asset = offer.User.Company?.Asset != undefined && offer.User.Company.Asset.url != "" ? offer.User.Company.Asset.url : DEFAULT_COMPANY_LOGO_URI;
  
  
  const getStatusChip = () => {
    if (offer.endDate < new Date()) {
      return <Chip label="Finalizada" variant="outlined" color='error'/>
    } else if (offer.isFeatured) {
      return <Chip label="Destacada" variant="outlined" color='success'/>
    }
  }
  const getApplicationOfferCount = () => {
    const isCompanyAdmin = session && session.user?.roleCode == 'COMPANY' && session.user?.id == offer.userId;
    if(isCompanyAdmin) {
      return (
        <Tooltip
            title="Número de candidatos"
            placement="top"
          >
          <BoxIconTextInformation
            icon={<PeopleAltOutlined sx={{ fontSize: {xs: 16, md: 20} }}/>}
            text={offer._count?.ApplicationOffer.toString() ?? '0'}  
            fontSize={!mediaQuery ? 13 : 16 }
            fontWeight={400}
            onClick={() => {
              try {
                router.push(`/account-company/offers/${offer.id}/candidates`);
              } catch (error) {
                console.log(error);
              }
            }}
          />
        </Tooltip>
      )
    }
  }

  return (
    <Box sx={{
      position: 'relative',
      ...(loading && {
        backgroundColor: {xs: 'rgba(184, 184, 184, 0.5)', md: 'transparent'}, // Add a semi-transparent white background
        pointerEvents: 'none', // Disable all interactions
      }),
      pr: {xs: 2, sm: 0},
      pl: {xs: 2, sm: 0}
    }}>
    <Box sx={cardMobileStyles}>
      <Box sx={{ p: {xs: 1, md: 2}, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Image
          src={asset} 
          alt={offer.User?.Company?.name ?? ''}
          width={60}
          height={60}
          style={{ borderRadius: '50%' }}
          />
      </Box>
      <Box sx={{ textAlign: 'start', p: { xs: 1, md: 2 }, flexGrow: 1 }}>
        <Typography variant='h4' fontWeight={600} fontSize={{xs: 20, md: 26}}>{offer.title}</Typography>
        <Typography variant='subtitle1' fontWeight={400} color='textSecondary'>{offer.User?.Company?.name}</Typography>
        <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'flex-start' }}>
          <BoxIconTextInformation
            icon={<BusinessOutlined sx={{ fontSize: {xs: 16, md: 20} }}/>}
            text={offer.Location.state ?? ''}
            fontSize={!mediaQuery ? 13 : 16}
            fontWeight={!mediaQuery ? 400 : 200}
          />
          <BoxIconTextInformation
            icon={<TextSnippetOutlined sx={{ fontSize: {xs: 16, md: 20} }}/>}
            text={offer.OfferPreferences.filter((preferences) => preferences.type == 'CARNET').map((licence) => licence.EncoderType.name).join(", ") ?? ''}
            fontSize={!mediaQuery ? 13 : 16}
            fontWeight={!mediaQuery ? 400 : 200}
          />
          </Box>
      </Box>
      <Box sx={{ m: {xs: 1, md: 0}, p: {xs: 0, md: 2}, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between'}}>
        <Box>
          {getStatusChip()}
        </Box>
        <Box>
          {getApplicationOfferCount()}
        </Box>
      </Box>
    </Box>
    <Paper elevation={2} sx={paperStyles}>
      <Box sx={{ p: {xs: 1, md: 2}, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Image
          src={asset} 
          alt={offer.User.Company?.name ?? ''}
          width={mediaQuery ? 100 : 60}
          height={mediaQuery ? 100 : 60}
          style={{ borderRadius: '50%' }}
        />
      </Box>
      <Box sx={{ textAlign: 'start', p: { xs: 1, md: 2 }, flexGrow: 1 }}>
        <Typography variant='h4' fontWeight={600} fontSize={{xs: 20, md: 26}}>{offer.title}</Typography>
        <Typography variant='subtitle1' fontWeight={400} color='textSecondary'>{offer.User.Company?.name}</Typography>
        <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'flex-start' }}>
          <BoxIconTextInformation
            icon={<BusinessOutlined sx={{ fontSize: {xs: 16, md: 20} }}/>}
            text={offer.Location.state ?? ''}
            fontSize={!mediaQuery ? 13 : 16}
            fontWeight={!mediaQuery ? 400 : 200}
          />
          <BoxIconTextInformation
            icon={<TextSnippetOutlined sx={{ fontSize: {xs: 16, md: 20} }}/>}
            text={offer.OfferPreferences.filter((pref) => pref.type == 'CARNET')?.map((licence) => licence.EncoderType.name).join(", ") ?? ''}
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
          {getApplicationOfferCount()}
        </Box>
        {handleEdit && handleDelete && (<SettingButtonMenu offer={offer} handleEdit={(o: OfferDTO) => handleEdit(o)} handleDelete={(o: OfferDTO) => handleDelete(o)}/>)}
      </Box>
    </Paper>
    </Box>
  )
}

export default OfferCardComponent;


