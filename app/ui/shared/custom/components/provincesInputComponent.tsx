import { Province } from "@/lib/definitions";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import React, { ChangeEvent, useEffect } from "react";

export type ProvincesInputComponentProps = {
  provincesData: Province[] | undefined;
  isProvincesLoading?: boolean;
  selectedProvince: string;
  inputName: string;
  style?: any;
  handleInputChange: (e: ChangeEvent<HTMLInputElement> | SelectChangeEvent<string | number>) => void;
}

const ProvincesInputComponent: React.FC<ProvincesInputComponentProps> = React.memo(
  ({provincesData, isProvincesLoading, selectedProvince, inputName, style, handleInputChange}
) => {  
  if (isProvincesLoading) {
    return (
      <Typography variant="body1" align="center">
        Loading...
      </Typography>
    );
  }
  if (!provincesData || provincesData.length == 0) {
    return (
      <TextField
        fullWidth
        label="Provincia"
        name={inputName}
        value={selectedProvince}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
        required
      />
    );
  }
  return (
    <FormControl fullWidth>
      <InputLabel>Provincia</InputLabel>
      <Select
        label='Provincia'
        name={inputName}
        value={selectedProvince}
        placeholder={isProvincesLoading ? 'Loading...' : 'Selecciona una provincia'}
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
        sx={{
          textAlign: 'start',
          style,
        }}
      > 
        {isProvincesLoading ? (
          <MenuItem disabled>Loading...</MenuItem>
        ) : (
          provincesData && provincesData.map((province) => (
          <MenuItem key={province.id} value={province.name}>
            {province.name}
          </MenuItem>
        )))
        }
      </Select>
    </FormControl>
  );
}
);

export default ProvincesInputComponent;