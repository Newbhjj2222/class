// pages/books/index.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/components/firebase";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BooksList() {
  const [books, setBooks] = useState([]);

    useEffect(() => {
        const loadBooks = async () => {
              const ref = collection(db, "books");
                    const snapshot = await getDocs(ref);

                          const items = snapshot.docs.map(doc => ({
                                  id: doc.id,
                                          ...doc.data(),
                                                }));

                                                      setBooks(items);
                                                          };

                                                              loadBooks();
                                                                }, []);

                                                                  return (
                                                                      <div style={{ padding: 30 }}>
                                                                            <h1>📚 Ibitabo</h1>

                                                                                  {books.length === 0 && <p>Loading books...</p>}

                                                                                        <ul>
                                                                                                {books.map(book => (
                                                                                                          <li key={book.id} style={{ marginBottom: 20 }}>
                                                                                                                      <Link href={`/books/${book.id}`}>
                                                                                                                                    <button style={{
                                                                                                                                                    padding: "10px 15px",
                                                                                                                                                                    cursor: "pointer",
                                                                                                                                                                                    background: "#0070f3",
                                                                                                                                                                                                    color: "white",
                                                                                                                                                                                                                    border: "none",
                                                                                                                                                                                                                                    borderRadius: 6
                                                                                                                                                                                                                                                  }}>
                                                                                                                                                                                                                                                                  Soma: {book.title}
                                                                                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                                                                                            </Link>
                                                                                                                                                                                                                                                                                                      </li>
                                                                                                                                                                                                                                                                                                              ))}
                                                                                                                                                                                                                                                                                                                    </ul>
                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                          );
                                                                                                                                                                                                                                                                                                                          }