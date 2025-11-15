// pages/books/[id].js
import { useRouter } from "next/router";
import { db } from "@/components/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("@/components/PDFViewer"), {
  ssr: false,
});

export default function BookReader() {
  const router = useRouter();
  const { id } = router.query;

  const [book, setBook] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      const ref = doc(db, "books", id);
      const snap = await getDoc(ref);

      if (snap.exists()) setBook(snap.data());
    };

    fetchBook();
  }, [id]);

  if (!book) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>📖 {book.title}</h2>
      <PDFViewer url={book.url} />
    </div>
  );
}
