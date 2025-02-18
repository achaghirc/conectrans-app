import React from 'react';
import { Typography, Button, Card, CardContent, CardActions, CardMedia } from "@mui/material";
import { styled } from '@mui/material/styles';
import Image, { StaticImageData } from 'next/image';
import ButtonCustom from './button/ButtonCustom';
import Link from 'next/link';

type CardSectionPropsType = {
    title: string;
    description: string;
    actionText: string;
    actionUrl: string;
    image: StaticImageData;
		color?: string;
		bgColor?: string;
		imageWidth?: number;
		imageHeight?: number;
}

// Estilos personalizados para cada Card
const SectionCard = styled(Card)(({ theme }) => ({
  display: "flex",
	flexDirection: "column",
	alignContent: "center",
	boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)", // Sombra ligera para los contenedores
  borderRadius: "15px", // Bordes redondeados
  backgroundColor: "#FAFDFF", // Fondo blanco
	padding: "20px",
  [theme.breakpoints.down('sm')]: {
    marginBottom: "20px", // Separación entre las secciones en pantallas pequeñas
  },
  [theme.breakpoints.up('md')]: {
    width: "70%",
    height: "auto",
  }
}));

// Estilos del botón
const ActionButton = styled(Button)(({ theme }) => ({
  marginTop: '20px',
  [theme.breakpoints.down('sm')]: {
    width: '100%', // Botón con ancho completo en pantallas pequeñas
  },
}));

const ImageCustom = styled(Image)(({ theme, width, height }) => ({
	borderRadius: "15px", // Bordes redondeados
	width: width,
	height:height,
	[theme.breakpoints.down('sm')]: {
		marginBottom: "20px", // Separación entre las secciones en pantallas pequeñas
		width: width ?? 125,
	  height: height ?? 150,
    // width: (Number(width) - 100),
		// height: (Number(height) - 100),
	},
  [theme.breakpoints.up('md')]: {
    width: width ?? 150,
    height: height ?? 150,
  },
}));


export const CardSectionCustom = ({
		title, 
		description, 
		actionText, 
		actionUrl, 
		image,
		color,
		bgColor,
		imageWidth,
		imageHeight
	}: CardSectionPropsType) => {
  return (
		<SectionCard sx={{ backgroundColor: bgColor ?? 'primary', color: color}}>
			<CardContent>
				<Typography 
					variant="h4" 
					component="h2" 
					gutterBottom 
					sx={{ fontSize: {xs: '1.5rem', md: '1.725rem'}, fontWeight: 'bold'}}
				>
						{title}
				</Typography>
				<Typography 
					variant="body2"
          component={'p'} 
					sx={{ fontSize: {xs: '0.8rem', md: '1 rem'} }}
				>
						{description}
				</Typography>
			</CardContent>
			<CardMedia sx={{ textAlign: 'center'}}>
				<ImageCustom
					src={image} 
					width={imageWidth}
					height={imageHeight}
					alt="Banner Home Conectrans" 
					quality={100}
					priority
					/>
			</CardMedia>
			<CardActions sx={{ margin: '0 auto'}}>
        <Link href={actionUrl} passHref>
          <ButtonCustom 
            title='Comenzar'
            onClick={() => console.log(actionUrl)}
            variant={actionUrl === '/company' ? 'outlined' : 'contained'}
            color='primary'
            loading={false}
          />
        </Link>
			</CardActions>
		</SectionCard>
  )
}
