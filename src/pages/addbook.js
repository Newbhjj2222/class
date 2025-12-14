import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../components/firebase";
import styles from "../styles/addbook.module.css";
import { FiBook, FiUpload } from "react-icons/fi";

/**
 * NOTE:
 * - PDF ibikwa muri Firestore nka Base64
 * - Cover image ikajya muri Cloudinary
 * - Firestore document limit ≈ 1MB (PDF nto gusa)
 */

export default function AddBook({ username }) {
  const [title, setTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Cloudinary config
  const CLOUDINARY_UPLOAD_PRESET = "Pdfbooks";
  const CLOUDINARY_CLOUD = "dilowy3fd";

  // ===============================
  // Convert File → Base64
  // ===============================
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // includes mime type
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  // ===============================
  // Upload cover image to Cloudinary
  // ===============================
  const uploadCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!data.secure_url) {
      throw new Error(
        data?.error?.message || "Failed to upload cover image"
      );
    }

    return data.secure_url;
  };

  // ===============================
  // Handle submit
  // ===============================
  const handlePublish = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !pdfFile || !coverFile) {
      setError("Please provide Title, Cover image and PDF file.");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Upload cover image
      const coverUrl = await uploadCloudinary(coverFile);

      // 2️⃣ Convert PDF to Base64
      const pdfBase64 = await fileToBase64(pdfFile);

      // 3️⃣ Save book to Firestore
      await addDoc(collection(db, "books"), {
        title,
        author: username,
        coverUrl,

        // PDF stored as Base64
        pdfBase64,
        pdfName: pdfFile.name,
        pdfSize: pdfFile.size,
        pdfType: pdfFile.type,

        createdAt: serverTimestamp(),
      });

      alert("Book uploaded successfully!");

      // Reset form
      setTitle("");
      setPdfFile(null);
      setCoverFile(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Upload failed");
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Upload Book</h2>

      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.formWrapper} onSubmit={handlePublish}>
        {/* Title */}
        <div className={styles.inputGroup}>
          <FiBook className={styles.icon} />
          <input
            className={styles.inputField}
            type="text"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Cover image */}
        <div className={styles.inputGroup}>
          <label className={styles.fileLabel}>
            <FiUpload />
            {coverFile ? coverFile.name : "Upload Cover Image"}
            <input
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={(e) => setCoverFile(e.target.files[0])}
              required
            />
          </label>
        </div>

        {/* PDF */}
        <div className={styles.inputGroup}>
          <label className={styles.fileLabel}>
            <FiUpload />
            {pdfFile ? pdfFile.name : "Upload PDF File"}
            <input
              type="file"
              accept="application/pdf"
              className={styles.fileInput}
              onChange={(e) => setPdfFile(e.target.files[0])}
              required
            />
          </label>
        </div>

        <button
          type="submit"
          className={styles.buttonPrimary}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Publish"}
        </button>
      </form>
    </div>
  );
}

// ===============================
// Auth check (SSR)
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

  return {
    props: { username },
  };
    }
