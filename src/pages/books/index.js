import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../components/firebase";
import Link from "next/link";

export default function BooksList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      const ref = collection(db, "books");
      const snap = await getDocs(ref);

      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBooks(data);
      setLoading(false);
    }

    fetchBooks();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading books...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>All Books</h1>

      <div
        style={{
          display: "grid",
          gap: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          marginTop: 20,
        }}
      >
        {books.map(book => (
          <Link
            key={book.id}
            href={`/book/${book.id}`}
            style={{
              border: "1px solid #ddd",
              padding: 15,
              borderRadius: 10,
              textDecoration: "none",
              color: "black",
              background: "#fafafa",
            }}
          >
            <h3>{book.title}</h3>
            <p style={{ color: "#666" }}>{book.author}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
