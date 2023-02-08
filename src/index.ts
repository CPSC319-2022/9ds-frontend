import {initializeApp} from "firebase/app";
import {connectFirestoreEmulator, getFirestore} from "firebase/firestore";
import {connectAuthEmulator, getAuth} from "firebase/auth";

// const app = initializeApp(firebaseConfig);

export const db = getFirestore();
connectFirestoreEmulator(db, 'localhost', 8080);

export const auth = getAuth();
connectAuthEmulator(auth, 'https://localhost:9099')
