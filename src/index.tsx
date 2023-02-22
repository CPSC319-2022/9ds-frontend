import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { App } from './pages/App'
import {initializeApp} from "firebase/app";
import {connectFirestoreEmulator, getFirestore} from "firebase/firestore";
import {connectAuthEmulator, getAuth} from "firebase/auth";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

interface firestoreConfigInterface {
  projectId: string,
  apiKey: string
}

let firestoreConfig: firestoreConfigInterface = {projectId: "", apiKey: ""}

switch(process.env.REACT_APP_ENV) {
  
  case "DEV":
    firestoreConfig = {
      projectId: "ds-blog-dev",
      apiKey: "AIzaSyCGGe5ZDxWeJITHmfr3Xn2he1iFWBdhe3I"
    };
    break;
  
  case "QA":
    firestoreConfig = {
      projectId: "ds-blog-qa",
      apiKey: "AIzaSyDKFaX7kzx02Ca9qjjU5_NbSJVLdpOFcjw"
    }
    break;

  case "PROD":
    firestoreConfig = {
      projectId: "ds-blog-376905",
      apiKey: "AIzaSyA3GTkgZ2andw7-szFQ2Crnp8-pNbx9Av4"
    }
    break;
  
  default:
    firestoreConfig = {
      projectId: "dev-emulator",
      apiKey: "dev-emulator-placeholder-key"
  }
}

const app = initializeApp(firestoreConfig)
export const db = getFirestore(app);

if (!process.env.REACT_APP_ENV) {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export const auth = getAuth(app);
connectAuthEmulator(auth, 'https://localhost:9099', { disableWarnings: true })
