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
import accountStyles from './organization.module.scss';
import utilStyles from '../styles/utils.module.scss';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { faCloud } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
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
  const plusIcon = <FontAwesomeIcon icon={faPlus} />

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

  const [userOrgs, _setUserOrgs] = useState({});
  const userOrgIDsRef = useRef(userOrgs);
  const setUserOrgs = (data) => {
    userOrgIDsRef.current = data;
    _setUserOrgs(data);
  }

  const [userFileIDs, _setUserFileIDs] = useState([]);
  const userFilesRef = useRef(userFileIDs);
  const setUserFileIDs = (data) => {
    userFilesRef.current = data;
    _setUserFileIDs(data);
  }

  const [userOrgIDs, _setUserOrgIDs] = useState([]);
  const userOrgsRef = useRef(userOrgIDs);
  const setUserOrgIDs = (data) => {
    userOrgsRef.current = data;
    _setUserOrgIDs(data);
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
    router.prefetch("./organization");
    if (uidRef.current == "") {
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const orgID = urlParams.get('orgID');
    Database.getOrgIDsByUser(orgID).then((response) => {
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
          if (data) {
            setNumberOfLikes(data);
          }
        });
      });

      Database.getUserAccountViews(uidRef.current).then((response) => {
        response.json().then((data) => {
          console.log(data);
          if (data) {
            setNumberOfViews(data);
          }
        });
      });

    });


  }, [uid, forceReloadRef.current])

  useEffect(() => {
    // console.log("Updating files");
    if (userFileIDs) {
    for (let [fileID, fileName] of userFileIDs) {
      Database.getSimpleFileByObjectID(fileID).then((data) => {
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

    if (uidRef.current == "") {
      return;
    }
    updateOrgList();
    const urlParams = new URLSearchParams(window.location.search);
    const orgID = urlParams.get('orgID');
    Database.getOrgFromID(orgID).then((response) => {
      response.json().then((data) => {
        document.getElementById("orgNameInput").value = data.name;
        document.getElementById("orgDescInput").value = data.description;
      })
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

  const generateOrgOnClick = (orgID) => {
    return () => {
      router.push({
        pathname: '/organization',
        query: { orgID: orgID, uid: uidRef.current},
      });
    }
  }

  const forceReloadCallback = () => {
    setForceReload(1 - forceReloadRef.current);
  }

  const addNewOrg = () => {
    Database.addNewOrg(uidRef.current).then((response) => {
      updateOrgList();
    })
  }

  const updateOrgList = () => {
    Database.getOrganizationsByUser(uidRef.current).then((response) => {
      response.json().then((data) => {
        let orgs = data.organizations;
        const tmpOrgIDS = []
        for(let i = 0; i < orgs.length; i++) {
          tmpOrgIDS.push([orgs[i][0], orgs[i][1]]);
        }
        setUserOrgIDs(tmpOrgIDS);
      });
    });
  }
  
  const addUserToOrg = () => {
    let email = document.getElementById("addUserInput").value;
    document.getElementById("addUserInput").value = "";
    const urlParams = new URLSearchParams(window.location.search);
    const orgID = urlParams.get('orgID');
    Database.addNewOrg(email, orgID).then((response) => {

    });
  }

  const updateOrgData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const orgID = urlParams.get('orgID');
    let name = document.getElementById("orgNameInput").value;
    let desc = document.getElementById("orgDescInput").value;
    Database.updateOrg(orgID, name, desc).then((response) => {

    });
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
                <div className={accountStyles.title}>ORGANIZATION DOCS</div>
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
            <div className={accountStyles.contentWrapper2}>
              <div className={cx(lato.className, accountStyles.myorgs)}>
                <div className={accountStyles.title}>SETTINGS</div>
                <input id="addUserInput" type="text"></input>
                <div onClick={addUserToOrg}>ADD USER</div>
                <input id="orgNameInput" type="text"></input>
                <textarea id="orgDescInput"></textarea>
                <div>DELETE</div>
                <div onClick={updateOrgData}>UPDATE</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={utilStyles.dropdownWrapper}>
        <Dropdown
          items={{
            "TestItem2": [uploadIcon, clickFileUpload],
            "TestItem3": [searchIcon, clickSearchLink],
          }}
        />
      </div>
    </>
  );
}