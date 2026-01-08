import styles from "@/styles/book.module.css";
import { db } from "@/components/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useState, useMemo } from "react";

export async function getServerSideProps() {
  const q = query(collection(db, "books"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  const books = snap.docs.map((d) => ({
    id: d.id,
    title: d.data().title || "",
    author: d.data().author || "",
    coverUrl: d.data().coverUrl || "",
    bookType: d.data().bookType || "pdf",
    bookUrl: d.data().bookUrl || ""
  }));

  return { props: { books } };
}

export default function BooksPage({ books }) {
  const [search, setSearch] = useState("");

  // 🔍 LIVE SEARCH (title + author)
  const filteredBooks = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return books;

    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
    );
  }, [search, books]);

  const handleDownload = (book) => {
    if (!book.bookUrl) {
      alert("Book URL ntibonetse!");
      return;
    }

    const a = document.createElement("a");
    a.href = book.bookUrl;
    a.download = book.title + ".pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📚 Books</h1>

      {/* 🔎 SEARCH BAR */}
      <input
        type="text"
        placeholder="Shakisha igitabo cyangwa umwanditsi..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />

      {/* 📚 BOOK LIST */}
      <div className={styles.bookList}>
        {filteredBooks.length === 0 && (
          <p className={styles.noResult}>Nta gitabo kibonetse</p>
        )}

        {filteredBooks.map((b) => (
          <div key={b.id} className={styles.bookCard}>
            {b.coverUrl && (
              <img
                src={b.coverUrl}
                alt={b.title}
                className={styles.cover}
              />
            )}
            <h3>{b.title}</h3>
            <p>{b.author}</p>

            <button
              className={styles.readBtn}
              onClick={() => handleDownload(b)}
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
