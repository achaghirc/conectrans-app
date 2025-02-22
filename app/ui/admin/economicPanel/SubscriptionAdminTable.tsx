'use client';
import React, { useCallback, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query';
import { getSubscriptionByFilter } from '@/lib/data/subscriptions';
import { SubscriptionFilterDTO } from '@/lib/definitions';
import { fromValueSubscription, SubscriptionStatusEnum } from '@/lib/enums';
import { SubscriptionDataDTO } from '@prisma/client';
import { FormGroup, IconButton } from '@mui/material';
import { CheckCircleOutline, CheckOutlined, CloseOutlined, MoreVertOutlined, VisibilityOutlined } from '@mui/icons-material';
import TableCustomPanel, { TableCustomDataType, TableSkeleton } from '../../shared/custom/components/table/TableCustomPanel';
import { DetailsAdminTableInformation } from './DialogInformationTable';
import dayjs from 'dayjs';
dayjs.locale('es');

const filter: SubscriptionFilterDTO = {
  status: SubscriptionStatusEnum.ACTIVE
}

const SubscriptionAdminTable: React.FC = () => {
  const [dataTable, setDataTable] = React.useState<Record<string, TableCustomDataType>[]>([]);
  const [selected, setSelected] = React.useState<Record<string, TableCustomDataType>[] | null>([]);
  const [open, setOpen] = React.useState(false);
  const { data, isLoading, isError, isFetched} = useQuery({
    queryKey: ['subscriptions', filter], 
    queryFn: async () => await getSubscriptionByFilter(filter),
  });

  const onAction = (subscriptionId: number) => { 
    if (!data) return;
    setOpen(true);
    const subscription = data.find(subscription => subscription.id === subscriptionId);
    if (!subscription) return;
    const tableData = buildDialogInformation(subscription);
    setSelected(tableData);
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case SubscriptionStatusEnum.ACTIVE:
        return <CheckCircleOutline color='success' />
      case SubscriptionStatusEnum.INACTIVE:
        return <CloseOutlined color='error' />
      default:
        return <CloseOutlined color='error' />
    }
  }

  const buildDialogInformation = (data: SubscriptionDataDTO) => {
    const tableData: Record<string, TableCustomDataType>[] = [{
      ID: {
        content: data.id,
        hidden: true
      },
      Usuario: {
        content: data.User.email,
      },
      Empresa: {
        content: data.User.Company?.name,
      },
      Estado: {
        content: getStatusIcon(data.status),
        align: 'center'
      },
      'Ofertas disponibles': {
        content: data.remainingOffers,
      },
      'Ofertas consumidas': {
        content: data.usedOffers,
      },
      'Ultima actualización': {
        content: dayjs(data.updatedAt).format("DD/MM/YYYY"),
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
        align: 'center'
      }
    }]
    return tableData;
  }

  const buildTableData = useCallback(() => {
    if (!data) return [];
    const tableData: Record<string, TableCustomDataType>[] = data.map((subscription: SubscriptionDataDTO) => {
      return {
        ID: {
          content: subscription.id,
          hidden: true
        },
        Usuario: {
          content: subscription.User.email,
        },
        Empresa: {
          content: subscription.User.Company?.name,
        },
        Estado:{
          content: getStatusIcon(subscription.status),
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

  if (isError) {
    return <div>Error</div>
  }



  
  return (
    <div>
      <TableCustomPanel data={dataTable} onClick={onAction}/>
      <DetailsAdminTableInformation data={selected!} open={open} setOpen={setOpen} />
    </div>
  )
}

export default SubscriptionAdminTable
