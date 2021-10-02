// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDlXc0aJHTNexVHFa6WLmHDJ_wNleGY_kw",
    authDomain: "invoice-8edb3.firebaseapp.com",
    projectId: "invoice-8edb3",
    storageBucket: "invoice-8edb3.appspot.com",
    messagingSenderId: "855515067457",
    appId: "1:855515067457:web:f4aac1953dea15c9f882c0",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export default db;
