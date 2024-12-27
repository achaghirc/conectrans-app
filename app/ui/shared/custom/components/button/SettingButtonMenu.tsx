import { DeleteOutline, EditOutlined, SettingsOutlined } from "@mui/icons-material";
import { Box, ClickAwayListener, IconButton, Menu, MenuItem, styled, Typography } from "@mui/material";
import { OfferDTO } from "@prisma/client";
import React from "react";

type SettingButtonMenuProps = {
  offer: OfferDTO;
  handleEdit: (offer: OfferDTO) => void;
  handleDelete: (offer: OfferDTO) => void;
}
//Generate a styled component Menu with border-radius: 5px
const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '25px !important',
  },
}));

const SettingButtonMenu: React.FC<SettingButtonMenuProps> = ({
  offer,
  handleEdit,
  handleDelete
}) => {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e: MouseEvent | TouchEvent | any) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton 
        size="large"
        aria-label="settings of current offer"
        aria-controls="menu-settings-offer"
        aria-haspopup="true"
        onClick={(e) => {
          e.stopPropagation();
          console.log('click icon button');
          handleMenu(e);
        }}
        color="inherit"
      >

        <SettingsOutlined />
      </IconButton>
      <StyledMenu
        key={offer.id}
        id="menu-settings-offer"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}   
      >
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(offer);
            handleClose(e);
          }} 
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1  }}>
          <Typography variant='subtitle1' fontWeight={700} color='textPrimary' sx={{display: {xs: 'none', md: 'block'}}}>Eliminar</Typography>
          <DeleteOutline color='error' />
        </MenuItem>
        <MenuItem 
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(offer);
            handleClose(e);
          }} 
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Typography variant='subtitle1' fontWeight={700} color='textPrimary' sx={{display: {xs: 'none', md: 'block'}}}>Editar</Typography>
          <EditOutlined />
        </MenuItem>
      </StyledMenu>
    </Box>
  )
}

export default SettingButtonMenu;