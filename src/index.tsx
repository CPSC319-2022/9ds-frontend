import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { App } from './pages/App'
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { initializeApp } from 'firebase/app';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

const firebaseConfig = {
    apiKey: 'AIzaSyDw4Wb3pAswoflIpz69oker-U6cMes-za0',
    authDomain: 'pwc-9ds.firebaseapp.com',
    projectId: 'pwc-9ds',
    storageBucket: 'pwc-9ds.appspot.com',
    messagingSenderId: '174807098074',
    appId: '1:174807098074:web:661a3552af18693bb8bbe3',
    measurementId: 'G-YDGMYVN7YV',
};

const app = initializeApp(firebaseConfig);

if (location.hostname === "localhost") {
    const db = getFirestore(app);
    connectFirestoreEmulator(db, 'localhost', 8080);

    const auth = getAuth(app);
    connectAuthEmulator(auth, 'https://localhost:9099')
} else {
    const db = getFirestore(app);
    const auth = getAuth(app);
}