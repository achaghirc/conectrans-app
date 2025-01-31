import { MenuProps } from "@mui/material";

export const MenuProperties : Partial<MenuProps>= {
  PaperProps: {
    style: {
      maxHeight: 300,
      overflow: 'auto',
    },
  },
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
}

export const cardMobileStyles = {
  display: {xs: 'flex', sm: 'none'},
  height: '100%',
  flexDirection: 'row',
  m: { xs: 'none', md: 2 },
  borderRadius: 5,
  cursor: 'pointer',
  '&:first-child': {
    marginTop: { xs: 0, md: 0 },
  },
  '&:before': {
    //Divider line
    content: '""',
  },
  '&:last-child': {
    marginBottom: 4,
  },
}

export const paperStyles = {
  display: {xs: 'none', sm: 'flex'},
  height: { xs: 100, md: '100%' },
  flexDirection: 'row',
  m: { xs: 'none', md: 2 },
  borderRadius: 5,
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)',
  },
  '&:first-child': {
    marginTop: { xs: 1, md: 0 },
  },
  '&:last-child': {
    marginBottom: 2,
  },
};


