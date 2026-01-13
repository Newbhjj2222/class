"use client";

import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../components/firebase";
import Cookies from "js-cookie";
import styles from "../../styles/lesson.module.css";

export default function LessonPage() {
  const router = useRouter();
  const { id } = router.query;

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const [lesson, setLesson] = useState(null);
  const [comments, setComments] = useState([]);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchLesson = async () => {
      const snap = await getDoc(doc(db, "inclusive", id));
      setLesson(snap.data());
    };

    const fetchComments = async () => {
      const q = query(
        collection(db, "comments"),
        where("lessonId", "==", id)
      );
      const snap = await getDocs(q);
      setComments(snap.docs.map((d) => d.data()));
    };

    fetchLesson();
    fetchComments();
  }, [id]);

  // auto play audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [lesson]);

  // start recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    audioChunks.current = [];

    recorder.ondataavailable = (e) =>
      audioChunks.current.push(e.data);

    recorder.onstop = uploadComment;

    recorder.start();
    setRecording(true);
  };

  // stop recording
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  // upload comment
  const uploadComment = async () => {
    const blob = new Blob(audioChunks.current, {
      type: "audio/webm",
    });

    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", "audiomp3");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dilowy3fd/video/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    const comment = {
      lessonId: id,
      username: Cookies.get("username") || "anonymous",
      audioUrl: data.secure_url,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, "comments"), comment);
    setComments((prev) => [...prev, comment]);
  };

  if (!lesson) return null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{lesson.lessonTitle}</h1>

      <p className={styles.content}>{lesson.lessonContent}</p>

      {lesson.audioUrl && (
        <audio
          ref={audioRef}
          controls
          src={lesson.audioUrl}
          className={styles.audio}
        />
      )}

      <div className={styles.recorder}>
        {!recording ? (
          <button onClick={startRecording}>
            🎙️ Tangira Comment
          </button>
        ) : (
          <button onClick={stopRecording}>
            ⏹️ Hagarika
          </button>
        )}
      </div>

      <div className={styles.comments}>
        <h3>Ibitekerezo / Ibisubizo</h3>

        {comments.map((c, i) => (
          <div key={i} className={styles.comment}>
            <strong>{c.username}</strong>
            <audio controls src={c.audioUrl} />
          </div>
        ))}
      </div>
    </div>
  );
}
