import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../components/firebase";
import styles from "../styles/addbook.module.css";
import { FiBook, FiUpload } from "react-icons/fi";
import { supabase } from "../components/supabase"; // supabase client

export default function AddBook({ username }) {
  const [title, setTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const CLOUDINARY_UPLOAD_PRESET = "Pdfbooks";
  const CLOUDINARY_CLOUD = "dilowy3fd";

  // 👉 Upload cover image to Cloudinary
  const uploadCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await res.json();

      if (!data.secure_url) {
        console.error("Cloudinary upload error:", data);
        throw new Error("Cloudinary upload failed: " + (data.error?.message || "Unknown error"));
      }

      return data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload exception:", err);
      throw new Error("Cloudinary upload failed: " + err.message);
    }
  };

  // 👉 Upload PDF to Supabase Storage (bucket `class`)
  const uploadPDFtoSupabase = async (file) => {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      console.log("Uploading PDF file to Supabase:", fileName);

      const { data, error } = await supabase.storage
        .from("class") // bucket name
        .upload(fileName, file);

      if (error) {
        console.error("Supabase upload error:", error);
        throw new Error("Supabase upload failed: " + error.message);
      }

      const { data: publicUrlData, error: urlError } = supabase.storage
        .from("class")
        .getPublicUrl(fileName);

      if (urlError) {
        console.error("Supabase getPublicUrl error:", urlError);
        throw new Error("Failed to get public URL from Supabase: " + urlError.message);
      }

      console.log("PDF public URL:", publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (err) {
      console.error("Supabase upload exception:", err);
      throw new Error(err.message);
    }
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
      const coverUrl = await uploadCloudinary(coverFile);

      // 2️⃣ Upload PDF
      const pdfUrl = await uploadPDFtoSupabase(pdfFile);

      // 3️⃣ Save metadata to Firestore
      await addDoc(collection(db, "books"), {
        title,
        coverUrl,
        pdfUrl,
        author: username,
        createdAt: serverTimestamp(),
      });

      alert("Book uploaded successfully!");

      // Reset form
      setTitle("");
      setPdfFile(null);
      setCoverFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Failed to upload: " + err.message);
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

// Check username from cookies
export async function getServerSideProps({ req }) {
  const username = req.cookies.username || null;

  if (!username) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  return { props: { username } };
}
