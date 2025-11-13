import Link from "next/link";
import { useRouter } from "next/router";

export default function IndexPage({ children }) {
  const router = useRouter();

  // Function yo kugenzura aho uri
  const currentRoute = router.pathname;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-100 p-6">
        <h1 className="text-xl font-bold mb-4">MyApp</h1>
        <ul className="space-y-3">
          <li><Link href="/">🏠 Profile</Link></li>
          <li><Link href="/login">🔑 Login</Link></li>
          <li><Link href="/register">📝 Register</Link></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {currentRoute === "/" && <ProfileDraft />}
        {children}
      </main>
    </div>
  );
}

// Draft Profile view
function ProfileDraft() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Profile (Draft)</h2>
      <p className="text-gray-700">Iyi ni preview y’umwirondoro wawe...</p>
    </div>
  );
}
