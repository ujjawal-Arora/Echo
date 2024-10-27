import axios from 'axios';

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/dptxufghg/upload`;

// Define the function with an appropriate type for the file parameter
const uploadFile = async (file: File): Promise<any> => { 
    console.log(file);
    console.log(process.env.VITE_CLOUD_NAME)

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', "chatKaro");
  
    try {
        const response = await axios.post(CLOUDINARY_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('File uploaded successfully:', response.data);
        return response.data; // Return the uploaded file data
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error; // Re-throw the error for handling elsewhere
    }
};

export default uploadFile;
