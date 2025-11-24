// pages/read.js
import { db } from "@/components/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getServerSideProps(context) {
  const { id } = context.query;

  const ref = doc(db, "books", id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    return { notFound: true };
  }

  return {
    props: {
      book: snapshot.data()
    }
  };
}

export default function ReadBook({ book }) {
  return (
    <div style={{ padding: "20px" }}>
      <h1>{book.title}</h1>
      <p>By: {book.author}</p>

      <iframe
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(
          book.pdfUrl
        )}&embedded=true`}
        style={{
          width: "100%",
          height: "90vh",
          border: "none",
          marginTop: "10px"
        }}
      ></iframe>
    </div>
  );
}
