import { EducationDTO, PersonLanguageDTO, ExperienceDTO } from '@/lib/definitions';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, IconButton, Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import React from 'react'

type TableExperiencesProps = {
	languages: PersonLanguageDTO[];
	onAction: (education: PersonLanguageDTO) => void;
};

const TableLanguageComponent: React.FC<TableExperiencesProps> = ({ languages, onAction }) => {
  return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: '100%' }} aria-label="simple table">
				<TableHead sx={{ display: {xs: 'none', sm: 'table-header-group'}}}>
					<TableRow>
						<TableCell align="left">Idioma</TableCell>
						<TableCell align="left">Nivel</TableCell>
						<TableCell align="left">Acción</TableCell>
					</TableRow>
				</TableHead>
				<TableHead sx={{ display: {xs: 'flex', sm: 'none'}, flexDirection: {xs: 'column'}}}>
					<TableRow>
						<TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="left">Idioma</TableCell>
						<TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="left">Nivel</TableCell>
						<TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="left">Acción</TableCell>
					</TableRow>
				</TableHead>
				<TableBody
          sx={{ 
            display: {xs: 'flex', sm: 'table-row-group'},
            flexDirection: {xs: 'column', sm: 'row'},
          }}
        >
          {languages.map((row: PersonLanguageDTO, index: number) => (
						<TableRow
							key={index}
							sx={{
                borderBottom: index % 2 != 0 ? '1px solid #ffffff' : '1px solid #cccccc',
                backgroundColor: {xs: index % 2 != 0 ? '#cccccc' : 'f2f2f2', sm: 'inherit'},
                '&:last-child td, &:last-child th': { border: 0 } 
              }}
						>
							<TableCell sx={tableCellStyles} component="th" scope="row">
                <Box component={'span'} sx={cellHeaderMobile} >Idioma </Box>{row.languageName}
							</TableCell>
							<TableCell sx={tableCellStyles} component="th" scope="row">
                <Box component={'span'} sx={cellHeaderMobile} >Nivel </Box>{row.level}
							</TableCell>
							<TableCell sx={tableCellStyles} align="left">
                <Box component={'span'} sx={cellHeaderMobile} >Acción </Box>
                <IconButton onClick={() => onAction(row)}>
                  <RemoveCircleOutline color='error' />
                </IconButton>
							</TableCell>
						</TableRow>
					))}	
				</TableBody>
			</Table>
		</TableContainer>
	);
};

const cellHeaderMobile: SxProps = {
  display: {xs: 'block', sm: 'none'},
  fontWeight: 'bold',
}

const tableCellStyles: SxProps = {
  display: {xs: 'flex', sm: 'table-cell'},
  flexDirection: {xs: 'row', sm: 'column'},
  justifyContent: 'space-between',
}



export default TableLanguageComponent
