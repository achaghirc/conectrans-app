'use client';
import { getApplicationOffersPageableByFilter, getApplicationsOfferUserByFilter, handleApplicationOfferStatus } from "@/lib/data/applicationOffers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Session } from "next-auth";
import React from "react";
import TablePaginatedComponent from "../../../shared/custom/components/table/TablePaginatedComponent";
import { Box, Button, Typography } from "@mui/material";
import { ApplicationOfferDTO } from "@prisma/client";
import CandidateInformationComponent from "./CandidateInformationComponent";
import CandidateFileComponent from "./CandidateFileComponent";
import { downloadFileFromCloud } from "@/lib/services/cloudinary";
import { useRouter } from "next/navigation";
import { ApplicationOfferStatusEnum } from "@/lib/enums";
import CandidateDrawerComponent from "./CandidateDrawerComponent";
import { sendApplicationOfferMail, sendMail } from "@/lib/services/mail/mailsender";

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
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);
  const [openManagement, setOpenManagement] = React.useState<boolean>(false);
  const [action, setAction] = React.useState<ApplicationOfferStatusEnum>(ApplicationOfferStatusEnum.ACCEPTED);
  const [isPdfShow, setPdfShow] = React.useState<boolean>(false);
  const [selectedCandidate, setSelectedCandidate] = React.useState<ApplicationOfferDTO | null>(null);
  
  const {data, isLoading: isLoadingData, isError} = useQuery({
    queryKey: ['offer_candidates', Number(offerId)],
    queryFn: () => getApplicationsOfferUserByFilter({offerId: Number(offerId)}, Number(1), 10),
  });

  if(isLoadingData) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  const handleShow = (candidate: ApplicationOfferDTO) => {
    setSelectedCandidate(candidate);
    setOpen(true);
  }

  const handlePdfShow = (candidate: ApplicationOfferDTO) => {
    setSelectedCandidate(candidate);
    setPdfShow(true);
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
      await queryClient.refetchQueries({queryKey: ['offer_candidates', Number(offerId)]});
      await sendApplicationOfferMail(candidate, status); 
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

  return (
    <Box component='div'
      sx={{
        pt: 2,
      }}
    >
      <Box sx={{ mb: 2}}>
        <Typography variant='h5' fontWeight={700}>
          Candidatos a la oferta
        </Typography>
      </Box>
      <Button onClick={sendMail}>
        Enviar email
      </Button>
      {data && (
        <TablePaginatedComponent rows={data} handleShow={handleShow} handleStatusChange={handleStatusChange} /> 
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