import { useEffect, useState } from "react";
import { db } from "../components/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import styles from "../styles/poll.module.css";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

/* =========================
   SSR: FETCH POLLS + USER
========================= */
export async function getServerSideProps({ req }) {
  const username = req.cookies.username || null;

  if (!username) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const snapshot = await getDocs(collection(db, "polls"));
  const polls = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    props: {
      polls,
      username,
    },
  };
}

/* =========================
   PAGE COMPONENT
========================= */
export default function Poll({ polls, username }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  /* =========================
     CHECK ATTEMPT
  ========================= */
  useEffect(() => {
    const checkAttempt = async () => {
      const attemptRef = doc(db, "pollAttempts", username);
      const snap = await getDoc(attemptRef);

      if (snap.exists()) {
        setAlreadySubmitted(true);
        setSubmitted(true);
        setScore(snap.data().score);
      }

      setLoading(false);
    };

    checkAttempt();
  }, [username]);

  /* =========================
     SELECT ANSWER
  ========================= */
  const handleSelect = (pollId, index) => {
    if (submitted || alreadySubmitted) return;

    setAnswers((prev) => ({
      ...prev,
      [pollId]: index,
    }));
  };

  /* =========================
     SUBMIT ANSWERS
  ========================= */
  const submitAnswers = async () => {
    const attemptRef = doc(db, "pollAttempts", username);
    const attemptSnap = await getDoc(attemptRef);

    if (attemptSnap.exists()) {
      setAlreadySubmitted(true);
      setSubmitted(true);
      setScore(attemptSnap.data().score);
      return;
    }

    let total = 0;
    polls.forEach((poll) => {
      if (answers[poll.id] === poll.correctIndex) {
        total += poll.points;
      }
    });

    setScore(total);
    setSubmitted(true);
    setAlreadySubmitted(true);

    await setDoc(attemptRef, {
      username,
      score: total,
      createdAt: serverTimestamp(),
    });

    const depositerRef = doc(db, "depositers", username);
    const depositerSnap = await getDoc(depositerRef);

    if (depositerSnap.exists()) {
      await updateDoc(depositerRef, {
        nes: increment(total),
      });
    } else {
      await setDoc(depositerRef, {
        username,
        nes: total,
      });
    }
  };

  if (loading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🗳️ Real Question Exam</h1>
      <p className={styles.user}>User: {username}</p>

      {polls.map((poll, idx) => (
        <div key={poll.id} className={styles.card}>
          <h3 className={styles.question}>
            {idx + 1}. {poll.question}
          </h3>

          {poll.imageUrl && (
            <img
              src={poll.imageUrl}
              alt="poll"
              className={styles.image}
            />
          )}

          <div className={styles.answers}>
            {poll.answers.map((ans, index) => {
              const selected = answers[poll.id] === index;
              const correct = poll.correctIndex === index;

              return (
                <button
                  key={index}
                  className={`${styles.answer}
                  ${submitted && correct ? styles.correct : ""}
                  ${submitted && selected && !correct ? styles.wrong : ""}`}
                  onClick={() => handleSelect(poll.id, index)}
                >
                  <span>{ans}</span>
                  {submitted && correct && <FaCheckCircle />}
                  {submitted && selected && !correct && <FaTimesCircle />}
                </button>
              );
            })}
          </div>

          <p className={styles.points}>Amanota: {poll.points}</p>
        </div>
      ))}

      {!alreadySubmitted && (
        <button className={styles.submit} onClick={submitAnswers}>
          Ohereza ibisubizo
        </button>
      )}

      {alreadySubmitted && (
        <div className={styles.result}>
          ✅ Wamaze gukina game <br />
          🎯 NeS: <strong>{score}</strong>
        </div>
      )}
    </div>
  );
}
