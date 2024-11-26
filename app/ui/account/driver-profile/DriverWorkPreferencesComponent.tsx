'use client';

import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid2';
import { Autocomplete, Button, CircularProgress, FormControl, InputLabel, Select, TextField } from '@mui/material';
import { MenuProperties } from '../../shared/styles/styles';
import { DriverPreferencesDTO } from '@/lib/definitions';
import { DriverEmploymentPreferencesDTO, DriverWorkRangePreferencesDTO, EncoderType } from '@prisma/client';
import { updateEmployeeTypes, updateWorkRangeTypes } from '@/lib/data/preferences';

type DriverWorkPreferencesComponentProps = {
  data: DriverPreferencesDTO  | undefined;
  encoders: EncoderType[] | undefined;
  saveAction?: () => void;
}

const DriverWorkPreferencesComponent: React.FC<DriverWorkPreferencesComponentProps> = (
  {data, encoders, saveAction}
) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [changedData, setChangedData] = React.useState<boolean>(false);
  const employeeEncoders: EncoderType[] = encoders?.filter((encoder) =>  encoder.type === 'EMPLOYEE_TYPE') ?? [];
  const workRanges: EncoderType[] = encoders?.filter((encoder) =>  encoder.type === 'WORK_SCOPE') ?? [];
  const [employeeTypes, setEmployeeTypes] = React.useState<EncoderType[]>(data?.employeeTypes.map((el) => el.EncoderType) ?? []);
  const [workRangeTypes, setWorkRangeTypes] = React.useState<EncoderType[]>(data?.workRanges.map((el) => el.workScope) ?? []);
  
  useEffect(() => {
    if (data) {
      setEmployeeTypes(data.employeeTypes.map((el) => el.EncoderType));
      setWorkRangeTypes(data.workRanges.map((el) => el.workScope));
    }
  }, [data]);

  const update = async () => {
    setLoading(true);
    const employeeTypesDelete: DriverEmploymentPreferencesDTO[] = [];
    const employeeTypesUpdate: DriverEmploymentPreferencesDTO[] = [];
    const workRangeTypesDelete: DriverWorkRangePreferencesDTO[] = [];
    const workRangeTypesUpdate: DriverWorkRangePreferencesDTO[] = [];

    const employeeTypesData: DriverEmploymentPreferencesDTO[] = data?.employeeTypes ?? [];
    const workRangeTypesData: DriverWorkRangePreferencesDTO[] = data?.workRanges ?? [];

    employeeTypesData.forEach((el) => {
      if (!employeeTypes.find((data) => data.id === el.EncoderType.id)) {
        employeeTypesDelete.push(el);
      } else {
        employeeTypesUpdate.push(el);
      }
    });

    workRangeTypesData.forEach((el) => {
      if (!workRangeTypes.find((data) => data.id === el.workScope.id)) {
        workRangeTypesDelete.push(el);
      } else {
        workRangeTypesUpdate.push(el);
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
    
    if (employeeTypesDelete.length > 0 || employeeTypesUpdate.length > 0) {
      await updateEmployeeTypes(employeeTypesUpdate,employeeTypesDelete);
    }
    if (workRangeTypesDelete.length > 0 || workRangeTypesUpdate.length > 0) {
      await updateWorkRangeTypes(workRangeTypesUpdate, workRangeTypesDelete);
    }
    setLoading(false);
    setChangedData(false);
    saveAction && saveAction();
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
    </Grid>
  )
}

export default DriverWorkPreferencesComponent
