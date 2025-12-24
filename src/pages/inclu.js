import Head from "next/head";

export default function IncludeLesson() {
  return (
    <>
      <Head>
        <title>Isomo ry'Inclusive Learning</title>
        <meta name="description" content="Isomo rigenewe abatabona n’abatumva" />
      </Head>

      {/* Skip link for screen readers */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 bg-black text-white p-2 z-50"
      >
        Simbuka ujye ku isomo
      </a>

      <main
        id="main"
        className="min-h-screen bg-white text-gray-900 p-6 max-w-4xl mx-auto"
      >
        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-4">
          Isomo 1: Gusoma no Kumva
        </h1>

        <p className="mb-6 text-lg leading-relaxed">
          Iri ni isomo rigenewe abanyeshuri bafite ubumuga bwo kutabona
          cyangwa kutumva. Ushobora gukoresha audio, text cyangwa video.
        </p>

        {/* AUDIO SECTION */}
        <section
          aria-labelledby="audio-heading"
          className="mb-10"
        >
          <h2 id="audio-heading" className="text-2xl font-semibold mb-2">
            🔊 Audio y'isomo
          </h2>

          <audio
            controls
            className="w-full"
            aria-label="Audio y'isomo rya Gusoma"
          >
            <source src="/audio/isomo1.mp3" type="audio/mpeg" />
            Browser yawe ntishyigikira audio.
          </audio>
        </section>

        {/* TEXT SECTION */}
        <section
          aria-labelledby="text-heading"
          className="mb-10"
        >
          <h2 id="text-heading" className="text-2xl font-semibold mb-2">
            📝 Inyandiko y'isomo
          </h2>

          <article className="text-lg leading-relaxed space-y-4">
            <p>
              Gusoma ni ingenzi cyane mu buzima bwa buri munsi.
              Bituma dushobora kumenya amakuru no kwiga ibintu bishya.
            </p>
            <p>
              Kugira ngo dusome neza, tugomba kwitondera inyuguti,
              amagambo n'interuro.
            </p>
          </article>
        </section>

        {/* VIDEO SECTION */}
        <section
          aria-labelledby="video-heading"
          className="mb-10"
        >
          <h2 id="video-heading" className="text-2xl font-semibold mb-2">
            🎥 Video y'isomo (ifite subtitles)
          </h2>

          <video
            controls
            className="w-full rounded"
            aria-describedby="video-desc"
          >
            <source src="/video/isomo1.mp4" type="video/mp4" />
            <track
              kind="subtitles"
              src="/subtitles/isomo1_rw.vtt"
              srcLang="rw"
              label="Ikinyarwanda"
              default
            />
            Browser yawe ntishyigikira video.
          </video>

          <p id="video-desc" className="mt-2 text-sm text-gray-600">
            Iyi video ifite subtitles ku bantu batumva.
          </p>
        </section>

        {/* SIGN LANGUAGE (OPTIONAL) */}
        <section
          aria-labelledby="sign-heading"
          className="mb-10"
        >
          <h2 id="sign-heading" className="text-2xl font-semibold mb-2">
            🤟 Sign Language
          </h2>

          <video controls className="w-full rounded">
            <source src="/video/isomo1_sign.mp4" type="video/mp4" />
          </video>
        </section>

        {/* NAVIGATION */}
        <nav className="flex justify-between mt-12">
          <button
            className="px-6 py-3 bg-gray-200 rounded focus:outline-none focus:ring-4 focus:ring-blue-500"
          >
            ⬅️ Isomo ribanza
          </button>

          <button
            className="px-6 py-3 bg-blue-600 text-white rounded focus:outline-none focus:ring-4 focus:ring-blue-500"
          >
            Isomo rikurikira ➡️
          </button>
        </nav>
      </main>
    </>
  );
}
