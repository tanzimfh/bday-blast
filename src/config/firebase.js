import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAha0I6Lu001An6O_wJ_p98w3hPqy0BpW8",
  authDomain: "blast-eb7f5.firebaseapp.com",
  projectId: "blast-eb7f5",
  storageBucket: "blast-eb7f5.appspot.com",
  messagingSenderId: "31262016010",
  appId: "1:31262016010:web:ec3a41aa7839e786d195f3",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account",
});