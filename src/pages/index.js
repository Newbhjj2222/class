import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// Lazy-load izindi pages
const Profile = dynamic(() => import("./profile"));
const Login = dynamic(() => import("./login"));
const Register = dynamic(() => import("./register"));

export default function IndexPage() {
  const router = useRouter();
  const route = router.pathname;

  // Determine which component to show
  let Content;
  if (route === "/login") Content = <Login />;
  else if (route === "/register") Content = <Register />;
  else Content = <Profile />; // Default (profile page)

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar / Menu */}
      <aside className="w-1/4 bg-white border-r p-6">
        <h1 className="text-2xl font-bold mb-6">MyApp</h1>
        <ul className="space-y-3">
          <li>
            <Link href="/">👤 Profile</Link>
          </li>
          <li>
            <Link href="/login">🔑 Login</Link>
          </li>
          <li>
            <Link href="/register">📝 Register</Link>
          </li>
        </ul>
      </aside>

      {/* Main page container */}
      <main className="flex-1 p-8">{Content}</main>
    </div>
  );
}
