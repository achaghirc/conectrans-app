import { EducationDTO } from '@/lib/definitions';
import { EditOutlined, RemoveCircleOutline } from '@mui/icons-material';
import { Box, IconButton, Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react'
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

type TableExperiencesProps = {
	educations: EducationDTO[];
	deleteEducationExperience: (education: EducationDTO) => void;
  editEducationExperience: (education: EducationDTO) => void;
};

const TableEducationComponent: React.FC<TableExperiencesProps> = ({ educations, deleteEducationExperience, editEducationExperience }) => {
  return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: '100%' }} aria-label="simple table education">
				<TableHead sx={{ display: {xs: 'none', sm: 'table-header-group'}}}>
					<TableRow>
						<TableCell align="left">Título</TableCell>
						<TableCell align="left">Centro</TableCell>
						<TableCell align="left">Inicio</TableCell>
						<TableCell align="left">Fin</TableCell>
						<TableCell align="left">Acción</TableCell>
					</TableRow>
				</TableHead>
				<TableHead sx={{ display: {xs: 'flex', sm: 'none'}, flexDirection: {xs: 'column'}}}>
					<TableRow>
						<TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="left">Título</TableCell>
						<TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="left">Centro</TableCell>
						<TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="left">Inicio</TableCell>
						<TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="left">Fin</TableCell>
						<TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="left">Acción</TableCell>
					</TableRow>
				</TableHead>
				<TableBody 
          sx={{ 
            display: {xs: 'flex', sm: 'table-row-group'},
            flexDirection: {xs: 'column', sm: 'row'},
          }}
        >
          {educations != undefined && educations.map((row: EducationDTO, index: number) => (
						<TableRow
							key={index}
							sx={{
                borderBottom: index % 2 != 0 ? '1px solid #ffffff' : '1px solid #cccccc',
                backgroundColor: {xs: index % 2 != 0 ? '#cccccc' : 'f2f2f2', sm: 'inherit'},
                '&:last-child td, &:last-child th': { border: 0 } 
              }}
						>
							<TableCell sx={tableCellStyles} component="th" scope="row">
                <Box component={'span'} sx={cellHeaderMobile} >Título </Box>{row.title || ''}
							</TableCell>
							<TableCell sx={tableCellStyles} component="th" scope="row">
                <Box component={'span'} sx={cellHeaderMobile} >Centro </Box>{row.center || ''}
							</TableCell>
							<TableCell sx={tableCellStyles} align="left">
                <Box component={'span'} sx={cellHeaderMobile} >Inicio </Box>{typeof row.startYear === 'string' ? row.startYear ?? '-': dayjs(row.startYear).format('LL')}
              </TableCell>
							<TableCell sx={tableCellStyles} align="left">
                <Box component={'span'} sx={cellHeaderMobile} >Fin </Box>{typeof row.endYear === 'string' ? row.endYear ?? '-' : dayjs(row.endYear).format('LL')}
              </TableCell>
							<TableCell sx={tableCellStyles} align="left">
                <Box component={'span'} sx={cellHeaderMobile} >Acción </Box>
                <IconButton onClick={() => deleteEducationExperience(row)}>
                  <RemoveCircleOutline color='error' />
                </IconButton>
                <IconButton>
                  <EditOutlined onClick={() => editEducationExperience(row)} />
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

export default TableEducationComponent
