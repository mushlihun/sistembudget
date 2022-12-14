// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQ68ZS048FJL3sh6WZcmisw09-kYFeXyw",
  authDomain: "budgetapprovalsystem-477a4.firebaseapp.com",
  projectId: "budgetapprovalsystem-477a4",
  storageBucket: "budgetapprovalsystem-477a4.appspot.com",
  messagingSenderId: "596028199690",
  appId: "1:596028199690:web:d4cb6d5513b642607a60f3",
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();
auth.languageCode = "en";
export { auth };
export const provider = new GoogleAuthProvider();
