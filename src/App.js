import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";

import { useEffect, useState } from "react";
import SignInButton from "./components/SignInButton";
import Home from "./components/Home";

import logo from "./bday.png";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      document.body.style.overflow = user ? "auto" : "hidden";
    });
  }, []);

  return (
    <div className="bg-neutral-800 min-h-dvh">
      <div className="justify-center flex pt-32">
        <img src={logo} alt="logo" className="size-11 mr-3" />
        <h1 className="text-white text-4xl font-bold">Birthday Blast</h1>
      </div>
      <h2 className="text-white text-xl justify-center flex mt-8">
        Never forget a birthday again!
      </h2>
      {user ? <Home user={user} /> : <SignInButton />}
      <div className="h-4"></div>
    </div>
  );
}
