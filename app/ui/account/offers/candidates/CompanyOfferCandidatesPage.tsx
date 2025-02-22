'use client';
import { getApplicationOffersPageableByFilter, getApplicationsOfferUserByFilter, handleApplicationOfferStatus } from "@/lib/data/applicationOffers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Session } from "next-auth";
import React, { useEffect } from "react";
import TablePaginatedComponent from "../../../shared/custom/components/table/TablePaginatedComponent";
import { Box, Button, IconButton, Skeleton, Tooltip, Typography } from "@mui/material";
import { ApplicationOfferDTO } from "@prisma/client";
import CandidateInformationComponent from "./CandidateInformationComponent";
import CandidateFileComponent from "./CandidateFileComponent";
import { downloadFileFromCloud } from "@/lib/services/cloudinary";
import { useRouter } from "next/navigation";
import { ApplicationOfferStatusEnum } from "@/lib/enums";
import CandidateDrawerComponent from "./CandidateDrawerComponent";
import { sendApplicationOfferMail, sendMail } from "@/lib/services/mail/mailsender";
import TableCustomPanel, { TableSkeleton } from "@/app/ui/shared/custom/components/table/TableCustomPanel";
import { ArrowForwardOutlined, CheckCircleOutline, CloseOutlined, PendingOutlined } from "@mui/icons-material";
import SnackbarCustom from "@/app/ui/shared/custom/components/snackbarCustom";

import dayjs from 'dayjs';
import { TableCustomDataType } from "@/lib/definitions";
import useMediaQueryData from "@/app/ui/shared/hooks/useMediaQueryData";
import TableCustomCardMobile from "@/app/ui/shared/custom/components/table/TableCardMobile";
dayjs.locale('es');


type CompanyOfferCandidatesPageProps = {
  session: Session | null;
  offerId: string;
}


const CompanyOfferCandidatesPage: React.FC<CompanyOfferCandidatesPageProps>= ({
  session,
  offerId
}) => {
  const router = useRouter();
  if (!session) {
    router.push('/auth/login');
    return null;
  }
  const { mediaQuery } = useMediaQueryData();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);
  const [openManagement, setOpenManagement] = React.useState<boolean>(false);
  const [action, setAction] = React.useState<ApplicationOfferStatusEnum>(ApplicationOfferStatusEnum.ACCEPTED);
  const [isPdfShow, setPdfShow] = React.useState<boolean>(false);
  const [selectedCandidate, setSelectedCandidate] = React.useState<ApplicationOfferDTO | null>(null);
  
  const [tableData, setTableData] = React.useState<Record<string, TableCustomDataType>[]>([]);

  const {data, isLoading: isLoadingData, isError, isFetched} = useQuery({
    queryKey: ['offer_candidates', Number(offerId)],
    queryFn: () => getApplicationsOfferUserByFilter({offerId: Number(offerId)}, Number(1), 10),
  });

  const handleShow = (candidateId: number) => {
    const candidate: ApplicationOfferDTO | undefined= data?.find((candidate) => candidate.id === candidateId);
    if (!candidate) {
      return;
    }
    setSelectedCandidate(candidate);
    setOpen(true);
  }

  const handleDownloadPdf = async (url: string, publicId: string | null) => {
    try {
      
      const res = await fetch(`/api/download-file?url=${url}&public_id=${publicId}`)
      if (!res.ok) {
        throw new Error('Error downloading the file');
      }
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      console.log('Download pdf');

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = publicId ? `${publicId}_cv.pdf` : `cv.pdf`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  }

  const CandidateInformationComponentMemo = React.memo(CandidateInformationComponent);
  const CandidateFileComponentMemo = React.memo(CandidateFileComponent);
  const getPartialAsset = (asset: any) => {
    if (asset) {
      return {
        url: asset.url,
        secureUrl: asset.secureUrl,
        publicId: asset.publicId
      }
    }
    return null
  }

  const handleStatusChange = async (candidate: ApplicationOfferDTO, status: ApplicationOfferStatusEnum) => {
    setSelectedCandidate(candidate);
    setAction(status);
    setOpenManagement(true);
  }

  const handleApplicationOfferStatusChange = async (candidate: ApplicationOfferDTO, status: ApplicationOfferStatusEnum) => {
    try {
      setIsLoading(true);
      if (!candidate.id) {
        return;
      }
      await handleApplicationOfferStatus(candidate.id, status);
      await sendApplicationOfferMail(candidate, status); 
      await queryClient.refetchQueries({queryKey: ['offer_candidates', Number(offerId)]});
    } catch (error) {
      console.error('Error changing the status of the candidate:', error);
    } finally {
      setIsLoading(false);
      setOpenManagement(false);
    }
  }

  const toggleDrawer = ( value: boolean, event?: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setOpenManagement(value);
  };

  const candidateActions = (row: ApplicationOfferDTO) => {
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

  const buildTableData = React.useMemo(() => {
    if (!data) {
      return [];
    }
    const tableData: Record<string, TableCustomDataType>[] = data.map((candidate: ApplicationOfferDTO) => {
      return {
        ID: {
          content: candidate.id,
          hidden: true
        },
        Nombre: {
          content: candidate.Person?.name,
          align: 'center'
        },
        Apellidos: {
          content: candidate.Person?.lastname, 
          align: 'center'
        },
        'Fech. Nacimiento': {
          content: dayjs(candidate.Person?.birthdate).format('DD/MM/YYYY'),
          align: 'center'
        },
        Licencias: {
          content: candidate.Person?.DriverProfile[0].DriverLicence.filter((licence) => licence.LicenceType?.type === 'CARNET').map((licence) => licence.LicenceType?.name).join(', ') ?? '',
          align: 'center'
        },
        Acciones: {
          content: candidateActions(candidate),
          align: 'center'
        }
      } as Record<string, TableCustomDataType>;
    });
    return tableData;
  }, [data]);

  useEffect(() => {
    if (data) {
      setTableData(buildTableData);
    }
  }, [isFetched, data])

  if(isError) {
    return (
      <SnackbarCustom
        open={true}
        message='Error al cargar los datos'
        severity='error'
        handleClose={() => {}}
      />
    )
  }

  return (
    <Box component='div'
      sx={{
        pt: 2,
      }}
    >
      <Box sx={{ mb: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: {xs: 'center', sm: 'start'} }}>
        <Typography variant='h5' fontWeight={700}>
          Candidatos a la oferta
        </Typography>
      </Box>
      {isLoadingData && (
        <TableSkeleton />
      )}
      {data && (
         mediaQuery ? 
          <TableCustomPanel data={tableData} onClick={handleShow} /> 
        :
          <TableCustomCardMobile data={data} onClick={handleShow} handleStatusChange={handleStatusChange} />
      )}
      <CandidateInformationComponentMemo 
        session={session}
        open={open}
        setOpen={setOpen}
        offerId={offerId}
        selectedCandidate={selectedCandidate}
        setPdfShow={setPdfShow}
      />
      <CandidateFileComponentMemo
        asset={getPartialAsset(selectedCandidate?.Person?.Asset)}
        isPdfShow={isPdfShow}
        setPdfShow={setPdfShow}
        handleDownload={handleDownloadPdf}
      />
      <CandidateDrawerComponent 
        data={selectedCandidate}
        open={openManagement}
        action={action}
        setOpen={toggleDrawer}
        isLoading={isLoading}
        onAction={handleApplicationOfferStatusChange}
      /> 
    </Box>
  ) 
}

export default CompanyOfferCandidatesPage