// pages/books.js
import { useState, useEffect } from "react";
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
  const [downloading, setDownloading] = useState(false);
  const [downloadedBooks, setDownloadedBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("downloadedBooks") || "[]");
    setDownloadedBooks(saved);
  }, []);

  const saveDownloaded = (id) => {
    const updated = [...downloadedBooks, id];
    setDownloadedBooks(updated);
    localStorage.setItem("downloadedBooks", JSON.stringify(updated));
  };

  const autoDownload = async (book) => {
    try {
      setDownloading(true);
      const response = await fetch(book.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = book.title + ".pdf";
      a.click();

      saveDownloaded(book.id);
      setDownloading(false);
    } catch (error) {
      setDownloading(false);
      alert("Failed to download PDF");
    }
  };

  const openExternally = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // 🔎 REAL-TIME SEARCH FILTER
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
              onClick={() => autoDownload(book)}
            >
              <img src={book.coverUrl} alt={book.title} className={styles.slideImage} />
              <p className={styles.slideTitle}>{book.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ==================== SEARCH BAR ==================== */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="🔍 Shakisha igitabo..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* ==================== LIST ==================== */}
      <div className={styles.bookList}>
        {filteredBooks.map((book) => (
          <div key={book.id} className={styles.bookCard}>
            {book.coverUrl ? (
              <img src={book.coverUrl} alt={book.title} className={styles.cover} />
            ) : (
              <div className={styles.noCover}>No Image</div>
            )}

            <div className={styles.meta}>
              <h3 className={styles.bookTitle}>{book.title}</h3>
              <p className={styles.bookAuthor}>By: {book.author}</p>
            </div>

            <div className={styles.actions}>
              {!downloadedBooks.includes(book.id) ? (
                <button
                  className={styles.readBtn}
                  onClick={() => autoDownload(book)}
                >
                  {downloading ? "Downloading..." : "Read Book"}
                </button>
              ) : (
                <button
                  className={styles.openBtn}
                  onClick={() => openExternally(book.url)}
                >
                  Open
                </button>
              )}

              {!downloadedBooks.includes(book.id) && (
                <a className={styles.downloadBtn} href={book.url} download>
                  Download
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
