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

let firebaseConfig;

switch(process.env.REACT_APP_ENV) {
  
  case "DEV":
    firebaseConfig = {
      apiKey: "AIzaSyCHfU9yLnEnLeKKokIQ9sUGI8Cr9mLYXgE",
      authDomain: "ds-blog-dev.firebaseapp.com",
      projectId: "ds-blog-dev",
      storageBucket: "ds-blog-dev.appspot.com",
      messagingSenderId: "545518666660",
      appId: "1:545518666660:web:85badd3f2024480bc07731",
      measurementId: "G-BB9M09710P"
    };
    break;
  
  case "QA":
    firebaseConfig = {
      apiKey: "AIzaSyCG-Lvza6UMVVSW_gZ_oHQFMQa3sssDgdk",
      authDomain: "ds-blog-qa.firebaseapp.com",
      projectId: "ds-blog-qa",
      storageBucket: "ds-blog-qa.appspot.com",
      messagingSenderId: "631919673252",
      appId: "1:631919673252:web:3b5bd30368a67c23ba4b31",
      measurementId: "G-59FZFJ0980"
    };
    break;

  case "PROD":
    firebaseConfig = {
      apiKey: "AIzaSyCcgzkgm7DJkNLTrBk-vDQgeTZw7bTwdn8",
      authDomain: "ds-blog-376905.firebaseapp.com",
      projectId: "ds-blog-376905",
      storageBucket: "ds-blog-376905.appspot.com",
      messagingSenderId: "1046661353798",
      appId: "1:1046661353798:web:e6771cdb184606a1861547",
      measurementId: "G-V1G11MYNRB"
    }
    break;
  
  default:
    firebaseConfig = {
      projectId: "dev-emulator",
      apiKey: "dev-emulator-placeholder-key"
  }
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app);
export const auth = getAuth(app);

if (!process.env.REACT_APP_ENV) {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'https://localhost:9099', { disableWarnings: true })
}
