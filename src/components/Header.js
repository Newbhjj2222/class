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

  const closeMenu = () => setOpen(false);

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}
      <header className={styles.mobileHeader}>
        <div className={styles.logo}>
          <span>Your</span>
          <span>Logo</span>
        </div>

        <div
          className={styles.menuIcon}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <FaTimes /> : <FaBars />}
        </div>
      </header>

      {/* ================= SIDEBAR ================= */}
      <aside className={`${styles.sidebar} ${open ? styles.show : ""}`}>
        {/* Logo */}
        <div className={styles.logo}>
          <span>Your</span>
          <span>Logo</span>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <Link href="/" className={styles.link} onClick={closeMenu}>
            <FaHome />
            <span>Home</span>
          </Link>

          <Link href="/about" className={styles.link} onClick={closeMenu}>
            <FaInfoCircle />
            <span>About</span>
          </Link>

          <Link href="/contact" className={styles.link} onClick={closeMenu}>
            <FaEnvelope />
            <span>Contact</span>
          </Link>

          <Link href="/login" className={styles.link} onClick={closeMenu}>
            <FaSignInAlt />
            <span>Login</span>
          </Link>

          <Link href="/profile" className={styles.link} onClick={closeMenu}>
            <FaUser />
            <span>Profile</span>
          </Link>

          <Link href="/chat" className={styles.link} onClick={closeMenu}>
            <FaComments />
            <span>Chat</span>
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default Header;
