import Head from 'next/head';
import { useEffect } from 'react';

//mongodbstuff
import React, { useState } from 'react';
// import axios from 'axios';

const serverURL = "http://192.168.68.128:8080/api"

export default function Home() {
//===========================================================MONGODB TESTING=======================================//
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = event => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedFile);
    fetch(serverURL + '/upload', {
      method: 'POST',
      body: formData,
    }).then(response => response.json()).then(data => {
      console.log(data);
    });
  };
  

  const uploadGarbage = () => {
    fetch(serverURL + '/getgarbage')
    .then(response => response.json()).then(data => {
      console.log(data);
    });
  }

  return (
    <>
      <Head>
        <title>test</title>
      </Head>
      <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Upload File</button>
      <button onClick={uploadGarbage}>Upload Garbage</button>
    </div>
    </>
  );
}