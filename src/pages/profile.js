import styles from "../styles/profile.module.css";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db, auth, storage } from "../components/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { signOut } from "firebase/auth";
import { FiUser, FiMail, FiShield, FiCamera, FiCheck, FiX } from "react-icons/fi";
import Cookies from "js-cookie";
import { useState } from "react";

export default function Profile({ userDataServer }) {
  // ✅ Fallbacks zikumira undefined errors
  const [userData, setUserData] = useState(userDataServer || {});
  const [editField, setEditField] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(userDataServer?.photoURL || "");

  // ✅ Early return if no user data (safe)
  if (!userDataServer || !userData.username) {
    return <p className={styles.loading}>User not found or not logged in</p>;
  }

  // ✏️ Handle editing
  const handleFieldClick = (field) => {
    setEditField(field);
    setTempValue(userData[field] || "");
  };

  const handleSaveField = async (field) => {
    if (!tempValue) return;
    setLoading(true);
    try {
      const userRef = doc(db, "users", userData.id);
      await updateDoc(userRef, { [field]: tempValue });
      setUserData((prev) => ({ ...prev, [field]: tempValue }));
      setEditField("");
      alert(`${field} updated successfully!`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
    setLoading(false);
  };

  const handleCancelField = () => {
    setEditField("");
  };

  // 📸 Handle photo upload
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const storageRef = ref(storage, `profile_pictures/${userData.id}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      const userRef = doc(db, "users", userData.id);
      await updateDoc(userRef, { photoURL: url });

      setPhotoPreview(url);
      setUserData((prev) => ({ ...prev, photoURL: url }));
    } catch (err) {
      console.error("Photo upload failed:", err);
      alert(err.message);
    }
    setLoading(false);
  };

  // 🚪 Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Cookies.remove("username");
      Cookies.remove("role");
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
    <div className={styles.container}>
      <h2 className={styles.title}>Profile</h2>

      {/* Profile Picture */}
      <div className={styles.profilePicWrapper}>
        {photoPreview ? (
          <img
            src={photoPreview}
            alt="Profile"
            className={styles.profilePic}
          />
        ) : (
          <div className={styles.profileDraft}>
            <FiUser size={60} />
          </div>
        )}
        <label className={styles.fileLabel}>
          <FiCamera /> Change Photo
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className={styles.fileInput}
          />
        </label>
      </div>

      {/* Info Fields */}
      <div className={styles.formWrapper}>
        {/* Username */}
        <div className={styles.fieldWrapper}>
          <FiUser
            className={styles.icon}
            onClick={() => handleFieldClick("username")}
          />
          {editField === "username" ? (
            <>
              <input
                className={styles.inputField}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
              />
              <button
                className={styles.buttonPrimary}
                onClick={() => handleSaveField("username")}
                disabled={loading}
              >
                <FiCheck />
              </button>
              <button
                className={styles.buttonReset}
                onClick={handleCancelField}
              >
                <FiX />
              </button>
            </>
          ) : (
            <span className={styles.fieldValue}>
              {userData?.username || "—"}
            </span>
          )}
        </div>

        {/* Email */}
        <div className={styles.fieldWrapper}>
          <FiMail
            className={styles.icon}
            onClick={() => handleFieldClick("email")}
          />
          {editField === "email" ? (
            <>
              <input
                className={styles.inputField}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
              />
              <button
                className={styles.buttonPrimary}
                onClick={() => handleSaveField("email")}
                disabled={loading}
              >
                <FiCheck />
              </button>
              <button
                className={styles.buttonReset}
                onClick={handleCancelField}
              >
                <FiX />
              </button>
            </>
          ) : (
            <span className={styles.fieldValue}>
              {userData?.email || "—"}
            </span>
          )}
        </div>

        {/* Role */}
        <div className={styles.fieldWrapper}>
          <FiShield className={styles.icon} />
          <span className={styles.fieldValue}>
            {userData?.role || "—"}
          </span>
        </div>

        <button
          className={styles.buttonReset}
          onClick={handleLogout}
          disabled={loading}
        >
          Logout
        </button>
      </div>
    </div>
                  </>
  );
}

// ✅ Server-side fetching
export async function getServerSideProps({ req }) {
  const cookieUsername = req.cookies.username || null;

  if (!cookieUsername) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  let userData = null;
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", cookieUsername));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      const data = docSnap.data();

      // Handle Firestore timestamps
      if (data.createdAt?.toDate) {
        data.createdAt = data.createdAt.toDate().toISOString();
      }

      userData = { ...data, id: docSnap.id };
    }
  } catch (err) {
    console.error("Error fetching user data:", err);
  }

  return { props: { userDataServer: userData || null } };
}
