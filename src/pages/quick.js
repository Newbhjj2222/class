import { useState } from "react";
import { db } from "../components/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import styles from "../styles/poly.module.css";
import { FaPlusCircle, FaImage } from "react-icons/fa";

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default function Poly() {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [points, setPoints] = useState(1);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = "d3b627c6d75013b8aaf2aac6de73dcb5";

  const uploadImage = async () => {
    if (!image) return null;

    const formData = new FormData();
    formData.append("image", image);

    const uploadResponse = await fetch(
      `https://api.imgbb.com/1/upload?key=${API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await uploadResponse.json();
    return data.data.url;
  };

  const submitPoll = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrl = await uploadImage();

      await addDoc(collection(db, "polls"), {
        question,
        answers,
        correctIndex,
        points: Number(points),
        imageUrl: imageUrl || null,
        createdAt: serverTimestamp(),
      });

      alert("Poll yabitswe neza ✅");
      setQuestion("");
      setAnswers(["", "", "", ""]);
      setCorrectIndex(0);
      setPoints(1);
      setImage(null);
    } catch (error) {
      console.error(error);
      alert("Habaye ikibazo ❌");
    }

    setLoading(false);
  };

  const handleAnswerChange = (value, index) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🗳️ Kora Poll</h1>

      <form onSubmit={submitPoll} className={styles.form}>
        <input
          className={styles.input}
          placeholder="Andika ikibazo..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        {answers.map((ans, index) => (
          <div key={index} className={styles.answerRow}>
            <input
              className={styles.input}
              placeholder={`Igisubizo ${index + 1}`}
              value={ans}
              onChange={(e) => handleAnswerChange(e.target.value, index)}
              required
            />

            <input
              type="radio"
              name="correct"
              checked={correctIndex === index}
              onChange={() => setCorrectIndex(index)}
            />
            <span>Ni cyo cyukuri</span>
          </div>
        ))}

        <input
          type="number"
          className={styles.input}
          placeholder="Amanota"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          min="1"
        />

        <label className={styles.imageUpload}>
          <FaImage /> Hitamo Ifoto (si ngombwa)
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        <button disabled={loading} className={styles.button}>
          <FaPlusCircle />
          {loading ? "Biri kubika..." : "Bika Poll"}
        </button>
      </form>
    </div>
  );
}
