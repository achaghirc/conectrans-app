import React from 'react'
import { BadgeRoot, Box, Card, CardContent, CardHeader, IconButton, Pagination, SelectChangeEvent, Tooltip, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { TableCustomDataType, TableCustomPanelProps } from '@/lib/definitions'
import { cardMobileStyles, paperStyles } from '../../../styles/styles'
import BoxIconTextInformation from '../box/BoxIconTextInformation'
import { ArrowBackOutlined, ArrowForwardOutlined, BadgeOutlined, BusinessOutlined, CalendarMonthOutlined, CheckCircleOutline, CloseOutlined, ContactsOutlined, PendingOutlined } from '@mui/icons-material'
import useMediaQueryData from '../../../hooks/useMediaQueryData'
import { ApplicationOfferDTO } from '@prisma/client'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { ApplicationOfferStatusEnum } from '@/lib/enums'
import PaginationComponent from '../pagination/PaginationComponent'
import Image from 'next/image'
import ButtonCustom from '../button/ButtonCustom'
import NoDataFolder from '../../../svg/noDataFolder'


type TableCustomCardMobileProps = {
  data: ApplicationOfferDTO[];
  handleStatusChange: (row: ApplicationOfferDTO, status: ApplicationOfferStatusEnum) => void;
  onClick?: (id: number) => void;
}

const TableCustomCardMobile: React.FC<TableCustomCardMobileProps> = (
  {data, handleStatusChange, onClick}
) => {
  const { mediaQuery } = useMediaQueryData();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | React.ChangeEvent<unknown> | null,
    newPage: number,
  ) => {
    event?.preventDefault();
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: SelectChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt((event.target as HTMLInputElement).value, 10));
    setPage(0);
  };

    
  const getCandidateActions = (row: ApplicationOfferDTO) => {
    const status = row.status;
    const actions = [
      {
        condition: status === ApplicationOfferStatusEnum.REJECTED,
        buttons: [
          {
            title: 'Rechazado',
            onClickStatus: ApplicationOfferStatusEnum.REJECTED,
            icon: <CloseOutlined color='error'/>,
            disabled: true
          }
        ]
      },
      {
        condition: status === ApplicationOfferStatusEnum.PENDING,
        buttons: [
          {
            title: 'Rechazar',
            onClickStatus: ApplicationOfferStatusEnum.REJECTED,
            icon: <CloseOutlined color='error' />,
            disabled: false
          },
          {
            title: 'Continuar',
            onClickStatus: ApplicationOfferStatusEnum.IN_PROCESS,
            icon: <ArrowForwardOutlined color='warning' />,
            disabled: false
          }
        ]
      },
      {
        condition: status === ApplicationOfferStatusEnum.IN_PROCESS,
        buttons: [
          {
            title: 'Rechazar',
            onClickStatus: ApplicationOfferStatusEnum.REJECTED,
            icon: <CloseOutlined color='error' />,
            disabled: false
          },
          {
            title: 'Aceptar',
            onClickStatus: ApplicationOfferStatusEnum.ACCEPTED,
            icon: <ArrowForwardOutlined color='warning' />,
            disabled: false
          }
        ]
      },
      {
        condition: status === ApplicationOfferStatusEnum.ACCEPTED,
        buttons: [
          {
            title: 'Aceptado',
            onClickStatus: ApplicationOfferStatusEnum.ACCEPTED,
            icon: <CheckCircleOutline color='success'/>,
            disabled: true
          }
        ]
      }
    ];
    return (
      <>
        {actions.map((action, index) => (
          action.condition && action.buttons.map((button, btnIndex) => (
            <Tooltip key={`${index}-${btnIndex}`} title={button.title} placement='top'>
              <span>
                <IconButton 
                  disabled={button.disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(row, button.onClickStatus);
                  }}
                >
                  {button.icon}
                </IconButton>
              </span>
            </Tooltip>
          ))
        ))}
      </>
    );
  }
  
  if (!data || data.length == 0) return (
    <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',}}>
      <NoDataFolder />
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
        <Typography variant='h6' sx={{ fontWeight: 'bold', fontSize: 16 }}>
          Aún no se ha inscrito ningún candidato
        </Typography>
        <ButtonCustom
          title='Volver'
          onClick={() => window.history.back()}
          loading={false}
          disable={false}
          type='button'
          color='primary'
          startIcon={<ArrowBackOutlined />}
          />
      </Box>
    </Box>
  );

  return (
    <Box component={'div'}>
      <Grid container spacing={2} sx={{ maxWidth: '90%', mx: 'auto' }}>
        {
          (rowsPerPage > 0 
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : 
            data
          ).map((row: ApplicationOfferDTO , index: number) => (
            <Grid size={12} key={index}>
              <Card 
                sx={{
                  borderRadius: 5,
                }}

                onClick={() => onClick?.(row.id ?? 0)}>
                <CardHeader sx={{ pb: 0 }} // Removes extra padding below the header
                  titleTypographyProps={{ variant: 'h6', fontWeight: 'bold', gutterBottom: false, sx: { mb: 0 } }}
                  subheaderTypographyProps={{ variant: 'caption', color: 'textSecondary', sx: { mt: 0 } }}
                  title={
                    `${row.Person?.name} ${row.Person?.lastname}`
                  }
                  subheader={
                    `${row.Person?.Location.city}, ${row.Person?.Location.state}`
                  }
                  action={
                    <Box>
                      {getCandidateActions(row)}
                    </Box>
                  }
                />
                <CardContent
                  sx={{ pt: 1 }}
                >
                  <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'flex-start' }}>
                    <BoxIconTextInformation
                      icon={<CalendarMonthOutlined sx={{ fontSize: 20 }}/>}
                      text={row.Person != undefined ? dayjs(row.Person.birthdate).format('LL') : ''}
                      fontSize={!mediaQuery ? 14 : 16}
                      fontWeight={!mediaQuery ? 400 : 200}
                    />
                    <BoxIconTextInformation
                      icon={<BadgeOutlined sx={{ fontSize: 20 }}/>}
                      text={row.Person?.DriverProfile[0].DriverLicence.filter((licence) => licence.LicenceType?.type === 'CARNET').map((licence) => licence.LicenceType?.name).join(', ') ?? ''}
                      fontSize={!mediaQuery ? 14 : 16}
                      fontWeight={!mediaQuery ? 400 : 200}
                    />
                    <BoxIconTextInformation
                      icon={<Typography sx={{ fontSize: 13, fontWeight: 'bold'}}> CAP</Typography>}
                      text={row.Person?.DriverProfile[0].hasCapCertification ? 'Sí' : 'No'}
                      fontSize={!mediaQuery ? 14 : 16}
                      fontWeight={!mediaQuery ? 400 : 200}
                    />
                    <BoxIconTextInformation
                      icon={<Typography sx={{ fontSize: 13, fontWeight: 'bold'}}>Dig. Tacograph</Typography>}
                      text={row.Person?.DriverProfile[0].hasCapCertification ? 'Sí' : 'No'}
                      fontSize={!mediaQuery ? 14 : 16}
                      fontWeight={!mediaQuery ? 400 : 200}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        }
      <Grid size={{ xs:12 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
        <PaginationComponent
          count={Math.ceil(data.length / rowsPerPage)} 
          currentPage={page + 1} 
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5,10,15,20]}
          handleRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Grid>
      </Grid>
    </Box>
  )
}

export default TableCustomCardMobile
