import { useState } from "react";
import { Document, Page } from "react-pdf";

export default function PDFViewer({ url }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(err) => console.log("PDF Error: ", err)}
        loading={<p>Loading book...</p>}
      >
        <Page pageNumber={pageNumber} width={350} />
      </Document>

      {numPages && (
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
            disabled={pageNumber === 1}
            style={{ marginRight: "10px" }}
          >
            Previous
          </button>

          <span>
            Page {pageNumber} of {numPages}
          </span>

          <button
            onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
            disabled={pageNumber === numPages}
            style={{ marginLeft: "10px" }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
