import { auth, provider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";

export default function SignInButton() {
  async function mySignIn() {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="justify-center flex mt-32">
      <button
        className="justify-center bg-neutral-200 text-black text-lg pl-2.5 pr-3 py-2 rounded-lg hover:bg-neutral-300 transition ease-out"
        onClick={mySignIn}
      >
        <FcGoogle className="inline-block mr-2 size-7 mb-0.5" />
        Sign in with Google
      </button>
    </div>
  );
}
