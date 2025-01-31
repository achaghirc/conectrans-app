'use client';
import { getAllOffersPageableByFilter } from '@/lib/data/offer';
import { Box, Divider, FormControlLabel, FormGroup, IconButton, SwipeableDrawer, SxProps, Theme, Tooltip, Typography } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo } from 'react'
import OffersListSkeleton from '../shared/custom/components/skeleton/OffersListSkeletonComponent';
import OffersGeneralListComponent from './OffersGeneralListComponent';
import BreadcrumbsComponent from '../shared/custom/components/breadcrumbs/Breadcrumbs';
import Grid from '@mui/material/Grid2';
import { FilterAltOutlined, RemoveCircleOutline } from '@mui/icons-material';
import { ControllerSelectFieldComponent, ControllerSelectMultiFieldComponent, ControllerTextFieldComponent } from '../shared/custom/components/form/ControllersReactHForm';
import { SubmitHandler, useForm } from 'react-hook-form';
import ButtonCustom from '../shared/custom/components/button/ButtonCustom';
import useMediaQueryData from '../shared/hooks/useMediaQueryData';
import { getCountries, getProvincesByCountryId } from '@/lib/data/geolocate';
import { getEncoderTypeData } from '@/lib/data/encoderType';
import { EncoderType } from '@prisma/client';
import PaginationComponent from '../shared/custom/components/pagination/PaginationComponent';
import { FilterOffersDTO, OfferSearchResponse } from '@/lib/definitions';
import { CustomSwitch } from '../shared/custom/components/switch/CustomSwitch';

type OffersGeneralComponentProps = {
  currentPage: number;
  limit: number;
  initialFilterData: Partial<FilterOffersDTO>;
}


const OffersGeneralComponent: React.FC<OffersGeneralComponentProps> = ({
  currentPage,limit, initialFilterData
}) => {
  const queryClient = useQueryClient();
  const { mediaQuery } = useMediaQueryData();
  const [open, setOpen] = React.useState(false);
  const [filterData, setFilterData] = React.useState<Partial<FilterOffersDTO>>(initialFilterData);
  const [isSearching, setIsSearching] = React.useState<boolean>(false);

  const toggleDrawer = (open: boolean) => {
    setOpen(open);
  }

  const updateFilterData = (data: FilterOffersDTO) => {
    setFilterData(data);
    return data;
  }

  const onSubmit: SubmitHandler<FilterOffersDTO> = async (data: FilterOffersDTO) => {
    try {
      setIsSearching(true);
      // const result = await getAllOffersPageableByFilter(currentPage, rowsPerPage, data);
      // setOffers(result.offers);
      const filterData = {
        contractType: data.contractType ?? undefined,
        country: data.country ?? undefined,
        state: data.state ?? undefined,
        licenseType: data.licenseType ?? undefined,
        adrType: data.adrType ?? undefined,
        workRange: data.workRange ?? undefined,
        isFeatured: data.isFeatured ?? undefined,
        experience: data.experience ?? undefined,
        isAnonymous: data.isAnonymous ?? undefined,
        allOffers: data.allOffers ?? undefined,
        active: true
      }
      updateFilterData(filterData);
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    } 
  }

  const {data, isLoading, isFetched, } = useQuery({
    queryKey: ['offers', filterData, currentPage, limit], 
    queryFn: (): Promise<OfferSearchResponse> => getAllOffersPageableByFilter(Number(currentPage), Number(limit), filterData),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 24 hours
  });

  const {data: recomendedOffers, isLoading: isRecomendedLoading, isError: isErrorRecomended} = useQuery({
    queryKey: ['recomended_offers', currentPage, limit],
    queryFn: (): Promise<OfferSearchResponse> => getAllOffersPageableByFilter(currentPage, limit, {allOffers: true, active: true}),
    staleTime: 1000 * 60 * 5, // 5 minutes
    // enabled: data == undefined || data.total == 0
  });

  const prefetchNexPage = async () => {
    if (data && data.total) {
      if((currentPage + 1) * limit <= (data.total + limit)) {
        const newPage = currentPage + 1;
        await queryClient.prefetchQuery({
          queryKey: ['offers', filterData, newPage, limit], 
          queryFn: (): Promise<OfferSearchResponse> => getAllOffersPageableByFilter(newPage, limit, filterData)
        });
      }
      console.log(queryClient.getQueriesData({queryKey: ['offers']}));
    }
  }

  //Si aún hay páginas por cargar, cargar al menos la siguiente.
  useEffect(() => {
    if (isFetched) {
      const prefetchData = async () => {
        await prefetchNexPage();
      };
      prefetchData();
    }
  }, [isFetched, prefetchNexPage]);


  return (
    <>
      <Box
        sx={{
          display: 'flex', 
          flexDirection: 'column', 
          p: 1,
          ml: {xs: 1, md: 0}, 
          mr: {xs: 1, md: 0}
        }}    
      >
        <BreadcrumbsComponent 
          breadcrumbs={[
            {href: '/', label: 'Inicio', active: false}, 
            {href: '/offers', label: 'Ofertas', active: true}
          ]}
          />
      </Box>
      <Grid container spacing={1}>
        <Grid size={{xs: 12, md: 4}}>
          {mediaQuery && (
            <FilterComponent 
              loading={isLoading}
              filterData={filterData}
              onSubmitHandler={onSubmit} 
            />
          )}
        </Grid>
        <Grid size={{xs: 12, md: 8}}>
          <Box sx={{ display: {xs: 'flex', md: 'none'}, justifyContent: 'flex-end', alignItems: 'center'}}>
            <IconButton size='large' onClick={() => setOpen(!open)} > 
              <FilterAltOutlined sx={{ width: 30, height: 30}} color='success' />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: 'flex', 
              flexDirection: 'column',
              gap: 2,
              overflow: 'auto',
              maxHeight: '100vh',
            }}
          >
            {isLoading && data == undefined ? (
              <OffersListSkeleton />
            ) : (
              <OffersGeneralListComponent offers={data == undefined ? [] : data.offers} recommendedOffers={recomendedOffers == undefined ? [] : recomendedOffers.offers} />
            )}
          </Box>
        </Grid>
        <Grid size={{xs: 12}}>
          {!isLoading && data && data.total > 0 && (
            <PaginationComponent
              count={data.total ?? 10}
              currentPage={currentPage}
              rowsPerPage={limit}
              rowsPerPageOptions={[3, 10, 20, 30]}
              handleRowsPerPageChange={(event) => {}}
            />
          )}
          {(!data || data.total == 0) && recomendedOffers && !isRecomendedLoading && (
            <PaginationComponent
              count={recomendedOffers.total ?? 10}
              currentPage={currentPage}
              rowsPerPage={limit}
              rowsPerPageOptions={[3, 10, 20, 30]}
              handleRowsPerPageChange={(event) => {}}
            />
          )}
        </Grid>
      </Grid>
      <SwipableDrawerComponent 
        anchor='bottom'
        open={open}
        toggleDrawer={toggleDrawer}
      >
        <FilterComponent 
          loading={isLoading}
          filterData={filterData}
          onSubmitHandler={onSubmit} 
        />
      </SwipableDrawerComponent> 
    </>
  )
}

export default OffersGeneralComponent

type FilterComponentProps = {
  loading: boolean;
  filterData?: Partial<FilterOffersDTO>;
  onSubmitHandler: SubmitHandler<FilterOffersDTO>;
}

const filterStyle: SxProps<Theme> | undefined = {
  borderRadius: '10px',
  '& .MuiInputLabel-root': {
    borderRadius: '10px',
    padding: '0px 10px',
    '&.Mui-focused': {
      borderRadius: '10px',
    }
  }
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  loading, filterData, onSubmitHandler
}) => {
  const queryClient = useQueryClient();
  const [selectedCountry, setSelectedCountry] = React.useState<string>('');
  const {
    control,
    register,
    watch,
    reset,
    setValue,
    handleSubmit,
  } = useForm<FilterOffersDTO>({
    defaultValues: filterData as FilterOffersDTO ?? {
      country: '',
      state: '',
      contractType: [],
      workRange: [],
      experience: '',
      licenseType: [],
      adrType: [],
      isFeatured: false,
      isAnonymous: false,
      allOffers: true
    }
  });
  // Watch the values of switches
  const allOffers = watch("allOffers");
  const isFeatured = watch("isFeatured");
  const isAnonymous = watch("isAnonymous");

  // Handle switch changes
  const handleToggle = (name: keyof FilterOffersDTO, value: boolean) => {
    if (name === "allOffers" && value) {
      // If "allOffers" is enabled, disable others
      setValue("isFeatured", false);
      setValue("isAnonymous", false);
    } else if ((name === "isFeatured" || name === "isAnonymous") && value) {
      // If "isFeatured" or "isAnonymous" is enabled, disable "allOffers"
      setValue("allOffers", false);
      setValue("allOffers", false);
    } else if ((name === "isFeatured") && !value && !isAnonymous) {
      setValue("allOffers", true);
    } else if (name === "isAnonymous" && !value && !isFeatured) {
      setValue("allOffers", true);
    }
    setValue(name, value);
  };

  

  const onSubmit: SubmitHandler<FilterOffersDTO> = async (data: FilterOffersDTO) => {
    onSubmitHandler(data)
  }

  const {data: countries, isLoading: isCountryLoading, isError: isErrorCountry} = useQuery({
    queryKey: ['countries'], queryFn: () => getCountries(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
  
  const {data: encoders, isLoading: isEncodersLoading, isError: isErrorEncoders} = useQuery({
    queryKey: ['encoders'], queryFn: () => getEncoderTypeData(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  const {data: provinces, isLoading: isProvincesLoading, isError: isErrorProvinces} = useQuery({
    queryKey: ['provinces', selectedCountry], 
    queryFn: () => getProvincesByCountryId(parseInt(selectedCountry)),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: !!selectedCountry // 24 hours
  });

  const handleCountryChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value === null) {
      return;
    }
    if (selectedCountry === value) return;
    setSelectedCountry(value);
    setValue('state', '');
    queryClient.refetchQueries({queryKey: ['provinces', value]});
  }

  const filterEncodersByType = useMemo(
    () => (type: string): EncoderType[] | undefined => { 
      return encoders?.filter((encoder) => encoder.type === type) 
    },
    [encoders]
  );
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box 
        sx={{
          display: 'flex', 
          flexDirection: 'column', 
          gap: 1, 
          mr: {xs: 0, md: 1},
          ml: {xs: 0, md: 1},
          mb: {xs: 0, md: 1},
          pb: 2,
          backgroundColor: 'white',
          borderRadius: 5,
          boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.2)',
          overflow: 'auto',
          position: 'sticky',
        }}
      >
        <Box sx={{ pt: 2, pl: 2, pr: 2, display: 'flex', justifyContent: 'space-between'}}>
          <Typography variant="h6" fontWeight={600} gutterBottom>Filtros</Typography>
          <Box>
            <Tooltip title='Limpiar filtros' placement='top'>    
              <IconButton onClick={() => reset()}>
                <RemoveCircleOutline color='error' />
              </IconButton>
            </Tooltip>
            <ButtonCustom 
              color='primary'
              title='Buscar'
              loading={loading}
              onClick={() => {}}
              type='submit'
            />
          </Box>
        </Box>
        <Divider variant='middle' />
        <Box>
          <FormGroup sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', p: {xs: 0, lg: 2}}} >
            <FormControlLabel 
                control={<CustomSwitch 
                  {...register('allOffers')}
                  checked={allOffers ?? false}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>, value: boolean) => handleToggle('allOffers', value)}
                  />
                } 
                label="Todas" 
                labelPlacement='start' 
            />
            <FormControlLabel 
                control={<CustomSwitch  
                  {...register('isFeatured')}
                  checked={isFeatured ?? false}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>, value: boolean) => handleToggle('isFeatured', value)}
                />} 
                label="Detacada" 
                labelPlacement='start' 
            />
            <FormControlLabel 
              control={<CustomSwitch 
                {...register('isAnonymous')}
                checked={isAnonymous ?? false}
                onChange={(event: React.ChangeEvent<HTMLInputElement>, value: boolean) => handleToggle('isAnonymous', value)}
              />} 
              label="Anónimas" 
              labelPlacement='start'
            />
          </FormGroup>
        </Box>
        <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column', pl: 2, pr: 2, gap: 2}}>
          <Typography variant="h6" fontWeight={900} fontSize={14} gutterBottom>Localización</Typography>
          <Box>
            <ControllerSelectFieldComponent 
              control={control}
              name="country"
              label="País"
              value={selectedCountry ?? ''}
              options={countries?.map((country) => ({label: country.id.toString(), value: country.name_es, id: country.id.toString()}))}
              sx={filterStyle}
              isLoading={isCountryLoading}
              extraChangeFunction={handleCountryChange}
            />
          </Box>
          <Box>
            {!provinces || provinces.length === 0 ? (
              <ControllerTextFieldComponent 
                control={control}
                name="state"
                value={''}
                label="Provincia"
                placeholder="Provincia"
                sx={filterStyle}
              />  
            ) : (
              <ControllerSelectFieldComponent 
                control={control}
                name="state"
                label="Provincia"
                value={''}
                options={provinces?.map((province) => ({label: province.name, value: province.name, id: province.name})) ?? []}
                sx={filterStyle}
                isLoading={isProvincesLoading}
                
              />
            )}
          </Box>
          <Typography variant="h6" fontWeight={900} fontSize={14} gutterBottom>Empleo</Typography>
          <Box>
            <ControllerSelectMultiFieldComponent 
              control={control}
              name="contractType"
              label="Tipo de contrato"
              value={''}
              options={filterEncodersByType('EMPLOYEE_TYPE')?.map((encoder) => ({label: encoder.name, value: encoder.name, id: encoder.id.toString()})) ?? []}
              sx={filterStyle}
            />
          </Box>
          <Box>
            <ControllerSelectMultiFieldComponent 
              control={control}
              name="workRange"
              label="Ámbito"
              value={''}
              options={filterEncodersByType('WORK_SCOPE')?.map((encoder) => ({label: encoder.name, value: encoder.name, id: encoder.id.toString()})) ?? []}
              sx={filterStyle}
            />
          </Box>
          <Box>
            <ControllerSelectFieldComponent 
              control={control}
              name="experience"
              label="Experiencia"
              value={''}
              options={filterEncodersByType('EXPERIENCE')?.map((encoder) => ({label: encoder.name, value: encoder.name, id: encoder.id.toString()})) ?? []}
              sx={filterStyle}
            />
          </Box>
          <Typography variant="h6" fontWeight={900} fontSize={14} gutterBottom>Licencias</Typography>
          <Box>
            <ControllerSelectMultiFieldComponent
              control={control}
              name="licenseType"
              label="Carnet de conducir"
              value={watch('licenseType')}
              options={filterEncodersByType('CARNET')?.map((encoder) => ({label: encoder.name, value: encoder.name, id: encoder.id.toString()})) ?? []}
              sx={filterStyle}
            />
          </Box>
          <Box>
            <ControllerSelectMultiFieldComponent 
              control={control}
              name="adrType"
              label="Carnet de ADR"
              value={''}
              options={filterEncodersByType('CARNET_ADR')?.map((encoder) => ({label: encoder.name, value: encoder.name, id: encoder.id.toString()})) ?? []}
              sx={filterStyle}
            />
          </Box>
        </Box>
      </Box>
    </form>
  )
}

type SwipeableDrawerComponentProps = {
  anchor: 'top' | 'left' | 'bottom' | 'right';
  children: React.ReactNode;
  open: boolean;
  toggleDrawer: (open: boolean) => void;
}


const SwipableDrawerComponent: React.FC<SwipeableDrawerComponentProps> = (
  {anchor, children, open, toggleDrawer}
) => {
  return (
    <React.Fragment>
      <SwipeableDrawer 
        anchor={anchor}
        open={open}
        onOpen={() => toggleDrawer(true)}
        onClose={() => toggleDrawer(false)}
      >
        {children}
      </SwipeableDrawer>
    </React.Fragment>
  )
}