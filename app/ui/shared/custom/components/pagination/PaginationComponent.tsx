import { Box, MenuItem, Pagination, Select, SelectChangeEvent } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react'

type PaginationComponentProps = {
  count: number;
  currentPage: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  handleRowsPerPageChange: (event: SelectChangeEvent<any>) => void;
}


const PaginationComponent: React.FC<PaginationComponentProps> = (
  { count,currentPage, rowsPerPage, rowsPerPageOptions, handleRowsPerPageChange }
) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageUrl = (page: number | string) => {
    const params = new URLSearchParams(searchParams!);
    const query = params.get('q');
    if (typeof page === 'string') {
      page = Number(page);
    }
    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
      params.set('limit', rowsPerPage.toString());
      params.set('q', query ?? '');
    }
    return `${pathname}?${params.toString()}`;
  }

  const handlePageChange = (event: React.ChangeEvent<unknown> | null, newPage: number) => {
    if (event == null ) return;
    event.preventDefault()
    router.push(createPageUrl(newPage))
  }

  const countItems = count == 0 ? 0 : rowsPerPage >= count ? 1 : Math.floor(count / rowsPerPage); 

  return (
    <Box display={countItems > 0 ? 'flex' : 'none'} justifyContent='center' m={2}>
      <Pagination count={countItems}  page={currentPage} variant='outlined' onChange={handlePageChange} />
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

export default PaginationComponent;