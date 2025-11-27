import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "@/styles/book.module.css";
import { db } from "@/components/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

// dynamic import client-side only
const PdfViewer = dynamic(() => import("@/components/PdfViewer"), { ssr: false });

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
  const [selectedUrl, setSelectedUrl] = useState(null);

  const handleReadBook = (url) => {
    if (!url) return alert("Book URL not found");
    setSelectedUrl(url); // Google Docs Viewer will handle embedding
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📚 All Books</h1>

      <div className={styles.bookList}>
        {books.map((book) => (
          <div key={book.id} className={styles.bookCard}>
            {book.coverUrl ? (
              <img src={book.coverUrl} alt={book.title} className={styles.cover} />
            ) : (
              <div className={styles.noCover}>No Image</div>
            )}

            <h3 className={styles.bookTitle}>{book.title}</h3>
            <p className={styles.bookAuthor}>By: {book.author}</p>

            <div className={styles.actions}>
              <button className={styles.readBtn} onClick={() => handleReadBook(book.url)}>
                Read Book
              </button>

              <a className={styles.downloadBtn} href={book.url} download>
                Download
              </a>
            </div>
          </div>
        ))}
      </div>

      {selectedUrl && (
        <PdfViewer url={selectedUrl} onClose={() => setSelectedUrl(null)} />
      )}
    </div>
  );
}
