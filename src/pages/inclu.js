import { useRef } from "react";

export default function TTSLesson() {
  const textRef = useRef();

  const readText = () => {
    const text = textRef.current.innerText;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "rw-RW"; // Ikinyarwanda
    speechSynthesis.speak(utterance);
  };

  const stopReading = () => {
    speechSynthesis.cancel();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Isomo 1: Gusoma no Kumva</h1>

      <article ref={textRef} className="text-lg leading-relaxed mb-6">
        <p>
          Gusoma ni ingenzi cyane mu buzima bwa buri munsi. Bituma dushobora kumenya amakuru no kwiga ibintu bishya.
        </p>
        <p>
          Kugira ngo dusome neza, tugomba kwitondera inyuguti, amagambo n'interuro.
        </p>
      </article>

      <div className="space-x-4">
        <button
          onClick={readText}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Soma Text
        </button>
        <button
          onClick={stopReading}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Hagarika
        </button>
      </div>
    </div>
  );
}
