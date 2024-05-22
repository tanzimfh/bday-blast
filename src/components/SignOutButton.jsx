import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { FaSignOutAlt } from "react-icons/fa";

export default function SignOutButton() {
  async function mySignOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <button
      className="bg-neutral-200 text-black text-lg pl-2.5 pr-3 p-2 rounded-lg hover:bg-neutral-300 transition"
      onClick={mySignOut}
    >
      <FaSignOutAlt className="inline-block mr-2 size-5 my-1" />
      Sign out
    </button>
  );
}
