import useMediaQueryData from '@/app/ui/shared/hooks/useMediaQueryData';
import { downloadFileFromCloud } from '@/lib/services/cloudinary';
import { CloseOutlined, DownloadOutlined, FileDownload, FileDownloadOutlined } from '@mui/icons-material';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Modal, Typography } from '@mui/material';
import { Asset } from '@prisma/client';
import React from 'react'

type CandidateFileComponentProps = {
  // Define props here
  asset: Partial<Asset> | null | undefined;
  isPdfShow: boolean;
  setPdfShow: (value: boolean) => void;
  handleDownload: (url: string, name: string | null) => void;
}


const CandidateFileComponent: React.FC<CandidateFileComponentProps> = ({
  asset, isPdfShow, setPdfShow, handleDownload
}) => {
  const { mediaQuery } = useMediaQueryData();
  const file = asset as Asset;
  return (
    <Dialog 
      open={isPdfShow} 
      onClose={setPdfShow}
      fullWidth={true}
      maxWidth='lg'
      fullScreen={!mediaQuery}
    >
      <DialogTitle id="form-dialog-title">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h6' fontWeight={900} component={'h4'}>
            Curriculum Vitae
          </Typography>
          <Box>
            {file && file.url != undefined && file.url != null && file.publicId && (
              <IconButton onClick={() => handleDownload && handleDownload(file.url, file.publicId)}>
                <FileDownloadOutlined color='primary' />
              </IconButton>
            )}
            <IconButton onClick={() => setPdfShow(false)}>
              <CloseOutlined color='secondary' />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      {
        !file || !file.url || !file.publicId ? (
          <DialogContent className="show-grid" sx={{ overflow: 'hidden' }}>
            <Typography variant='body1' color='textSecondary'>
              No file to show
            </Typography>
          </DialogContent>
        ) : (
          <DialogContent className="show-grid" sx={{ overflow: 'hidden' }}>
            {/* <iframe src={fileUrl}  style={{ width: '100%', minHeight: '100%' }} frameBorder="0"></iframe> */}
            <iframe src={file.url} width="100%" height="600px" />
          </DialogContent>
      )
    }
  </Dialog>
  )
}

export default CandidateFileComponent
