'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { SelectChangeEvent, SxProps, TableHead } from '@mui/material';
import PaginationTableComponent from '../pagination/PaginationTableComponent';
import { TableCustomDataType, TableCustomPanelProps } from '@/lib/definitions';
import theme from '@/app/theme';


export default function TableCustomPanel({ data, onClick }: TableCustomPanelProps) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const headers = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).map((key) => ({
      key,
      align: data[0][key].align || 'left',
      hidden: data[0][key].hidden || false,
    }));
  }, [data]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = React.useMemo(
    () => (page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0),
    [page, rowsPerPage, data.length]
  );

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | React.ChangeEvent<unknown> | null,
    newPage: number
  ) => {
    event?.preventDefault();
    setPage(newPage - 1 );
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt((event.target as HTMLInputElement).value, 10));
    setPage(0);
  };

  if (!data || data.length == 0) return <div>NO DATA</div>;

  const rowHeight = 48; // Assuming each row is 48px high
  return (
    <Box sx={{ 
      pl: { xs: 1, sm: 0 }, 
      pr: { xs: 1, sm: 0 },
    }}    
    >
      <Table 
        sx={{ 
          minWidth: '100%',
          boxShadow: 1,
        }} 
        aria-label="custom pagination table"
      >
        <TableHead 
          sx={{ 
            display: { xs: 'none', sm: 'table-header-group' },
            backgroundColor: theme.palette.primary.main, // Use a primary color
            borderRadius: 5,
            color: 'white',
            '& th': {
              fontWeight: 'bold',
              color: 'white',
              padding: '12px 16px',
              textTransform: 'uppercase',
            },
          }}
          >
          <TableRow>
            {headers.map((header, index) => (
              <TableCell key={index} align={header.align} sx={{
                fontWeight: "bold",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: header.hidden ? 'none' : 'table-cell',
              }}>{header.key}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0 ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : data)
          .map((row: Record<string, TableCustomDataType>, index: number) => (
            <TableRow
              key={index}
              sx={{
                transition: 'background-color 0.2s ease-in-out',
                '&:nth-of-type(even)': { bgcolor: '#f9f9f9' }, // Zebra striping
                '&:hover': {
                  bgcolor: '#f1f1f1',
                  transition: 'background-color 0.2s',
                },
              }}
              onClick={() => onClick?.(row['ID']?.content ?? 0)}
            >
              {headers.map((header, idx) => (
                <TableCell 
                  key={idx} 
                  align={header.align} 
                  sx={{ 
                    display: header.hidden ? 'none' : 'table-cell',
                    padding: '12px 16px',
                    fontSize: '0.95rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    borderBottom: '1px solid #e0e0e0',
                  }}
                >
                  <Box component={'span'} sx={cellHeaderMobile}>{header.key}</Box>
                  {row[header.key]?.content || ''}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 48 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Box sx={{ p: 2, display: 'flex', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
        <PaginationTableComponent
          count={data.length}
          currentPage={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          handleRowsPerPageChange={handleChangeRowsPerPage}
          handlePageChange={handleChangePage}
        />
      </Box>
    </Box>
  );
}

const cellHeaderMobile: SxProps = {
  display: { xs: 'block', sm: 'none' },
  fontWeight: 'bold',
};

export function TableSkeleton() {
  return (
    <Box sx={{ pl: { xs: 1, sm: 0 }, pr: { xs: 1, sm: 0 } }}>
      <Table sx={{ minWidth: '100%', boxShadow: 1 }} aria-label="custom pagination table">
        <TableHead
          sx={{
            display: { xs: 'none', sm: 'table-header-group' },
            backgroundColor: theme.palette.primary.main,
            borderRadius: 5,
            color: 'white',
            '& th': {
              fontWeight: 'bold',
              color: 'white',
              padding: '12px 16px',
              textTransform: 'uppercase',
            },
          }}
        >
          <TableRow>
            {[...Array(5)].map((_, index) => (
              <TableCell key={index} align="left" sx={{ fontWeight: 'bold' }}>
                <Box sx={{ width: '100%', height: '20px', bgcolor: 'grey.300', borderRadius: 1 }} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(5)].map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {[...Array(5)].map((_, cellIndex) => (
                <TableCell key={cellIndex} align="left">
                  <Box sx={{ width: '100%', height: '20px', bgcolor: 'grey.300', borderRadius: 1 }} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}