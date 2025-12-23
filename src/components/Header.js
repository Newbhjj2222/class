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
      {/* ================= MOBILE HEADER ================= */}
      <div className={styles.mobileHeader}>
        <div className={styles.logo}>
          <span>Your</span><span>Logo</span>
        </div>

        <div className={styles.menuIcon} onClick={() => setOpen(!open)}>
          {open ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* ================= SIDEBAR ================= */}
      <aside className={`${styles.sidebar} ${open ? styles.show : ""}`}>
        <div className={styles.logo}>
          <span>Your</span><span>Logo</span>
        </div>

        {/* Sidebar content ifata space isigaye */}
        <nav className={`${styles.nav} ${styles.sidebarContent}`}>
          <Link href="/" className={styles.link}><FaHome /> Home</Link>
          <Link href="/About" className={styles.link}><FaInfoCircle /> About</Link>
          <Link href="/Contact" className={styles.link}><FaEnvelope /> Contact</Link>
          <Link href="/login" className={styles.link}><FaSignInAlt /> Login</Link>
          <Link href="/poll" className={styles.link}><FaUser /> quiz partol</Link>
          <Link href="/profile" className={styles.link}><FaUser /> Profile</Link>
          
        </nav>
      </aside>
    </>
  );
};

export default Header;
