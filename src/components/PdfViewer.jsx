import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewer({ url, onClose }) {
  const [numPages, setNumPages] = useState(null);

  const onLoadSuccess = ({ numPages }) => setNumPages(numPages);

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "scroll" }}>
      <button onClick={onClose} style={{ margin: 10 }}>Close</button>

      <Document file={url} onLoadSuccess={onLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
    </div>
  );
}
