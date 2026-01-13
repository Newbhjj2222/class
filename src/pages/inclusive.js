"use client";

import React, { useState, useRef } from "react";
import { db } from "../components/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Cookies from "js-cookie";
import styles from "../styles/inclusive.module.css";

export default function InclusiveLessonsPage() {
  const [lessonTitle, setLessonTitle] = useState("");
  const [audio, setAudio] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorDetail, setErrorDetail] = useState("");

  const lessonRef = useRef(null);

  // Upload audio to Cloudinary
  const uploadToCloudinary = async (file) => {
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
      throw new Error("Cloudinary upload failed");
    }

    return data.secure_url;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorDetail("");

    try {
      const lessonContent =
        lessonRef.current?.innerText?.trim() || "";

      if (!lessonTitle.trim()) {
        throw new Error("Andika umutwe w'isomo.");
      }

      if (!lessonContent) {
        throw new Error("Andika ibikubiye mu isomo.");
      }

      let audioUrl = null;
      if (audio) {
        audioUrl = await uploadToCloudinary(audio);
      }

      await addDoc(collection(db, "inclusive"), {
        username: Cookies.get("username") || "anonymous",
        lessonTitle,
        lessonContent,
        audioUrl,
        type: "lesson",
        createdAt: serverTimestamp(),
      });

      setLessonTitle("");
      lessonRef.current.innerText = "";
      setAudio(null);
      setAudioPreview(null);
      setMessage("✅ Isomo ryabitswe neza!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Habaye ikibazo.");
      setErrorDetail(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAudio(file);
    setAudioPreview(URL.createObjectURL(file));
  };

  return (
    <>
      <Net />

      <div className={styles.container}>
        <h1 className={styles.title}>Upload Isomo (Inclusive)</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            className={styles.input}
            placeholder="Umutwe w'isomo..."
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
          />

          <div
            ref={lessonRef}
            className={styles.editor}
            contentEditable
            suppressContentEditableWarning
            placeholder="Andika isomo hano..."
          />

          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className={styles.file}
          />

          {audioPreview && (
            <audio
              controls
              src={audioPreview}
              className={styles.audio}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? "Birimo kubikwa..." : "Bika Isomo"}
          </button>
        </form>

        {message && <p className={styles.success}>{message}</p>}
        {errorDetail && <p className={styles.error}>{errorDetail}</p>}
      </div>
    </>
  );
}
