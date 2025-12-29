
import styles from "@/styles/book.module.css";
import { db } from "@/components/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export async function getServerSideProps() {
  const q = query(collection(db, "books"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  // Metadata gusa, nta PDF iri muri Next.js
  const books = snap.docs.map((d) => ({
    id: d.id,
    title: d.data().title,
    author: d.data().author,
    coverUrl: d.data().coverUrl,
    bookType: d.data().bookType || "pdf", // pdf cyangwa url
  }));

  return { props: { books } };
}

export default function BooksPage({ books }) {
  const handleRead = (book) => {
    // Fungura PDF kuri InfiniteFree index.php
    const infiniteFreeUrl = `https://bmmm.ct.ws/index.php?file=${encodeURIComponent(book.id)}.pdf`;
    window.open(infiniteFreeUrl, "_blank");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📚 Books</h1>

      <div className={styles.bookList}>
        {books.map((b) => (
          <div key={b.id} className={styles.bookCard}>
            {b.coverUrl && <img src={b.coverUrl} alt={b.title} className={styles.cover} />}
            <h3>{b.title}</h3>
            <p>{b.author}</p>
            <button className={styles.readBtn} onClick={() => handleRead(b)}>
              Read Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
