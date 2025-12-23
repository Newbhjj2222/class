import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaHeart,
} from "react-icons/fa";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* Top section */}
      <div className={styles.top}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span>Your</span>
            <span>Logo</span>
          </div>
          <p>
            A modern platform for stories, books, and meaningful conversations.
          </p>
        </div>

        {/* Links */}
        <div className={styles.links}>
          <h4>Quick Links</h4>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/chat">Chat</Link>
        </div>

        {/* Social */}
        <div className={styles.social}>
          <h4>Follow Us</h4>
          <div className={styles.icons}>
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className={styles.bottom}>
        <p>
          © {new Date().getFullYear()} YourLogo. Made with{" "}
          <FaHeart className={styles.heart} /> in Netweb
        </p>
      </div>
    </footer>
  );
};

export default Footer;
