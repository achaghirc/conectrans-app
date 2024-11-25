import { PersonLanguageDTO } from "@/lib/definitions";
import { Autocomplete, Box, Divider, FormControl, IconButton, TextField, Typography } from "@mui/material";
import { Languages } from "@prisma/client";
import { useState } from "react";
import TableLanguageComponent from "../custom/components/table/TableLanguageComponent";
import { AddCircleOutlineOutlined } from "@mui/icons-material";

type LanguagesComponentProps = {
  languages: Languages[];
  selectedLenguages: PersonLanguageDTO[];
  loadingLanguages: boolean;
  isError: boolean;
  handleAddLanguage: (languages: PersonLanguageDTO) => void;
  handleDeleteLanguage: (language: PersonLanguageDTO) => void;
}

const languageLevels = ['Nativo','Avanzado', 'Intermedio', 'Básico'];

const LanguagesComponentSignUp: React.FC<LanguagesComponentProps> = (
  {languages, selectedLenguages, loadingLanguages, isError, handleAddLanguage, handleDeleteLanguage}
) => {
  const [selectedLanguage, setSelectedLanguage] = useState<PersonLanguageDTO | null>(null);

  const addLanguage = () => {
    if(!selectedLanguage) return;
    handleAddLanguage(selectedLanguage);
    setSelectedLanguage(null);
  }
  return (
    <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Typography color='primary' component={'h3'} variant='h5' fontWeight={'semibold'}>
          Idiomas
        </Typography>
      </Box>
      <Divider sx={{ mb: 1 }}/>
      <TableLanguageComponent languages={selectedLenguages} onAction={handleDeleteLanguage} />
      {loadingLanguages ? 'Cargando...' : isError ? 'Error al cargar los idiomas' : null}
      <Box sx={{ gap: 3, display: 'flex'}}>
        <FormControl fullWidth>
          <Autocomplete
            id="tags-outlined"
            options={languages ?? []}
            getOptionLabel={(option) => option.name}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                name='language'
                label="Idiomas"
                placeholder="Idiomas"
              />
            )}
            onChange={(e, value) => {
              const lang = value as Languages;
              setSelectedLanguage({...selectedLanguage, languageName: lang?.name, languageId: lang.id});
            }}
          />  
        </FormControl>
        <FormControl fullWidth>
          <Autocomplete
            id="tags-outlined"
            options={languageLevels ?? []}
            getOptionLabel={(option) => option}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                name='level'
                label="Nivel"
                placeholder="Nivel"
              />
            )}
            onChange={(e, value) => {
              const level = value;
              if(!level) return;
              setSelectedLanguage({...selectedLanguage, level: level});
            }}
          />  
        </FormControl>    
        <IconButton onClick={addLanguage}>
          <AddCircleOutlineOutlined color='primary' />
        </IconButton>
      </Box>
    </Box>
  )
}

export default LanguagesComponentSignUp
