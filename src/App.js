import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaSignOutAlt } from "react-icons/fa";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlhVMVWhFX6JfeTAXxe1W59fXzJZ40uOs",
  authDomain: "bday-blast.firebaseapp.com",
  databaseURL: "https://bday-blast-default-rtdb.firebaseio.com",
  projectId: "bday-blast",
  storageBucket: "bday-blast.appspot.com",
  messagingSenderId: "649887584528",
  appId: "1:649887584528:web:4e46e23cf84794199f1595",
  measurementId: "G-GCEDJW4BPH",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  return (
    <div className="bg-neutral-800 h-screen">
      <h1 className="text-white text-5xl font-bold justify-center flex pt-32">
        Birthday Blast
      </h1>
      <h2 className="text-white text-2xl justify-center flex pt-8 pb-32">
        Never forget a birthday again!
      </h2>
      {user ? <Home user={user} /> : signInButton()}
    </div>
  );
}

function Home({ user }) {
  return (
    <div className="flex h-max items-center flex-row justify-center">
      <div className="bg-neutral-200 text-black text-xl pl-2.5 pr-3 py-2 mr-2 rounded-lg flex">
        <img src={user.photoURL} className="size-8 rounded-full mr-2" />
        {user.displayName.split(" ")[0]}
      </div>
      <button
        className="bg-neutral-200 text-black text-xl pl-2.5 pr-3 py-2 rounded-lg hover:bg-neutral-300 transition"
        onClick={() => signOut(auth)}
      >
        <FaSignOutAlt className="inline-block mr-2 size-6 my-1" />
        Sign out
      </button>
    </div>
  );
}

function signInButton() {
  return (
    <div className="justify-center flex">
      <button
        className="justify-center bg-neutral-200 text-black text-xl pl-2.5 pr-3 py-2 rounded-lg hover:bg-neutral-300 transition"
        onClick={() => signInWithPopup(auth, provider)}
      >
        <FcGoogle className="inline-block mr-2 size-8" />
        Sign in with Google
      </button>
    </div>
  );
}

export default App;
