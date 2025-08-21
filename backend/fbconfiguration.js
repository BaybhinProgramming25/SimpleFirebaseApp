import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

dotenv.config()

// Firebase Configuration
const firebaseConfig = {
    apiKey: `${process.env.API_KEY}`,
    authDomain: `${process.env.AUTH_DOMAIN}`,
    databaseURL: `${process.env.DATABASE_URL}`,
    projectId: `${process.env.PROJECT_ID}`,
    storageBucket: `${process.env.STORAGE_BUCKET}`,
    messagingSenderId: `${process.env.MESSAGE_SENDER_ID}`,
    appId: `${process.env.APP_ID}`
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Create instance of firestore
const db = getFirestore(app);


export default db; 
