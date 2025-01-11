import { generatePagination } from '@/lib/utils';
import { TablePagination } from '@mui/material';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react'

type PaginationComponentProps = {
  count: number;
  currentPage: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    if (event == null ) return;
    event.preventDefault()
    router.push(createPageUrl(newPage))
  }


  return (
    <div>
      <TablePagination 
        align='center'
        component={'div'}
        count={count}
        rowsPerPageOptions={rowsPerPageOptions}
        page={currentPage - 1}
        onPageChange={(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => handlePageChange(event, newPage + 1)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => handleRowsPerPageChange(event)}
      />
    </div>
  )
}

export default PaginationComponent;