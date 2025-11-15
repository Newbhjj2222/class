import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/components/firebase";
import PDFViewer from "@/components/PDFViewer";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [activeBook, setActiveBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get all books from Firestore
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "books"));
        const list = [];

        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });

        setBooks(list);
      } catch (error) {
        console.log("Error fetching books:", error);
      }
      setLoading(false);
    };

    fetchBooks();
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading books...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>📚 Books Library</h1>

      {!activeBook && (
        <div>
          {books.length === 0 && <p>No books found.</p>}

          <ul style={{ listStyle: "none", padding: 0 }}>
            {books.map((book) => (
              <li
                key={book.id}
                onClick={() => setActiveBook(book)}
                style={{
                  padding: "15px",
                  margin: "10px 0",
                  background: "#f5f5f5",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <strong>{book.title || "Untitled Book"}</strong>
                <p style={{ margin: 0, opacity: 0.8 }}>
                  Click to open the book
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* PDF Viewer */}
      {activeBook && (
        <div>
          <button
            onClick={() => setActiveBook(null)}
            style={{
              marginBottom: "20px",
              padding: "10px 20px",
            }}
          >
            ← Back to Library
          </button>

          <h2>{activeBook.title}</h2>
          <PDFViewer url={activeBook.url} />
        </div>
      )}
    </div>
  );
}
