import React from 'react'
import Grid from '@mui/material/Grid2';
import { TextField } from '@mui/material';
import { SignUpCandidateFormData, State } from '@/lib/definitions';

type CadidateUserFormProps = {
    formData: SignUpCandidateFormData;
    setFormData: (data: any) => void;
    errors: State;
}

const licenceCodes =  [
	{
		code: 'B',
		name: 'B',
	},
	{
		code: 'C1',
		name: 'C1',
	},
	{
		code: 'C1E',
		name: 'C1+E',
	},
	{
		code: 'C',
		name: 'C',
	},
	{
		code: 'C+E',
		name: 'C+E',
	},
	{
		code: 'D1',
		name: 'D1',
	},
	{
		code: 'D1E',
		name: 'D1+E',
	},
	{
		code: 'D',
		name: 'D',
	},
	{
		code: 'DE',
		name: 'D+E',
	}
];

export default function CandidateProfesionalDataForm({formData, setFormData, errors}: CadidateUserFormProps) {
    	
	// const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	let { name, value } = e.target;
	// 	setFormData({ ...formData, licence: licenceCodes.find((tipo) => tipo.code === value) || {} });
	// }

  return (
    <div>
      	{/* <Grid size={{xs:12}}>
        <TextField
          fullWidth
          select
          label="Tipo de carnet"
          name="activityType"
          value={formData.licence.code}
          onChange={handleSelectChange}
          error={handleZodError(errors,'activityType')}
          helperText={handleZodHelperText(errors,'activityType')}
          required
        >
          {licenceCodes && licenceCodes.map((tipo) => (
            <MenuItem key={tipo.code} value={tipo.code}>
              {tipo.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid> */}
    </div>
  )
}
