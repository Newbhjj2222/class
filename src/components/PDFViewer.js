// components/PDFViewer.js
import { Document, Page } from "react-pdf";
import { useState } from "react";

export default function PDFViewer({ url }) {
  const [numPages, setNumPages] = useState(null);

  const onLoad = ({ numPages }) => setNumPages(numPages);

  return (
    <div style={{ marginTop: 20 }}>
      <Document file={url} onLoadSuccess={onLoad}>
        {Array.from(new Array(numPages), (e, i) => (
          <Page key={i} pageNumber={i + 1} />
        ))}
      </Document>
    </div>
  );
}
