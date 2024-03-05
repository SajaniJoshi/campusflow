import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { FiCheckCircle } from "react-icons/fi";
import "../assets/css/FileUpload.css";
import { useNavigate } from "react-router-dom";
import { telecastFile } from "../api/adminApi";
import { api } from "../api/externalApi";

const FileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [cleaningStatus, setUpCleanStatus] = useState(true);
  const [message, setMessage] = useState("Preparing Tool");
  const navigate = useNavigate();

  useEffect(() => {
    cleanUpAndPrepare();
  }, []);
  const cleanUpAndPrepare = () => {
    api.post("/adminapp/deleteclean", {

      body: JSON.stringify({}),
    })
      .then(response => {
        if (response.status == 200) {
          setUpCleanStatus(false);
        } else {
          setMessage("Failed to Prepare Tool!");
        }
      })
      .catch(error => console.error(error));
  };

  const onPressStartProcess = () => {
    navigate("/admin/automation");
  };
  const onDrop = useCallback(async acceptedFiles => {
    try {
      const formData = new FormData();
      acceptedFiles.forEach(file => {
        console.log(JSON.stringify(file));
        formData.append("files", file);
      });

      const response = await telecastFile(formData);

      console.log("Upload response:", response.data);
      setUploadedFiles(acceptedFiles);
      setUploadStatus("Files uploaded successfully!");
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadStatus("Error uploading files. Please try again.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  if (cleaningStatus)
    return (
      <div className="file-upload-container">
        <p className="instructions-font">{message}</p>
      </div>
    );
  return (
    <div className="file-upload-container">

      <div className="start-button-parent">
        <button onClick={onPressStartProcess} className="start-button">
          Start Processing Files
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
