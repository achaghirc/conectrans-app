import { EducationDTO } from '@/lib/definitions';
import { Edit, EditOutlined, RemoveCircleOutline } from '@mui/icons-material';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
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
			<Table sx={{ minWidth: { xs: 350, sm: 650} }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell align="left">Título</TableCell>
						<TableCell align="left">Centro</TableCell>
						<TableCell align="left">Inicio</TableCell>
						<TableCell align="left">Fin</TableCell>
						<TableCell align="left">Acción</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
          {educations.map((row: EducationDTO, index: number) => (
						<TableRow
							key={index}
							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
						>
							<TableCell component="th" scope="row">
								{row.title}
							</TableCell>
							<TableCell component="th" scope="row">
								{row.center}
							</TableCell>
							<TableCell align="left">{typeof row.startYear === 'string' ? row.startYear : dayjs(row.startYear).format('LL')}</TableCell>
							<TableCell align="left">{typeof row.endYear === 'string' ? row.endYear : dayjs(row.endYear).format('LL')}</TableCell>
							<TableCell align="left">
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


export default TableEducationComponent
