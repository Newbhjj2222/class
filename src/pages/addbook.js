import { useState } from "react";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../components/firebase";
import styles from "../styles/addbook.module.css";
import { FiBook, FiUpload } from "react-icons/fi";

/**
 * CONFIG
 * Cloudinary secrets (as provided)
 */
const CLOUDINARY_UPLOAD_PRESET = "Pdfbooks";
const CLOUDINARY_CLOUD = "dilowy3fd";

/**
 * Chunk size (safe for Firestore)
 * ~400KB per chunk
 */
const CHUNK_SIZE = 400_000;

export default function AddBook({ username }) {
  const [title, setTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===============================
  // File → Base64
  // ===============================
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  // ===============================
  // Split Base64 into chunks
  // ===============================
  const splitBase64 = (base64) => {
    const chunks = [];
    for (let i = 0; i < base64.length; i += CHUNK_SIZE) {
      chunks.push(base64.slice(i, i + CHUNK_SIZE));
    }
    return chunks;
  };

  // ===============================
  // Upload cover to Cloudinary
  // ===============================
  const uploadCoverToCloudinary = async (file) => {
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
        data?.error?.message || "Cloudinary upload failed"
      );
    }

    return data.secure_url;
  };

  // ===============================
  // Save PDF chunks to Firestore
  // ===============================
  const savePdfChunks = async (bookId, base64) => {
    const chunks = splitBase64(base64);

    for (let i = 0; i < chunks.length; i++) {
      await setDoc(doc(db, "book_chunks", `${bookId}_${i}`), {
        bookId,
        index: i,
        data: chunks[i],
        createdAt: serverTimestamp(),
      });
    }

    return chunks.length;
  };

  // ===============================
  // Handle submit
  // ===============================
  const handlePublish = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !pdfFile || !coverFile) {
      setError("Shyiramo title, cover image na PDF");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Upload cover image
      const coverUrl = await uploadCoverToCloudinary(coverFile);

      // 2️⃣ Convert PDF to Base64
      const pdfBase64 = await fileToBase64(pdfFile);

      // 3️⃣ Create book document
      const bookRef = await addDoc(collection(db, "books"), {
        title,
        author: username,
        coverUrl,

        pdfName: pdfFile.name,
        pdfSize: pdfFile.size,
        pdfType: pdfFile.type,

        createdAt: serverTimestamp(),
      });

      // 4️⃣ Save PDF chunks
      const totalChunks = await savePdfChunks(
        bookRef.id,
        pdfBase64
      );

      // 5️⃣ Update book with chunk info
      await setDoc(
        doc(db, "books", bookRef.id),
        {
          totalChunks,
        },
        { merge: true }
      );

      alert("Igitabo cyoherejwe neza ✔️");

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
            type="text"
            placeholder="Book title"
            className={styles.inputField}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Cover */}
        <div className={styles.inputGroup}>
          <label className={styles.fileLabel}>
            <FiUpload />
            {coverFile ? coverFile.name : "Upload cover image"}
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
            {pdfFile ? pdfFile.name : "Upload PDF"}
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
// Auth guard
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
