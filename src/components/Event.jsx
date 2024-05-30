import { useState } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { MdStickyNote2 } from "react-icons/md";
import { IoIosArrowUp } from "react-icons/io";
import { PiRepeatBold } from "react-icons/pi";

export default function Event({ event, handleEdit, editDate, handleDelete }) {
  const [open, setOpen] = useState(false);
  const { id, title, date: UnixDate, notes, repeat } = event;

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const [year, month, day] = new Date(UnixDate)
    .toISOString()
    .split("T")[0]
    .split("-")
    .map(Number);

  const date = new Date(year, month - 1, day);
  const days = ~~((date - now) / (1000 * 60 * 60 * 24));

  let canMove = false;
  let nextDate = 0;
  if (days < 0 && repeat && repeat !== "Once") {
    canMove = true;
    if (repeat === "Daily") nextDate = now;
    else if (repeat === "Weekly")
      nextDate = new Date(
        now.getTime() +
          (7 - (now.getDay() - date.getDay())) * 24 * 60 * 60 * 1000
      );
    else if (repeat === "Biweekly") {
      nextDate = new Date(
        UnixDate + Math.ceil(-days / 14) * 14 * 24 * 60 * 60 * 1000
      );
    } else if (repeat === "Monthly") {
      nextDate = new Date(now.getFullYear(), now.getMonth(), date.getDate());
      if (nextDate < now) nextDate.setMonth(nextDate.getMonth() + 1);
    } else if (repeat === "Yearly") {
      nextDate = new Date(now.getFullYear(), date.getMonth(), date.getDate());
      if (nextDate < now) nextDate.setFullYear(nextDate.getFullYear() + 1);
    }
  }

  let color;
  if (days < 1) color = "text-red-600";
  else if (days < 8) color = "text-orange-600";
  else if (days < 31) color = "text-yellow-600";
  else color = "text-green-600";

  let dateString;
  if (days === 0) dateString = "today";
  else if (days === -1) dateString = "yesterday";
  else if (days === 1) dateString = "tomorrow";
  else {
    const moment = require("moment");
    dateString = moment.duration(days, "days").humanize(true);
  }

  return (
    <div className="bg-neutral-200 text-black p-3 pt-2 mb-4 rounded-lg">
      <div className="flex" id="outer">
        <div className="" id="left">
          <div className="text-left text-lg font-semibold">{title}</div>
          <div className="text-base text-left text-black -my-0.5">
            {date.toDateString()}
          </div>
          <div className={color}>{dateString}</div>
        </div>
        <div className="flex-grow" />
        <div className="grid grid-cols-1 place-items-end" id="right">
          <div className="h-8 text-right text-base text-neutral-500 flex items-center">
            {repeat && repeat !== "Once" && (
              <>
                <div
                  className={
                    "transition ease-out h-6 w-6 rounded-md flex items-center justify-center" +
                    (canMove ? " hover:bg-neutral-300 cursor-pointer" : "")
                  }
                  onClick={() => canMove && editDate(id, nextDate)}
                >
                  <PiRepeatBold className="size-4" />
                </div>
                {repeat}
              </>
            )}
          </div>
          <div className="flex mt-auto" id="buttons">
            {notes.length - notes.indexOf(":") > 2 && (
              <button
                className="bg-neutral-300 hover:bg-neutral-400 transition ease-out h-8 w-8 rounded-md mr-2 flex items-center justify-center"
                onClick={() => setOpen(!open)}
              >
                {open ? (
                  <IoIosArrowUp className="size-5" />
                ) : (
                  <MdStickyNote2 className="size-[18px]" />
                )}
              </button>
            )}
            <button
              className="bg-neutral-300 hover:bg-neutral-400 transition ease-out h-8 w-8 rounded-md mr-2 flex items-center justify-center"
              onClick={() => handleEdit(id, title, UnixDate, notes, repeat)}
            >
              <FaPencilAlt className="size-4" />
            </button>
            <button
              className="bg-red-300 hover:bg-red-400 transition ease-out h-8 w-8 rounded-md flex items-center justify-center"
              onClick={() => {
                window.confirm('Delete "' + title + '"?') && handleDelete(id);
              }}
            >
              <FaTrash className="size-4 text-red-950" />
            </button>
          </div>
        </div>
      </div>
      {open && <div className="flex text-base text-neutral-500">{notes}</div>}
    </div>
  );
}

/** BUGGY TOOLTIP
const Tooltip = ({ children, content }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);

  return (
    <div className="relative group">
      <button
        className="group-hover:text-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </button>
      {showTooltip && (
        <div
          className="absolute top-[calc(-100%-4px)] transform -translate-x-[calc(50%-16px)] py-1 px-2 rounded-md bg-neutral-300 shadow-lg text-neutral-500 whitespace-nowrap overflow-hidden"
        >
          {content}
        </div>
      )}
    </div>
  );
};
*/
