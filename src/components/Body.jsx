import { doc, addDoc, deleteDoc } from "firebase/firestore";
import { collectionRef } from "../config/firebase";

import { useState } from "react";
import Event from "./Event";

import { HiSparkles } from "react-icons/hi2";

export default function Body({ user, events }) {
  const [aiText, setAiText] = useState("");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [repeat, setRepeat] = useState("");

  const handleAiAdd = async (e) => {
    e.preventDefault();
    try {
      
    } catch (error) {
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
        className="bg-neutral-200 text-black p-3 mt-8 rounded-lg flex-col flex"
      >
        {/** <div className="text-xl mb-2 ml-0.5">Let Gemini handle it</div> */}
        <textarea
          placeholder="Briefly describe an event"
          value={aiText}
          onChange={(e) => setAiText(e.target.value)}
          required
          rows={2}
          maxLength={100}
          className="bg-neutral-100 placeholder:text-neutral-400 text-black text-base p-2 rounded-lg flex-grow"
        />
        <button className="flex-row flex items-center justify-center mt-2 h-12 rounded-lg bg-gradient-to-r from-blue-400 via-pink-400 to-blue-400 bg-size-200 bg-pos-0 hover:bg-pos-100 duration-500 transition-all">
          <HiSparkles color="white" className="size-6 mr-2" />
          <div className="text-lg text-white drop-shadow-lg">
            Let Gemini handle it
          </div>
        </button>
      </form>

      <div className="flex flex-row mt-2 items-center">
        <div className="h-0.5 bg-neutral-200 flex-grow mx-4 rounded-full"></div>
        <div className="text-white">OR</div>
        <div className="h-0.5 bg-neutral-200 flex-grow mx-4 rounded-full"></div>
      </div>

      <form
        onSubmit={handleAdd}
        className="bg-neutral-200 text-black p-3 mt-2 mb-12 rounded-lg"
      >
        <div className="text-xl mb-2 ml-0.5">Enter manually</div>
        <div className="flex flex-row">
          <input
            type="text"
            placeholder="Event Title"
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

      <div className="text-xl ml-0.5 mb-1 text-white">Your Events</div>
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
