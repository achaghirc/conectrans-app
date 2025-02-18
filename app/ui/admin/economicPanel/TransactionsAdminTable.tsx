'use client';
import { getTransactionsByFilter } from '@/lib/data/transactions';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect } from 'react'
import TableAdminPanel, { TableAdminDataType, TableSkeleton } from '../../shared/custom/components/table/TableAdminPanel';
import { FormGroup, IconButton, Menu, MenuItem, styled } from '@mui/material';
import { TransactionDTO } from '@prisma/client';
import { CheckCircleOutline, CloseOutlined, VisibilityOutlined, WarningOutlined } from '@mui/icons-material';
import { DetailsAdminTableInformation } from './DialogInformationTable';
import useUtilsHook from '../../shared/hooks/useUtils';
import { TransactionStatusEnum } from '@/lib/enums';


const TransactionsAdminTable: React.FC = () => {
  const [dataTable, setDataTable] = React.useState<Record<string, TableAdminDataType>[]>([]);
  const [selected, setSelected] = React.useState<Record<string, TableAdminDataType>[] | null>([]);
  const [open, setOpen] = React.useState(false);

  const { formatCurrencyEur } = useUtilsHook();

  const { data, isLoading, isError, isFetched} = useQuery({
    queryKey: ['transactions', 'paid'], 
    queryFn: async () => await getTransactionsByFilter({ status: TransactionStatusEnum.PAID }),
  });

  const onAction = (transactionId: number) => { 
    if (!data) return;
    setOpen(true);
    const transaction = data.find(transaction => transaction.id === transactionId);
    if (!transaction) return;
    const tableData = buildDialogInformation(transaction);
    setSelected(tableData);
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case TransactionStatusEnum.PAID:
        return <CheckCircleOutline color='success' />
      case TransactionStatusEnum.PENDING:
        return <WarningOutlined color='warning' />
      default:
        return <CloseOutlined color='error' />
    }
  }

  const buildDialogInformation = (data: TransactionDTO) => {
      const tableData: Record<string, any>[] = [{
        Plan: {
          content: data.Plan.title,
        }, 
        Precio: {
          content: `${formatCurrencyEur(data.amount)} €`,
        },
        Estado: {
          content: getStatusIcon(data.status),
          align: 'center'
        },
        Acción: {
          content: (
            <FormGroup>
              <IconButton
                size="large"
                aria-label="settings of current offer"
                aria-controls="menu-settings-offer"
                aria-haspopup="true"
                onClick={(e) => console.log('click action on table details')}
                color="inherit"
                >
                <CloseOutlined />
              </IconButton>
            </FormGroup>
          ),
        }
      }]
      return tableData;
    }

  
  const buildTableData = useCallback(() => {
    if (!data) return [];
    const tableData: Record<string, TableAdminDataType>[] = data.map((transaction: TransactionDTO) => {
      return {
        ID: {
          content: transaction.id,
          hidden: true
        },
        Plan: {
          content: transaction.Plan.title,
        }, 
        Precio: {
          content: `${formatCurrencyEur(transaction.amount)}`,
        },
        Estado: {
          content: getStatusIcon(transaction.status),
        }
      }
    })
    setDataTable(tableData);
  }, [data]);
  
  useEffect(() => {
    if (isFetched) {
      buildTableData();
    }
  }, [isFetched]);

  if (isLoading) {
    return <TableSkeleton />
  }

  return (
    <div>
      <TableAdminPanel data={dataTable} onClick={onAction}/>
      <DetailsAdminTableInformation data={selected!} open={open} setOpen={setOpen} />
    </div>
  )
}

export default TransactionsAdminTable
