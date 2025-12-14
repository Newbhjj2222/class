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
    const q = query(
      collection(db, "book_chunks"),
      where("bookId", "==", id),
      orderBy("index")
    );
    const snap = await getDocs(q);

    if (snap.empty) return { notFound: true };

    let pdfBase64 = "";
    snap.forEach((doc) => {
      const data = doc.data()?.data;
      if (data) pdfBase64 += data;
    });

    if (!pdfBase64) return { notFound: true };

    return { props: { pdfBase64 } };
  } catch (err) {
    console.error(err);
    return { notFound: true };
  }
             }
