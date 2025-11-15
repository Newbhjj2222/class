import "@/styles/globals.css";
import { pdfjs } from "react-pdf";

// PDF.js worker (IMPORTANT)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
