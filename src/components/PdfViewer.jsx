"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// PDF.js worker (CDN, compatible v5.4.394)
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewer({ url, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  const onLoadSuccess = ({ numPages }) => setNumPages(numPages);

  const onLoadError = (err) => {
    console.error("PDF failed to load:", err);
    setError(err.message || "Unknown error while loading PDF.");
  };

  return (
    <div style={styles.wrapper}>
      <button style={styles.closeBtn} onClick={onClose}>✖ Close</button>

      {error ? (
        <div style={styles.error}>
          <h3>Failed to load PDF</h3>
          <p>{error}</p>
          <p>
            Try opening the PDF in a new tab:
            <a href={url} target="_blank" rel="noopener noreferrer">Open PDF</a>
          </p>
        </div>
      ) : (
        <div style={styles.pdfContainer}>
          <Document
            file={encodeURI(url)}
            onLoadSuccess={onLoadSuccess}
            onLoadError={onLoadError}
            loading={<p style={{ color: "#fff" }}>Loading PDF…</p>}
          >
            <Page pageNumber={page} width={window.innerWidth * 0.9} />
          </Document>

          {numPages && (
            <div style={styles.pagination}>
              <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
              <span>Page {page} of {numPages}</span>
              <button disabled={page >= numPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "#000000d0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "auto",
    paddingTop: 20,
    zIndex: 9999,
  },
  closeBtn: {
    background: "red",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 5,
    border: "none",
    marginBottom: 10,
    cursor: "pointer",
  },
  pdfContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  pagination: {
    marginTop: 10,
    color: "white",
    display: "flex",
    gap: 20,
    fontSize: 16,
    alignItems: "center",
  },
  error: {
    color: "white",
    textAlign: "center",
    maxWidth: "80%",
    marginTop: 50,
  },
};
