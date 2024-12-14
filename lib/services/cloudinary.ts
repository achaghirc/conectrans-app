'use server';
import { v2 as cloudinary, DeleteAssetRelation, UploadApiResponse } from 'cloudinary';
import { CloudinaryRemoveResponse } from '../definitions';

/**
 * Converts an ArrayBuffer to a Base64 string (Node.js compatible).
 * @param {ArrayBuffer} buffer - The ArrayBuffer to convert.
 * @returns {string} - The Base64 encoded string.
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const binary = Buffer.from(buffer).toString('base64');
  return binary;
}

/**
 * Converts a File object (or equivalent) to Base64 string in Node.js.
 * @param {File | Blob} file - The file-like object to convert.
 * @returns {Promise<string>} - A promise that resolves to a Base64 string.
 */
async function fileToBase64(file: File | Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  return arrayBufferToBase64(arrayBuffer);
}

//New method to upload images to cloudinary
export async function uploadFileToCloud(image: File, userEmail: string) {
  const base64StringFile = await fileToBase64(image);
  const response: UploadApiResponse = await cloudinary.uploader.upload(`data:${image.type};base64,${base64StringFile}`, {
    public_id: `${userEmail}_file_${image.name}`,
    upload_preset: 'conectrans_preset',
  });
  const cloudinaryResponse = {
    ...response,
    original_filename: image.name,
  }
  return cloudinaryResponse;  
}

export async function removeFileFromCloud(identifier: string, format: string) {
    const response: CloudinaryRemoveResponse = await cloudinary.uploader.destroy(identifier);
    return response;
}