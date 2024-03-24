// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgWLPlJd74ky3ImqRtyoRlHavj8G4yVj0",
  authDomain: "rasoi-aa9fc.firebaseapp.com",
  projectId: "rasoi-aa9fc",
  storageBucket: "rasoi-aa9fc.appspot.com",
  messagingSenderId: "330350342335",
  appId: "1:330350342335:web:d3b6b9ca504356e847160a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
