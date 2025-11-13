import React from "react";
import { db } from "../components/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ReadBook({ pdfUrl, error }) {
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ height: "100vh", width: "100%", padding: "10px" }}>
      {pdfUrl ? (
        <>
          <iframe
            src={pdfUrl}
            width="100%"
            height="90%"
            style={{ border: "1px solid #ccc" }}
            title="Read Book PDF"
          />
          <div style={{ marginTop: "10px" }}>
            <a href={pdfUrl} download>
              Download PDF
            </a>
          </div>
        </>
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
}

// SSR
export async function getServerSideProps(context) {
  const { id } = context.query;
  if (!id) return { props: { pdfUrl: null, error: "No document ID provided." } };

  try {
    const docRef = doc(db, "books", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists())
      return { props: { pdfUrl: null, error: "Document not found." } };

    const pdfUrl = docSnap.data().url;
    if (!pdfUrl)
      return { props: { pdfUrl: null, error: "PDF URL not found in document." } };

    return { props: { pdfUrl, error: null } };
  } catch (err) {
    return { props: { pdfUrl: null, error: "Failed to fetch PDF URL: " + err.message } };
  }
}
