import { Box, MenuItem, Pagination, Select, SelectChangeEvent } from '@mui/material';
import React from 'react'

type PaginationTableComponentProps = {
  count: number;
  currentPage: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  handleRowsPerPageChange: (event: SelectChangeEvent<any>) => void;
  handlePageChange: (event: React.ChangeEvent<unknown> | null, newPage: number) => void;
}

const PaginationTableComponent: React.FC<PaginationTableComponentProps> = (
  { count,currentPage, rowsPerPage, rowsPerPageOptions, handleRowsPerPageChange, handlePageChange }
) => {
  const countItems = count > 0 ? Math.ceil(count / rowsPerPage) : 0;
  return (
    <Box display={countItems > 0 ? 'flex' : 'none'} justifyContent='center' m={2}>
      <Pagination count={countItems}  page={currentPage + 1} variant='outlined' onChange={handlePageChange} />
      <Select 
        value={rowsPerPage}
        onChange={handleRowsPerPageChange}
        variant='outlined'
        sx={{
          borderRadius: 10,
          fontSize: '0.8rem',
          width: 'auto',
          height: 30,
        }}
        >
          {rowsPerPageOptions.map((option) => (
            <MenuItem key={option} value={option} sx={{fontSize: '0.8rem'}}>
              {Number(option)}
            </MenuItem>
          ))}
      </Select>
    </Box>      
  )
}

export default PaginationTableComponent
