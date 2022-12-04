import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCHczn-Qw9xLUbvKIHzHXxVUkDAdI-YYdE",
    authDomain: "twitter-signin-d20d8.firebaseapp.com",
    projectId: "twitter-signin-d20d8",
    storageBucket: "twitter-signin-d20d8.appspot.com",
    messagingSenderId: "496699980560",
    appId: "1:496699980560:web:965bc94d5d12b4db510395"
} ;

const app = initializeApp(firebaseConfig);

export const authentication = getAuth(app);