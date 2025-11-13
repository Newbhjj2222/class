import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../components/firebase";
import { FiLogIn, FiEye, FiEyeOff } from "react-icons/fi";
import Cookies from "js-cookie";
import Link from "next/link";
import styles from "../styles/login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    const role = Cookies.get("role");
    if (role) window.location.href = "/";
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", userCred.user.uid));
      const data = userDoc.data();
      const username = data?.username || "User";
      const role = data?.role || "student";

      Cookies.set("username", username, { expires: 7 });
      Cookies.set("role", role, { expires: 7 });

      setLoading(false);
      alert("Login successful!");
      window.location.href = "/"; // redirect to root
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const handleResetPassword = async () => {
    if (!email) return setError("Please enter your email to reset password.");
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Login</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.formWrapper}>
        <input
          className={styles.inputField}
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <div className={styles.passwordWrapper}>
          <input
            className={styles.inputField}
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <span className={styles.passwordToggle} onClick={() => setShowPass(!showPass)}>
            {showPass ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>
        <button
          className={styles.buttonPrimary}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : <><FiLogIn /> Login</>}
        </button>
        <button
          className={styles.buttonReset}
          type="button"
          onClick={handleResetPassword}
        >
          Reset Password
        </button>
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Not registered?{" "}
          <Link href="/register" style={{ color: "#2563eb", fontWeight: "600" }}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
