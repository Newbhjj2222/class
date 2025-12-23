import styles from "@/styles/book.module.css";
import { db } from "@/components/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Header from "@/components/Header";
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
  // ===============================
  // READ & DOWNLOAD BOOK
  // ===============================
  const handleRead = async (book) => {
    try {
      // 1️⃣ Fetch chunks
      const q = query(
        collection(db, "book_chunks"),
        where("bookId", "==", book.id)
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        alert("PDF ntibonetse");
        return;
      }

      // 2️⃣ Sort chunks
      const chunks = snap.docs
        .map((d) => d.data())
        .sort((a, b) => a.index - b.index);

      // 3️⃣ Combine base64
      const base64 = chunks.map((c) => c.data).join("");

      // 4️⃣ Base64 → Blob
      const byteString = atob(base64.split(",")[1]);
      const mime = base64.match(/data:(.*?);/)[1];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([ab], { type: mime });

      // 5️⃣ Download + open
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = book.pdfName || "book.pdf";
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Habaye ikibazo mu gufungura igitabo");
    }
  };

  return (
    <>
    <Header />
    <div className={styles.container}>
      <h1>📚 Books</h1>

      <div className={styles.bookList}>
        {books.map((b) => (
          <div key={b.id} className={styles.bookCard}>
            {b.coverUrl && (
              <img src={b.coverUrl} className={styles.cover} />
            )}

            <h3>{b.title}</h3>
            <p>{b.author}</p>

            <button
              className={styles.readBtn}
              onClick={() => handleRead(b)}
            >
              Read
            </button>
          </div>
        ))}
      </div>
    </div>
              </>
  );
  }
