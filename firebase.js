import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC7oW4YHKWBxlrtL_K6IzAefnZOx_BhEcI",
  authDomain: "dev-deakin-716e2.firebaseapp.com",
  projectId: "dev-deakin-716e2",
  storageBucket: "dev-deakin-716e2.appspot.com",
  messagingSenderId: "1003394990434",
  appId: "1:1003394990434:web:5c2d0f2290c819694fec3b"
};
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
