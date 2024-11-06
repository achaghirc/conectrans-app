//New method to upload images to cloudinary
export async function uploadFileToCloud(image: File) {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'conectrans_preset');
    console.log('env', process.env.CLOUDINARY_CLOUD_NAME);
    const res = await fetch(`https://api.cloudinary.com/v1_1/dgmgqhoui/image/upload`, {
        method: 'POST',
        body: formData
    });
    return await res.json();
}

export async function removeFileFromCloud(identifier: string, format: string) {
    if(format !== 'image') {
        format = 'raw';
    }

    const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/image/upload`;
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = `public_id=${identifier}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;

    const formData = new FormData();
    formData.append('public_id', identifier);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', process.env.CLOUDINARY_API_KEY!);

    const res = await fetch(url, {
        method: 'DELETE',
        body: formData
    });

    return await res.json();
}