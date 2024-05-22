import { FaPencilAlt, FaTrash } from "react-icons/fa";

export default function Event({ event, handleEdit, handleDelete }) {
  const { id, title, date: UnixDate, notes, repeat } = event;

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const [year, month, day] = new Date(UnixDate)
    .toISOString()
    .split("T")[0]
    .split("-")
    .map(Number);

  const date = new Date(year, month - 1, day);
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
  dateString = "(" + dateString + ")";

  let repeatString = "";
  if (repeat && repeat !== "Once")
    repeatString += "repeats " + repeat.toLowerCase();

  return (
    <div className="bg-neutral-200 text-black py-2 pl-3 pr-2 mt-4 rounded-lg">

      <div className="flex mb-1">
        <div className="text-left text-lg">{title}</div>
        <div className="flex-grow" />
        <button
          className="bg-neutral-300 hover:bg-neutral-400 transition h-8 w-8 rounded-md mr-2 flex items-center justify-center"
          onClick={() => handleEdit(id, title, UnixDate, notes, repeat)}
        >
          <FaPencilAlt className="size-4" />
        </button>
        <button
          className="bg-red-300 hover:bg-red-400 transition h-8 w-8 rounded-md flex items-center justify-center"
          onClick={() => handleDelete(id)}
        >
          <FaTrash className="size-4" />
        </button>
      </div>

      <div className="flex text-base">
        <div className="text-right text-base text-neutral-500">
          {date.toDateString()}
        </div>
        <div className={"text-left ml-1 " + color}>{dateString}</div>
        <div className="flex-grow" />
        <div className="text-right text-base text-neutral-500">
          {repeatString}
        </div>
      </div>

    </div>
  );
}