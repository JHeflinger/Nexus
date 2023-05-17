import { useRouter } from 'next/router';
import Head from 'next/head';
// import Head from 'next/document';
import Link from 'next/link';
import Image from 'next/image';
import Stars from '../components/stars';
import FileUploader from '../components/fileUploader';
import Dropdown from '../components/dropdown';
import cx from 'classnames';
import Database from '../scripts/dbInterface';


import { useEffect, useRef, useState } from 'react';
import accountStyles from './account.module.scss';
import utilStyles from '../styles/utils.module.scss';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { faCloud } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Lato } from '@next/font/google';
import dynamic from 'next/dynamic';
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { pdfjs, Document, Page } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = worker;

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

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const lato = Lato({
  weight: ['100', '300', '400', '900'],
  subsets: ['latin-ext'],
  display: 'swap',
});

const state = {
  options: {
    chart: {
      type: 'area'
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      show: false
    },
    stroke: {
      curve: 'smooth',
    }
  },
  series: [
    {
      name: "series-1",
      type: 'area',
      data: [30, 40, 45, 50, 49, 60, 70, 91]
    }
  ]
};

export default function Home() {
  const router = useRouter()
  const siteTitle = "Nexus: Account";

  const [uid, _setUid] = useState("");
  const uidRef = useRef(uid);
  const setUid = (data) => {
    uidRef.current = data;
    _setUid(data);
  }


  const [nameToDisplay, _setNameToDisplay] = useState("");
  const nameToDisplayRef = useRef(nameToDisplay);
  const setNameToDisplay = (data) => {
    nameToDisplayRef.current = data;
    _setNameToDisplay(data);
  }

  const [emailToDisplay, _setEmailToDisplay] = useState("");
  const emailToDisplayRef = useRef(emailToDisplay);
  const setEmailToDisplay = (data) => {
    emailToDisplayRef.current = data;
    _setEmailToDisplay(data);
  }

  const [pfpToDisplay, _setPfpToDisplay] = useState("");
  const pfpToDisplayRef = useRef(pfpToDisplay);
  const setPfpToDisplay = (data) => {
    pfpToDisplayRef.current = data;
    _setPfpToDisplay(data);
  }




  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const uidLocal = user.uid;
        const displayName = user.name;
        const email = user.email;
        // console.log(`uid: ${uidLocal}, displayname: ${displayName} email: ${email}`);
        // console.log(user.photoURL);
        if (displayName) {
          setNameToDisplay(displayName);
        } else {
          setNameToDisplay(email)
        }
        setEmailToDisplay(email);
        setUid(uidLocal);
        setPfpToDisplay(user.photoURL);
        // console.log(`pfp: ${user.photoURL}`);
      } else {
        console.log("No user signed in, please log in!");
        router.push("/login");
      }
    });
  }, []);

  const scannerIcon = <FontAwesomeIcon icon={faCamera} />
  const uploadIcon = <FontAwesomeIcon icon={faCloud} />
  const searchIcon = <FontAwesomeIcon icon={faSearch} />

  const [numberOfDocs, _setNumberOfDocs] = useState(0);
  const numberOfDocsRef = useRef(numberOfDocs);
  const setNumberOfDocs = (data) => {
    numberOfDocsRef.current = data;
    _setNumberOfDocs(data);
  }

  const [numberOfLikes, _setNumberOfLikes] = useState(0);
  const numberOfLikesRef = useRef(numberOfLikes);
  const setNumberOfLikes = (data) => {
    numberOfLikesRef.current = data;
    _setNumberOfLikes(data);
  }

  const [numberOfViews, _setNumberOfViews] = useState(0);
  const numberOfViewsRef = useRef(numberOfViews);
  const setNumberOfViews = (data) => {
    numberOfViewsRef.current = data;
    _setNumberOfViews(data);
  }

  const [forceReload, _setForceReload] = useState(1);
  const forceReloadRef = useRef(forceReload);
  const setForceReload = (data) => {
    forceReloadRef.current = data;
    _setForceReload(data);
  }



  const [fileUploadVisible, _setFileUploadVisible] = useState(false);
  const fileUploadVisibleRef = useRef(fileUploadVisible);

  const setFileUploadVisible = (data) => {
    fileUploadVisibleRef.current = data;
    _setFileUploadVisible(data);
  }

  const [userFiles, _setUserFiles] = useState({});
  const userFileIDsRef = useRef(userFiles);
  const setUserFiles = (data) => {
    userFileIDsRef.current = data;
    _setUserFiles(data);
  }


  const [userFileIDs, _setUserFileIDs] = useState([]);
  const userFilesRef = useRef(userFileIDs);
  const setUserFileIDs = (data) => {
    userFilesRef.current = data;
    _setUserFileIDs(data);
  }

  const clickFileUpload = () => {
    setFileUploadVisible(!fileUploadVisibleRef.current);
  }

  const clickScannerLink = () => {
    router.push('./scanner');
  }

  const clickSearchLink = () => {
    router.push('/search');
  }

  useEffect(() => {
    router.prefetch("./scanner");
    router.prefetch("./search");
    router.prefetch("./document");
    if (uidRef.current == "") {
      return;
    }
    // console.log("Getting user files from user id: " + uidRef.current)
    Database.getFileIDsByUser(uidRef.current).then((response) => {
      const files = response.json().then((data) => {
        console.log("Data:")
        console.log(data)
        // console.log("Files: " + data);
        // console.log(data);
        const fileIDs = [];
        for (let dataObject of data.docs) {
          console.log(dataObject);
          // console.log(dataObject.filename);
          // fileIDs.push([dataObject._id, dataObject.metadata.title]);
          fileIDs.push([dataObject.fileID, dataObject.fileName]);
        }
        // console.log("length: " + data.length);
        setUserFileIDs(fileIDs);
        setNumberOfDocs(data.docs.length);
      });

      Database.getUserAccountLikes(uidRef.current).then((response) => {
        response.json().then((data) => {
          console.log(data);
          setNumberOfLikes(data);
        });
      });

      Database.getUserAccountViews(uidRef.current).then((response) => {
        response.json().then((data) => {
          console.log(data);
          setNumberOfViews(data);
        });
      });

    });


  }, [uid, forceReloadRef.current])

  useEffect(() => {
    // console.log("Updating files");
    for (let [fileID, fileName] of userFileIDs) {
      Database.getFileByObjectID(fileID).then((data) => {
        // console.log(`Getting file with id: ${fileID} and name: ${fileName}`);

        // data.arrayBuffer().then((buffer) => {
        //   const file = new File([buffer], data.name, { type: data.type });
        //   setUserFiles((userFiles) => [...userFiles, file]);
        // });
        //set blob as data
        // const file = new File([data], data.name, { type: data.type });
        // setUserFiles((userFiles) => [...userFiles, file]);
        data.blob().then((text) => {
          setUserFiles((userFiles) => ({ ...userFiles, [fileID]: text }));
        });
      });
    }
  }, [userFileIDs])


  const generateFileOnClick = (fileID) => {
    return () => {
      router.push({
        pathname: '/document',
        query: { fileID: fileID, uid: uidRef.current},
      });
    }
  }


  const forceReloadCallback = () => {
    setForceReload(1 - forceReloadRef.current);
  }

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        {/* <Link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:100,200,300,400,500,600,700"></Link>
        <Link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons"></Link>
        <Link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></Link>
        <Link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.13.0/css/all.css"></Link> */}
      </Head>
      <Stars />
      <FileUploader
        visible={fileUploadVisible}
        setVisible={setFileUploadVisible}
        router={router}
        forceReload={forceReloadCallback}
      />
      <div>
        <div className='outer'>
          <div className='inner'>
            <div className={cx(lato.className, accountStyles.profile)}>
              <img
                className={accountStyles.pfp}
                src={pfpToDisplayRef.current}
                alt="profile picture"
                referrerPolicy="no-referrer"
                width={256}
                height={256}
              />
              <div className={accountStyles.name}>
                {nameToDisplay}
                <span className={accountStyles.username}>
                  @{emailToDisplay.split('@')[0]}
                </span>
              </div>
              <div className={accountStyles.joinlog}>Joined: January 13th 2023</div>
              <div className={accountStyles.accStats}>
                <div className={accountStyles.stat}>
                  {numberOfViewsRef.current}
                  <div>views</div>
                </div>
                <div className={accountStyles.stat}>
                  {numberOfLikesRef.current}
                  <div>likes</div>
                </div>
                <div id="numDocuments" className={accountStyles.stat}>
                  {numberOfDocsRef.current}
                  <div>documents</div>
                </div>
              </div>
            </div>
            <div className={accountStyles.contentWrapper}>
              <div className={cx(lato.className, accountStyles.mydocs)}>
                <div className={accountStyles.title}>MY DOCS</div>
                <div className={accountStyles.docs}>

                  {userFileIDs.map(([fileId, fileName]) => {
                    const fileURL = userFiles[fileId]
                    return (
                      <div
                        className={accountStyles.pageWrapper}
                        onClick={generateFileOnClick(fileId)}
                        key={fileId}
                      >
                        <div className={accountStyles.pageTitle}>
                          <FontAwesomeIcon icon={faFile} className={accountStyles.fileIcon} />
                          {fileName}
                        </div>
                        <Document file={fileURL}>
                          <Page
                            pageNumber={1}
                            width={200}
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                          />
                        </Document>
                      </div>
                    )
                  })
                  }


                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={utilStyles.dropdownWrapper}>
        <Dropdown
          items={{
            "TestItem1": [scannerIcon, clickScannerLink],
            "TestItem2": [uploadIcon, clickFileUpload],
            "TestItem3": [searchIcon, clickSearchLink]
          }}
        />
      </div>
    </>
  );
}