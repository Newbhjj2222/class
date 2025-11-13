import { getDoc, doc, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDyfRYol2H7jL1HbQNnkyU4v9BfvagDBoU",
  authDomain: "sample-fad00.firebaseapp.com",
  projectId: "sample-fad00",
  storageBucket: "sample-fad00.appspot.com",
  messagingSenderId: "1003375658787",
  appId: "1:1003375658787:web:8260a5730e1d2defd06e96",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: "Missing id" });

  try {
    const docRef = doc(db, "books", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return res.status(404).json({ error: "Book not found" });

    res.status(200).json({ url: docSnap.data().url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
