import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }) {
  return (
    <div className="appLayout">
      {/* Sidebar (Header) */}
      <Header />

      {/* Main content */}
      <main className="mainContent">
        <Component {...pageProps} />
      </main>

      {/* Footer kuri desktop izajya hejuru ya sidebar */}
      <Footer />
    </div>
  );
}
