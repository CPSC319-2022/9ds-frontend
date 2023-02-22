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

interface gcpConfigInterface {
  projectId: string,
  apiKey: string
}

let gcpConfig: gcpConfigInterface = {projectId: "", apiKey: ""}

switch(process.env.REACT_APP_ENV) {
  
  case "DEV":
    gcpConfig = {
      projectId: "ds-blog-dev",
      apiKey: "AIzaSyCGGe5ZDxWeJITHmfr3Xn2he1iFWBdhe3I"
    };
    break;
  
  case "QA":
    gcpConfig = {
      projectId: "ds-blog-qa",
      apiKey: "AIzaSyDKFaX7kzx02Ca9qjjU5_NbSJVLdpOFcjw"
    }
    break;

  case "PROD":
    gcpConfig = {
      projectId: "ds-blog-376905",
      apiKey: "AIzaSyA3GTkgZ2andw7-szFQ2Crnp8-pNbx9Av4"
    }
    break;
  
  default:
    gcpConfig = {
      projectId: "dev-emulator",
      apiKey: "dev-emulator-placeholder-key"
  }
}

const app = initializeApp(gcpConfig)
export const db = getFirestore(app);

if (!process.env.REACT_APP_ENV) {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export const auth = getAuth(app);
connectAuthEmulator(auth, 'https://localhost:9099', { disableWarnings: true })
