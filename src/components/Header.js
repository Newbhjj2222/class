import { useState, useEffect } from "react";
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

  // 🔽 IYI NI YO CODE WAVUZE
  const [sidebarHeight, setSidebarHeight] = useState("100vh");

  useEffect(() => {
    const updateHeight = () => {
      const footer = document.querySelector("footer");
      const footerHeight = footer ? footer.offsetHeight : 0;

      setSidebarHeight(`calc(100vh - ${footerHeight}px)`);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);
  // 🔼 IRANGIYE HANO

  return (
    <>
      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <div className={styles.logo}>
          <span>Your</span><span>Logo</span>
        </div>
        <div className={styles.menuIcon} onClick={() => setOpen(!open)}>
          {open ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${open ? styles.show : ""}`}
        style={{ height: sidebarHeight }}   // 🔴 HANO NI HO IKORA
      >
        <div className={styles.logo}>
          <span>Your</span><span>Logo</span>
        </div>

        <nav className={styles.nav}>
          <Link href="/" className={styles.link}><FaHome /> Home</Link>
          <Link href="/about" className={styles.link}><FaInfoCircle /> About</Link>
          <Link href="/contact" className={styles.link}><FaEnvelope /> Contact</Link>
          <Link href="/login" className={styles.link}><FaSignInAlt /> Login</Link>
          <Link href="/profile" className={styles.link}><FaUser /> Profile</Link>
          <Link href="/chat" className={styles.link}><FaComments /> Chat</Link>
        </nav>
      </aside>
    </>
  );
};

export default Header;
