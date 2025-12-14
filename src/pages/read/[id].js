import { db } from "@/components/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function ReadBook({ bookId }) {
  const [pdf, setPdf] = useState(null);

  useEffect(() => {
    const loadPdf = async () => {
      const q = query(
        collection(db, "book_chunks"),
        where("bookId", "==", bookId),
        orderBy("index")
      );

      const snap = await getDocs(q);
      let base64 = "";

      snap.forEach((d) => {
        base64 += d.data().data;
      });

      setPdf(base64);
    };

    loadPdf();
  }, [bookId]);

  if (!pdf) return <p>Loading book…</p>;

  return (
    <iframe
      src={pdf}
      style={{ width: "100%", height: "100vh", border: "none" }}
    />
  );
}

export async function getServerSideProps({ params }) {
  return { props: { bookId: params.id } };
  }
