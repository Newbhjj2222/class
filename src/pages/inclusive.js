import React, { useState, useRef } from "react";
import { db } from "../components/firebase";
import { collection, addDoc } from "firebase/firestore";
import Cookies from "js-cookie";


export default function InclusiveLessonsPage({ usernameFromServer }) {
  const [lessonTitle, setLessonTitle] = useState("");
  const [audio, setAudio] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorDetail, setErrorDetail] = useState("");
  const lessonRef = useRef(null);

  // Upload audio kuri Cloudinary
  const uploadToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "audiomp3");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dilowy3fd/video/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok || !data.secure_url) {
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }
      return data.secure_url;
    } catch (err) {
      throw new Error(`Cloudinary Error: ${err.message}`);
    }
  };

  // Kubika amasomo muri Firestore (collection: inclusive)
  const saveToFirestore = async (data) => {
    try {
      await addDoc(collection(db, "inclusive"), data);
    } catch (err) {
      throw new Error(`Firestore Error: ${err.message}`);
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorDetail("");

    try {
      const username =
        Cookies.get("username") || usernameFromServer || "anonymous";

      const lessonContent = lessonRef.current.innerText.trim();

      if (!lessonTitle.trim())
        throw new Error("Andika umutwe w'isomo mbere yo kubika.");
      if (!lessonContent)
        throw new Error("Andika ibikubiye mu isomo mbere yo kubika.");

      let audioUrl = null;
      if (audio) audioUrl = await uploadToCloudinary(audio);

      await saveToFirestore({
        username,
        lessonTitle,
        lessonContent,
        audioUrl,
        type: "lesson",
        createdAt: new Date(),
      });

      // Reset
      setLessonTitle("");
      lessonRef.current.innerText = "";
      setAudio(null);
      setAudioPreview(null);
      setMessage("✅ Isomo ryabitswe neza!");
    } catch (error) {
      console.error("Detailed Error:", error);
      setMessage("❌ Habaye ikibazo mu kubika isomo!");
      setErrorDetail(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle audio preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudio(file);
      setAudioPreview(URL.createObjectURL(file));
    } else {
      setAudio(null);
      setAudioPreview(null);
    }
  };

  return (
    <>
      <Net />
      <div className="lyrics-container">
        <h1 className="title">Upload Isomo (Inclusive)</h1>

        <form className="lyrics-form" onSubmit={handleSubmit}>
          {/* TITLE */}
          <input
            type="text"
            value={lessonTitle}
            placeholder="Andika umutwe w'isomo..."
            onChange={(e) => setLessonTitle(e.target.value)}
            className="title-input"
          />

          {/* LESSON CONTENT */}
          <div
            ref={lessonRef}
            className="lyrics-input"
            contentEditable
            suppressContentEditableWarning={true}
            placeholder="Andika isomo hano..."
          ></div>

          {/* AUDIO */}
          <input type="file" accept="audio/*" onChange={handleFileChange} />

          {/* PREVIEW */}
          {audioPreview && (
            <audio controls src={audioPreview} className="audio-preview" />
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Birimo kubikwa..." : "Bika Isomo"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}
        {errorDetail && <p className="error-detail">{errorDetail}</p>}
      </div>
    </>
  );
}

// SSR
export async function getServerSideProps(context) {
  const usernameFromServer = context.req.cookies.username || null;
  return { props: { usernameFromServer } };
}
