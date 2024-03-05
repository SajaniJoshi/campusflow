import React, { useState, useEffect, useRef, useCallback } from "react";
import "../assets/css/ShowModules.css";
import useWebSocket from 'react-use-websocket';
import { useNavigate, useLocation } from 'react-router-dom';
import '../assets/css/FileUpload.css';

const Converter = () => {
  const [data, setData] = useState("Conversion Process");
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState([]);
  const [styleType, setStyleType] = useState(0);
  const navigate = useNavigate();
  const socketUrl = 'ws://localhost:8000/ws/updates';
  const location = useLocation();

  // Access the state object from location
  const { state } = location;
  // Destructure email and full_name from the state object
  const { rdf_File_Path, university_name, belongs_to_department, course_name, course_uri, belongs_to_program, has_language } = state || {};


  console.log("FROM CONVERTER", rdf_File_Path, university_name, belongs_to_department)
  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(socketUrl, {
    onOpen: () => {
      sendDataToServer()
    },
    onMessage: (event) => {
      const jsonData = JSON.parse(event.data)
      setData(jsonData.message)
      setProgress(jsonData.progress)
      setMessages([{ message: jsonData.message, type: jsonData.type }, ...messages]);
    },
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => false,
  });

  const sendDataToServer = useCallback(() => setTimeout(() => {
    sendJsonMessage({
      'message': "start",
      'university_name': university_name,
      'rdf_File_Path': rdf_File_Path,
      'belongs_to_department': belongs_to_department,
      'course_name': course_name,
      'course_uri': course_uri,
      'belongs_to_program': belongs_to_program,
      'has_language': has_language
    })
  }, 1000), []);

  const getStyleValue = (index, message, type) => {
    if (type == 0) {
      return <p style={{ color: 'yellow', fontWeight: 300 }} key={index}>{message}</p>
    } else if (type == 10) {
      return <p style={{ color: 'teal', fontWeight: 300 }} key={index}>{message}</p>
    } else if (type == 2) {
      return <p style={{ color: 'green', fontWeight: 700 }} key={index}>{message}</p>
    } else if (type == 3) {
      return <p style={{ color: 'red', fontWeight: 200 }} key={index}>{message}</p>
    } else if (type == 11) {
      return <p style={{ color: 'blue', fontWeight: 400 }} key={index}>{message}</p>
    } else if (type == 12) {
      return <p style={{ color: 'lime', fontWeight: 400 }} key={index}>{message}</p>
    }
  }
  const onClickSimilarityTable = () => {
    navigate('/admin/similaritytable')
  }

  return (
    <div style={{ flex: 1 }}>
      <progress value={progress} max={100} style={{ width: "100%", height: 30 }} />
      {progress === 100 && <button className='start-button' onClick={onClickSimilarityTable}>View Similarity Table</button>}
      <p style={{ color: "#979" }}>{data}</p>
      <div style={{ border: "1px solid black" }}>
        {messages.map((message, index) => getStyleValue(index, message.message, message.type))}
      </div>

    </div>
  );
};

export default Converter;
