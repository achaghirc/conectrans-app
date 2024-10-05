import React, { ReactElement } from 'react';
import { Box, Typography, Button, Card, CardContent, CardActions, CardMedia } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import BusinessMan from '../../../public/BusinessMan.png';
import BusinessTable from '../../../public/BusinessTable.png';
import Image, { StaticImageData } from 'next/image';

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
		width: (Number(width) - 100),
		height: (Number(height) - 100),
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
		<SectionCard sx={{ backgroundColor: bgColor, color: color}}>
			<CardContent>
				<Typography 
					variant="h4" 
					component="h2" 
					gutterBottom 
					sx={{ fontSize: {xs: '1.5rem', md: '2.125rem'}, fontWeight: 'bold'}}
				>
						{title}
				</Typography>
				<Typography 
					variant="body2" 
					sx={{ fontSize: {xs: '0.8rem', md: '1.125rem'} }}
				>
						{description}
				</Typography>
			</CardContent>
			<CardMedia sx={{ textAlign: 'center'}}>
				<ImageCustom
					src={image} 
					width={imageWidth ?? 300}
					height={imageHeight ?? 350}
					alt="Banner Home Conectrans" 
					quality={100}
					priority
					/>
			</CardMedia>
			<CardActions sx={{ margin: '0 auto'}}>
					<ActionButton variant="contained" color="primary" onClick={() => console.log(actionUrl)}>
							{actionText}
					</ActionButton>
			</CardActions>
		</SectionCard>
  )
}
