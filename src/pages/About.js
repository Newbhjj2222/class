// pages/about.js
import React from "react";
import styles from "../styles/about.module.css";
import { FaBookOpen, FaBullseye, FaEye } from "react-icons/fa";

export default function About() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-4">
          <FaBookOpen className={styles.icon} />
          About Our E-Library System
        </h1>

        <p className={styles.text}>
          Welcome to our E-Library System — a secure and modern digital platform designed to provide
          controlled, reliable, and educational access to digital reading materials within a correctional
          environment. The system supports users inside the facility, including juveniles, inmates,
          correctional officers, institutional staff, and administration.
        </p>

        <p className={styles.text}>
          Our E-Library enables users to explore a carefully curated collection of books, academic
          resources, vocational training materials, and rehabilitation-focused content. With organized
          categories and an easy-to-use interface, users can access the information they need in a safe
          and structured manner.
        </p>

        <p className={styles.text}>
          This system was developed to promote digital learning, support personal development, and offer
          meaningful educational opportunities even within restricted environments. It also assists
          correctional officers and staff in managing digital resources efficiently and securely.
        </p>

        {/* Mission */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2">
            <FaBullseye className={styles.iconSmall} /> Mission
          </h2>
          <p className={styles.text}>
            To provide secure, meaningful, and accessible digital learning resources that support
            rehabilitation, education, and personal development within the correctional facility.
          </p>
        </div>

        {/* Vision */}
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2">
            <FaEye className={styles.iconSmall} /> Vision
          </h2>
          <p className={styles.text}>
            To become a trusted digital library solution that empowers individuals in correctional
            institutions through education, knowledge, and positive transformation.
          </p>
        </div>
      </div>
    </div>
  );
}
