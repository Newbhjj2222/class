import { useState } from "react";
import styles from "../styles/contact.module.css";
import { db } from "../components/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Cookies from "js-cookie";
import { FiMail, FiUser, FiMessageCircle, FiSend } from "react-icons/fi";

export default function Contact() {
  const username = Cookies.get("username") || "Guest";

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      await addDoc(collection(db, "messages"), {
        username,
        email,
        message,
        createdAt: serverTimestamp(),
      });

      setEmail("");
      setMessage("");
      setSuccess("Message sent successfully!");
    } catch (err) {
      console.error("Error sending message: ", err);
      setSuccess("Failed to send. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contact Us</h1>
      <p className={styles.subtitle}>
        Feel free to reach out for help, suggestions or any information.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          <FiUser className={styles.icon} /> Username
        </label>
        <input type="text" value={username} className={styles.input} disabled />

        <label className={styles.label}>
          <FiMail className={styles.icon} /> Email
        </label>
        <input
          type="email"
          placeholder="Enter your email..."
          required
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className={styles.label}>
          <FiMessageCircle className={styles.icon} /> Message
        </label>
        <textarea
          placeholder="Write your message..."
          required
          className={styles.textarea}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <button
          type="submit"
          className={loading ? styles.buttonDisabled : styles.button}
          disabled={loading}
        >
          <FiSend />
          {loading ? "Sending..." : "Send Message"}
        </button>

        {success && <p className={styles.success}>{success}</p>}
      </form>
    </div>
  );
}
