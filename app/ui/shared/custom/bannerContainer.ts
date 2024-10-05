import { Box} from "@mui/material";
import { styled } from '@mui/material/styles'

export const BannerContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '100%',
    height: '500px',
    borderRadius: "20px", // Bordes redondeados
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)", // Sombra para la elevación
    marginRight: "20px",
    overflow: "hidden", // Asegurar que la imagen de fondo respete los bordes redondeados
    backgroundColor: "#fff", // Color de fondo por si la imagen tarda en cargar
    [theme.breakpoints.down('sm')]: {
      height: '400px',
    },
  }));
  
  export const TextContainer = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '5%',
    transform: 'translateY(-50%)',
    color: 'white',
    zIndex: 2,
    [theme.breakpoints.down('sm')]: {
      left: '2%',
      transform: 'translateY(-90%)',
    },
    [theme.breakpoints.up('sm')]: {
      left: '5%',
      transform: 'translateY(-60%)',
    },
  }));
  export const ButtonContainer = styled(Box)(({ theme }) => ({
    position: 'absolute',
    zIndex: 2,
    [theme.breakpoints.down('sm')]: {
      top: '70%',
      left: '20%',
      transform: 'translateY(-20%)',
    },
    [theme.breakpoints.down('md') && theme.breakpoints.up('sm')]: {
      top: '70%',
      right: '25%',
      transform: 'translateY(100%)',
    },
    [theme.breakpoints.down('lg') && theme.breakpoints.up('md') ]: {
      top: '80%',
      right: '30%',
      transform: 'translateY(-50%)',
    },
    [theme.breakpoints.up('lg')]: {
      top: '50%',
      right: '5%',
      transform: 'translateY(-50%)',
    },
  }));
  