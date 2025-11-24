import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../components/firebase";
import styles from "../styles/addbook.module.css";
import { FiBook, FiUpload } from "react-icons/fi";

export default function AddBook({ username }) {
  const [title, setTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const CLOUDINARY_UPLOAD_PRESET = "Pdfbooks";
  const CLOUDINARY_CLOUD = "dilowy3fd";

  // 👉 Generic Cloudinary uploader (image or pdf)
  const uploadCloudinary = async (file, type = "image") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    // endpoint itandukanye bitewe na file
    const endpoint =
      type === "pdf"
        ? `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/raw/upload`
        : `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`;

    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!data.secure_url) {
      console.error(data);
      throw new Error("Cloudinary upload failed");
    }

    return data.secure_url;
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !pdfFile || !coverFile) {
      setError("Please upload Title, Cover image, and PDF file.");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Upload cover image
      const coverUrl = await uploadCloudinary(coverFile, "image");

      // 2️⃣ Upload PDF file
      const pdfUrl = await uploadCloudinary(pdfFile, "pdf");

      // 3️⃣ Save metadata to Firestore
      await addDoc(collection(db, "books"), {
        title,
        coverUrl,
        pdfUrl,
        author: username,
        createdAt: serverTimestamp(),
      });

      alert("Book uploaded successfully!");

      setTitle("");
      setPdfFile(null);
      setCoverFile(null);
    } catch (err) {
      console.error(err);
      setError("Failed to upload. Please try again.");
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

        {/* Cover Image */}
        <div className={styles.inputGroup}>
          <label className={styles.fileLabel}>
            <FiUpload /> {coverFile ? coverFile.name : "Upload Cover Image"}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files[0])}
              className={styles.fileInput}
            />
          </label>
        </div>

        {/* PDF File */}
        <div className={styles.inputGroup}>
          <label className={styles.fileLabel}>
            <FiUpload /> {pdfFile ? pdfFile.name : "Upload PDF File"}
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
              className={styles.fileInput}
            />
          </label>
        </div>

        <button className={styles.buttonPrimary} type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Publish"}
        </button>
      </form>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const username = req.cookies.username || null;

  if (!username) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  return { props: { username } };
}
