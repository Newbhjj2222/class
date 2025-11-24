import { useState } from "react";
import styles from "@/styles/book.module.css";
import { db } from "@/components/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export async function getServerSideProps() {
  const booksRef = collection(db, "books");
  const q = query(booksRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  const books = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return { props: { books } };
}

export default function BooksPage({ books }) {
  const [selectedPdf, setSelectedPdf] = useState(null);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>📚 All Books</h1>

      <div className={styles.grid}>
        {books.map((book) => (
          <div key={book.id} className={styles.card}>
            {/* COVER IMAGE */}
            {book.coverUrl ? (
              <img src={book.coverUrl} alt={book.title} className={styles.cover} />
            ) : (
              <div className={styles.noCover}>No Image</div>
            )}

            {/* TITLE */}
            <h3 className={styles.title}>{book.title}</h3>

            {/* AUTHOR */}
            <p className={styles.author}>By: {book.author}</p>

            {/* READ BUTTON */}
            <button
              className={styles.btn}
              onClick={() => setSelectedPdf(book.pdfUrl)}
            >
              Read Book
            </button>
          </div>
        ))}
      </div>

      {/* IFRAME PDF PREVIEW */}
      {selectedPdf && (
        <div className={styles.iframeWrapper}>
          <iframe
            src={selectedPdf}
            width="100%"
            height="90vh"
            style={{ border: "none" }}
          ></iframe>

          <button
            className={styles.closeIframeBtn}
            onClick={() => setSelectedPdf(null)}
          >
            Close Preview
          </button>
        </div>
      )}
    </div>
  );
}
