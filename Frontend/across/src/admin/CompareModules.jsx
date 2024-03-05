import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { FiCheckCircle } from "react-icons/fi";
import "../assets/css/FileUpload.css";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./components/Navbar/AdminNavbar";
import { api} from "../api/externalApi";


const CompareModules = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState(null);
    //const [cleaningStatus, setUpCleanStatus] = useState(true);
    //const [message, setMessage] = useState("Preparing Tool");
    const navigate = useNavigate();

    // useEffect(() => {
    //     //cleanUpAndPrepare();
    // }, []);
    // const cleanUpAndPrepare = () => {
    //     api.post
    //     ("/adminapp/deleteclean", {
            
    //         body: JSON.stringify({}),
    //     })
    //         .then((response) => {
    //             if (response.status == 200) {
    //                 setUpCleanStatus(false);
    //             } else {
    //                 setMessage("Failed to Prepare Tool!");
    //             }
    //         })
    //         .catch((error) => console.error(error));
    // };

    const onPressStartProcess = () => {
        navigate("/admin/automation");
    };
    const onDrop = useCallback(async (acceptedFiles) => {
        try {
            const formData = new FormData();
            acceptedFiles.forEach((file) => {
                console.log(JSON.stringify(file));
                formData.append("files", file);
            });

            const response = await api.post(
                "/adminapp/upload",
                formData
            );

            console.log("Upload response:", response.data);

            setUploadedFiles(acceptedFiles);
            setUploadStatus("Files uploaded successfully!");
        } catch (error) {
            console.error("Error uploading files:", error);
            setUploadStatus("Error uploading files. Please try again.");
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    // if (cleaningStatus)
    //     return (
    //         <div className="file-upload-container">
    //             {/* <p className="instructions-font">{message}</p> */}
    //         </div>
    //     );
    return (
        <div style={{ flex: 1 }}>
            <AdminNavbar />
            <div className="file-upload-container">
                <div className="instructions">
                    <p className="instructions-font">
                        This is utility to find similar modules based on their content or
                        names. The purpose of this utility is to reduce the human-effort for
                        finding if given module is similar to other universities modules can be deemed similar
                    </p>
                    <p className="instructions-font-subtext">How to use this utility</p>
                    <ul>
                        <li>
                            Upload one PDF file with modules you want to find similarities
                            between
                        </li>
                        <li>Click Start processing</li>
                        <li>
                            After processing a new RDF file will be generated with a relation
                            identifying similar modules
                        </li>
                        <li>
                            The newly generated files can be than used with different API's and
                            sparql queries
                        </li>
                    </ul>
                </div>
                <div
                    {...getRootProps()}
                    className={`dropzone ${isDragActive ? "active" : ""}`}
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop the files here ...</p>
                    ) : (
                        <p>
                            Drag 'n' drop University module files here, or click to select files
                        </p>
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
                <div className="start-button-parent">
                    <button onClick={onPressStartProcess} className="start-button">
                        Start Processing Files
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompareModules;
