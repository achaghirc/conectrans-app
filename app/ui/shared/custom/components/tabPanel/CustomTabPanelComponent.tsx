import { Box } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`offers-tabpanel-${index}`}
      aria-labelledby={`offers-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ mt: {xs: 1, md: 0}, p: {xs: 0, md: 3 }}}>{children}</Box>}
    </div>
  );
}

export function a11yProps(index: number) {
  return {
    id: `offers-tab-${index}`,
    'aria-controls': `offers-tabpanel-${index}`,
  };
}