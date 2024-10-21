import React, { ChangeEvent } from 'react'
import Grid from '@mui/material/Grid2';
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, InputLabel, ListItemText, MenuItem, MenuProps, Select, SelectChangeEvent, TextField } from '@mui/material';
import { Country, Licence, SignUpCandidateFormData, State } from '@/lib/definitions';
import { handleZodError, handleZodHelperText } from '@/lib/utils';
import { Check } from '@mui/icons-material';

type CadidateUserFormProps = {
    formData: SignUpCandidateFormData;
    setFormData: (data: any) => void;
    errors: State;
		countries: Country[];
}

const MenuProperties : Partial<MenuProps>= {
		PaperProps: {
			style: {
				maxHeight: 300,
				overflow: 'auto',
			},
		},
		anchorOrigin: {
			vertical: 'bottom',
			horizontal: 'left',
		},
		transformOrigin: {
			vertical: 'top',
			horizontal: 'left',
		},
}

const adrLicenceCodes = [
	{
		code: 'BASIC',
		name: 'Básico'
	},
	{
		code: 'TANKS',
		name: 'Cisternas'
	},
	{
		code: 'EXPLOSIVES',
		name: 'Explosivos'
	},
	{
		code: 'RADIOACTIVES',
		name: 'Radioactivos'
	},
]

const workRanges = [
	{
		code: 'INTERNATIONAL',
		name: 'Internacional'
	},
	{
		code: 'NATIONAL',
		name: 'Nacional'
	},
	{
		code: 'REGIONAL',
		name: 'Regional'
	},
	{
		code: 'LOCAL',
		name: 'Local'
	}
]



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

export default function CandidateProfesionalDataForm({formData, errors, countries, setFormData}: CadidateUserFormProps) {
    	
	const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let { value } = e.target;
		const licenceType = licenceCodes.find((type) => type.code === value);
		setFormData({licence: {...formData.licence, code: licenceType?.code, name: licenceType?.name}})
	}

	const handleFormControlSelect = (e: SelectChangeEvent<string | string[]>) => {
			e.preventDefault();
			const { name, value } = e.target;
			if(name === 'workRange'){
				setFormData({...formData, [name]: value});
			}else {
				setFormData({licence: {...formData.licence, [name]: value}});
			}
	}

	const handleCheckChange = (e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
		e.preventDefault();
		const { name, id } = e.target;
		let value = 'No'
		if (name === 'Si' && checked){
				value = 'Si'
		}
		setFormData({licence: {...formData.licence, [id]: value}})
	}

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs:12, sm: 6 }}>
        <TextField
          fullWidth
          select
          label="Tipo de carnet"
          name="code"
          value={formData.licence.code ?? ''}
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
      </Grid>
			<Grid size={{ xs: 12, sm: 6 }}>
				<FormControl fullWidth error={handleZodError(errors, 'country')} required>
					<InputLabel>País de emisión</InputLabel>
					<Select
						label="País de emisión"
						id='country'
						name='country'
						value={formData.licence.country ?? ''}
						onChange={(e:SelectChangeEvent<string>) => handleFormControlSelect(e)}
						MenuProps={MenuProperties}
					>
						{countries.map((country) => (
							<MenuItem key={country.id} value={country.cod_iso2 ?? 'ES'}>
								{country.name_es}
							</MenuItem>
						))}
					</Select>
					<FormHelperText>{handleZodHelperText(errors, 'country')}</FormHelperText>
				</FormControl>
			</Grid>
			<Grid size={{ xs: 12 }}>
				<FormControl fullWidth error={handleZodError(errors, 'adrCode')}>
					<InputLabel id="adr_carnet">Carnet de mercancías peligrosas</InputLabel>
					<Select
						label='Carnet de mercancías peligrosas'
						id='adr_carnet'
						multiple
						name="adrCode"
						value={formData.licence.adrCode ?? []}
						onChange={(e: SelectChangeEvent<string | string[]>) => handleFormControlSelect(e)}
						MenuProps={MenuProperties}
					>
						{adrLicenceCodes && adrLicenceCodes.map((tipo) => (
							<MenuItem key={tipo.code} value={tipo.code}>
								{tipo.name}
							</MenuItem>
						))}
					</Select>
					<FormHelperText>{handleZodHelperText(errors, 'adrCode') ?? 'Carnet de mercancías peligrosas'}</FormHelperText>
				</FormControl>
			</Grid>
			<Grid size={{ xs: 12, sm: 6 }}>
				<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
					<FormLabel component={"label"}>
							Tacógrafo digital
					</FormLabel>
					<FormGroup sx={{ display: 'flex', flexDirection: 'row'}}>
						<FormControlLabel
							control={<Checkbox 
								checked={formData.licence.digitalTachograph === 'Si'} 
								onChange={handleCheckChange} 
								name='Si' 
								id='digitalTachograph'
							/>}
							label={'Si'}
							/>
						<FormControlLabel
							control={<Checkbox 
								checked={formData.licence.digitalTachograph === 'No'} onChange={(e:ChangeEvent<HTMLInputElement>, checked: boolean ) => handleCheckChange(e, checked)} 
								name='No' 
								id='digitalTachograph'
								/>
							}
							label={'No'}
							/>
					</FormGroup>
					<FormHelperText>{handleZodHelperText(errors, 'digitalTachograph')}</FormHelperText>
				</Box>
			</Grid>
			<Grid size={{ xs: 12, sm: 6 }}>
				<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
					<FormLabel component={"label"}>
							Certificado CAP
					</FormLabel>
					<FormGroup sx={{ display: 'flex', flexDirection: 'row'}}>
						<FormControlLabel
							control={
								<Checkbox 
									checked={formData.licence.capCertificate === 'Si'} 
									onChange={handleCheckChange} 
									name='Si'
									id='capCertificate'
									/>
								}
							label={'Si'}
							/>
						<FormControlLabel
							control={
								<Checkbox 
									checked={formData.licence.capCertificate === 'No'} 
									onChange={(e:ChangeEvent<HTMLInputElement>, checked: boolean ) => handleCheckChange(e, checked)} 
									name='No' 
									id='capCertificate'
								/>}
							label={'No'}
							/>
					</FormGroup>
					<FormHelperText>{handleZodHelperText(errors, 'digitalTachograph')}</FormHelperText>
				</Box>
			</Grid>
			<Grid size={{ xs: 12 }}>
				<FormControl fullWidth error={handleZodError(errors, 'adrCode')}>
					<InputLabel id="work_range">Ámbito de trabajo</InputLabel>
					<Select
						label='Ámbito de trabajo'
						id='work_range'
						multiple
						name="workRange"
						value={formData.workRange ?? []}
						renderValue={(selected) => selected.join(', ')}
						onChange={(e: SelectChangeEvent<string[]>) => handleFormControlSelect(e)}
						MenuProps={MenuProperties}
					>
						{workRanges && workRanges.map((tipo) => (
							<MenuItem key={tipo.code} value={tipo.name}>
								<Checkbox checked={formData.workRange.includes(tipo.name)} />
								<ListItemText primary={tipo.name} />
							</MenuItem>
						))}
					</Select>
					<FormHelperText>{handleZodHelperText(errors, 'adrCode') ?? 'Carnet de mercancías peligrosas'}</FormHelperText>
				</FormControl>
			</Grid>
			<Grid>
				
			</Grid>
    </Grid>
  )
}
