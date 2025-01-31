import { EducationDTO, Licence } from '@/lib/definitions';
import { EditOutlined, RemoveCircleOutline } from '@mui/icons-material';
import { Box, IconButton, Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react'
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

type TableLicenceComponentProps = {
	licences: Licence[] | undefined;
	deleteLicenceExperience: (education: Licence) => void;
  editLicenceExperience?: (education: Licence) => void;
};

const TableLicenceComponent: React.FC<TableLicenceComponentProps> = ({ licences, deleteLicenceExperience, editLicenceExperience }) => {
  return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: '100%' }} aria-label="simple table education">
				<TableHead sx={{ display: {xs: 'none', sm: 'table-header-group'}}}>
					<TableRow>
						<TableCell align="left">Nombre</TableCell>
						<TableCell align="left">País de emision</TableCell>
						<TableCell align="left">Acción</TableCell>
					</TableRow>
				</TableHead>
				<TableHead sx={{ display: {xs: 'flex', sm: 'none'}, flexDirection: {xs: 'column'}}}>
					<TableRow>
						<TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="left">Nombre</TableCell>
						<TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="left">País de emision</TableCell>
						<TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="left">Acción</TableCell>
					</TableRow>
				</TableHead>
				<TableBody 
          sx={{ 
            display: {xs: 'flex', sm: 'table-row-group'},
            flexDirection: {xs: 'column', sm: 'row'},
          }}
        >
          {licences != undefined && licences.map((row: Licence, index: number) => (
						<TableRow
							key={index}
							sx={{
                borderBottom: index % 2 != 0 ? '1px solid #ffffff' : '1px solid #cccccc',
                backgroundColor: {xs: index % 2 != 0 ? '#cccccc' : 'f2f2f2', sm: 'inherit'},
                '&:last-child td, &:last-child th': { border: 0 } 
              }}
						>
							<TableCell sx={tableCellStyles} component="th" scope="row">
                <Box component={'span'} sx={cellHeaderMobile} >Name </Box>{row.name|| ''}
							</TableCell>
							<TableCell sx={tableCellStyles} component="th" scope="row">
                <Box component={'span'} sx={cellHeaderMobile} >Country </Box>{row.countryName || ''}
							</TableCell>
							<TableCell sx={tableCellStyles} align="left">
                <Box component={'span'} sx={cellHeaderMobile} >Acción </Box>
                <IconButton onClick={() => deleteLicenceExperience(row)}>
                  <RemoveCircleOutline color='error' />
                </IconButton>
                {editLicenceExperience && (
                  <IconButton>
                    <EditOutlined onClick={() => editLicenceExperience(row)} />
                  </IconButton>
                )}
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

export default TableLicenceComponent
