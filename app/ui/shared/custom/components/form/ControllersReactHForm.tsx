import { State } from '@/lib/definitions';
import { Box, Checkbox, CircularProgress, FormControl, FormHelperText, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent, SxProps, TextField, Theme } from '@mui/material';
import React from 'react'
import { Controller } from 'react-hook-form';
import useUtilsHook from '../../../hooks/useUtils';
import { MenuProperties } from '../../../styles/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
dayjs.locale('es');

type ControllerTextFieldComponentProps = {
  control: any;
  value?: string;
  label: string;
  name: string;
  formState?: State;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  sx?: SxProps<Theme> | undefined;
  type?: 'text' | 'password' | 'email' | 'number';
  inputAdornment?: React.ReactNode;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const ControllerTextFieldComponent: React.FC<ControllerTextFieldComponentProps> = (
  {control, value, name, label, formState, placeholder, multiline, rows, sx, type, inputAdornment, onBlur}
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
          type={type ?? 'text'}
          multiline={multiline ?? false}
          rows={rows ?? 1}
          onChange={(event) => {
            field.onChange(event);
          }}
          slotProps={{
            input: {
              sx: sx,
              endAdornment: inputAdornment
            },
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
  value?: string[] | string;
  label: string;
  name: string;
  formState?: State;
  placeholder?: string;
  options?: ControllerSelectFieldOptions[];
  isLoading?: boolean;
  sx?: SxProps<Theme> | undefined;
  extraChangeFunction?: (value: any) => void;
}
const initialState = {message: '', errors: []};
export const ControllerSelectMultiFieldComponent: React.FC<ControllerSelectFieldComponentProps> = (
  {control, value, name, label, formState, placeholder, sx, options}
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
          placeholder={placeholder}
          value={field.value || []}
          sx={sx}
          renderValue={(selected) => (
            <>
              <Box sx={{ display: {xs: 'none', md: 'block'}, 
                maxWidth: '100%', 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis' }}>
                {selected && selected.join(', ')}
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
              <ListItemText primary={option.value} />
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
  {control, label, value,name, placeholder, formState, options, isLoading, sx, extraChangeFunction}
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
              endAdornment: isLoading && <CircularProgress size={20} />,
              sx: sx
            }
          }}
        > 
          {options && options.map((option) => (
            <MenuItem key={option.id} value={option.label}>
              {option.value}
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


type ControllerDateFieldComponentProps = {
  control: any;
  value?: Dayjs;
  label: string;
  name: string;
  formState?: State;
  placeholder?: string;
  sx?: SxProps<Theme> | undefined;
}

export const ControllerDateTimePickerComponent: React.FC<ControllerDateFieldComponentProps> = (
  {control, value, name, label, formState, placeholder, sx}
) => {
  const { handleZodError, handleZodHelperText } = useUtilsHook();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={value ?? ''}
      render={({ field }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <DemoContainer components={['DatePicker']}>
            <DatePicker
                format='DD-MM-YYYY'
                label={label}
                name={name ?? ''}
                value={field.value}
                onChange={(newValue) => field.onChange(newValue)}
                slotProps={{
                  textField: {
                    error: formState?.errors && handleZodError(formState, name),
                    helperText: formState?.errors && handleZodHelperText(formState, name),
                    required: true,
                    placeholder: placeholder
                  }
                }}
                sx={sx}
            />
          </DemoContainer>
        </LocalizationProvider>
      )}
    />
  )
}
export const ControllerDateTimeMobilePickerComponent: React.FC<ControllerDateFieldComponentProps> = (
  {control, value, name, label, formState, placeholder, sx}
) => {
  const { handleZodError, handleZodHelperText } = useUtilsHook();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={value ?? ''}
      render={({ field }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <DemoContainer components={['MobileDatePicker']}>
            <MobileDatePicker
              label={label}
              name={name ?? ''}
              format='DD-MM-YYYY'
              value={field.value}
              onChange={(newValue) => field.onChange(newValue)}
              slotProps={{
                textField: {
                  error: handleZodError(formState ?? {message: '', errors: []}, name ?? ''),
                  helperText: handleZodHelperText(formState ?? {message: '', errors: []}, name ?? ''),
                  required: true,
                  placeholder: placeholder
                }
              }}
              sx={sx}
            />
          </DemoContainer>
        </LocalizationProvider>
      )}
    />
  )
}
