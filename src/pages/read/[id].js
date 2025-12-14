import { db } from "@/components/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

/**
 * READ BOOK PAGE (SSR 100%)
 * - Reads PDF chunks from Firestore
 * - Rebuilds Base64 on the server
 * - Renders PDF in iframe
 */

export default function ReadBook({ pdfBase64, title }) {
  if (!pdfBase64) {
    return <p style={{ padding: 20 }}>Book not found.</p>;
  }

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        src={pdfBase64}
        title={title}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
      />
    </div>
  );
}

// ===============================
// SSR
// ===============================
export async function getServerSideProps({ params }) {
  const bookId = params.id;

  try {
    // 1️⃣ Fetch chunks ordered
    const q = query(
      collection(db, "book_chunks"),
      where("bookId", "==", bookId),
      orderBy("index", "asc")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { notFound: true };
    }

    // 2️⃣ Rebuild Base64
    let pdfBase64 = "";
    snapshot.forEach((doc) => {
      pdfBase64 += doc.data().data;
    });

    return {
      props: {
        pdfBase64,
        title: bookId,
      },
    };
  } catch (error) {
    console.error("SSR read error:", error);
    return { notFound: true };
  }
          }
