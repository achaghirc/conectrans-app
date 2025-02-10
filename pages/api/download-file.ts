import { downloadFileFromCloud } from "@/lib/services/cloudinary";
import { NextApiRequest, NextApiResponse } from 'next';

interface DownloadFileRequest extends NextApiRequest {
  query: {
    public_id?: string;
    url?: string;
  };
}

const downloadFile =  async function handler(req: DownloadFileRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { public_id, url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing public_id parameter' });
  }
  try {

    // Fetch the file from Cloudinary
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch file from Cloudinary: ${response.statusText}`);
    }

    // Set headers for file download
    const contentType = response.headers.get('content-type');
    res.setHeader('Content-Disposition', `attachment; filename=${public_id ? public_id.split('/').pop(): 'file'}`);
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    } else {
      res.setHeader('Content-Type', 'application/octet-stream');
    }

    // Stream the file data to the client
    const { pipeline } = require('stream');
    pipeline(response.body, res, (err: any) => {
      if (err) {
        console.error('Pipeline failed:', err);
        res.status(500).json({ error: 'Failed to download the file' });
      }
    });
  } catch (error) {
    console.error('Error downloading the file:', error);
    res.status(500).json({ error: 'Failed to download the file' });
  }
}

export default downloadFile;