import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../components/firebase";
import Cookies from "js-cookie";
import styles from "../styles/addbook.module.css";
import { FiBook, FiLink, FiFileText, FiUpload } from "react-icons/fi";

export default function AddBook({ username }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || (!url && !file)) {
      setError("Please provide a title and either a URL or a file.");
      return;
    }

    setLoading(true);
    try {
      // Convert file to URL using local URL (you can later integrate Firebase Storage)
      const fileUrl = file ? URL.createObjectURL(file) : url;

      await addDoc(collection(db, "books"), {
        title,
        url: fileUrl,
        author: username,
        createdAt: serverTimestamp(),
      });

      setLoading(false);
      alert("Book published successfully!");
      setTitle("");
      setUrl("");
      setFile(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Add a Book</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.formWrapper} onSubmit={handlePublish}>
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

        <div className={styles.inputGroup}>
          <FiLink className={styles.icon} />
          <input
            className={styles.inputField}
            type="text"
            placeholder="Book URL (optional if uploading file)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <FiFileText className={styles.icon} />
          <label className={styles.fileLabel}>
            <FiUpload /> {file ? file.name : "Upload PDF file"}
            <input type="file" accept=".pdf" onChange={handleFileChange} className={styles.fileInput} />
          </label>
        </div>

        <button className={styles.buttonPrimary} type="submit" disabled={loading}>
          {loading ? "Publishing..." : "Publish"}
        </button>
      </form>
    </div>
  );
}

// SSR: fetch username from cookies
export async function getServerSideProps({ req }) {
  const username = req.cookies.username || null;
  if (!username) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  return { props: { username } };
}
