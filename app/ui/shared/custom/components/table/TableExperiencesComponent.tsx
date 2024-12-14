import React from 'react'
import { ExperienceDTO } from '@/lib/definitions';
import { RemoveCircleOutline } from '@mui/icons-material';
import { Box, IconButton, Paper, SxProps, Table, TableBody, TableCell, TableCellProps, TableContainer, TableHead, TableRow } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');
type TableExperiencesProps = {
	experiences: ExperienceDTO[];
	deleteExperience: (experience: ExperienceDTO) => void;
};

const TableExperiencesComponent: React.FC<TableExperiencesProps> = ({ experiences, deleteExperience }) => {
	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: '100%' }} aria-label="simple table">
				<TableHead sx={{ display: {xs: 'none', sm: 'table-header-group'}}}>
					<TableRow>
						<TableCell align="left">Nombre</TableCell>
						<TableCell align="left">Inicio</TableCell>
						<TableCell align="left">Fin</TableCell>
						<TableCell align="left">Acción</TableCell>
					</TableRow>
				</TableHead>
        <TableHead sx={{ display: {xs: 'flex', sm: 'none'}, flexDirection: {xs: 'column'}}}>
          <TableRow>
            <TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="left">Nombre</TableCell>
            <TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="right">Inicio</TableCell>
            <TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="right">Fin</TableCell>
            <TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="right">Acción</TableCell>
          </TableRow>
        </TableHead>
				<TableBody 
          sx={{ 
            display: {xs: 'flex', sm: 'table-row-group'},
            flexDirection: {xs: 'column', sm: 'row'},
          }}
        >
					{experiences.map((row: ExperienceDTO, index: number) => (
            <TableRow
              key={index}
              sx={{
                borderBottom: index % 2 != 0 ? '1px solid #ffffff' : '1px solid #cccccc',
                backgroundColor: {xs: index % 2 != 0 ? '#cccccc' : 'f2f2f2', sm: 'inherit'},
                '&:last-child td, &:last-child th': { border: 0 } 
              }}
            >
              <TableCell sx={tableCellStyles} component="th" scope="row" align='left'>
                <Box component={'span'} sx={cellHeaderMobile} >Nombre </Box>{row.experienceType}
              </TableCell>
              <TableCell sx={tableCellStyles} align="left">
                <Box component={'span'} sx={cellHeaderMobile} >Inicio </Box>{typeof row.startYear === 'string' ? row.startYear : dayjs(row.startYear).format('LL')}
              </TableCell>
              <TableCell sx={tableCellStyles} align="left">
                <Box component={'span'} sx={cellHeaderMobile} >Fin </Box>{typeof row.endYear === 'string' ? row.endYear : dayjs(row.endYear).format('LL')}
              </TableCell>
              <TableCell sx={tableCellStyles} align="left">
                <Box component={'span'} sx={cellHeaderMobile} >Acción </Box>
                <IconButton onClick={() => deleteExperience(row)}>
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



export default TableExperiencesComponent
