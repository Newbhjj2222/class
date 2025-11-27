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
  const [selectedUrl, setSelectedUrl] = useState(null);

  const handleReadBook = (url) => {
    if (!url) {
      alert("Book URL not found.");
      return;
    }
    setSelectedUrl(url); // 👉 direct URL stored in Firestore
  };

  const handleClose = () => {
    setSelectedUrl(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📚 All Books</h1>

      <div className={styles.bookList}>
        {books.map((book) => (
          <div key={book.id} className={styles.bookCard}>
            
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className={styles.cover}
              />
            ) : (
              <div className={styles.noCover}>No Image</div>
            )}

            <h3 className={styles.bookTitle}>{book.title}</h3>
            <p className={styles.bookAuthor}>By: {book.author}</p>

            <div className={styles.actions}>
              <button
                className={styles.readBtn}
                onClick={() => handleReadBook(book.url)}
              >
                Read Book
              </button>

              <a className={styles.downloadBtn} href={book.url} download>
                Download
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Preview */}
      {selectedUrl && (
        <div className={styles.pdfWrapper}>
          <iframe
            src={selectedUrl}
            width="100%"
            height="90vh"
            style={{ border: "none" }}
            title="Book Preview"
          ></iframe>

          <button className={styles.closePdfBtn} onClick={handleClose}>
            Close Preview
          </button>
        </div>
      )}
    </div>
  );
}
