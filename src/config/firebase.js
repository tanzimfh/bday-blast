import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAlhVMVWhFX6JfeTAXxe1W59fXzJZ40uOs",
  authDomain: "bday-blast.firebaseapp.com",
  databaseURL: "https://bday-blast-default-rtdb.firebaseio.com",
  projectId: "bday-blast",
  storageBucket: "bday-blast.appspot.com",
  messagingSenderId: "649887584528",
  appId: "1:649887584528:web:4e46e23cf84794199f1595",
  measurementId: "G-GCEDJW4BPH"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const collectionRef = collection(db, "events-dev");
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account",
});