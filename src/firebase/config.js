// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDa_xDwI5bgVnxwMhDBr4SPrBHylnpekL0",
  authDomain: "e-commerce-6e4c8.firebaseapp.com",
  projectId: "e-commerce-6e4c8",
  storageBucket: "e-commerce-6e4c8.appspot.com",
  messagingSenderId: "499173516174",
  appId: "1:499173516174:web:c5a853d2b57caf353c7adf",
  measurementId: "G-EQ7NDBSLGZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)

export const provider = new GoogleAuthProvider()

export const db = getFirestore(app)

export const storage = getStorage()