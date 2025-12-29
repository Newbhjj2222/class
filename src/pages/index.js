import styles from "@/styles/book.module.css";
import { db } from "@/components/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export async function getServerSideProps() {
  const q = query(collection(db, "books"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  const books = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  return { props: { books } };
}

export default function BooksPage({ books }) {
  const handleRead = (book) => {
    // Fungura PDF cyangwa URL yose muri tab nshya
    // book.bookUrl igomba kuba:
    // 🔹 URL ya PHP server: https://bmmm.ct.ws/index.php?file=mybook.pdf
    // 🔹 Cyangwa URL ya Cloudinary / Firebase
    if (!book.bookUrl) {
      alert("Book URL ntibonetse!");
      return;
    }

    window.open(book.bookUrl, "_blank");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📚 Books</h1>

      <div className={styles.bookList}>
        {books.map((b) => (
          <div key={b.id} className={styles.bookCard}>
            {b.coverUrl && (
              <img
                src={b.coverUrl}
                alt={b.title}
                className={styles.cover}
              />
            )}

            <h3>{b.title}</h3>
            <p className={styles.author}>{b.author}</p>

            <button
              className={styles.readBtn}
              onClick={() => handleRead(b)}
            >
              Read more
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
