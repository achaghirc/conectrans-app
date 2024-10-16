import React, { useLayoutEffect, useState } from 'react'
import { SignUpCandidateFormData, State, ValidationCIFNIFResult } from '@/lib/definitions';
import Grid from '@mui/material/Grid2';
import { Box, MenuItem, TextField } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { handleZodError, handleZodHelperText } from '@/lib/utils';
import { validateCIFNIFFormat } from '@/lib/actions';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
type CadidateUserFormProps = {
    formData: SignUpCandidateFormData;
    setFormData: (data: any) => void;
    errors: State;
}


export default function CandidatePersonalDataForm({formData, errors, setFormData}: CadidateUserFormProps) {
	dayjs.locale('es');
	const [mediaQuery, setMediaQuery] = useState<boolean | null>(null);
	const [cifError, setCifError] = useState<string | null>(null);

	useLayoutEffect(() => {
		const mediaQuery = window.matchMedia('(min-width: 600px)');
		setMediaQuery(mediaQuery.matches);
		mediaQuery.addEventListener('change', (e) => {
			setMediaQuery(e.matches);
		});
	},[]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let { name, value } = e.target;
		if (name === 'cifnif' && value.length == 0) {
      if (value.length == 0) setCifError(null);
      value = value.toUpperCase();
    }
		setFormData({ ...formData, [name]: value });
	}
	//Validación de CIF/NIF
  const handleCifNifValidation = async (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
		const valid: ValidationCIFNIFResult | undefined = await validateCIFNIFFormat(value);
    if (valid && valid.valid) {
      setCifError(null);
      setFormData({ company: { ...formData, [name]: value } });
    } else {
      const message = valid?.message || 'El CIF/NIF introducido no es válido';
      setCifError(message);
    }
  }

  const cifnifError = () => {
    if (cifError) {
      return true;
    } else {
      return handleZodError(errors, 'cifnif');
    }
  }

  const cifnifHelperText = () => {
    if (cifError) {
      return cifError;
    } else {
      return handleZodHelperText(errors, 'cifnif');
    }
  }

	return (
    <Grid container spacing={2}>
			<Grid size={{xs:12, sm: 6}}>
					<TextField
					fullWidth
					label="Nombre"
					name="name"
					value={formData.name}
					onChange={handleInputChange}
					error={handleZodError(errors,'name')}
					helperText={handleZodHelperText(errors,'name')}
					/>
			</Grid>
			<Grid size={{xs:12, sm: 6}}>
					<TextField
					fullWidth
					label="Apellidos"
					name="lastname"
					value={formData.lastname}
					onChange={handleInputChange}
					error={handleZodError(errors,'lastname')}
					helperText={handleZodHelperText(errors,'lastname')}
					/>
			</Grid>
			<Grid size={{xs:12, sm: 6}}>
				<TextField
				fullWidth
				label="CIF/NIF"
				name="cifnif"
				value={formData.cifnif}
				onBlur={handleCifNifValidation}
				onChange={handleInputChange}
				error={cifnifError()}
				helperText={cifnifHelperText()}
				sx={{
					paddingTop: 'calc(1 * var(--mui-spacing))',
					'.MuiInputLabel-root.MuiFormLabel-filled':{
						transform: 'translate(15px, -0px) scale(0.75) !important',
					},
					'.MuiInputLabel-root': {
						transform: 'translate(14px, 25px) scale(1) !important',
					},
					'.MuiInputLabel-root.Mui-focused':{
						transform: 'translate(15px, -0px) scale(0.75) !important',
					}
				}}
				required
				/>
			</Grid>
			<Grid size={{xs:12, sm: 6}}>
				{mediaQuery == null ? null :
					mediaQuery ? (
						<DatePickerComponent value={dayjs(formData.birthdate)} setValue={(value) => setFormData({...formData, birthdate: value?.format('YYYY-MM-DD') || ''})} />
					) : (
						<DateMobilePickerComponent value={dayjs(formData.birthdate)} setValue={(value) => setFormData({...formData, birthdate: value?.format('YYYY-MM-DD') || ''})} />
					)
				}
			</Grid>
			<Grid size={{xs:12, sm: 12}}>
				<TextField
						fullWidth
						type='text'
						label="Dirección"
						name="streetAddress"
						value={formData.contactInfo.streetAddress}
						onChange={handleInputChange}
						error={handleZodError(errors, 'streetAddress')}
						helperText={handleZodHelperText(errors, 'streetAddress')}
						required
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="País"
						name="country"
						value={formData.contactInfo.country}
						onChange={handleInputChange}
						error={handleZodError(errors, 'country')}
						helperText={handleZodHelperText(errors, 'country')}
						required
						/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="Provincia"
						name="province"
						value={formData.contactInfo.province}
						onChange={handleInputChange}
						error={handleZodError(errors, 'province')}
						helperText={handleZodHelperText(errors, 'province')}
						required
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="Código Postal"
						name="zip"
						value={formData.contactInfo.zip}
						onChange={handleInputChange}
						error={handleZodError(errors, 'zip')}
						helperText={handleZodHelperText(errors, 'zip')}
						required
				/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="Localidad"
						name="locality"
						value={formData.contactInfo.locality}
						onChange={handleInputChange}
						error={handleZodError(errors, 'locality')}
						helperText={handleZodHelperText(errors, 'locality')}
						required
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Teléfono Móvil"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            error={handleZodError(errors, 'phone')}
            helperText={handleZodHelperText(errors, 'phone')}
            required
          />
        </Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Teléfono Fijo"
            name="landlinePhone"
            value={formData.contactInfo.landlinePhone}
            onChange={handleInputChange}
          />
        </Grid>
    </Grid>
  )
}

function DatePickerComponent({value, setValue}: {value: Dayjs, setValue: (value: Dayjs | null) => void}) {
	return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <DemoContainer components={['DatePicker']}>
        <DatePicker
					format='DD/MM/YYYY'
          label="Fecha de nacimiento"
          value={value}
          onChange={(newValue) => setValue(newValue)}
					sx={{
						width: '100%'
					}}
        />
      </DemoContainer>
    </LocalizationProvider>
	)
}

function DateMobilePickerComponent({value, setValue}: {value: Dayjs, setValue: (value: Dayjs | null) => void}) {
	
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
			<DemoContainer components={['MobileDatePicker']}>
				<MobileDatePicker
					format='DD/MM/YYYY'
					label="Fecha de nacimiento"
					value={value}
					onChange={(newValue) => setValue(newValue)}
					sx={{
						width: '100%'
					}}
				/>
			</DemoContainer>
		</LocalizationProvider>
	)
}

