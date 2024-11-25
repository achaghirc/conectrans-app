import { Country } from '@/lib/definitions';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material'
import React, { ChangeEvent } from 'react'

export type CountryInputComponentProps = {
  countries: Country[] | undefined;
  selectedCountry: number;
  inputName: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement> | SelectChangeEvent<number>) => void;
}

const CountryInputComponent: React.FC<CountryInputComponentProps> = (
  {countries, selectedCountry, inputName, handleInputChange}: CountryInputComponentProps
) => {
  return (
    <div>
      {countries == undefined || countries.length == 0  ? (
          <TextField
            fullWidth
            label="País"
            name="locationCountryId"
            value={selectedCountry}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
            // onChange={handleInputChange}
            // error={handleZodError(errors, 'country')}
            // helperText={handleZodHelperText(errors, 'country')}
            />
        ) : ( 
          <FormControl fullWidth 
            // error={handleZodError(errors, 'country')} 
            required
          >
            <InputLabel>País</InputLabel>
            <Select
              label="País"
              id='country'
              name={inputName}
              value={selectedCountry}
              onChange={(e: SelectChangeEvent<number>) => handleInputChange(e)}
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
              sx={{
                textAlign: 'start'
              }}
            >
              {countries.map((country) => (
                <MenuItem key={country.id} value={country.id ?? 64}>
                  {country.name_es}
                </MenuItem>
              ))}
            </Select>
            {/* <FormHelperText>{handleZodHelperText(errors, 'country')}</FormHelperText> */}
          </FormControl>
        )}
    </div>
  )
}

export default CountryInputComponent;