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
