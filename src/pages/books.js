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
  return (
    <div className={styles.container}>
      <h1>📚 Books</h1>

      <div className={styles.bookList}>
        {books.map((b) => (
          <div key={b.id} className={styles.bookCard}>
            {b.coverUrl ? (
              <img src={b.coverUrl} className={styles.cover} />
            ) : (
              <div>No cover</div>
            )}
            <h3>{b.title}</h3>
            <p>{b.author}</p>

            <a href={`/read/${b.id}`} className={styles.readBtn}>
              Read
            </a>
          </div>
        ))}
      </div>
    </div>
  );
    }
