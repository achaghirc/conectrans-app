import { EducationDTO, PersonLanguageDTO, ExperienceDTO } from '@/lib/definitions';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import React from 'react'

type TableExperiencesProps = {
	languages: PersonLanguageDTO[];
	onAction: (education: PersonLanguageDTO) => void;
};

const TableLanguageComponent: React.FC<TableExperiencesProps> = ({ languages, onAction }) => {
  return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: { xs: 350, sm: 650} }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell align="left">Idioma</TableCell>
						<TableCell align="left">Nivel</TableCell>
						<TableCell align="left">Acción</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
          {languages.map((row: PersonLanguageDTO, index: number) => (
						<TableRow
							key={index}
							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
						>
							<TableCell component="th" scope="row">
								{row.languageName}
							</TableCell>
							<TableCell component="th" scope="row">
								{row.level}
							</TableCell>
							<TableCell align="left">
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


export default TableLanguageComponent
