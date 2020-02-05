// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import 'firebase/analytics';

// Add the Firebase products that you want to use
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

const API_KEY = process.env.REACT_APP_FIREBASE_API_KEY;
const PROJECT_ID = process.env.REACT_APP_FIREBASE_PROJECT_ID;
const SENDER_ID = process.env.REACT_APP_FIREBASE_SENDER_ID;
const APP_ID = process.env.REACT_APP_FIREBASE_APP_ID;
const MEASUREMENT_ID = process.env.REACT_APP_FIREBASE_MEASUREMENT_ID;

const config = {
    apiKey: `${API_KEY}`,
    authDomain: `${PROJECT_ID}.firebaseapp.com`,
    databaseURL: `https:/${PROJECT_ID}.firebaseio.com`,
    projectId: `${PROJECT_ID}`,
    storageBucket: `${PROJECT_ID}.appspot.com`,
    messagingSenderId: `${SENDER_ID}`,
    appId: `${APP_ID}`,
    measurementId: `${MEASUREMENT_ID}`,
};

export const init = () => {
    firebase.initializeApp(config);

    // Connect to function emulator
    if (process.env.NODE_ENV !== 'production') {
        firebase.functions().useFunctionsEmulator('http://localhost:5001');
    }

    firebase.app().functions('europe-west1');

    return firebase;
};
