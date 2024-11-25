import { SignUpExperienceData } from '@/lib/definitions';
import { RemoveCircleOutline } from '@mui/icons-material';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react'

type TableExperiencesProps = {
	experiences: SignUpExperienceData[];
	deleteExperience: (experience: SignUpExperienceData) => void;
};

const TableExperiencesComponent: React.FC<TableExperiencesProps> = ({ experiences, deleteExperience }) => {
	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: { xs: 350, sm: 650} }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell align="left">Nombre</TableCell>
						<TableCell align="left">Inicio</TableCell>
						<TableCell align="left">Fin</TableCell>
						<TableCell align="left">Acción</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{experiences.map((row) => (
						<TableRow
							key={row.experienceType}
							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
						>
							<TableCell component="th" scope="row">
								{row.experienceType}
							</TableCell>
							<TableCell align="left">{row.startYear}</TableCell>
							<TableCell align="left">{row.endYear}</TableCell>
							<TableCell align="left">
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


export default TableExperiencesComponent
