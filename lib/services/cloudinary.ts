
//New method to upload images to cloudinary
export async function uploadImage(image: File) {
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