// pages/index.js
import React from "react";
import Link from "next/link";
import styles from "../styles/index.module.css";
import { FiSettings, FiUserPlus, FiLogIn, FiUser } from "react-icons/fi";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <FiSettings className={styles.icon} />
        <h1 className={styles.title}>Urubuga ruracyubakwa 🏗️</h1>
        <p className={styles.text}>
          Turacyanoza byinshi... ariko hari zimwe muri pages zamaze kugeraho zuzuye 👇
        </p>

        <div className={styles.links}>
          <Link href="/register" className={styles.link}>
            <FiUserPlus /> &nbsp;Register Page
          </Link>

          <Link href="/login" className={styles.link}>
            <FiLogIn /> &nbsp;Login Page
          </Link>

          <Link href="/profile" className={styles.link}>
            <FiUser /> &nbsp;Profile Page
          </Link>
        </div>

        <footer className={styles.footer}>
          <p>© {new Date().getFullYear()} — Urubuga rwawe rurimo kubakwa 🚧</p>
        </footer>
      </div>
    </div>
  );
}
