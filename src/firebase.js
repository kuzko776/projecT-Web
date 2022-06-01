import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDAIOXOjd9bLjQAVNtDHmY40K1le4LJBtM",
    authDomain: "projectt-55f6d.firebaseapp.com",
    databaseURL: "https://projectt-55f6d-default-rtdb.firebaseio.com",
    projectId: "projectt-55f6d",
    storageBucket: "projectt-55f6d.appspot.com",
    messagingSenderId: "953138929500",
    appId: "1:953138929500:web:8f2e04520907f73f9aeb99",
    measurementId: "G-M3S9DMT707"
};


export const app = initializeApp(firebaseConfig);
const db = getFirestore();
export default db;