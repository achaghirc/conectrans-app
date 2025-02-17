'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Pagination, SxProps, TableHead } from '@mui/material';
import { MoreVertOutlined } from '@mui/icons-material';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

function createData(name: string, calories: number, fat: number) {
  return { name, calories, fat };
}

const rows = [
  createData('Cupcake', 305, 3.7),
  createData('Donut', 452, 25.0),
  createData('Eclair', 262, 16.0),
  createData('Pack básico', 159, 6.0),
  createData('Gingerbread', 356, 16.0),
  createData('Honeycomb', 408, 3.2),
  createData('Ice cream sandwich', 237, 9.0),
  createData('Jelly Bean', 375, 0.0),
  createData('KitKat', 518, 26.0),
  createData('Lollipop', 392, 0.2),
  createData('Marshmallow', 318, 0),
  createData('Nougat', 360, 19.0),
  createData('Oreo', 437, 18.0),
].sort((a, b) => (a.calories < b.calories ? -1 : 1));

export type TableAdminDataType = {
  content: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  hidden?: boolean;
}

export type TableAdminPanelProps = {
  // Add props here
  data: Record<string, TableAdminDataType>[];
  onClick?: (id: number) => void;
};

export default function TableAdminPanel({ data, onClick }: TableAdminPanelProps) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
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
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (!data || data.length == 0) return <div>Loading...</div>;

  const headers = Object.keys(data[0]).map((key) => ({
    key,
    align: data[0][key].align || 'left',
    hidden: data[0][key].hidden || false,
  }));
  const rowHeight = 48; // Assuming each row is 48px high
  const tableHeight = rowsPerPage * rowHeight;


  return (
    <Box sx={{ pl: {xs: 1, sm: 0}, pr: {xs: 1, sm: 0} }}>
      <TableContainer component={Paper} sx={{ width: '100%', overflow: 'auto', borderRadius: 5, elevation: {xs: 0, sm: 2} }}>
        <Table sx={{ minWidth: '100%', minHeight: tableHeight  }} aria-label="custom pagination table">
          <TableHead sx={{ display: {xs: 'none', sm: 'table-header-group', bgcolor: 'Highlight', color: 'white'}}}>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell key={index} align={header.align} sx={{
                  fontWeight: "bold",
                  whiteSpace: "nowrap", // Prevents wrapping
                  overflow: "hidden", // Hides overflow text
                  textOverflow: "ellipsis", // Adds "..."" when text overflows
                  display: header.hidden ? 'none' : 'table-cell',
                  }}>{header.key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableHead sx={{ display: {xs: 'flex', sm: 'none'}, flexDirection: {xs: 'column'}}}>
              <TableRow>
                {
                headers.map((header, index) => (
                  <TableCell key={index} align={header.align} sx={{
                    display: {xs: 'none', sm: header.hidden ? 'none' : 'block'},
                    fontWeight: "bold",
                    whiteSpace: "nowrap", // Prevents wrapping
                    overflow: "hidden", // Hides overflow text
                    textOverflow: "ellipsis", // Adds "..."" when text overflows
                    }}>{header.key}</TableCell>
                ))}
              </TableRow>
          </TableHead>
          <TableBody
            sx={{
              display: {xs: 'flex', sm: 'table-row-group'},
              flexDirection: {xs: 'column', sm: 'row'},
            }}
          >
            {(rowsPerPage > 0
              ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : data
            ).map((row, index) => (
              <TableRow 
                key={index}
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
                onClick={() => {
                  if (onClick && !row['ID']){
                    console.error('ID not found in row', row);
                    return;
                  }
                  onClick?.(row['ID'].content as number ?? 0)
                }}
                >
                {headers.map((header, index) => (
                  <TableCell key={index} 
                    sx={{
                      display: header.hidden ? 'none' : {xs: 'flex', sm: 'table-cell'},
                      flexDirection: {xs: 'row', sm: 'column'},
                      justifyContent: 'space-between',
                    }} 
                    align={header.align ?? 'left'}
                  >
                    <Box component={'span'} sx={cellHeaderMobile}>{header.key}</Box>{row[header.key].content}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 81 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Box sx={{ p: 2, display: 'flex', justifyContent: {xs: 'center', sm: 'flex-end' } }}>
          <Pagination
            count={Math.floor(data.length / rowsPerPage)} 
            page={page} 
            variant='outlined'
            onChange={handleChangePage} 
            />
        </Box>
      </TableContainer>
    </Box>
  );
}


import Skeleton from '@mui/material/Skeleton';

export function TableSkeleton() {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 5 }}>
      <Table sx={{ minWidth: '100%' }} aria-label="skeleton table">
        <TableHead sx={{ display: { xs: 'none', sm: 'table-header-group', bgcolor: 'Highlight', color: 'white' } }}>
          <TableRow>
            <TableCell>
              <Skeleton variant="rounded" sx={{ width: '100%', height: 22}} component={'div'}/>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from(new Array(5)).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell>
                <Skeleton variant="rounded" height={48} width={'100%'} component={'div'}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>
              <Skeleton variant="rounded" height={22} width={'100%'} component={'div'}/>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
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

