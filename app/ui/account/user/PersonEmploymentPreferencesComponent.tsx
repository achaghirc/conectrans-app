import React from 'react';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import ButtonCustom from '../../shared/custom/components/button/ButtonCustom';
import { set } from 'zod';

type PersonEmploymentPreferencesComponentProps = {
  hasCar: boolean;
  relocateOption: boolean;
  setHasCar: (value: boolean) => void;
  setRelocateOption: (value: boolean) => void;
  saveAction: () => Promise<void>;
}


const PersonEmploymentPreferencesComponent: React.FC<PersonEmploymentPreferencesComponentProps> = ({
  hasCar, relocateOption, setHasCar, setRelocateOption, saveAction
}) => {
  const [changedForm, setChangedForm] = React.useState({hasCar: false, relocateOption: false});
  const [loading, setLoading] = React.useState(false);


  const onClickAction = async () => {
    setLoading(true);
    await saveAction();
    setLoading(false);
  }

 return (
  <Grid container spacing={2} mt={3}>
    <Grid size={{ xs: 12, sm: 6}}
      sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: {xs: 'space-between', sm: 'flex-start'}}}
    >
      <Typography variant='h6' component={'h1'} fontWeight={'bold'} color='textPrimary'>
        Vehículo propio
      </Typography>
      <Switch
        id='hasCar'
        name='hasCar'
        checked={hasCar ?? false}
        onChange={() => {
          setHasCar(!hasCar)
          setChangedForm({...changedForm, hasCar: hasCar != !hasCar});
        }}
        inputProps={{ 'aria-label': 'controlled' }}
      />
    </Grid>
    <Grid size={{ xs: 12, sm: 6}}
      sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: {xs: 'space-between', sm: 'flex-start'}}}
    >
      <Typography variant='h6' component={'h1'} fontWeight={'bold'} color='textPrimary'>
        Disponible para reubicación
      </Typography>
      <Switch
        id='relocateOption'
        name='relocateOption'
        checked={relocateOption ?? false}
        onChange={() => {
          setRelocateOption(!relocateOption);
          setChangedForm({...changedForm, relocateOption: relocateOption != !relocateOption});
        }}
        inputProps={{ 'aria-label': 'controlled' }}
      />
    </Grid>
    <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end'}}>
      <ButtonCustom 
        title='Guardar'
        loading={loading}
        color='secondary'
        onClick={onClickAction}
        disable={changedForm.hasCar == false && changedForm.relocateOption == false}
      />
    </Grid>
  </Grid>
 )
}

export default PersonEmploymentPreferencesComponent;