import { db } from "@/components/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

/**
 * ================================
 * PAGE COMPONENT (NO CLIENT LOGIC)
 * ================================
 */
export default function ReadBook({ pdfBase64, title }) {
  if (!pdfBase64) {
    return <p style={{ padding: 20 }}>Book not found.</p>;
  }

  return (
    <>
      <iframe
        src={pdfBase64}
        title={title}
        style={{
          width: "100%",
          height: "100vh",
          border: "none",
        }}
      />
    </>
  );
}

/**
 * ================================
 * SERVER-SIDE ONLY
 * ================================
 */
export async function getServerSideProps({ params }) {
  const bookId = params.id;

  try {
    // 1️⃣ Fetch chunks ordered correctly
    const q = query(
      collection(db, "book_chunks"),
      where("bookId", "==", bookId),
      orderBy("index", "asc")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return {
        notFound: true,
      };
    }

    // 2️⃣ Rebuild Base64 on server
    let pdfBase64 = "";
    snapshot.forEach((doc) => {
      pdfBase64 += doc.data().data;
    });

    // 3️⃣ Optional: fetch book title (clean UX)
    let title = "Book Reader";
    try {
      const bookSnap = await getDocs(
        query(
          collection(db, "books"),
          where("__name__", "==", bookId)
        )
      );
      if (!bookSnap.empty) {
        title = bookSnap.docs[0].data().title || title;
      }
    } catch (e) {
      // title optional – ignore errors
    }

    return {
      props: {
        pdfBase64,
        title,
      },
    };
  } catch (error) {
    console.error("SSR PDF load failed:", error);

    return {
      notFound: true,
    };
  }
    }
