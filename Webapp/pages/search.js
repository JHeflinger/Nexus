import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Dropdown from '../components/dropdown';
import Stars from '../components/stars';
import cx from 'classnames';
import FileUploader from '../components/fileUploader';

import { useEffect, useState, useRef } from 'react';
import searchStyles from './search.module.scss';
import utilStyles from '../styles/utils.module.scss';
import { faCamera, faCloud, faSignOut, faUserCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app"; 
import { Lato } from '@next/font/google';
import ReactDOM from 'react-dom';
import Database from '../scripts/dbInterface';

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

const lato = Lato({
  weight: ['100', '300', '400', '900'],
  subsets: ['latin-ext'],
  display: 'swap',
});

export default function Home() {
  const router = useRouter()
  const siteTitle = "Nexus: Search";
  const tagData = [];

  const [likesState, _setLikesFilter] = useState(0);
  const [viewsState, _setViewsFilter] = useState(0);
  const [activeState, _setActiveFilter] = useState(0);

  
  const likesStateRef = useRef(likesState);
  const setLikesFilter = (data) => {
    likesStateRef.current = data;
    _setLikesFilter(data);
  }

  
  const viewsStateRef = useRef(viewsState);
  const setViewsFilter = (data) => {
    viewsStateRef.current = data;
    _setViewsFilter(data);
  }

  const activeStateRef = useRef(activeState);
  const setActiveFilter = (data) => {
    activeStateRef.current = data;
    _setActiveFilter(data);
  }

  const [uid, _setUid] = useState("");
  const uidRef = useRef(uid);
  const setUid = (data) => {
    uidRef.current = data;
    _setUid(data);
  }

  const [temp, _setTemp] = useState(false);
  const tempRef = useRef(temp);
  const setTemp = (data) => {
    tempRef.current = data;
    _setTemp(data);
  }

  const likesHLClass = (likesState == 1) ? searchStyles.filterSelected : "";
  const likesLHClass = (likesState == 2) ? searchStyles.filterSelected : "";
  const viewsHLClass = (viewsState == 1) ? searchStyles.filterSelected : "";
  const viewsLHClass = (viewsState == 2) ? searchStyles.filterSelected : "";
  const activHLClass = (activeState == 1) ? searchStyles.filterSelected : "";
  const activLHClass = (activeState == 2) ? searchStyles.filterSelected : "";

  const [fileUploadVisible, _setFileUploadVisible] = useState(false);
  const fileUploadVisibleRef = useRef(fileUploadVisible);
  const setFileUploadVisible = (data) => {
    fileUploadVisibleRef.current = data;
    _setFileUploadVisible(data);
  }

  const clickFileUpload = () => {
    setFileUploadVisible(!fileUploadVisibleRef.current);
  }

  const logOut = () => {
    signOut(auth).then(() => {
      //router.push("/login");
    }).catch((error) => {
      console.log("cant sign out! oopsies!");
    });
  }

  const orderFilterClick = (filter) => {
    let old_likes = likesState;
    let old_views = viewsState;
    let old_activ = activeState;
    setLikesFilter(0);
    setViewsFilter(0);
    setActiveFilter(0);
    switch (filter) {
      case "likesHL":
        if (old_likes != 1) setLikesFilter(1);
        break;
      case "likesLH":
        if (old_likes != 2) setLikesFilter(2);
        break;
      case "viewsHL":
        if (old_views != 1) setViewsFilter(1);
        break;
      case "viewsLH":
        if (old_views != 2) setViewsFilter(2);
        break;
      case "activHL":
        if (old_activ != 1) setActiveFilter(1);
        if (tempRef.current == false) {
          setTemp(true);
        }else {
          setTemp(false);
        }
        break;
      case "activLH":
        if (old_activ != 2) setActiveFilter(2);
        break;
    }
  }

  const clickAccountPageLink = () => {
    router.push('./account');
  }

  const clickScannerLink = () => {
    router.push('./scanner');
  }

  const goToDocument = (myid) => {
    router.push(`/document?fileID=${myid}`);
  }

  const searchDocs = () => {
    let searchText = document.getElementById("searchbar").value;
    document.getElementById("searchbar").value = "";
    let descending = false;
    let sortBy = 'activity';
    if (likesStateRef.current == 1) {
      descending = false;
      sortBy = 'likes';
    } else if (likesStateRef.current == 2) {
      descending = true;
      sortBy = 'likes';
    } else if (viewsStateRef.current == 1) {
      descending = false;
      sortBy = 'views';
    } else if (viewsStateRef.current == 2) {
      descending = true;
      sortBy = 'views';
    } else if (activeStateRef.current == 2) {
      descending = true;
    }
    Database.getAvailableFilesByUser(uidRef.current, sortBy, descending).then((response) => {
      const files = response.json().then((data) => {
        let result = <div className={searchStyles.searchResult}><div>{}</div><br></br><span>{}</span></div>
        let resultData = [];
        for (let i = 0; i < data.docs.length; i++) {
          let grabDoc = false;
          if (data.docs[i].fileName.includes(searchText) || data.docs[i].description.includes(searchText) || searchText == "") grabDoc = true;
          if (grabDoc) {
            resultData.push({
              title: data.docs[i].fileName,
              desc: data.docs[i].description,
              _id: data.docs[i].fileID
            });
          }
        }
        const children = resultData.map((val) => (
          <div onClick={() => goToDocument(val._id)} className={searchStyles.searchResult}><div>{val.title}</div><br></br><span>{val.desc}</span></div>
        ));
        ReactDOM.render(children, document.getElementById("results"));
      });
    });
  }

  const deleteTag = (tag) => {
    tagData.splice(tagData.indexOf(tag.val), 1);
    const children = tagData.map((val) => (
      <span onClick={() => deleteTag({val})} className={searchStyles.tag}><span className={lato.className}>X</span>{val}</span>
    ));
    ReactDOM.render(children, document.getElementById("tagContainer"));
  }

  useEffect(() => {
    router.prefetch("./scanner");
    router.prefetch("./account");
    router.prefetch("./document");
    const inputs = document.querySelectorAll("input");
    inputs.forEach(input => {
      input.addEventListener("mouseenter", function () {
        this.focus();
      });
    });

    auth.onAuthStateChanged((user) => {
      if (user) {
        const uidLocal = user.uid;
        const displayName = user.name;
        const email = user.email;
        console.log(`uid: ${uidLocal}, displayname: ${displayName} email: ${email}`);
        setUid(uidLocal);
      } else {
        console.log("No user signed in, please log in!");
        router.push("/login");
      }
    });

    document.getElementById("tagInput").addEventListener("keyup", function(event) {
      event.preventDefault();
      if (event.keyCode === 13) {
        tagData.push(document.getElementById("tagInput").value);
        document.getElementById("tagInput").value = "";
        let container = document.getElementById("tagContainer");
        const children = tagData.map((val) => (
          <span onClick={() => deleteTag({val})} className={searchStyles.tag}><span className={lato.className}>X</span>{val}</span>
        ));
        ReactDOM.render(children, container);
      }
    });
  
    document.getElementById("searchbar").addEventListener("keyup", function(event) {
      event.preventDefault();
      if (event.keyCode === 13) {
        searchDocs();
      }
    });

    setTimeout(function(){
      searchDocs();
     }, 1000);
  }, [])

  

  const scannerIcon = <FontAwesomeIcon icon={faCamera} />
  const uploadIcon = <FontAwesomeIcon icon={faCloud} />
  const accIcon = <FontAwesomeIcon className={searchStyles.accIconBtn} icon={faUserCircle} />
  const signOutIcon = <FontAwesomeIcon icon={faSignOut} />

  return (
    <>
      <title>{siteTitle}</title>
      <Stars
        blur={5}
      />
      <FileUploader
        visible={fileUploadVisible}
        setVisible={setFileUploadVisible}
        router={router}
      />
      <div className={cx('flexbox', searchStyles.searchField)}>
        <input id="searchbar" type="text" className={searchStyles.searchBar} placeholder="Search..." />
        <div onClick={searchDocs} className={searchStyles.searchBtn}><FontAwesomeIcon icon={faSearch} /></div>
        <div className={searchStyles.accountBtn} onClick={clickAccountPageLink}><FontAwesomeIcon icon={faUserCircle} /></div>
      </div>

      <div className={searchStyles.mainPageWrapper}>
        <div id="results" className={searchStyles.results}></div>
        <div className={searchStyles.filters}>
          <div className={searchStyles.filterContainer}>
            <div>ORDER BY:</div><br></br>
            <div id="likesHL" className={cx(likesHLClass, searchStyles.orderFilter)} onClick={() => orderFilterClick("likesHL")}>LIKES: HIGH TO LOW</div>
            <div id="likesLH" className={cx(likesLHClass, searchStyles.orderFilter)} onClick={() => orderFilterClick("likesLH")}>LIKES: LOW TO HIGH</div>
            <div id="viewsHL" className={cx(viewsHLClass, searchStyles.orderFilter)} onClick={() => orderFilterClick("viewsHL")}>VIEWS: HIGH TO LOW</div>
            <div id="viewsLH" className={cx(viewsLHClass, searchStyles.orderFilter)} onClick={() => orderFilterClick("viewsLH")}>VIEWS: LOW TO HIGH</div>
            <div id="activHL" className={cx(activHLClass, searchStyles.orderFilter)} onClick={() => orderFilterClick("activHL")}>ACTIVITY: HIGH TO LOW</div>
            <div id="activLH" className={cx(activLHClass, searchStyles.orderFilter)} onClick={() => orderFilterClick("activLH")}>ACTIVITY: LOW TO HIGH</div>
            <hr></hr>
            <label>ADD TAG:</label>
            <input id="tagInput" type="text" className={searchStyles.addTagText} placeholder="NEW TAG..." />
            <div id="tagContainer" className={searchStyles.tagContainer}></div>
          </div>
        </div>
        <div
          className={utilStyles.dropdownWrapper}
        >
          <Dropdown
            items={{
              "TestItem4": [signOutIcon, logOut],
              "TestItem1": [scannerIcon, clickScannerLink],
              "TestItem2": [uploadIcon, clickFileUpload],
              "TestItem3": [accIcon, clickAccountPageLink],
            }}
          />
        </div>
      </div>
    </>
  );
}