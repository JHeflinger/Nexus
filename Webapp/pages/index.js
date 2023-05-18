import { useRouter } from 'next/router';
import Stars from '../components/stars';
import cx from 'classnames';
import { Lato } from '@next/font/google';
import { useState, useRef } from 'react'
import Database from '../scripts/dbInterface';

//firebase
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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
const provider = new GoogleAuthProvider();

const lato = Lato({
  weight: ['100','300','400','900'],
  subsets: ['latin-ext'],
  display: 'swap',
});

import { useEffect } from 'react';
import indexStyles from './index.module.scss';

const siteTitle = 'Nexus';

export default function Home() {
  const router = useRouter()

  const [fadeOut, setFadeOut] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const [popupEnabled, setPopup] = useState(false);
  const [btnEnabled, setBtn] = useState(true);

  const fadeInClass = fadeIn ? indexStyles.fadeIn : "";
  const fadeOutClass = fadeOut ? indexStyles.fadeOut : "";
  const popupClass = popupEnabled ? indexStyles.signInPopup : "";
  const btnClass = btnEnabled ? "btn" : "";

  const checkUserSQL = (user) => {
    console.log("Checking if user exists...");
    Database.makeUserIfNotExists(user.uid, user.displayName, user.email).then((success) => {
      console.log("SQL query success:");
      console.log(success);
      const successVal = success.success;
      console.log(successVal)
      if (successVal === true) {
        router.push("./search");
      } else {
        console.log("Error logging in");
        alert("Error logging in to SQL database");
      }
    }).catch((error) => {
      console.log("Error checking if user exists:");
      console.log(error);
    });

  }

  const clickSignin = () => {
    //router.push("./search");
    //setFadeIn(false);
    //setFadeOut(true);
    //setPopup(true);
    //setBtn(false);
    signInWithPopup(auth, provider).then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      
      console.log("Checking if user exists...");
      checkUserSQL(user);
      
      // router.push("./search");
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(`ERROR ${errorCode}: ${errorMessage}`);
    });
  }

  useEffect(() => {
    router.prefetch("./scanner");
    router.prefetch("./search");
    if (localStorage.getItem("devMode") === "true") {
      toggleDevTools();
    }
    auth.onAuthStateChanged((user) => {
      if (user) {
        var uid = user.uid;
        var displayName = user.name;
        var email = user.email;
        var photoURL = user.photoURL;
        var phoneNumber = user.phoneNumber;
        var isAnonymous = user.isAnonymous;
        // router.push("./search");
        checkUserSQL(user);
        console.log(`uid: ${uid}, displayname: ${displayName}, email: ${email}, photoURL: ${photoURL}, phoneNumber: ${phoneNumber}, isAnonymous: ${isAnonymous}`);
      } else {
        console.log("No user signed in, please log in!");
      }
    });
  }, [])

  return (
    <>
      <script src="https://www.gstatic.com/firebasejs/ui/4.6.1/firebase-ui-auth.js"></script>
      <Stars
        blur={2}
      />
      <div className={indexStyles.pageWrapper}>
        <div id="siteTitle" className={cx(lato.className, indexStyles.title, fadeInClass, fadeOutClass)}>
          NEXUS
        </div>
        <div className={indexStyles.loginWrapper}>
          <div className={cx(btnClass, indexStyles.signIn, popupClass)} onClick={clickSignin}>
            SIGN IN
          </div>
          <div id="firebaseui-auth-container"></div>
        </div>
      </div>
    </>
  );
}