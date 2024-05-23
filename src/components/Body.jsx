import { doc, addDoc, deleteDoc } from "firebase/firestore";
import { collectionRef } from "../config/firebase";

import { useState } from "react";
import Event from "./Event";

export default function Body({ user, events }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [repeat, setRepeat] = useState("");

  const handleAiAdd = async (e) => {
    e.preventDefault();
    try {
    }
    catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collectionRef, {
        user: user.uid,
        title: title,
        date: new Date(date).getTime(),
        notes: notes,
        repeat: repeat,
      });
      setTitle("");
      setDate("");
      setNotes("");
      setRepeat("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (id, title, date, notes, repeat) => {
    setTitle(title);
    setDate(new Date(date).toISOString().split("T")[0]);
    setNotes(notes);
    setRepeat(repeat ? repeat : "Once");
    await handleDelete(id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(collectionRef, id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-[calc(100vw-2rem)] max-w-96">
      <form
        onSubmit={handleAiAdd}
        className="bg-neutral-200 text-black p-3 mt-4 rounded-lg"
      >

        </form>

      <form
        onSubmit={handleAdd}
        className="bg-neutral-200 text-black p-3 mt-4 rounded-lg"
      >
        <div className="flex flex-row">
          <input
            type="text"
            placeholder="New Event"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={25}
            required
            className="bg-neutral-100 placeholder:text-neutral-400 text-black text-lg p-2 rounded-lg h-11 flex-grow max-w-[calc(100vw-12rem)] cs:max-w-[14rem]"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="bg-neutral-100 text-neutral-500 text-base p-2 ml-2 rounded-lg h-11 w-32 min-w-32"
          />
        </div>

        <div className="flex flex-row mt-2">
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={25}
            placeholder="Notes (optional)"
            className="bg-neutral-100 text-neutral-500 placeholder:text-neutral-400 text-base p-2 rounded-lg h-10 flex-grow max-w-[calc(100vw-13.5rem)] cs:max-w-[12.5rem]"
          />
          <select
            className="bg-neutral-100 text-neutral-500 text-base p-2 ml-2 rounded-lg h-10 w-26"
            onChange={(e) => setRepeat(e.target.value)}
            value={repeat}
            required
          >
            <option value="" disabled hidden>
              Repeat
            </option>
            <option value="Once">Once</option>
            <option value="Weekly">Weekly</option>
            <option value="Biweekly">Biweekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
          <button
            type="submit"
            className="bg-neutral-300 text-black text-lg text-center ml-2 rounded-lg h-10 hover:bg-neutral-400 transition w-14"
          >
            Add
          </button>
        </div>
      </form>

      {events.map((event) => (
        <Event
          key={event.id}
          event={event}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
}
