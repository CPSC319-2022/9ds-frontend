import * as firebase from 'firebase/app';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { assertFails, assertSucceeds } from "@firebase/rules-unit-testing";

const firebaseConfig = {
  apiKey: "AIzaSyCHfU9yLnEnLeKKokIQ9sUGI8Cr9mLYXgE",
  authDomain: "ds-blog-dev.firebaseapp.com",
  projectId: "ds-blog-dev",
  storageBucket: "ds-blog-dev.appspot.com",
  messagingSenderId: "545518666660",
  appId: "1:545518666660:web:85badd3f2024480bc07731",
  measurementId: "G-BB9M09710P"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app)

const data = {
  username: "devTest",
  contributor: false
}

it('Should add a user to the database', async () => {
  await assertSucceeds(addDoc(collection(db, 'users'), data));
})

