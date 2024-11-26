'use client';
import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid2'
import { Box, Button, Divider, Typography } from '@mui/material'
import TableExperiencesComponent from '../../shared/custom/components/table/TableExperiencesComponent'
import { AddCircleOutlineOutlined } from '@mui/icons-material'
import TableEducationComponent from '../../shared/custom/components/table/TableEducationComponent'
import LanguagesComponentSignUp from '../../shared/auth/LanguageComponentSignup'
import ExperienceComponent from '../../shared/auth/ExperienceComponent'
import { EducationDTO, ExperienceDTO, PersonLanguageDTO, SignUpCandidateFormData } from '@/lib/definitions'
import { Session } from 'next-auth'
import { Education, EncoderType } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { getLanguages } from '@/lib/data/languaje';
import { set } from 'zod';

type DriverExperienceComponentProps = {
  session: Session | null;
  encoders: EncoderType[];
  educations: EducationDTO[];
  personLanguages: PersonLanguageDTO[];
  data: ExperienceDTO[];
}

const DriverExperienceComponent: React.FC<DriverExperienceComponentProps> = (
  { encoders, educations, personLanguages, data}
) => {
  const [open, setOpen] = React.useState<boolean>(false)
  const [experiences, setExperiences] = React.useState<ExperienceDTO[] | []>(data)
  const [newExperience, setNewExperience] = React.useState<ExperienceDTO | null>(null)
  const experienceTypes: EncoderType[] = encoders.filter((encoder) => encoder.type === 'EXPERIENCE_TYPE');
  const {data: languages, isLoading: isLoadingLanguages, isError: isErrorLanguages} = useQuery({ queryKey: ['languages'], queryFn: () => getLanguages()});

  useEffect(() => {
    if (data) {
      setExperiences(data);
    } 
  }, [data])

  const handleAddExperience = (experience: ExperienceDTO) => {
    setNewExperience(experience);
    setExperiences([...experiences, experience]);
  }

  const handleDeleteExperience = (experience: ExperienceDTO) => {
    setExperiences(experiences.filter((exp) => exp !== experience));
  }

  return (
    <div>
      <Grid size={{ xs: 12 }}>
        <Box>
          <Typography color='textPrimary' component={'h3'} variant='h6'  sx={{ fontSize: 16, fontWeight: 500 }}>
            Experiencias
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }}/>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TableExperiencesComponent experiences={experiences ?? []} 
          deleteExperience={handleDeleteExperience} />
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
        <Grid size={{ xs: 12 }}>
          <TableEducationComponent 
            educations={educations ?? []}
            deleteEducationExperience={(row) => console.log(row)}
            editEducationExperience={(row) => console.log(row)}
          />
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
                Añadir estudios
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Box>
          <Typography color='textPrimary' component={'h3'} variant='h6'  sx={{ fontSize: 16, fontWeight: 500 }}>
            Idiomas
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }}/>
        <Grid size={{ xs: 12 }}>
          <LanguagesComponentSignUp
            languages={languages ?? []}
            handleAddLanguage={() => console.log('')}
            handleDeleteLanguage={() => console.log('')}
            selectedLenguages={personLanguages ??[]}
            loadingLanguages={isLoadingLanguages}
            isError={isErrorLanguages}
          />
        </Grid>
      </Grid>
      <ExperienceComponent
				experienceTypes={experienceTypes}
				open={open}
				setValue={handleAddExperience}
				setOpen={(value:boolean) => setOpen(value)}
			/>
    </div>
  )
}

export default DriverExperienceComponent
