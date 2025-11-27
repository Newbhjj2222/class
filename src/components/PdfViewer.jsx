"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PdfViewer({ url, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(1);

  function onLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div style={styles.wrapper}>
      <button style={styles.closeBtn} onClick={onClose}>✖ Close</button>

      <Document
        file={url}
        onLoadSuccess={onLoadSuccess}
        loading={<p>Loading PDF…</p>}
      >
        <Page pageNumber={page} width={350} />
      </Document>

      <div style={styles.pagination}>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>

        <span>
          Page {page} of {numPages}
        </span>

        <button disabled={page >= numPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "fixed",
    top: 0, left: 0,
    width: "100%",
    height: "100%",
    background: "#000000d0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "scroll",
    paddingTop: "20px",
  },
  pagination: {
    marginTop: "10px",
    color: "white",
    display: "flex",
    gap: 20,
    fontSize: 16,
  },
  closeBtn: {
    background: "red",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 5,
    border: "none",
    marginBottom: 10,
    cursor: "pointer",
  }
};
