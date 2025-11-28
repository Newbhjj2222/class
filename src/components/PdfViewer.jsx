"use client";

import { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";

// 1. Setup official ES module worker (no CDN, no copying)
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?worker";

// 2. Tell pdfjs to use it
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

import { Document, Page } from "react-pdf";

export default function PdfViewer({ url }) {
  const [numPages, setNumPages] = useState(null);

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "auto" }}>
      <Document
        file={url}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        {Array.from(new Array(numPages), (el, idx) => (
          <Page key={idx} pageNumber={idx + 1} />
        ))}
      </Document>
    </div>
  );
}
