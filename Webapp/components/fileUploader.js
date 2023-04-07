import { useReducer, useState, useRef } from "react";
import styles from './fileUploader.module.scss';
import Image from "next/image";
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cx from 'classnames';
import { Lato } from '@next/font/google';
import Database from "../scripts/dbInterface";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { pdfjs, Document, Page } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
// Code in this component is mostly from some tutorial
const lato = Lato({
    weight: ['100', '300', '400', '900'],
    subsets: ['latin-ext'],
    display: 'swap',
});

const firebaseConfig = {
    apiKey: "AIzaSyCew1DevDcpknJ9ROwEhVhp9yPUFhtygQ4",
    authDomain: "project-nexus-authentication.firebaseapp.com",
    projectId: "project-nexus-authentication",
    storageBucket: "project-nexus-authentication.appspot.com",
    messagingSenderId: "562007904915",
    appId: "1:562007904915:web:72f88a7f4437dc872f3366",
    measurementId: "G-3M7WVJKP31"
};
const app = initializeApp(firebaseConfig);

const FilePreview = ({ fileData }) => {
    const [pdfPreviews, _setPdfPreviews] = useState(Array(1000).fill(''));
    const pdfPreviewsRef = useRef(pdfPreviews);
    const setPdfPreviews = (data) => {
        pdfPreviewsRef.current = data;
        _setPdfPreviews(data);
    }


    // const tmpPrv = fileData.fileList.map((f) => {
    //     let reader = new FileReader();
    //     reader.readAsDataURL(f);
    //     reader.onloadend = (e) => {
    //         setPdfPreviews(e.target.result);
    //     }
    // }
    console.log("reloading");
    fileData.fileList.map((f, i) => {
        let reader = new FileReader();

        // console.log(`currentVal: {${pdfPreviews[i]}}`);
        reader.readAsDataURL(f);
        reader.onloadend = (e) => {
            if (pdfPreviewsRef.current[i] !== e.target.result) {
                // // console.log(e.target.result);
                // console.log(`setting ${i}`);
                pdfPreviewsRef.current[i] = e.target.result;
                setPdfPreviews([...pdfPreviewsRef.current]);
                // console.log(f.name);
                e.target.onloadend = (e) => { };
            }
        }
    });

    let dataIndex = -1;
    return (
        <div className={styles.fileList}>
            <div className={styles.fileContainer}>
                {/* loop over the fileData */}
                {fileData.fileList.map((f) => {
                    dataIndex++;
                    // console.log(dataIndex);
                    // console.log(pdfPreviews[dataIndex]);
                    return (
                        <>
                            <ol>
                                <li key={f.lastModified} className={styles.fileList}>
                                    {/* display the filename and type */}
                                    <div key={f.name} className={styles.fileName}>
                                        {f.name} {dataIndex}
                                        {/* load a page 1 with a small scale */}
                                        <Document
                                            // file={{ data: pdfPreviews[dataIndex] }}
                                            file={pdfPreviews[dataIndex]}


                                        >
                                            <Page
                                                pageNumber={1}
                                                width={300}
                                                renderAnnotationLayer={false}
                                                renderTextLayer={false}
                                            />
                                        </Document>
                                    </div>
                                </li>
                            </ol>
                        </>
                    );
                })}
            </div>
        </div>
    );
};

const DropZone = ({ data, dispatch, close, router, forceReload }) => {
    // onDragEnter sets inDropZone to true
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
    };

    // onDragLeave sets inDropZone to false
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();

        dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
    };

    // onDragOver sets inDropZone to true
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // set dropEffect to copy i.e copy of the source item
        e.dataTransfer.dropEffect = "copy";
        dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
    };

    // onDrop sets inDropZone to false and adds files to fileList
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // get files from event on the dataTransfer object as an array
        let files = [...e.dataTransfer.files];

        // ensure a file or files are dropped
        if (files && files.length > 0) {
            // loop over existing files
            const existingFiles = data.fileList.map((f) => f.name);
            // check if file already exists, if so, don't add to fileList
            // this is to prevent duplicates
            files = files.filter((f) => !existingFiles.includes(f.name));

            // dispatch action to add droped file or files to fileList
            dispatch({ type: "ADD_FILE_TO_LIST", files });
            // reset inDropZone to false
            dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
        }
    };

    // handle file selection via input element
    const handleFileSelect = (e) => {
        // get files from event on the input element as an array
        let files = [...e.target.files];

        // ensure a file or files are selected
        console.log("handleFileSelect");

        if (files && files.length > 0) {
            // loop over existing files
            const existingFiles = data.fileList.map((f) => f.name);
            // check if file already exists, if so, don't add to fileList
            // this is to prevent duplicates
            files = files.filter((f) => !existingFiles.includes(f.name) && f.type === "application/pdf");

            // dispatch action to add selected file or files to fileList
            dispatch({ type: "ADD_FILE_TO_LIST", files });
            e.target.value = null;
        }
    };

    const uploadFiles = async (event) => {
        // get the files from the fileList as an array
        event.target.innerHTML = "Uploading...";
        const files = data.fileList;
        const auth = getAuth(app);
        const user = auth.currentUser;
        if (user == null) {
            alert("You must be logged in to upload files");
            router.push("/login");
            return;
        }
        console.log(user.uid);
        console.log(data.fileList);
        let response = await Database.uploadFiles(files, user.uid);

        // let response = "bob";
        // console.log("Sending files");
        // for (let file of files) {
        //     response = await Database.uploadFile(file);
        // }

        //successful file upload
        if (response.ok) {
            event.target.innerHTML = "Upload";
            // alert("Files uploaded successfully");
            dispatch({ type: "CLEAR_FILE_LIST", files: [] });
            if (forceReload) {
                setTimeout(forceReload, 100);
            }
            close();

        } else {
            // unsuccessful file upload
            event.target.innerHTML = "Upload";
            alert("Error uploading files");
        }
    };

    const clearFiles = (event) => {
        dispatch({ type: "CLEAR_FILE_LIST", files: [] });
    };

    return (
        <div>
            <div
                className={styles.dropzone}
                onDragEnter={(e) => handleDragEnter(e)}
                onDragOver={(e) => handleDragOver(e)}
                onDragLeave={(e) => handleDragLeave(e)}
                onDrop={(e) => handleDrop(e)}
            >
                <Image src="/upload.svg" className={styles.svg} alt="upload" height={50} width={50} />

                <input
                    id="fileSelect"
                    type="file"
                    multiple
                    accept="application/pdf"
                    className={styles.files}
                    onChange={handleFileSelect}
                />
                <label htmlFor="fileSelect">You can select multiple Files</label>

                <h3 className={styles.uploadMessage}>
                    or drag &amp; drop your files here
                </h3>
            </div>
            {/* Pass the selectect or dropped files as props */}
            <div className={styles.previewWrapper}>
                <FilePreview fileData={data} />
            </div>
            {data.fileList.length > 0 && (
                <div>
                    <button id="fileUploadButton" className={styles.uploadBtn} onClick={uploadFiles}>
                        Upload
                    </button>
                    <button id="fileUploadButton" className={styles.uploadBtn} onClick={clearFiles}>
                        Clear Upload
                    </button>
                </div>
            )}
        </div>
    );
};

export default function FileUploader({ visible, setVisible, router, forceReload }) {

    const reducer = (state, action) => {
        switch (action.type) {
            case "SET_IN_DROP_ZONE":
                return { ...state, inDropZone: action.inDropZone };
            case "ADD_FILE_TO_LIST":
                return { ...state, fileList: state.fileList.concat(action.files) };
            case "CLEAR_FILE_LIST":
                return { ...state, fileList: [] };
            default:
                return state;
        }
    };

    // destructuring state and dispatch, initializing fileList to empty array
    const [data, dispatch] = useReducer(reducer, {
        inDropZone: false,
        fileList: [],
    });

    const close = () => {
        setVisible(false);
    };

    const blockClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div
            className={visible ? styles.fileUploadWrapperVisible : styles.fileUploadWrapperHidden}
            onClick={close}
        >

            <div className={styles.innerWrapper}>
                <div className={visible ? styles.closeButton : styles.hiddenButton}>
                    <FontAwesomeIcon icon={faXmark} />
                </div>
                <div className={styles.centerWrapper}>
                    <div className={styles.fileContainer}>
                        <main
                            id="fileUploaderMain"
                            className={styles.main}
                            onClick={blockClick}
                        >
                            <div className={cx(styles.title, lato.className)}>
                                PDF Upload
                            </div>
                            <DropZone data={data} dispatch={dispatch} close={close} router={router} forceReload={forceReload} />
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}