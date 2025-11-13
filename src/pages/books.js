import { useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../components/firebase";
import styles from "../styles/book.module.css";
import { FiDownload, FiBookOpen } from "react-icons/fi";
import Link from "next/link";
import Cookies from "js-cookie";

export default function Books({ booksData }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Books Library</h2>
      {booksData.length === 0 && <p>No books available.</p>}
      <div className={styles.bookList}>
        {booksData.map((book) => (
          <div key={book.id} className={styles.bookCard}>
            <h3 className={styles.bookTitle}>{book.title}</h3>
            <p className={styles.bookAuthor}>By: {book.author}</p>
            <div className={styles.actions}>
              <a
                href={book.url}
                download
                className={styles.downloadBtn}
              >
                <FiDownload /> Download
              </a>
              <Link href={`/readbook?id=${book.id}`} className={styles.readBtn}>
                <FiBookOpen /> Read
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// SSR: Fetch all books
export async function getServerSideProps() {
  let booksData = [];
  try {
    const booksRef = collection(db, "books");
    const q = query(booksRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    booksData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toMillis() || null,
    }));
  } catch (err) {
    console.error(err);
  }

  return { props: { booksData } };
}
