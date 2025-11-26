"use client";

import { useState } from "react";
import styles from "./contact.module.css";
import { db } from "@/components/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Function to read cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export default function Contact() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      const username = getCookie("username") || "Unknown User";

      await addDoc(collection(db, "messages"), {
        username,
        email,
        message,
        createdAt: serverTimestamp(),
      });

      setEmail("");
      setMessage("");
      setSuccess("Your message has been sent successfully!");
    } catch (error) {
      console.error(error);
      setSuccess("Failed to send your message. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contact Us</h1>
      <p className={styles.subtitle}>
        Have questions, feedback, or suggestions? We’d love to hear from you.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email..."
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Your Message</label>
        <textarea
          placeholder="Write your message here..."
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </button>

        {success && <p className={styles.success}>{success}</p>}
      </form>
    </div>
  );
}
