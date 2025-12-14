import { db } from "@/components/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export default function ReadBook({ pdfBase64 }) {
  if (!pdfBase64) return <p>Book not found…</p>;

  return (
    <iframe
      src={pdfBase64}
      style={{ width: "100%", height: "100vh", border: "none" }}
    />
  );
}

// =====================================================
// SERVER SIDE: load chunks, combine, return base64
// =====================================================
export async function getServerSideProps({ params }) {
  const { id } = params;

  // 🔹 Import Firestore dynamically inside SSR (node side)
  const { collection, getDocs, query, where, orderBy } = await import(
    "firebase/firestore"
  );
  const { db } = await import("@/components/firebase");

  // 1️⃣ Load all chunks for this book
  const q = query(
    collection(db, "book_chunks"),
    where("bookId", "==", id),
    orderBy("index")
  );
  const snap = await getDocs(q);

  if (snap.empty) {
    return { notFound: true }; // 404 if no chunks
  }

  let pdfBase64 = "";
  snap.forEach((doc) => {
    pdfBase64 += doc.data().data;
  });

  return {
    props: {
      pdfBase64,
    },
  };
        }
