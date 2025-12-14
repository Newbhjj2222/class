import { db } from "@/components/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export default function ReadBook({ pdfBase64, title }) {
  if (!pdfBase64) {
    return <p>Book not found</p>;
  }

  return (
    <iframe
      src={pdfBase64}
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
      }}
      title={title}
    />
  );
}

// ===============================
// SSR – runs on server only
// ===============================
export async function getServerSideProps({ params }) {
  const { id } = params;

  try {
    const q = query(
      collection(db, "book_chunks"),
      where("bookId", "==", id),
      orderBy("index")
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      return { notFound: true };
    }

    let base64 = "";
    snap.forEach((doc) => {
      base64 += doc.data().data;
    });

    return {
      props: {
        pdfBase64: base64,
        title: "Read Book",
      },
    };
  } catch (error) {
    console.error("SSR read error:", error);
    return { notFound: true };
  }
}
