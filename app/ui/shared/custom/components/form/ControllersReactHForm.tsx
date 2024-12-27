import { State } from '@/lib/definitions';
import { Box, Checkbox, CircularProgress, FormControl, FormHelperText, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import React from 'react'
import { Controller } from 'react-hook-form';
import useUtilsHook from '../../../hooks/useUtils';
import { MenuProperties } from '../../../styles/styles';

type ControllerTextFieldComponentProps = {
  control: any;
  value: string;
  label: string;
  name: string;
  formState?: State;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}

export const ControllerTextFieldComponent: React.FC<ControllerTextFieldComponentProps> = (
  {control, value, name, label, formState, placeholder, multiline, rows}
) => {
  const {handleZodError, handleZodHelperText} = useUtilsHook();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={value ?? ''}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          label={label}
          multiline={multiline ?? false}
          rows={rows ?? 1}
          onChange={(event) => {
            field.onChange(event);
          }}
          error={formState?.errors && handleZodError(formState, name)}
          helperText={formState?.errors && handleZodHelperText(formState, name)}
          placeholder={placeholder}
        />
      )}
    />
  )
}

export type ControllerSelectFieldOptions = {
  value: string;
  label: string;
  id?: string;
}
type ControllerSelectFieldComponentProps = {
  control: any;
  value: string[] | string;
  label: string;
  name: string;
  formState?: State;
  placeholder?: string;
  options?: ControllerSelectFieldOptions[];
  isLoading?: boolean;
  extraChangeFunction?: (value: any) => void;
}
const initialState = {message: '', errors: []};
export const ControllerSelectMultiFieldComponent: React.FC<ControllerSelectFieldComponentProps> = (
  {control, value, name, label, formState, placeholder, options}
) => {
  const {handleZodError, handleZodHelperText} = useUtilsHook();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={value ?? []}
      render={({ field }) => (
      <FormControl fullWidth error={handleZodError(formState ?? initialState, name)}>
        <InputLabel id={name}>{label}</InputLabel>
        <Select
          label={label}
          id={name}
          multiple
          name={name}
          value={field.value || []}
          renderValue={(selected) => (
            <>
              <Box sx={{ display: {xs: 'none', md: 'block'}, 
                maxWidth: '100%', 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis' }}>
                {selected.join(', ')}
              </Box>
              <Box sx={{ 
                display: { xs: 'block', md: 'none' }, 
                maxWidth: '100%', 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis' }}
              >
                {selected.map((value, index) => (
                  <span key={index}>
                    {value}
                    {index < selected.length - 1 && ', '}
                    {index % 2 === 1 && <br />} {/* Move to next line if size is overflowing */}
                  </span>
                ))}
              </Box>
            </>
          )}
          onChange={(e: SelectChangeEvent<string[]>) => field.onChange(e.target.value)}
          MenuProps={MenuProperties}
        >
          {options && options.map((option) => (
            <MenuItem key={option.id} value={option.label}>
              <Checkbox checked={option.id ? field.value.includes(option.label) : false} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{handleZodHelperText(formState ?? initialState, name) ?? 'Tipo de empleado'}</FormHelperText>
      </FormControl>
    )}
  />
  )
}

export const ControllerSelectFieldComponent: React.FC<ControllerSelectFieldComponentProps> = (
  {control, label, value,name, placeholder, formState, options, isLoading, extraChangeFunction}
) => {
  const { handleZodError, handleZodHelperText } = useUtilsHook();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={value ?? ''}
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          fullWidth
          select={!isLoading}
          onChange={(event) => {
            field.onChange(event);
            extraChangeFunction && extraChangeFunction(event);
          }}
          error={formState?.errors && handleZodError(formState, name)}
          helperText={formState?.errors && handleZodHelperText(formState, name)}
          placeholder={placeholder}
          slotProps={{
            select: {
              MenuProps: MenuProperties  
            },
            input:{
              endAdornment: isLoading && <CircularProgress size={20} />
            }
          }}
        > 
          {options && options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  )
}

export const ControllerAutcompleteFieldComponent: React.FC<ControllerSelectFieldComponentProps> = (
  {control, label, value,name, placeholder, formState, options}
) => {
  const { handleZodError, handleZodHelperText } = useUtilsHook();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={value ?? ''}
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          fullWidth
          select
          onChange={(event) => {
            field.onChange(event);
          }}
          error={formState?.errors && handleZodError(formState, name)}
          helperText={formState?.errors && handleZodHelperText(formState, name)}
          placeholder={placeholder}
        >
          {options && options.map((option) => (
            <MenuItem key={option.id} value={option.label}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  )
}
