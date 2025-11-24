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
  const [loadingPdf, setLoadingPdf] = useState(false);

  const handleReadBook = async (pdfUrl) => {
    setLoadingPdf(true);
    try {
      // Fetch PDF as blob
      const res = await fetch(pdfUrl);
      const blob = await res.blob();
      // Create temporary URL
      const pdfBlobUrl = URL.createObjectURL(blob);
      setSelectedPdf(pdfBlobUrl);
    } catch (err) {
      console.error("Failed to load PDF:", err);
      alert("Failed to load PDF. Please try again.");
    }
    setLoadingPdf(false);
  };

  const handleClosePdf = () => {
    setSelectedPdf(null);
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
              <button
                className={styles.readBtn}
                onClick={() => handleReadBook(book.pdfUrl)}
              >
                {loadingPdf ? "Loading..." : "Read Book"}
              </button>
              <a
                className={styles.downloadBtn}
                href={book.pdfUrl}
                download
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* PDF Preview */}
      {selectedPdf && (
        <div className={styles.pdfWrapper}>
          <iframe
            src={selectedPdf}
            width="100%"
            height="90vh"
            style={{ border: "none" }}
            title="PDF Preview"
          ></iframe>
          <button className={styles.closePdfBtn} onClick={handleClosePdf}>
            Close Preview
          </button>
        </div>
      )}
    </div>
  );
}
