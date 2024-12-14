'use client';
import React, { ChangeEvent, useLayoutEffect, useState } from 'react'
import { Country, Province, SignUpCandidateFormData, State, ValidationCIFNIFResult } from '@/lib/definitions';
import Grid from '@mui/material/Grid2';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { handleZodError, handleZodHelperText } from '@/lib/utils';
import { validateCIFNIFFormat } from '@/lib/actions';
import { DateMobilePickerComponent, DatePickerComponent } from '@/app/ui/shared/custom/components/datePickerCustom';
import { getProvincesByCountryId } from '@/lib/data/geolocate';

type CadidateUserFormProps = {
    formData: SignUpCandidateFormData;
    setFormData: (data: any) => void;
    errors: State;
	countries: Country[];
}


export default function CandidatePersonalDataForm({formData, errors, countries, setFormData}: CadidateUserFormProps) {
	const [mediaQuery, setMediaQuery] = useState<boolean | null>(null);
	const [cifError, setCifError] = useState<string | null>(null);
	const [provinces, setProvinces] = useState<Province[]>([]);
	
	useLayoutEffect(() => {
		const mediaQuery = window.matchMedia('(min-width: 600px)');
		setMediaQuery(mediaQuery.matches);
		mediaQuery.addEventListener('change', (e) => {
			setMediaQuery(e.matches);
		});
	},[]);

	const handleInputContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let { name, value } = e.target;
		if (name === 'cifnif' && value.length == 0) {
      if (value.length == 0) setCifError(null);
      value = value.toUpperCase();
    }
		setFormData({contactInfo: {...formData.contactInfo, [name]: value }});
	}

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	}

	const handleSelectChange = async (e: SelectChangeEvent<string>) => {
		const { name, value } = e.target;
		let contactInfo = formData.contactInfo;
		//Get provinces of the selected country
		if(name === 'country') {
			const country = countries.find((country) => country.id === parseInt(value));
			if (country && country.cod_iso2) {
				const provinces: Province[] | undefined = await getProvincesByCountryId(country.id);
				if (provinces == undefined || provinces.length == 0) {
						contactInfo.province = '';
						setProvinces([]);		
				}else {
						setProvinces(provinces);
				}
			}
		}
		setFormData({contactInfo: {...contactInfo, [name]: value }});
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

  const handleDateChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: new Date(value) as Date });
  }

	return (
    <Grid container spacing={2}>
			<Grid size={{xs:12, sm: 6}}>
					<TextField
					fullWidth
					label="Nombre"
					name="name"
					value={formData.name}
					onChange={handleChange}
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
					onChange={handleChange}
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
				onChange={handleChange}
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
						<DatePickerComponent 
							label="Fecha de nacimiento"
              name='birthdate'
							value={dayjs(formData.birthdate)} 
							errors={errors}
							setValue={(value) => handleDateChange({target: {name: 'birthdate', value: new Date(value?.format('YYYY-MM-DD') || '')}})} 
						/>
					) : (
						<DateMobilePickerComponent 
							label="Fecha de nacimiento"
              name='birthdate'
							value={dayjs(formData.birthdate)}
							errors={errors}
							setValue={(value) => handleDateChange({target: {name: 'birthdate', value: new Date(value?.format('YYYY-MM-DD') || '')}})} 
						/>
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
					onChange={handleInputContactInfoChange}
					error={handleZodError(errors, 'streetAddress')}
					helperText={handleZodHelperText(errors, 'streetAddress')}
					required
				/>
			</Grid>
			<Grid size={{ xs: 12, sm: 6 }}> 
				{countries == undefined || countries.length == 0  ? (
					<TextField
						fullWidth
						label="País"
						name="country"
						value={formData.contactInfo.country}
						onChange={handleInputContactInfoChange}
						error={handleZodError(errors, 'country')}
						helperText={handleZodHelperText(errors, 'country')}
						required
						/>
				) : ( 
					<FormControl fullWidth error={handleZodError(errors, 'country')} required>
						<InputLabel>País</InputLabel>
						<Select 
							label="País"
							id='country'
							name='country'
							value={formData.contactInfo.country.toString() ?? 64}
							onChange={(e:SelectChangeEvent<string>) => handleSelectChange(e)}
							MenuProps={{
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
							}}	
						>
							{countries.map((country) => (
								<MenuItem key={country.id} value={country.id ?? 64}>
									{country.name_es}
								</MenuItem>
							))}
						</Select>
						<FormHelperText>{handleZodHelperText(errors, 'country')}</FormHelperText>
					</FormControl>
				)}
			</Grid>
			<Grid size={{ xs: 12, sm: 6 }}>
				{provinces.length == 0 ? (
					<TextField
						fullWidth
						label="Provincia"
						name="province"
						value={formData.contactInfo.province}
						onChange={handleInputContactInfoChange}
						error={handleZodError(errors, 'province')}
						helperText={handleZodHelperText(errors, 'province')}
						required
					/>
				) : (
					<FormControl fullWidth error={handleZodError(errors, 'province')} required>
						<InputLabel>Provincia</InputLabel>
						<Select
							label='Provincia'
							name='province'
							value={formData.contactInfo.province ?? ''}
							onChange={(e:SelectChangeEvent<string>) => handleSelectChange(e)}
							MenuProps={{
								PaperProps: {
									style: {
										maxHeight: 300,
										overflow: 'auto',
									}
								},
								anchorOrigin: {
									vertical: 'bottom',
									horizontal: 'left',
								},
								transformOrigin: {
									vertical: 'top',
									horizontal: 'left',
								}
							}}
							>
							{provinces.map((province) => (
								<MenuItem key={province.id} value={province.cod_iso2}>
									{province.name}
								</MenuItem>
							))}
							</Select>
					</FormControl>
				)
				}
			</Grid>
			<Grid size={{ xs: 12, sm: 6 }}>
				<TextField
					fullWidth
					label="Código Postal"
					name="zip"
					value={formData.contactInfo.zip}
					onChange={handleInputContactInfoChange}
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
					onChange={handleInputContactInfoChange}
					error={handleZodError(errors, 'locality')}
					helperText={handleZodHelperText(errors, 'locality')}
					required
				/>
			</Grid>
			<Grid size={{ xs: 12, sm: 6 }}>
				<TextField
					fullWidth
					label="Teléfono Móvil"
					name="mobilePhone"
					value={formData.contactInfo.mobilePhone}
					onChange={handleInputContactInfoChange}
					error={handleZodError(errors, 'mobilePhone')}
					helperText={handleZodHelperText(errors, 'mobilePhone')}
					required
				/>
				</Grid>
			<Grid size={{ xs: 12, sm: 6 }}>
				<TextField
					fullWidth
					label="Teléfono Fijo"
					name="landlinePhone"
					value={formData.contactInfo.landlinePhone}
					onChange={handleInputContactInfoChange}
				/>
			</Grid>
    </Grid>
  )
}

