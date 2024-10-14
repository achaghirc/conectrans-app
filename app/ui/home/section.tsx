'use client';

import React from 'react';
import { Box } from "@mui/material";
import Grid from '@mui/material/Grid2';
import BusinessMan from '../../../public/BusinessMan.png';
import BusinessTable from '../../../public/BusinessTable.png';
import { CardSectionCustom } from '../shared/custom/components/sectionCustom';

export default function SectionCards() {
  return (
    <Box sx={{ padding: '20px 5px' }}>
      <Grid container spacing={4}>
        {/* Sección Candidatos */}
        <Grid size={{ xs:12, md:6}}>
          <CardSectionCustom
            title='Candidatos' 
            description='Encuentra las mejores ofertas de trabajo en el sector del transporte y conecta con empresas que valoran tus habilidades y experiencia.' 
            actionText='Comenzar'
            actionUrl='/candidates'
            image={BusinessMan}
            />
        </Grid>

        {/* Sección Empresas */}
        <Grid size={{ xs:12, md:6}}>
						<CardSectionCustom 
							title='Empresa' 
							description='Publica tus ofertas de trabajo, conecta con profesionales capacitados para tus proyectos de transporte y expande tu red de contratación.' 
							actionText='Comenzar'
							actionUrl='/company'
							image={BusinessTable}
							imageWidth={450}
							imageHeight={350}
							color='#fff'
							bgColor='#0B2C38'
							/>
        </Grid>
      </Grid>
    </Box>
  );
}
