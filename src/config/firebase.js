import { initializeApp } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
// import { getVertexAI, getGenerativeModel } from "firebase/vertexai-preview";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

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

initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(
    "6LejjuUpAAAAANcvZqY76YRvplx2ahYTaUOnORbE"
  ),
  isTokenAutoRefreshEnabled: true,
});

/**
const vertexAI = getVertexAI(app);

export const model = getGenerativeModel(vertexAI, {
  model: "gemini-1.5-pro-preview-0514",
  generationConfig: { maxOutputTokens: 128 },
  systemInstruction: `You will extract information about an event from a brief
    description. Each prompt will be in the format "<day> YYYY-MM-DD <info>",
    where <day> is the current day of the week, YYYY-MM-DD is the current date,
    and <info> is information about an event. Your response should be in json
    format: {"title": "short title for event", "date": "YYYY-MM-DD", "repeat":
    "Once"/"Daily"/"Weekly"/"Biweekly"/"Monthly"/"Yearly"}. Use the current day
    of the week and date to determine the date of the event from relative dates,
    which can be in the past. If a field isn't explicitly specified, use your
    best judgement to infer it. If a field can't be inferred at all, leave it as
   "N/A".`,
});
*/

export const db = getFirestore(app);
export const collectionRef = collection(db, "events");
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account",
});
