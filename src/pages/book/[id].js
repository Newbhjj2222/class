import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useRouter } from "next/router";
import { db } from "../components/firebase";   // <-- HANO NI HO HARYO
import { doc, getDoc } from "firebase/firestore";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function BookViewer() {
  const router = useRouter();
  const { id } = router.query;

  const [bookUrl, setBookUrl] = useState(null);
  const [bookTitle, setBookTitle] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    if (!id) return;

    async function fetchBook() {
      const ref = doc(db, "books", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setBookUrl(snap.data().url);
        setBookTitle(snap.data().title);
      }
    }

    fetchBook();
  }, [id]);

  if (!bookUrl) return <p style={{ textAlign: "center" }}>Loading book...</p>;

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>{bookTitle}</h2>

      <Document file={bookUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} width={400} />
      </Document>

      <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 20 }}>
        <button
          onClick={() => setPageNumber(p => p - 1)}
          disabled={pageNumber <= 1}
        >
          Previous
        </button>

        <p>
          Page {pageNumber} of {numPages}
        </p>

        <button
          onClick={() => setPageNumber(p => p + 1)}
          disabled={pageNumber >= numPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
