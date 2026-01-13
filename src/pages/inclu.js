import Link from "next/link";
import { db } from "../components/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import styles from "../styles/inclusive.module.css";

export default function InclusiveListPage({ lessons }) {
  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Amasomo Yose</h1>

        <div className={styles.grid}>
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/inclusive/${lesson.id}`}
              className={styles.card}
            >
              <h2>{lesson.lessonTitle}</h2>
              <p>{lesson.lessonContent.slice(0, 120)}...</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

/* =========================
   SSR
========================= */
export async function getServerSideProps() {
  const q = query(
    collection(db, "inclusive"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  const lessons = snap.docs.map((doc) => ({
    id: doc.id,
    lessonTitle: doc.data().lessonTitle || "",
    lessonContent: doc.data().lessonContent || "",
  }));

  return {
    props: { lessons },
  };
}
