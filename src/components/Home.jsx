import {
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { collectionRef } from "../config/firebase";

import { useState, useEffect } from "react";
import SignOutButton from "./SignOutButton";
import Body from "./Body";

export default function Home({ user }) {
  const [events, setEvents] = useState([]);

  const getEvents = async () => {
    let unsubscribe;
    try {
      if (user) {
        const q = query(
          collectionRef,
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
        <SignOutButton />
      </div>

      <div className="m-4 flex justify-center">
        <Body user={user} events={events} />
      </div>
    </div>
  );
}
