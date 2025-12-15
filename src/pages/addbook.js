import styles from "../styles/addbook.module.css";
import { FiBook, FiUpload } from "react-icons/fi";
import { useState } from "react";

export default function AddBook({ username }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePublish(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.target);

    try {
      const res = await fetch("/api/upload-book", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("Igitabo cyoherejwe neza ✔️");
      e.target.reset();
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
        <div className={styles.inputGroup}>
          <FiBook />
          <input name="title" placeholder="Book title" required />
        </div>

        <input type="hidden" name="author" value={username} />

        <label className={styles.fileLabel}>
          <FiUpload /> Upload cover image
          <input type="file" name="cover" accept="image/*" required />
        </label>

        <label className={styles.fileLabel}>
          <FiUpload /> Upload PDF
          <input type="file" name="pdf" accept="application/pdf" required />
        </label>

        <button disabled={loading}>
          {loading ? "Uploading..." : "Publish"}
        </button>
      </form>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const username = req.cookies.username || null;

  if (!username) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  return { props: { username } };
    }
