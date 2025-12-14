
import { db } from "@/components/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

export default function ReadBook({ pdfBase64 }) {
  if (!pdfBase64) return <p>Book not found…</p>;

  return (
    <iframe
      src={pdfBase64}
      style={{ width: "100%", height: "100vh", border: "none" }}
    />
  );
}

export async function getServerSideProps({ params }) {
  const { id } = params;

  try {
    // 1️⃣ Load chunks for this book
    const q = query(
      collection(db, "book_chunks"),
      where("bookId", "==", id),
      orderBy("index")
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      return { notFound: true }; // 404 if no chunks
    }

    // 2️⃣ Combine chunks into Base64
    let pdfBase64 = "";
    snap.forEach((doc) => {
      const data = doc.data()?.data;
      if (data) pdfBase64 += data;
    });

    if (!pdfBase64) {
      return { notFound: true }; // No data → 404
    }

    return {
      props: {
        pdfBase64,
      },
    };
  } catch (err) {
    console.error("Error loading PDF chunks:", err);
    return { notFound: true }; // fail-safe 404 instead of 500
  }
}
