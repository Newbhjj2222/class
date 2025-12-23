import { useState } from "react";
import Link from "next/link";
import {
  FaHome,
  FaUser,
  FaSignInAlt,
  FaEnvelope,
  FaInfoCircle,
  FaComments,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import styles from "./Header.module.css";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className={styles.mobileHeader}>
        <div className={styles.logo}>YourLogo</div>
        <div className={styles.menuIcon} onClick={() => setOpen(!open)}>
          {open ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${open ? styles.show : ""}`}>
        <div className={styles.logo}>YourLogo</div>

        <nav className={styles.nav}>
          <Link href="/" className={styles.link}>
            <FaHome /> Home
          </Link>

          <Link href="/about" className={styles.link}>
            <FaInfoCircle /> About
          </Link>

          <Link href="/contact" className={styles.link}>
            <FaEnvelope /> Contact
          </Link>

          <Link href="/login" className={styles.link}>
            <FaSignInAlt /> Login
          </Link>

          <Link href="/profile" className={styles.link}>
            <FaUser /> Profile
          </Link>

          <Link href="/chat" className={styles.link}>
            <FaComments /> Chat
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default Header;
