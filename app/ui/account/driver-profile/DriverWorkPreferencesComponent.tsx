'use client';

import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid2';
import { Autocomplete, Button, CircularProgress, FormControl, InputLabel, Select, SnackbarCloseReason, TextField } from '@mui/material';
import { DriverPreferencesDTO } from '@/lib/definitions';
import { DriverEmploymentPreferencesDTO, DriverWorkRangePreferencesDTO, EncoderType } from '@prisma/client';
import { updateEmployeeTypes, updateWorkRangeTypes } from '@/lib/data/preferences';
import SnackbarCustom, { SnackbarCustomProps } from '../../shared/custom/components/snackbarCustom';
import { SUCCESS_MESSAGE_SNACKBAR } from '@/lib/constants';;

type DriverWorkPreferencesComponentProps = {
  data: DriverPreferencesDTO  | undefined;
  encoders: EncoderType[] | undefined;
  saveAction?: () => void;
}

const DriverWorkPreferencesComponent: React.FC<DriverWorkPreferencesComponentProps> = (
  {data, encoders, saveAction}
) => {
  const [snackbarProps, setSnackbarProps] = React.useState<SnackbarCustomProps>({
    open: false,
    handleClose: (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason,) => handleCloseSnackbar(event, reason),
  } as SnackbarCustomProps);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [changedData, setChangedData] = React.useState<boolean>(false);
  const employeeEncoders: EncoderType[] = React.useMemo(() => encoders?.filter((encoder) =>  encoder.type === 'EMPLOYEE_TYPE') ?? [], [encoders]);
  const workRanges: EncoderType[] = React.useMemo(() => encoders?.filter((encoder) =>  encoder.type === 'WORK_SCOPE') ?? [], [encoders]);
  const [employeeTypes, setEmployeeTypes] = React.useState<EncoderType[]>(data?.employeeTypes.map((el) => el.EncoderType) ?? []);
  const [workRangeTypes, setWorkRangeTypes] = React.useState<EncoderType[]>(data?.workRanges.map((el) => el.workScope) ?? []);
  
  useEffect(() => {
    if (data) {
      setEmployeeTypes(data.employeeTypes.map((el) => el.EncoderType));
      setWorkRangeTypes(data.workRanges.map((el) => el.workScope));
    }
  }, [data]);

  const employeeTypesUpdate = async () : Promise<boolean> => {
    try {
      const employeeTypesDelete: DriverEmploymentPreferencesDTO[] = [];
      const employeeTypesUpdate: DriverEmploymentPreferencesDTO[] = [];
      
      const employeeTypesData: DriverEmploymentPreferencesDTO[] = data?.employeeTypes ?? [];
      employeeTypesData.forEach((el) => {
        if (!employeeTypes.find((data) => data.id === el.EncoderType.id)) {
          employeeTypesDelete.push(el);
        } else {
          employeeTypesUpdate.push(el);
        }
      });
      
      employeeTypes.forEach((el) => {
        if (!employeeTypesData.find((data) => data.EncoderType.id === el.id)) {
          const newEmployeeType: DriverEmploymentPreferencesDTO = {
            id: undefined,
            driverProfileId: data!.driverProfileId,
            employmentTypeId: el.id,
            EncoderType: el
          }
          employeeTypesUpdate.push(newEmployeeType);
        }
      });
      if (employeeTypesDelete.length > 0 || employeeTypesUpdate.length > 0) {
        await updateEmployeeTypes(employeeTypesUpdate,employeeTypesDelete);
      }
      return true;
    }catch (err) {
      return false;
    }
  } 

  const workRangesUpdate = async (): Promise<boolean> => {
    try {
      const workRangeTypesDelete: DriverWorkRangePreferencesDTO[] = [];
      const workRangeTypesUpdate: DriverWorkRangePreferencesDTO[] = [];
    
      const workRangeTypesData: DriverWorkRangePreferencesDTO[] = data?.workRanges ?? [];
  
      workRangeTypesData.forEach((el) => {
        if (!workRangeTypes.find((data) => data.id === el.workScope.id)) {
          workRangeTypesDelete.push(el);
        } else {
          workRangeTypesUpdate.push(el);
        }
      });
    
      workRangeTypes.forEach((el) => {
        if (!workRangeTypesData.find((data) => data.workScope.id === el.id)) {
          const newWorkRangeType: DriverWorkRangePreferencesDTO = {
            id: undefined,
            driverProfileId: data!.driverProfileId,
            workScopeId: el.id,
            workScope: el
          }
          workRangeTypesUpdate.push(newWorkRangeType);
        }
      });
      
      if (workRangeTypesDelete.length > 0 || workRangeTypesUpdate.length > 0) {
        await updateWorkRangeTypes(workRangeTypesUpdate, workRangeTypesDelete);
      }
    
      return true;
    } catch (err) {
      return false;
    }
  }

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarProps({...snackbarProps, open: false});
  }

  const update = async () => {
    setLoading(true);
    let message: string = '';
    let severity = snackbarProps.severity;
    const [
      employeeResult, workRangeResult
    ] = await Promise.allSettled([employeeTypesUpdate(), workRangesUpdate()]);

    if (employeeResult.status == 'rejected' || workRangeResult.status == 'rejected'){
      message = 'Error actualizando los datos';
      severity =  'error';
    }

    if (employeeResult.status == 'fulfilled' && workRangeResult.status === 'fulfilled'){
      message = SUCCESS_MESSAGE_SNACKBAR;
      severity = 'success';
    }

    setLoading(false);
    setChangedData(false);
    saveAction && saveAction();
    setSnackbarProps({...snackbarProps, open: true, message: message, severity: severity});
  }

  return (
    <Grid container spacing={4} p={1}>
      <Grid size={{ xs: 12, sm: 6}}>
        <FormControl fullWidth >
          <Autocomplete
            id="employeeType"
            multiple
            options={employeeEncoders ?? []}
            getOptionLabel={(option) => option.name}
            value={employeeTypes ?? []}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
              {...params}
              sx={{width: {xs: '95%', sm: '100%'}}}
              label="Tipo de empleo"
              name="employeeType"
              />
            )}
            onChange={(event, newValue) => {
              event.preventDefault();
              if (!newValue) {
                return;
              }
              setEmployeeTypes(newValue);
              setChangedData(true);
            }}
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 6}}>
        <FormControl fullWidth>
          <Autocomplete
            id="workRange"
            multiple
            options={workRanges ?? []}
            getOptionLabel={(option) => option.name}
            value={workRangeTypes ?? []}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
              {...params}
              sx={{width: {xs: '95%', sm: '100%'}}}
              label="Ámbito de trabajo"
              name="workRange"
              />
            )}
            onChange={(event, newValue) => {
              event.preventDefault();
              if (!newValue) return;
              setWorkRangeTypes(newValue);
              setChangedData(true);
            }}
          />
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end'}}>
        <Button 
          endIcon={loading ? <CircularProgress size={20} /> : null}
          variant='outlined' 
          color='secondary' 
          onClick={update} 
          disabled={!changedData}
        >
          Guardar
        </Button>
      </Grid>
      <SnackbarCustom
        open={snackbarProps.open}
        handleClose={snackbarProps.handleClose}
        message={snackbarProps.message}
        severity={snackbarProps.severity}
      />
    </Grid>
  )
}

export default DriverWorkPreferencesComponent