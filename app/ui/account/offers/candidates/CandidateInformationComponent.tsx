import BoxTextItem from '@/app/ui/shared/custom/components/box/BoxTextItem';
import useMediaQueryData from '@/app/ui/shared/hooks/useMediaQueryData';
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Typography, useMediaQuery } from '@mui/material';
import { ApplicationOfferDTO } from '@prisma/client';
import { Session } from 'next-auth';
import React from 'react';
import Grid from '@mui/material/Grid2';
import ProfileComponent from '@/app/ui/shared/account/ProfileComponent';
import AccordionComponent from '@/app/ui/shared/custom/components/accordion/AccordionComponent';
import { BoxAvatarMultiItem, BoxChipMultiItem } from '@/app/ui/shared/custom/components/box/BoxAvatarItem';
import TableExperiencesComponent from '@/app/ui/shared/custom/components/table/TableExperiencesComponent';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import TableEducationComponent from '@/app/ui/shared/custom/components/table/TableEducationComponent';
import TableLanguageComponent from '@/app/ui/shared/custom/components/table/TableLanguageComponent';
import ButtonCustom from '@/app/ui/shared/custom/components/button/ButtonCustom';
import { CloseOutlined } from '@mui/icons-material';
dayjs.locale('es');

type CandidateInformationComponentProps = {
  session: Session | null;
  offerId: string;
  open: boolean;
  selectedCandidate: ApplicationOfferDTO | null;
  setOpen: (open: boolean) => void;
  setPdfShow?: (open: boolean) => void;
}

const CandidateInformationComponent: React.FC<CandidateInformationComponentProps> = (
  { session, offerId, open, setOpen, selectedCandidate, setPdfShow }
) => {
  const { mediaQuery } = useMediaQueryData();

  const driverProfile = selectedCandidate?.Person?.DriverProfile[0];
  if (!driverProfile) {
    return (
      <Box>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth={true}
          maxWidth='lg'
          >
          <Box sx={{ p: 2 }}>
            <Typography variant='h5' fontWeight={700}>
              No se ha encontrado información del perfil del candidato
            </Typography>
          </Box>
        </Dialog>
      </Box>
    )
  }

  const filterLicenceByType = (licenceType: string) =>  {
    return driverProfile.DriverLicence.filter((licence) => licence.LicenceType?.type === licenceType);
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullScreen={!mediaQuery}
      maxWidth='lg'
      sx={{ 
        '& .MuiDialog-paper': {
          borderRadius: { xs: 0, sm: 5},
        },
        scrollMargin: '5px',
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', flexDirection: 'row',justifyContent: 'space-between', alignContent: 'center', alignItems: 'center', gap: 2 }}>
          <Typography variant='h5' fontWeight={700}>
            {mediaQuery ? 'Información del candidato' : 'Candidato'}
          </Typography>
          <Box>
            <ButtonCustom 
              title='Ver CV'
              color='primary'
              disable={false}
              loading={false}
              onClick={setPdfShow ? () => setPdfShow(true) : () => {}}
            />
            <IconButton 
              onClick={() => setOpen(false)}
              >
              <CloseOutlined color='secondary' />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ overflowY: 'auto', maxHeight: '80vh' }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>      
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ProfileComponent 
                title={`${selectedCandidate?.Person?.name} ${selectedCandidate?.Person?.lastname}`}
                subtitle={selectedCandidate?.Person?.User.email ?? ''}
                assetUrl={selectedCandidate?.Person?.PersonProfileImage?.url ?? ''}
                direction='column'
                justify='flex-end'
                />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, }}>
            <AccordionComponent
              title='Perfil de coductor'
              loading={false}
              expandedDefault={true} 
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <BoxAvatarMultiItem 
                  title='Carnets de conducir'
                  direction='column'
                  alignItems='flex-start'
                  justifyContent='flex-start'
                  items={filterLicenceByType("CARNET").map((licence) => licence.LicenceType?.name ?? '-') ?? []}
                />
                <BoxChipMultiItem
                  title='Carnets de ADR'
                  direction='column'
                  alignItems='flex-start'
                  justifyContent='flex-start'
                  items={filterLicenceByType("CARNET_ADR").map((licence) => licence.LicenceType?.name ?? '-') ?? []}
                />
                <BoxTextItem
                  title='Certificado de aptitud profesional (CAP)'
                  text={driverProfile.hasCapCertification ? 'Si' : 'No'}
                />
                <BoxTextItem
                  title='Tacógrafo Digital'
                  text={driverProfile.hasDigitalTachograph ? 'Si' : 'No'}
                />
                <BoxChipMultiItem
                  title='Ambito de trabajo'
                  direction='column'
                  alignItems='flex-start'
                  justifyContent='flex-start'
                  items={driverProfile.DriverWorkRangePreferences.map((range) => range.workScope.name) ?? []}
                />
                <BoxChipMultiItem
                  title='Preferencia de empleo'
                  direction='column'
                  alignItems='flex-start'
                  justifyContent='flex-start'
                  items={driverProfile.DriverEmploymentPreferences.map((employmentType) => employmentType.EncoderType.name) ?? []}
                />
                <BoxTextItem
                  title='Disponible para reubicación'
                  text={selectedCandidate.Person?.relocateOption ? 'Si' : 'No'}
                />
                <BoxTextItem
                  title='Vehículo Propio'
                  text={selectedCandidate.Person?.hasCar ? 'Si' : 'No'}
                />
                
              </Box>
            </AccordionComponent>
          </Grid>
          <Grid size={{ xs: 12, }}>
            <AccordionComponent
              title='Información personal'
              loading={false}
              expandedDefault={false} 
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <BoxTextItem
                  title='Nombre'
                  text={selectedCandidate?.Person?.name ?? ''}
                />
                <BoxTextItem
                  title='Apellidos'
                  text={selectedCandidate?.Person?.lastname ?? ''}
                />
                <BoxTextItem
                  title='Email'
                  text={selectedCandidate?.Person?.User.email ?? ''}
                />
                <BoxTextItem
                  title='Teléfono'
                  text={selectedCandidate?.Person?.phone ?? ''}
                />
                <BoxTextItem
                  title='Fecha de nacimiento'
                  text={dayjs(selectedCandidate?.Person?.birthdate).format('DD/MM/YYYY') ?? ''}
                />
                <BoxTextItem
                  title='Ciudad'
                  text={selectedCandidate?.Person?.Location.city ?? ''}
                />
                <BoxTextItem
                  title='Comunidad autónoma'
                  text={selectedCandidate?.Person?.Location.state ?? ''}
                />
              </Box>
            </AccordionComponent>
          </Grid>
          <Grid size={{ xs: 12, }}>
            <AccordionComponent 
              title='Conocimientos y experiencia laboral'
              loading={false}
              expandedDefault={false}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2  }}>
                <Box sx={{ display: 'flex', flexDirection: 'column'  }}>
                  <Typography variant='h6' fontWeight={700} fontSize={18}>
                    Experiencia laboral
                  </Typography>
                  <Divider orientation='horizontal' flexItem sx={{ mb: 2 }}/>
                  <TableExperiencesComponent 
                    experiences={selectedCandidate?.Person?.Experience.map((experience) => {
                      return {
                        id: experience.id,
                        jobName: experience.jobName,
                        startYear: new Date(experience.startYear),
                        endYear: new Date(experience.endYear),
                        description: experience.description,
                        experienceType: experience.jobName,
                      }
                    }) ?? []}
                  />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column',  }}>
                  <Typography variant='h6' fontWeight={700} fontSize={18}>
                    Educación
                  </Typography>
                  <Divider orientation='horizontal' flexItem sx={{ mb: 2 }}/>
                  <TableEducationComponent 
                    educations={selectedCandidate?.Person?.Education.map((education) => {
                      return {
                        id: education.id,
                        title: education.title,
                        center: education.center ?? '',
                        startYear: new Date(education.startYear),
                        endYear: new Date(education.endYear),
                      }
                    }) ?? []}
                  />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column',  }}>
                  <Typography variant='h6' fontWeight={700} fontSize={18}>
                    Idiomas
                  </Typography>
                  <Divider orientation='horizontal' flexItem sx={{ mb: 2 }}/>
                  <TableLanguageComponent 
                    languages={selectedCandidate?.Person?.PersonLanguages.map((languange) => {
                      return {
                        id: languange.id,
                        languageCode: languange.Languages.code,
                        level: languange.level,
                        languageName: languange.Languages.name,
                      }
                    }) ?? []}
                  />
                </Box>
              </Box>
            </AccordionComponent>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ position: 'relative', bottom: 0, right: 0, left: 0, p: 2, backgroundColor: 'white' }}>
      <ButtonCustom
          title='Rechazar'
          onClick={() => setOpen(false)}
          color='secondary'
          disable={false}
          loading={false}
        />
        <ButtonCustom 
          title='Aceptar'
          onClick={() => setOpen(false)}
          color='primary'
          disable={false}
          loading={false}        
        />
      </DialogActions>
    </Dialog>
  )
}

export default CandidateInformationComponent


