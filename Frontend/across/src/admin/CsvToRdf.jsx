import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { FiCheckCircle } from 'react-icons/fi';
import '../assets/css/FileUpload.css';


const CsvToRdf = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState(null);

    const onDrop = useCallback(async (acceptedFiles) => {
        try {
            const formData = new FormData();
            acceptedFiles.forEach((file) => {
                console.log(JSON.stringify(file))
                formData.append('files', file);
            });

            const response = await axios.post('http://127.0.0.1:8000/adminapp/csvToRdf', formData);

            console.log('Upload response:', response.data);

            setUploadedFiles(acceptedFiles);
            setUploadStatus('Files uploaded successfully!');
        } catch (error) {
            console.error('Error uploading files:', error);
            setUploadStatus('Error uploading files. Please try again.');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div className="file-upload-container">
            <div className='instructions'>
                <p className='instructions-font'>This is utility to update or insert modules in RDF file using csv files</p>
                <p className='instructions-font-subtext'>How to use this utility</p>
                <ul>
                    <li>Upload csv files with modules you want to update or insert in RDF file.</li>
                </ul>
            </div>
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here ...</p>
                ) : (
                    <p>Drag 'n' drop University module files here, or click to select files</p>
                )}
            </div>

            {uploadedFiles.length > 0 && (
                <div className="upload-info">
                    <h3>Uploaded Files:</h3>
                    <ul>
                        {uploadedFiles.map((file) => (
                            <li key={file.name}>{file.name}</li>
                        ))}
                    </ul>
                    <div className="upload-status">
                        <FiCheckCircle size={24} color="#4CAF50" />
                        <p>{uploadStatus}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CsvToRdf;
