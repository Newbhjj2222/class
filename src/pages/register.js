import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../components/firebase";
import { FiUserPlus, FiEye, FiEyeOff } from "react-icons/fi";
import Cookies from "js-cookie";
import Link from "next/link";
import styles from "../styles/login.module.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const roleCookie = Cookies.get("role");
    if (roleCookie) window.location.href = "/";
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1️⃣ Create user in Firebase Auth
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // 2️⃣ Save user info in Firestore
      await setDoc(doc(db, "users", userCred.user.uid), {
        username,
        email,
        role,
        createdAt: new Date()
      });

      // 3️⃣ Set cookies
      Cookies.set("username", username, { expires: 7 });
      Cookies.set("role", role, { expires: 7 });

      setLoading(false);
      alert("Registration successful!");

      // 4️⃣ Redirect after everything finished
      window.location.href = "/";
    } catch (err) {
      console.error("Registration error:", err);
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Register</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.formWrapper}>
        <input
          className={styles.inputField}
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
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
        <select
          className={styles.selectField}
          value={role}
          onChange={e => setRole(e.target.value)}
          required
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <button
          className={styles.buttonPrimary}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : <><FiUserPlus /> Register</>}
        </button>
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#2563eb", fontWeight: "600" }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
