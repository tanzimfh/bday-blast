import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaSignOutAlt } from "react-icons/fa";

import logo from "./bday.png";

import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection } from "firebase/firestore";

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

const db = getFirestore(app);

const auth = getAuth();
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

function App() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);

  const eventsCollection = collection(db, "events");

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await getDocs(eventsCollection);
        const filteredData = data.docs.map((doc) => doc.data());
        setEvents(filteredData);
      } catch (error) {
        console.error(error);
      }
    };

    getEvents();
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      document.body.style.overflow = user ? "auto" : "hidden";
    });
  }, []);

  return (
    <div className="bg-neutral-800 h-dvh">
      <div className="justify-center flex pt-32">
        <img src={logo} alt="logo" className="size-11 mr-3" />
        <h1 className="text-white text-4xl font-bold">Birthday Blast</h1>
      </div>
      <h2 className="text-white text-xl justify-center flex mt-8">
        Never forget a birthday again!
      </h2>
      {user ? <Home user={user} events={events} /> : <SignInButton />}
    </div>
  );
}

async function mySignOut() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
  }
}

function Home({ user, events }) {
  return (
    <div>
      <div className="flex items-center flex-row justify-center mt-8">
        <div className="bg-neutral-200 text-black text-lg pl-2.5 pr-3 py-2 mr-2 rounded-lg flex">
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="size-[30px] rounded-full mr-2"
          />
          {user.displayName.split(" ")[0]}
        </div>
        <button
          className="bg-neutral-200 text-black text-lg pl-2.5 pr-3 p-2 rounded-lg hover:bg-neutral-300 transition"
          onClick={mySignOut}
        >
          <FaSignOutAlt className="inline-block mr-2 size-5 my-1" />
          Sign out
        </button>
      </div>
      <div className="m-4 flex-row flex">
        <div className="flex-grow" />
        <div className="w-full max-w-96">
          <AddEvent />
          {events.map((event) => (
            <Event
              title={event.title}
              date={event.date.toDate()}
              notes={event.notes}
            />
          ))}
        </div>
        <div className="flex-grow" />
      </div>
      ;
    </div>
  );
}

function AddEvent() {
  return (
    <div className="bg-neutral-200 text-black w-full p-3 mt-4 rounded-lg">
      <div className="flex flex-row">
        <input
          type="text"
          placeholder="New Event"
          maxLength={25}
          required="required"
          className="bg-neutral-100 placeholder:text-neutral-400 text-black text-lg p-2 rounded-lg h-11 flex-grow"
        />
        <input
          type="date"
          required="required"
          value={new Date().toISOString().split("T")[0]}
          className="bg-neutral-100 text-neutral-500 text-base p-2 ml-2 rounded-lg h-11 w-32"
        />
      </div>
      <div className="flex flex-row">
        <input
          type="text"
          maxLength={35}
          placeholder="Notes (optional)"
          className="bg-neutral-100 text-neutral-500 placeholder:text-neutral-400 text-base p-2 mt-2 rounded-lg h-10 flex-grow"
        />
        <button className="bg-neutral-300 text-black text-lg px-4 ml-2 mt-2 rounded-lg h-10 hover:bg-neutral-400 transition">
          Add
        </button>
      </div>
    </div>
  );
}

function Event({ title, date, notes }) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const dateDiff = date - now;
  const days = Math.abs(Math.floor(dateDiff / (1000 * 60 * 60 * 24)));
  const past = dateDiff < 0;

  let color;
  if (past || days < 1) color = "text-red-600";
  else if (days < 8) color = "text-orange-600";
  else if (days < 31) color = "text-yellow-600";
  else color = "text-green-600";

  let dateString;
  if (days === 0) dateString = "today";
  else if (days === 1) dateString = past ? "yesterday" : "tomorrow";
  else dateString = (past ? "" : "in ") + days + " days" + (past ? " ago" : "");

  return (
    <div className="bg-neutral-200 text-black w-full px-3 py-2 mt-4 rounded-lg">
      <div className="flex">
        <div className="text-left text-lg">{title}</div>
        <div className="flex-grow"></div>
        <div className="text-right text-base text-neutral-500">
          {date.toDateString()}
        </div>
      </div>
      <div className="flex text-base">
        <div className="text-left text-neutral-500">{notes}</div>
        <div className="flex-grow"></div>
        <div className={"text-right " + color}>{dateString}</div>
      </div>
    </div>
  );
}

async function mySignIn() {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error(error);
  }
}

function SignInButton() {
  return (
    <div className="justify-center flex mt-32">
      <button
        className="justify-center bg-neutral-200 text-black text-lg pl-2.5 pr-3 py-2 rounded-lg hover:bg-neutral-300 transition"
        onClick={mySignIn}
      >
        <FcGoogle className="inline-block mr-2 size-7 mb-0.5" />
        Sign in with Google
      </button>
    </div>
  );
}

export default App;
