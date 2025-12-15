import styles from "../styles/addbook.module.css";
import { FiBook, FiUpload } from "react-icons/fi";
import { useState } from "react";

export default function AddBook({ username }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===============================
  // UPLOAD TO CLOUDINARY (DIRECT)
  // ===============================
  async function uploadToCloudinary(file, type = "raw") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Pdfbooks"); // ⚠️ preset yawe

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
      const pdfFile = form.pdf.files[0];

      if (!title || !coverFile || !pdfFile) {
        throw new Error("Fill all fields");
      }

      // 1️⃣ Upload cover image
      const coverUrl = await uploadToCloudinary(
        coverFile,
        "image"
      );

      // 2️⃣ Upload PDF
      const pdfUrl = await uploadToCloudinary(pdfFile, "raw");

      // 3️⃣ Save book info to API (JSON only)
      const res = await fetch("/api/save-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          author: username,
          coverUrl,
          pdfUrl,
          pdfName: pdfFile.name,
          pdfSize: pdfFile.size,
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
          <input
            name="title"
            placeholder="Book title"
            required
          />
        </div>

        {/* COVER */}
        <label className={styles.fileLabel}>
          <FiUpload /> Upload cover image
          <input
            type="file"
            name="cover"
            accept="image/*"
            required
          />
        </label>

        {/* PDF */}
        <label className={styles.fileLabel}>
          <FiUpload /> Upload PDF
          <input
            type="file"
            name="pdf"
            accept="application/pdf"
            required
          />
        </label>

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
