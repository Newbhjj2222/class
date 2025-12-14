import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";
import { db } from "@/components/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const config = {
  api: {
    bodyParser: false,
  },
};

// ===============================
// CLOUDINARY CONFIG (HARDCODED)
// ===============================
cloudinary.config({
  cloud_name: "dilowy3fd",
  api_key: "584595491678387",
  api_secret: "Vdsbc1r1MdZSiwi_-Sh6aUMLLPc",
});

// ===============================
// API HANDLER
// ===============================
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: false });

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const title = fields.title;
    const author = fields.author;
    const cover = files.cover?.[0];
    const pdf = files.pdf?.[0];

    if (!title || !author || !cover || !pdf) {
      return res.status(400).json({
        error: "Missing title, author, cover or pdf",
      });
    }

    // ===============================
    // 1️⃣ UPLOAD COVER IMAGE
    // ===============================
    const coverUpload = await cloudinary.uploader.upload(
      cover.filepath,
      {
        folder: "book_covers",
        resource_type: "image",
      }
    );

    // ===============================
    // 2️⃣ UPLOAD PDF (RAW)
    // ===============================
    const pdfUpload = await cloudinary.uploader.upload(
      pdf.filepath,
      {
        folder: "book_pdfs",
        resource_type: "raw",
      }
    );

    // ===============================
    // 3️⃣ SAVE TO FIRESTORE
    // ===============================
    await addDoc(collection(db, "books"), {
      title,
      author,
      coverUrl: coverUpload.secure_url,
      pdfUrl: pdfUpload.secure_url,
      pdfName: pdf.originalFilename,
      pdfSize: pdf.size,
      createdAt: serverTimestamp(),
    });

    return res.status(200).json({
      success: true,
      message: "Book uploaded successfully",
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return res.status(500).json({
      error: "Upload failed",
    });
  }
}
