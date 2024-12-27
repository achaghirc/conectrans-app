import { Box, Paper, Typography } from "@mui/material";
import { OfferDTO } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import BoxIconTextInformation from "../../shared/custom/components/text/BoxIconTextInformation";
import { BusinessOutlined, EventBusyOutlined, TextSnippetOutlined } from "@mui/icons-material";
import Chip from "@mui/material/Chip";

import dayjs from "dayjs";
import 'dayjs/locale/es';
import SettingButtonMenu from "../../shared/custom/components/button/SettingButtonMenu";
import useMediaQueryData from "../../shared/hooks/useMediaQueryData";
dayjs.locale('es');

type OfferCardComponentProps = {
  offer: OfferDTO;
  handleEdit: (offer: OfferDTO) => void;
  handleDelete: (offer: OfferDTO) => void;
}

const OfferCardComponent: React.FC<OfferCardComponentProps> = (
  {offer, handleEdit, handleDelete}
) => {
  const router = useRouter();
  
  const { mediaQuery } = useMediaQueryData();
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Paper elevation={2} 
      sx={{ 
        display: 'flex', 
        height: {xs: 170, md: '100%'},
        flexDirection: 'row', 
        m: {xs: 'none', md: 2},
        borderRadius: 5,
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)'
        },
        '&:first-child': {
          marginTop: {xs: 1, md: 0}
        },
        '&:last-child': {
          marginBottom: 2
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        router.push(`/account/offers/${encodeURIComponent(offer.id)}`)
      }}
    >
      <Box sx={{ p: {xs: 1, md: 2}, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Image
          src={offer.company!.assetUrl} 
          alt={offer.company!.name}
          width={mediaQuery ? 100 : 60}
          height={mediaQuery ? 100 : 60}
        />
      </Box>
      <Box sx={{ textAlign: 'start', p: { xs: 1, md: 2 }, flexGrow: 1 }}>
        <Typography variant='h4' fontWeight={600} fontSize={{xs: 20, md: 26}}>{offer.title}</Typography>
        <Typography variant='subtitle1' fontWeight={400} color='textSecondary'>{offer.company!.name}</Typography>
        <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'flex-start' }}>
          <BoxIconTextInformation
            icon={<BusinessOutlined sx={{ fontSize: {xs: 16, md: 20} }}/>}
            text={offer.location!.city}
            fontSize={!mediaQuery ? 13 : 16}
            fontWeight={!mediaQuery ? 400 : 200}
          />
          <BoxIconTextInformation
            icon={<TextSnippetOutlined sx={{ fontSize: {xs: 16, md: 20} }}/>}
            text={offer.licenseType.map((licence) => licence.name).join(", ")}
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
          {offer.endDate < new Date() ? (
            <Chip label="Finalizada" variant="outlined" color='error'/>
          ) : (
            <Chip label="Destacada" variant="outlined" color='success'/>
          )}
        </Box>
        <SettingButtonMenu offer={offer} handleEdit={(o: OfferDTO) => handleEdit(o)} handleDelete={(o: OfferDTO) => handleDelete(o)}/>
      </Box>
    </Paper>
  )
}

export default OfferCardComponent;


