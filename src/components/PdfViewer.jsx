"use client";

import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs";

// Tell pdfjs to use the imported ESM worker
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export default function PdfViewer({ url, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset state when url changes
    setNumPages(null);
    setPage(1);
    setScale(1.0);
    setError(null);
  }, [url]);

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onLoadError = (err) => {
    console.error("PDF failed to load:", err);
    // Provide helpful, specific message if available
    const msg =
      (err && err.message) ||
      "Unknown error while loading PDF. Check URL accessibility (public/CORS) and file integrity.";
    setError(msg);
  };

  const zoomIn = () => setScale((s) => Math.min(3, +(s + 0.25).toFixed(2)));
  const zoomOut = () => setScale((s) => Math.max(0.5, +(s - 0.25).toFixed(2)));

  return (
    <div className="pdfviewer-overlay">
      <div className="pdfviewer-toolbar">
        <div className="left">
          <button className="btn" onClick={onClose} aria-label="Close viewer">✖ Close</button>
        </div>

        <div className="center">
          <button className="btn" onClick={zoomOut} aria-label="Zoom out">−</button>
          <span className="zoom-label"> {Math.round(scale * 100)}% </span>
          <button className="btn" onClick={zoomIn} aria-label="Zoom in">+</button>

          <span className="page-controls">
            <button className="btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
            <span className="page-label">
              Page {page}{numPages ? ` / ${numPages}` : ""}
            </span>
            <button className="btn" disabled={numPages && page >= numPages} onClick={() => setPage((p) => p + 1)}>Next</button>
          </span>
        </div>

        <div className="right">
          <a className="btn link" href={url} target="_blank" rel="noopener noreferrer">Open in new tab</a>
          <a className="btn link" href={url} download>Download</a>
        </div>
      </div>

      <div className="pdfviewer-body">
        {error ? (
          <div className="pdf-error">
            <h3>Failed to load PDF</h3>
            <p>{error}</p>
            <p>
              Try opening the file in a new tab:
              {" "}
              <a href={url} target="_blank" rel="noopener noreferrer">Open PDF</a>
            </p>
          </div>
        ) : (
          <div className="pdf-document">
            <Document
              file={encodeURI(url)}
              onLoadSuccess={onLoadSuccess}
              onLoadError={onLoadError}
              loading={<div className="pdf-loading">Loading PDF…</div>}
              noData={<div className="pdf-loading">No file specified</div>}
            >
              <Page
                pageNumber={page}
                scale={scale}
                loading={<div className="pdf-loading">Rendering page…</div>}
              />
            </Document>
          </div>
        )}
      </div>

      <style jsx>{`
        .pdfviewer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .pdfviewer-toolbar {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 16px;
          gap: 12px;
          box-sizing: border-box;
          color: #fff;
        }
        .pdfviewer-toolbar .left,
        .pdfviewer-toolbar .center,
        .pdfviewer-toolbar .right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn {
          background: #1f2937;
          color: #fff;
          border: 0;
          padding: 8px 10px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn.link { background: transparent; border: 1px solid rgba(255,255,255,0.12); text-decoration: none; color: #fff; }
        .zoom-label { color: #fff; margin: 0 8px; min-width: 48px; text-align: center; }
        .page-controls { display:inline-flex; gap:8px; align-items:center; margin-left:12px; }
        .page-label { color:#fff; min-width:90px; text-align:center; }
        .pdfviewer-body {
          width: 100%;
          height: calc(100vh - 64px);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 16px;
          box-sizing: border-box;
        }
        .pdf-document {
          width: 100%;
          max-width: 1100px;
          background: #fff;
          border-radius: 6px;
          padding: 8px;
          box-sizing: border-box;
        }
        .pdf-loading { color: #fff; text-align:center; padding: 30px 0; }
        .pdf-error { color:#fff; text-align:center; padding: 24px; }
        @media (max-width: 640px) {
          .pdfviewer-toolbar { padding: 8px; gap:6px; }
          .btn { padding:6px 8px; font-size:13px; }
        }
      `}</style>
    </div>
  );
}
