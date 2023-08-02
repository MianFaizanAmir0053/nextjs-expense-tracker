import {initializeApp} from "firebase/app";
import {getFirestore} from 'firebase/firestore'

import {GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJRyFwEfZKuNdABOS2VWfita8r7LDT_lE",
  authDomain: "expense-tracker-8bf75.firebaseapp.com",
  projectId: "expense-tracker-8bf75",
  storageBucket: "expense-tracker-8bf75.appspot.com",
  messagingSenderId: "754927270676",
  appId: "1:754927270676:web:8cb90f8d761b3e1b40e001"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const googleAuthProvider = new GoogleAuthProvider();
