import {initializeApp} from "firebase/app";
import {connectFirestoreEmulator, getFirestore} from "firebase/firestore";
import {connectAuthEmulator, getAuth} from "firebase/auth";

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

export const db = getFirestore(app);
connectFirestoreEmulator(db, 'localhost', 8080);

export const auth = getAuth(app);
connectAuthEmulator(auth, 'https://localhost:9099')
