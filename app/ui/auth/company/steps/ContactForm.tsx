import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Country, Province, SignUpCompanyFormData, State } from '@/lib/definitions';
import { getProvincesByCountryId } from '@/lib/data/geolocate';
import useUtilsHook from '@/app/ui/shared/hooks/useUtils';

interface ContactoFormProps {
  formData: SignUpCompanyFormData
  countries: Country[] | undefined;
  setFormData: (data: any) => void;
  errors: State;
}

export default function ContactForm({ formData, errors, countries, setFormData }: ContactoFormProps) {
  const { handleZodError, handleZodHelperText } = useUtilsHook();
  const [provinces, setProvinces] = useState<Province[]>([]);
  
  const handleInputChange = async (e: ChangeEvent<HTMLInputElement> | any) => {
    const { name, value } = e.target;
    let contactInfo = formData.contactInfo;
    if(name === 'country') {
			const country = countries && countries.find((country) => country.id === parseInt(value));
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
    setFormData({ contactInfo: { ...formData.contactInfo, [name]: value } });
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
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
      {countries == undefined || countries.length == 0  ? (
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
				) : ( 
					<FormControl fullWidth error={handleZodError(errors, 'country')} required>
						<InputLabel>País</InputLabel>
						<Select 
							label="País"
							id='country'
							name='country'
							value={formData.contactInfo.country.toString() ?? 64}
							onChange={(e:SelectChangeEvent<string>) => handleInputChange(e)}
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
						onChange={handleInputChange}
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
							onChange={(e:SelectChangeEvent<string>) => handleInputChange(e)}
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
				)}
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
            name="mobilePhone"
            value={formData.contactInfo.mobilePhone}
            onChange={handleInputChange}
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
            onChange={handleInputChange}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Sitio Web"
            name="website"
            value={formData.contactInfo.website}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Correo Electrónico de Contacto"
            name="contactEmail"
            value={formData.contactInfo.contactEmail}
            onChange={handleInputChange}
            error={handleZodError(errors, 'contactEmail')}
            helperText={handleZodHelperText(errors, 'contactEmail')}
            required
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Descripción"
            name="description"
            value={formData.contactInfo.description}
            onChange={handleInputChange}
            multiline
            rows={4}
            maxRows={6}
            error={handleZodError(errors, 'description')}
            helperText={handleZodHelperText(errors, 'description')}
            required
          />
        </Grid>
      </Grid>
    );
  }