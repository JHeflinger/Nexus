import scannerStyles from './scanner.module.scss'
import { useRouter } from 'next/router'
import ImageManipulator from '../components/imageManipulator'
import Stars from '../components/stars'
import { useRef, useState, useEffect } from 'react'
import CoolButton from '../components/coolButton'
import DisplayPreviews from '../components/displayPreviews'
import Head from 'next/head';
import Link from 'next/link'
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import Dropdown from '../components/dropdown'
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { faCloud } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import utilStyles from '../styles/utils.module.scss'
import { Lato } from '@next/font/google';
import cx from 'classnames';
import Database from '../scripts/dbInterface';
import jsPDF from 'jspdf';

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
const auth = getAuth(app);

export default function Scanner() {
    const router = useRouter()

    useEffect(() => {
        router.prefetch("/search");
        router.prefetch("/login");
        router.prefetch("/account");
        auth.onAuthStateChanged((user) => {
            if (user) {
                const uid = user.uid;
                const displayName = user.name;
                const email = user.email;
                console.log(`uid: ${uid}, displayname: ${displayName} email: ${email}`);
            } else {
                console.log("No user signed in, please log in!");
                router.push("/login");
            }
        });
    }, []);

    const [image, setImage] = useState(null);
    const [zoomSense, _setZoomSense] = useState(50);
    const [selectedPoints, _setSelectedPoints] = useState([]);
    const [highlightedRectangles, _setHighlightedRectangles] = useState([]);
    const [scannedImages, _setScannedImages] = useState([]);
    const [forceReload, _setForceReload] = useState(1);

    const forceReloadRef = useRef(forceReload);
    const setForceReload = (data) => {
        console.log(`Changing forceReload from ${forceReloadRef.current} to ${data}`);
        forceReloadRef.current = data;
        _setForceReload(data);
    };

    const scannedImagesRef = useRef(scannedImages);
    const setScannedImages = data => {
        scannedImagesRef.current = data;
        _setScannedImages(data);
    };

    const selectedPointsRef = useRef(selectedPoints);
    const setSelectedPoints = data => {
        selectedPointsRef.current = data;
        _setSelectedPoints(data);
    };

    const highlightedRectanglesRef = useRef(highlightedRectangles);
    const setHighlightedRectangles = data => {
        highlightedRectanglesRef.current = data;
        _setHighlightedRectangles(data);
    };

    const zoomSenseRef = useRef(zoomSense)
    const setZoomSense = data => {
        zoomSenseRef.current = data
        localStorage.setItem('zoomSense', data);
        _setZoomSense(data)
        // console.log(`Zoom sense: ${zoomSense}`);
    };

    useEffect(() => {
        const currentZoomSense = localStorage.getItem('zoomSense');
        if (currentZoomSense) {
            setZoomSense(currentZoomSense);
        }
    }, [])

    const zoomSliderWrapperCallback = (event) => {
        setZoomSense(event.target.value);
    };

    const updateImage = event => {
        if (event.target.files[0]) {
            setImage(event.target.files[0]);
            setSelectedPoints([]);
            setHighlightedRectangles([]);
            // setScannedImages([]);
            setForceReload(forceReloadRef.current + 1);
        }
    }

    const clickImageUpload = () => {
        document.getElementById("scannerImageInput").click();
    }


    const getPDF = () => {
        if (scannedImagesRef.current.length === 0) {
            alert("No pages to download!");
            return;
        }
        const pdf = new jsPDF('p', 'pt', 'letter');
        //add all scanned images to pdf, scaling them to be the size as the largest
        let largestWidth = pdf.internal.pageSize.getWidth();
        let largestHeight = pdf.internal.pageSize.getHeight();

        scannedImagesRef.current.forEach((image) => {
            pdf.addImage(image, 'JPEG', 0, 0, largestWidth, largestHeight);
            pdf.addPage();
        }
        );
        pdf.deletePage(pdf.internal.getNumberOfPages());
        return pdf;
    }

    const clickDownloadPDF = (event) => {
        const pdf = getPDF();
        if (!pdf) {
            return;
        }
        pdf.save('scanned.pdf');
    }

    const uploadFiles = async (event, filesToUpload) => {
        // get the files from the fileList as an array
        event.target.innerHTML = "Uploading...";
        // const files = data.fileList;
        const auth = getAuth(app);
        const user = auth.currentUser;
        if (user == null) {
            alert("You must be logged in to upload files");
            router.push("/login");
            return;
        }
        console.log(user.uid);
        // console.log(data.fileList);
        let response = await Database.uploadFiles(filesToUpload, user.uid);

        if (response.ok) {
            event.target.innerHTML = "Upload";
            alert("File uploaded successfully");

        } else {
            event.target.innerHTML = "Upload";
            alert("Error uploading files");
        }
    };


    const clickUploadPDF = (event) => {
        const pdf = getPDF();
        if (!pdf) {
            return;
        }
        let pdfData = pdf.output('blob');

        let inputName = document.getElementById("scannerFileName").innerText;
        inputName = inputName.trim();
        if (inputName === "") {
            inputName = `scanned_${image.name}.pdf`;
        } else {
            if (!inputName.endsWith(".pdf")) {
                inputName += ".pdf";
            }
        }
        const pdfType = "application/pdf";
        const pdfFile = new File([pdfData], inputName, { type: pdfType });
        const pdfFileList = [pdfFile];
        uploadFiles(event, pdfFileList);

    }

    const clearPages = (event) => {
        if (!window.confirm("Are you sure you want to clear all pages?")) {
            return;
        }
        setScannedImages([]);
        setHighlightedRectangles([]);
        setForceReload(forceReloadRef.current + 1);
    }
    const accIcon = <FontAwesomeIcon className={scannerStyles.accIconBtn} icon={faUserCircle} />
    const searchIcon = <FontAwesomeIcon icon={faSearch} />

    const clickAccountPageLink = () => {
        router.push('./account');
    }

    const clickSearchLink = () => {
        router.push('/search');
    }


    return (
        <>
            <Head>
                <title>Scanner</title>
                <Link rel="stylesheet" href="https://unpkg.com/simplebar@latest/dist/simplebar.css" />

            </Head>
            <div className={utilStyles.dropdownWrapper}>
                <Dropdown
                    items={{
                        "TestItem1": [accIcon, clickAccountPageLink],
                        "TestItem3": [searchIcon, clickSearchLink]
                    }}
                />
            </div>
            <div id='scannerOuterWrapper' className={scannerStyles.outerWrapper}>
                <Stars
                    blur={5}
                />
                {/* <script src="https://cdn.jsdelivr.net/npm/simplebar@latest/dist/simplebar.min.js" /> */}
                <img
                    src={image === null ? "" : URL.createObjectURL(image)}
                    id='scannerImageElementForCV'
                    style={{ display: 'None' }}
                />
                <div id='scannerInnerWrapper' className={scannerStyles.innerWrapper}>
                    <div id='scannerImagePanelWrapper' className={scannerStyles.imagePanelWrapper}>
                        <div className={scannerStyles.imagePanelInnerWrapper}>
                            <div
                                id='scannerTopInfoBar'
                                className={cx(scannerStyles.topInfoBar, lato.className)}
                            >
                                {image === null ? "No Image Uploaded" : `Image Name: ${image.name}`}
                            </div>
                            <div id='scannerMainContentWrapper' className={scannerStyles.mainContentWrapper}>
                                <div id='scannerImageViewer' className={scannerStyles.imageViewer}>
                                    <ImageManipulator
                                        image={image}
                                        zoomSense={zoomSense}
                                        selectedPoints={selectedPoints}
                                        setSelectedPoints={setSelectedPoints}
                                        highlightedRectangles={highlightedRectangles}
                                        setHighlightedRectangles={setHighlightedRectangles}
                                        forceReload={forceReload}
                                        setForceReload={setForceReload}
                                        router={router}
                                        scannedImages={scannedImages}
                                        setScannedImages={setScannedImages}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id='scannerControlsWrapper' className={scannerStyles.controlsWrapper}>
                        <div id='scannerControlsInnerWrapper' className={scannerStyles.controlsInnerWrapper}>
                            <div className={scannerStyles.controlsTitle}>Controls</div>
                            <input
                                type="file"
                                onChange={updateImage}
                                accept="image/jpg, image/jpeg, image/png, image/heic, image/tiff"
                                id="scannerImageInput"
                                style={{ display: "None" }}
                            />
                            <CoolButton
                                content="Upload Image"
                                move={false}
                                id="scannerUploadImageButton"
                                className={scannerStyles.uploadImageButton}
                                callback={clickImageUpload}
                            />
                            <div
                                id='scannerPDFbuttonsWrapper'
                                className={scannerStyles.pdfButtonsWrapper}
                            >
                                <CoolButton
                                    content="Download PDF"
                                    move={false}
                                    id="scannerDownloadPDFButton"
                                    className={scannerStyles.halfWidthButtons}
                                    callback={clickDownloadPDF}
                                />
                                <CoolButton
                                    content="Upload PDF"
                                    move={false}
                                    id="scannerUploadPDFButton"
                                    className={scannerStyles.halfWidthButtons}
                                    callback={clickUploadPDF}
                                />
                            </div>
                            <div className={scannerStyles.fileNameLabel} id='scannerFileNameLabel'>File Name:</div>
                            <div id="scannerFileName" className={scannerStyles.fileNameInput} contentEditable>
                            </div>
                            <CoolButton
                                content="Clear Scanned Pages"
                                move={false}
                                id="scannerClearPagesButton"
                                className={scannerStyles.uploadImageButton}
                                callback={clearPages}
                            />
                            <div className={scannerStyles.zoomSenseLabel} id='scannerZoomSenseLabel'>Zoom Sensitivity:</div>
                            <div className={scannerStyles.zoomAdjustWrapper} id='scannerZoomAdjustWrapper'>
                                <div className={scannerStyles.sliderWrapper} id='scannerSliderWrapper'>
                                    <input type="range"
                                        min="1"
                                        max="100"
                                        defaultValue={zoomSense}
                                        className={scannerStyles.slider}
                                        id="scannerZoomSensitivity"
                                        onChange={zoomSliderWrapperCallback}
                                    ></input>
                                </div>
                                <div className={scannerStyles.zoomIndicator} id='scannerZoomIndicator'>
                                    {zoomSense}
                                </div>
                            </div>
                            <div className={scannerStyles.scannedPagesLabel} id='displayPreviewsScannedPagesLabel'>Scanned Pages Preview:</div>
                            <DisplayPreviews
                                scannedImages={scannedImages}
                                setScannedImages={setScannedImages}
                                highlightedRectangles={highlightedRectangles}
                                image={image}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}