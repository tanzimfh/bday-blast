import { doc, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { collectionRef, model } from "../config/firebase";

import { useState } from "react";
import Event from "./Event";

import { HiSparkles } from "react-icons/hi2";

export default function Body({ user, events }) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [aiText, setAiText] = useState("");
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [repeat, setRepeat] = useState("");

  const handleAiAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFailed(false);
    try {
      const prompt =
        days[now.getDay()] +
        " " +
        now.toISOString().split("T")[0] +
        " " +
        aiText;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsedObj = JSON.parse(text.replace(/```json\n|```/g, ""));
      if (Object.values(parsedObj).includes("N/A")) {
        console.log(parsedObj);
        throw new Error("Failed to extract information");
      }
      await addDoc(collectionRef, {
        user: user.uid,
        title: parsedObj.title,
        date: new Date(parsedObj.date).getTime(),
        notes: "Gemini prompt: " + aiText,
        repeat: parsedObj.repeat,
      });
    } catch (error) {
      setFailed(true);
      console.error(error);
    }
    setAiText("");
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collectionRef, {
        user: user.uid,
        title: title,
        date: new Date(date).getTime(),
        notes: "Notes: " + notes,
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
    setNotes(notes.replace("Gemini prompt: ", "").replace("Notes: ", ""));
    setRepeat(repeat ? repeat : "Once");
    await handleDelete(id);
  };

  const editDate = async (id, date) => {
    try {
      await updateDoc(doc(collectionRef, id), {
        date: new Date(date).getTime(),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(collectionRef, id));
    } catch (error) {
      console.error(error);
    }
  };

  const onEnterPress = (e) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      e.preventDefault();
      handleAiAdd(e);
    }
  };

  return (
    <div className="w-[calc(100vw-2rem)] max-w-96">
      <form
        onSubmit={handleAiAdd}
        className="bg-neutral-200 text-black p-3 mt-8 rounded-lg flex-col flex"
      >
        <textarea
          placeholder={
            failed
              ? "Failed to extract information. Please try again with more details."
              : "Briefly describe an event"
          }
          value={aiText}
          onChange={(e) => {
            setFailed(false);
            setAiText(e.target.value);
          }}
          onKeyDown={onEnterPress}
          required
          rows={2}
          maxLength={100}
          className={
            "bg-neutral-100 text-black text-base p-2 rounded-lg flex-grow" +
            (failed ? " placeholder:text-red-400" : "")
          }
        />
        <button className="flex-row flex items-center justify-center mt-2 h-12 rounded-lg bg-gradient-to-r from-blue-400 via-pink-400 to-blue-400 bg-size-200 bg-pos-0 hover:bg-pos-100 duration-500 transition-all ease-out">
          {loading ? (
            <div className="h-6 w-6 mr-2 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] text-white" />
          ) : (
            <HiSparkles color="white" className="size-6 mr-2" />
          )}
          <div className="text-lg text-white drop-shadow-lg font-semibold">
            Let Gemini handle it
          </div>
        </button>
      </form>

      <div className="flex flex-row mt-2 items-center">
        <div className="h-0.5 bg-neutral-200 flex-grow mx-4 rounded-full"></div>
        <div className="text-white font-semibold">OR</div>
        <div className="h-0.5 bg-neutral-200 flex-grow mx-4 rounded-full"></div>
      </div>

      <form
        onSubmit={handleAdd}
        className="bg-neutral-200 text-black p-3 pt-2 mt-2 mb-8 rounded-lg"
      >
        <div className="text-xl mb-2 ml-0.5 font-semibold">Enter manually</div>
        <div className="flex flex-row text-black">
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={25}
            required
            className="bg-neutral-100 text-lg p-2 rounded-lg h-11 flex-grow max-w-[calc(100vw-12rem)] cs:max-w-[14rem]"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className={
              "bg-neutral-100 text-base p-2 ml-2 rounded-lg h-11 w-32 min-w-32" +
              (date === "" ? " text-gray-400" : "")
            }
          />
        </div>

        <div className="flex flex-row mt-2 text-neutral-500">
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={115}
            placeholder="Notes (optional)"
            className="bg-neutral-100 text-base p-2 rounded-lg h-10 flex-grow max-w-[calc(100vw-13.5rem)] cs:max-w-[12.5rem]"
          />
          <select
            className={
              "bg-neutral-100 text-base p-2 ml-2 rounded-lg h-10 w-26" +
              (repeat === "" ? " text-gray-400" : "")
            }
            onChange={(e) => setRepeat(e.target.value)}
            value={repeat}
            required
          >
            <option value="" disabled hidden>
              Repeat
            </option>
            <option value="Once">Once</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Biweekly">Biweekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
          <button
            type="submit"
            className="bg-neutral-300 text-black text-lg text-center ml-2 rounded-lg h-10 hover:bg-neutral-400 transition ease-out w-14"
          >
            Add
          </button>
        </div>
      </form>
      {events.length > 0 && (
        <div className="text-xl ml-0.5 mb-1 text-white">Your Events</div>
      )}
      {events.map((event) => (
        <Event
          key={event.id}
          event={event}
          handleEdit={handleEdit}
          editDate={editDate}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
}
