"use client"; // client-only component

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PdfViewer({ url, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(1);

  const onLoadSuccess = ({ numPages }) => setNumPages(numPages);

  return (
    <div style={styles.wrapper}>
      <button style={styles.closeBtn} onClick={onClose}>✖ Close</button>

      <div style={styles.pdfContainer}>
        <Document
          file={url}
          onLoadSuccess={onLoadSuccess}
          loading={<p style={{color:"#fff"}}>Loading PDF…</p>}
        >
          <Page pageNumber={page} width={window.innerWidth * 0.9} />
        </Document>
      </div>

      <div style={styles.pagination}>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {page} of {numPages}</span>
        <button disabled={page >= numPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
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
    flexGrow: 1,
  },
  pagination: {
    marginTop: 10,
    color: "white",
    display: "flex",
    gap: 20,
    fontSize: 16,
    alignItems: "center",
  },
};
