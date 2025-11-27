"use client";

export default function PdfViewer({ url, onClose }) {
  // Google Docs Viewer
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

  return (
    <div style={styles.wrapper}>
      <button style={styles.closeBtn} onClick={onClose}>✖ Close</button>
      <iframe
        src={viewerUrl}
        width="100%"
        height="90vh"
        style={{ border: "none" }}
        title="Book Viewer"
      ></iframe>
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
};
