// pages/books.js
import styles from "@/styles/book.module.css";
import { db } from "@/components/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";

export async function getServerSideProps() {
  const booksRef = collection(db, "books");
  const q = query(booksRef, orderBy("title", "asc"));
  const snapshot = await getDocs(q);

  const books = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return { props: { books } };
}

export default function BooksPage({ books }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>📚 All Books</h1>

      <div className={styles.grid}>
        {books.map(book => (
          <div key={book.id} className={styles.card}>
            <h3>{book.title}</h3>
            <p className={styles.author}>By: {book.author}</p>

            <Link href={`/read?id=${book.id}`}>
              <button className={styles.btn}>Read Book</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
