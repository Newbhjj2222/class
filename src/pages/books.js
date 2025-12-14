import { useState, useEffect } from "react";
import styles from "@/styles/book.module.css";
import { db } from "@/components/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

/**
 * This page reads PDF stored as Base64 in Firestore
 * Field used: book.pdfBase64
 */

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
  const [downloading, setDownloading] = useState(false);
  const [downloadedBooks, setDownloadedBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // ===============================
  // Load downloaded books
  // ===============================
  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("downloadedBooks") || "[]"
    );
    setDownloadedBooks(saved);
  }, []);

  const saveDownloaded = (id) => {
    const updated = [...new Set([...downloadedBooks, id])];
    setDownloadedBooks(updated);
    localStorage.setItem("downloadedBooks", JSON.stringify(updated));
  };

  // ===============================
  // Open PDF in browser (Base64)
  // ===============================
  const readBook = (book) => {
    if (!book.pdfBase64) {
      alert("PDF not found");
      return;
    }

    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>${book.title}</title>
          <style>
            body, html {
              margin: 0;
              padding: 0;
              height: 100%;
            }
            iframe {
              width: 100%;
              height: 100%;
              border: none;
            }
          </style>
        </head>
        <body>
          <iframe src="${book.pdfBase64}"></iframe>
        </body>
      </html>
    `);

    saveDownloaded(book.id);
  };

  // ===============================
  // Download PDF from Base64
  // ===============================
  const downloadBook = async (book) => {
    try {
      setDownloading(true);

      const a = document.createElement("a");
      a.href = book.pdfBase64;
      a.download = `${book.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      saveDownloaded(book.id);
      setDownloading(false);
    } catch (err) {
      setDownloading(false);
      alert("Failed to download PDF");
    }
  };

  // ===============================
  // Search filter
  // ===============================
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📚 All Books</h1>

      {/* ==================== SLIDER ==================== */}
      <div className={styles.sliderWrapper}>
        <div className={styles.slider}>
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className={styles.slideCard}
              onClick={() => readBook(book)}
            >
              <img
                src={book.coverUrl}
                alt={book.title}
                className={styles.slideImage}
              />
              <p className={styles.slideTitle}>{book.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ==================== SEARCH ==================== */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="🔍 Shakisha igitabo..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* ==================== BOOK LIST ==================== */}
      <div className={styles.bookList}>
        {filteredBooks.map((book) => (
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

            <div className={styles.meta}>
              <h3 className={styles.bookTitle}>{book.title}</h3>
              <p className={styles.bookAuthor}>By: {book.author}</p>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.readBtn}
                onClick={() => readBook(book)}
              >
                Read Book
              </button>

              <button
                className={styles.downloadBtn}
                disabled={downloading}
                onClick={() => downloadBook(book)}
              >
                {downloading ? "Downloading..." : "Download"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  }
