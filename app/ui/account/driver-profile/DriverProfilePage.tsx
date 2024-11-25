'use client';
import React from 'react'
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { Box, Button, Checkbox, Divider, FormControl, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent, Switch, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AccordionComponent from '../../shared/custom/components/accordion/AccordionComponent';
import { MenuProperties } from '../../shared/styles/styles';
import TableExperiencesComponent from '../../shared/custom/components/table/TableExperiencesComponent';
import { AddCircleOutlineOutlined } from '@mui/icons-material';
import ExperienceComponent from '../../shared/auth/ExperienceComponent';
import { SignUpCandidateFormData } from '@/lib/definitions';

type DriverProfilePageProps = {
  session: Session | null;
}



const DriverProfilePage: React.FC<DriverProfilePageProps> = (session) => {
  const router = useRouter();
  const [hasCapCertificate, setHasCapCertificate] = React.useState<boolean>(false);
  const [hasDigitalTachograph, setHasDigitalTachograph] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);
  if (!session) {
    router.push('/auth/login');
  }
  
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      padding: 2,
    }} >
      <Typography variant='h4' component='h1' sx={{ fontWeight: 900 }}>Resumen</Typography>
      <Grid container spacing={2} sx={{ display: 'flex', flexDirection: 'column'}}>
        <Grid>
          <AccordionComponent title='Licencias de conducción' expandedDefault={true}>
            <Grid container spacing={4} p={1}>
              <Grid size={{ xs: 12, sm: 6}}>
                <TextField
                  sx={{width: {xs: '95%', sm: '80%'}}}
                  label="Carnet de conducir"
                  name="carnet"
                  value={'test'}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6}}>
                <TextField
                  sx={{width: {xs: '95%', sm: '80%'}}}
                  label="País de emisión"
                  name="country"
                  value={'España'}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12}}>
                <TextField
                  sx={{width: {xs: '95%', sm: '90%'}}}
                  label="Carnet ADR"
                  name="adr_code"
                  value={'ADR Básico, ADR Cisternas, ADR Explosivos'}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6}}
                sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: {xs: 'space-between', sm: 'flex-start'}}}
              >
                <Typography variant='h6' component={'h1'} sx={{ fontWeight: 700, fontSize: 16 }} color='textPrimary'>
                  Certificado CAP
                </Typography>
                <Switch
                  id='hasCapCertificate'
                  name='hasCapCertificate'
                  checked={hasCapCertificate ?? false}
                  onChange={() => setHasCapCertificate(!hasCapCertificate)}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6}}
                sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: {xs: 'space-between', sm: 'flex-start'}}}
              >
                <Typography variant='h6' component={'h1'} sx={{ fontWeight: 700, fontSize: 16 }} color='textPrimary'>
                  Tacógrafo digital
                </Typography>
                <Switch
                  id='hasDigitalTachograph'
                  name='hasDigitalTachograph'
                  checked={hasDigitalTachograph ?? false}
                  onChange={() => setHasDigitalTachograph(!hasDigitalTachograph)}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </Grid>
            </Grid>
          </AccordionComponent>
        </Grid>
        <Grid>
          <AccordionComponent title='Preferencias de empleo' expandedDefault={false}>
            <Grid container spacing={4} p={1}>
              <Grid size={{ xs: 12, sm: 6}}>
                <FormControl fullWidth 
                  // error={handleZodError(errors, 'employeeType')}
                >
                  <InputLabel id="employeeType">Tipo de empleo</InputLabel>
                  <Select
                    label='Tipo de empleo'
                    id='employeeType'
                    multiple
                    name="employeeType"
                    value={[]}
                    renderValue={(selected) => selected.join(', ')}
                    // onChange={(e: SelectChangeEvent<string[]>) => handleFormControlSelect(e)}
                    MenuProps={MenuProperties}
                  >
                    {/* {employeeType && employeeType.map((tipo) => (
                      <MenuItem key={tipo.code} value={tipo.name}>
                        <Checkbox checked={formData.employeeType ? formData.employeeType.includes(tipo.name) : false} />
                        <ListItemText primary={tipo.name} />
                      </MenuItem>
                    ))} */}
                  </Select>
                  {/* <FormHelperText>{handleZodHelperText(errors, 'employeeType') ?? 'Tipo de empleado'}</FormHelperText> */}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6}}>
                <FormControl fullWidth 
                  // error={handleZodError(errors, 'workRange')}
                >
                  <InputLabel id="workRange">Ámbito de trabajo</InputLabel>
                  <Select
                    label='Ámbito de trabajo'
                    id='workRange'
                    multiple
                    name="workRange"
                    value={[]}
                    renderValue={(selected) => selected.join(', ')}
                    // onChange={(e: SelectChangeEvent<string[]>) => handleFormControlSelect(e)}
                    MenuProps={MenuProperties}
                  >
                    {/* {workRanges && workRanges.map((tipo) => (
                      <MenuItem key={tipo.code} value={tipo.name}>
                        <Checkbox checked={formData.workRange.includes(tipo.name)} />
                        <ListItemText primary={tipo.name} />
                      </MenuItem>
                    ))} */}
                  </Select>
                  {/* <FormHelperText>{handleZodHelperText(errors, 'workRange') ?? 'Ambito de trabajo deseado'}</FormHelperText> */}
                </FormControl>
              </Grid>
            </Grid>
          </AccordionComponent>
        </Grid>
        <Grid>
          <AccordionComponent title='Experiencia y Estudios' expandedDefault={false}>
            <Grid size={{ xs: 12 }}>
              <Box>
                <Typography color='textPrimary' component={'h3'} variant='h6'  sx={{ fontSize: 16, fontWeight: 500 }}>
                  Experiencias
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }}/>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TableExperiencesComponent experiences={[]} 
                deleteExperience={(row) => console.log(row)} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box 
                sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}
              >
                <Button 
                  variant='outlined' 
                  color='primary' 
                  startIcon={<AddCircleOutlineOutlined />}
                  onClick={() => setOpen(true)}
                  sx={{ alignItems: 'center', mt: 2 }}
                  >
                    Añadir experiencia
                </Button>
              </Box>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box>
                <Typography color='textPrimary' component={'h3'} variant='h6'  sx={{ fontSize: 16, fontWeight: 500 }}>
                  Estudios
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }}/>
            </Grid>
          </AccordionComponent>
        </Grid>
      </Grid>
      <ExperienceComponent
				open={open}
				formData={{} as SignUpCandidateFormData}
				experienceTypes={[]}
				setFormData={() => console.log('')}
				setOpen={(value:boolean) => setOpen(value)}
			/>
    </Box>
  )
}

export default DriverProfilePage;
