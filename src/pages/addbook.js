
import styles from "../styles/addbook.module.css";
import { FiBook, FiUpload, FiLink } from "react-icons/fi";
import { useState } from "react";

export default function AddBook({ username }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookType, setBookType] = useState("pdf"); // pdf | url

  // ===============================
  // UPLOAD TO CLOUDINARY
  // ===============================
  async function uploadToCloudinary(file, type = "raw") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Pdfbooks");

    const endpoint =
      type === "image"
        ? "https://api.cloudinary.com/v1_1/dilowy3fd/image/upload"
        : "https://api.cloudinary.com/v1_1/dilowy3fd/raw/upload";

    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.secure_url) {
      throw new Error("Cloudinary upload failed");
    }

    return data.secure_url;
  }

  // ===============================
  // HANDLE SUBMIT
  // ===============================
  async function handlePublish(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const form = e.target;
      const title = form.title.value;
      const coverFile = form.cover.files[0];

      if (!title || !coverFile) {
        throw new Error("Fill all required fields");
      }

      // 1️⃣ Upload cover
      const coverUrl = await uploadToCloudinary(coverFile, "image");

      let bookUrl = "";
      let bookName = "";
      let bookSize = 0;

      // 2️⃣ PDF cyangwa URL
      if (bookType === "pdf") {
        const pdfFile = form.pdf.files[0];
        if (!pdfFile) throw new Error("Upload PDF file");

        bookUrl = await uploadToCloudinary(pdfFile, "raw");
        bookName = pdfFile.name;
        bookSize = pdfFile.size;
      } else {
        bookUrl = form.bookUrl.value;
        if (!bookUrl) throw new Error("Shyiramo Book URL");
      }

      // 3️⃣ Save to API
      const res = await fetch("/api/save-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author: username,
          coverUrl,
          bookUrl,
          bookType, // pdf | url
          bookName,
          bookSize,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("Igitabo cyoherejwe neza ✔️");
      form.reset();
    } catch (err) {
      setError(err.message || "Upload failed");
    }

    setLoading(false);
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Upload Book</h2>

      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handlePublish} className={styles.formWrapper}>
        {/* TITLE */}
        <div className={styles.inputGroup}>
          <FiBook />
          <input name="title" placeholder="Book title" required />
        </div>

        {/* COVER */}
        <label className={styles.fileLabel}>
          <FiUpload /> Upload cover image
          <input type="file" name="cover" accept="image/*" required />
        </label>

        {/* TYPE */}
        <div className={styles.typeSwitch}>
          <label>
            <input
              type="radio"
              value="pdf"
              checked={bookType === "pdf"}
              onChange={() => setBookType("pdf")}
            />
            PDF
          </label>

          <label>
            <input
              type="radio"
              value="url"
              checked={bookType === "url"}
              onChange={() => setBookType("url")}
            />
            URL
          </label>
        </div>

        {/* PDF */}
        {bookType === "pdf" && (
          <label className={styles.fileLabel}>
            <FiUpload /> Upload PDF
            <input type="file" name="pdf" accept="application/pdf" />
          </label>
        )}

        {/* URL */}
        {bookType === "url" && (
          <div className={styles.inputGroup}>
            <FiLink />
            <input
              name="bookUrl"
              placeholder="https://example.com/book"
              type="url"
            />
          </div>
        )}

        <button disabled={loading}>
          {loading ? "Uploading..." : "Publish"}
        </button>
      </form>
    </div>
  );
}

// ===============================
// SSR AUTH GUARD
// ===============================
export async function getServerSideProps({ req }) {
  const username = req.cookies.username || null;

  if (!username) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: { username } };
}
