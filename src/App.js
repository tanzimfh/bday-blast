import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaSignOutAlt, FaTrash } from "react-icons/fa";

import logo from "./bday.png";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAha0I6Lu001An6O_wJ_p98w3hPqy0BpW8",
  authDomain: "blast-eb7f5.firebaseapp.com",
  projectId: "blast-eb7f5",
  storageBucket: "blast-eb7f5.appspot.com",
  messagingSenderId: "31262016010",
  appId: "1:31262016010:web:ec3a41aa7839e786d195f3",
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
  const [eventTitle, setEventTitle] = useState("");

  const now = new Date(Date.now());
  now.setHours(0, 0, 0, 0);
  const [eventDate, setEventDate] = useState(now.toISOString().split("T")[0]);
  const [eventNotes, setEventNotes] = useState("");

  const eventsCollection = collection(db, "events");

  const getEvents = async () => {
    let unsubscribe;
    try {
      if (user) {
        const q = query(
          eventsCollection,
          where("user", "==", user.uid),
          orderBy("date")
        );

        unsubscribe = onSnapshot(q, (snapshot) => {
          setEvents(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        });
      }
    } catch (error) {
      console.error(error);
    }
    return unsubscribe;
  };

  useEffect(() => {
    getEvents();
  }, [user]);

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
      {user ? (
        <Home
          user={user}
          events={events}
          eventTitle={eventTitle}
          setEventTitle={setEventTitle}
          eventDate={eventDate}
          setEventDate={setEventDate}
          eventNotes={eventNotes}
          setEventNotes={setEventNotes}
        />
      ) : (
        <SignInButton />
      )}
      <div className="h-4"></div>
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

function Home({
  user,
  events,
  eventTitle,
  setEventTitle,
  eventDate,
  setEventDate,
  eventNotes,
  setEventNotes,
}) {
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
          <AddEvent
            user={user}
            eventTitle={eventTitle}
            setEventTitle={setEventTitle}
            eventDate={eventDate}
            setEventDate={setEventDate}
            eventNotes={eventNotes}
            setEventNotes={setEventNotes}
          />
          {events.map((event) => (
            <Event
              key={event.id}
              id={event.id}
              title={event.title}
              date={event.date}
              notes={event.notes}
            />
          ))}
        </div>
        <div className="flex-grow" />
      </div>
    </div>
  );
}

function AddEvent({
  user,
  eventTitle,
  setEventTitle,
  eventDate,
  setEventDate,
  eventNotes,
  setEventNotes,
}) {
  const handleAdd = async () => {
    if (!eventTitle || !eventDate)
      return alert("Please fill in the event title and date.");
    try {
      await addDoc(collection(db, "events"), {
        user: user.uid,
        title: eventTitle,
        date: new Date(eventDate).getTime(),
        notes: eventNotes,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-neutral-200 text-black w-full p-3 mt-4 rounded-lg">
      <div className="flex flex-row">
        <input
          type="text"
          placeholder="New Event"
          onChange={(e) => setEventTitle(e.target.value)}
          maxLength={25}
          className="bg-neutral-100 placeholder:text-neutral-400 text-black text-lg p-2 rounded-lg h-11 flex-grow"
        />
        <input
          type="date"
          onChange={(e) => setEventDate(e.target.value)}
          value={eventDate}
          className="bg-neutral-100 text-neutral-500 text-base p-2 ml-2 rounded-lg h-11 w-32"
        />
      </div>
      <div className="flex flex-row">
        <input
          type="text"
          onChange={(e) => setEventNotes(e.target.value)}
          maxLength={35}
          placeholder="Notes (optional)"
          className="bg-neutral-100 text-neutral-500 placeholder:text-neutral-400 text-base p-2 mt-2 rounded-lg h-10 flex-grow"
        />
        <button
          className="bg-neutral-300 text-black text-lg px-4 ml-2 mt-2 rounded-lg h-10 hover:bg-neutral-400 transition"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>
    </div>
  );
}

function Event({ id, title, date, notes }) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const [year, month, day] = new Date(date)
    .toISOString()
    .split("T")[0]
    .split("-")
    .map(Number);
  date = new Date(year, month - 1, day);

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

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "events", id));
    } catch (error) {
      console.error(error);
    }
  };

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
        <button
          className="bg-red-300 text-black text-lg p-1.5 ml-2 rounded-md hover:bg-red-400 transition"
          onClick={handleDelete}
        >
          <FaTrash className="size-4" />
        </button>
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
