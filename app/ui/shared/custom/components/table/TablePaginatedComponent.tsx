import { ArrowForwardOutlined, CheckCircleOutline, CloseOutlined, FirstPageOutlined, KeyboardArrowLeftOutlined, KeyboardArrowRightOutlined, LastPageOutlined, PendingOutlined } from '@mui/icons-material';
import { Box, FormGroup, IconButton, Paper, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, useTheme } from '@mui/material';
import { ApplicationOfferDTO } from '@prisma/client';
import React from 'react'
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { ApplicationOfferStatusEnum } from '@/lib/enums';
import PaginationComponent from '../pagination/PaginationComponent';
dayjs.locale('es');

type TablePaginatedComponentProps = { 
  rows: ApplicationOfferDTO[];
  handleShow: (candidate: ApplicationOfferDTO) => void;
  handleStatusChange: (candidate: ApplicationOfferDTO, status: ApplicationOfferStatusEnum) => void;
}

const TablePaginatedComponent: React.FC<TablePaginatedComponentProps> = (
  { rows, handleShow, handleStatusChange}
) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;


  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const fileActions = (row: ApplicationOfferDTO) => {
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
            icon: <PendingOutlined color='warning' />,
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
    

  return (
    <Box sx={{ pl: {xs: 1, sm: 0}, pr: {xs: 1, sm: 0} }}>
      <TableContainer component={Paper} elevation={2} sx={{ width: '100%', overflow: 'auto', borderRadius: 5 }}>
        <Table sx={{ minWidth: '100%' }} aria-label="simple table">
          <TableHead sx={{ display: {xs: 'none', sm: 'table-header-group', bgcolor: 'Highlight', color: 'white'}}}>
            <TableRow>
              <TableCell align="center">Nombre</TableCell>
              <TableCell align="center">Apellidos</TableCell>
              <TableCell align="center">Fech. Nacimiento</TableCell>
              <TableCell align="center">Vehículo propio</TableCell>
              <TableCell align="center">Licencias</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
            
          </TableHead>
          <TableHead sx={{ display: {xs: 'flex', sm: 'none'}, flexDirection: {xs: 'column'}}}>
            <TableRow>
              <TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="left">Nombre</TableCell>
              <TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="right">Apellidos</TableCell>
              <TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="right">Fech. Nacimiento</TableCell>
              <TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="right">Vehículo propio</TableCell>
              <TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="right">Licencias</TableCell>
              <TableCell sx={{ display: {xs: 'none', sm: 'block'}}} align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{ 
              display: {xs: 'flex', sm: 'table-row-group'},
              flexDirection: {xs: 'column', sm: 'row'},
            }}
            >
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row: ApplicationOfferDTO, index: number) => (
              <TableRow 
                key={row.id || index}
                sx={{
                  borderBottom: index % 2 != 0 ? '1px solid #ffffff' : '1px solid rgb(239, 239, 239)',
                  backgroundColor: {xs: index % 2 != 0 ? '#FAFAFA' : '#ffffff', sm: 'inherit'},
                  '&:last-child td, &:last-child th': { border: 0 },
                  cursor: 'pointer',
                  //Generate Onclick efect
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    transition: 'all 0.3s',
                  },
                }}
                onClick={() => handleShow(row)}
              >
                <TableCell sx={tableCellStyles} component="th" scope="row" align='center'>
                  <Box component={'span'} sx={cellHeaderMobile}>Nombre</Box>{row.Person?.name ?? ''}
                </TableCell>
                <TableCell sx={tableCellStyles} align="center">
                  <Box component={'span'} sx={cellHeaderMobile} >Apellidos</Box>{row.Person?.lastname ?? ''}
                </TableCell>
                <TableCell sx={tableCellStyles} align="center">
                  <Box component={'span'} sx={cellHeaderMobile} >Fech. Nacimiento</Box>{row.Person?.birthdate != undefined ? dayjs(row.Person.birthdate.toISOString()).format('DD/MM/YYYY') : ''}
                </TableCell>
                <TableCell sx={tableCellStyles} align="center">
                  <Box component={'span'} sx={cellHeaderMobile} >Vehiculo Propio</Box>{row.Person?.hasCar != undefined ? row.Person.hasCar ? 'Sí' : 'No' : ''}
                </TableCell>
                <TableCell sx={tableCellStyles} align="center">
                  <Box component={'span'} sx={cellHeaderMobile} >Licencias</Box>{row.Person?.relocateOption != undefined ? row.Person.DriverProfile[0].DriverLicence.filter((licence) => licence.LicenceType?.type === 'CARNET').map((licence) => licence.LicenceType?.name).join(', ') : ''}
                </TableCell>
                <TableCell sx={tableCellStyles} align="center">
                  <Box component={'span'} sx={cellHeaderMobile} >Acciones</Box>
                  <FormGroup row sx={{ justifyContent: 'center' }}>
                    {fileActions(row)}
                  </FormGroup>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', flexDirection: 'row'}}>
          <PaginationComponent 
            count={rows.length}
            currentPage={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            handleRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </TableContainer>
    </Box>
  );
}

const cellHeaderMobile: SxProps = {
  display: {xs: 'block', sm: 'none'},
  fontWeight: 'bold',
}

const tableCellStyles: SxProps = {
  display: {xs: 'flex', sm: 'table-cell'},
  flexDirection: {xs: 'row', sm: 'column'},
  justifyContent: 'space-between',
}

export default TablePaginatedComponent
