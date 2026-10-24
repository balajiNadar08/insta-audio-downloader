"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Shadows_Into_Light } from "next/font/google";

const shadows = Shadows_Into_Light({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/balaji_nadar_08/",
    path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5ZM7 4a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7ZM12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM17.25 6.2a1.05 1.05 0 1 0 0 2.1 1.05 1.05 0 0 0 0-2.1Z",
    evenOdd: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/balajiNadar08/insta-audio-downloader",
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
    evenOdd: false,
  },
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  const [videoReady, setVideoReady] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(true);

  const audioUrlRef = useRef("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.readyState >= 2) {
      setVideoReady(true);
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
    }
  }, []);

  function toggleVideo() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  function clearAudio() {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = "";
    }

    setAudioUrl("");
  }

  async function handlePaste() {
    try {
      const clipboardText = await navigator.clipboard.readText();

      if (clipboardText) {
        setUrl(clipboardText.trim());
        setError("");
      }
    } catch {
      setError(
        "Clipboard access is unavailable. Please paste your link manually.",
      );
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    clearAudio();

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url.trim());
    } catch {
      setError("Please enter a valid Instagram Reel link.");
      return;
    }

    const hostname = parsedUrl.hostname.toLowerCase();

    const isInstagram =
      hostname === "instagram.com" || hostname.endsWith(".instagram.com");

    const isValidPath = /^\/(reel|reels|p)\/[^/]+\/?$/i.test(
      parsedUrl.pathname,
    );

    if (
      parsedUrl.protocol !== "https:" ||
      !isInstagram ||
      !isValidPath ||
      parsedUrl.username ||
      parsedUrl.password ||
      parsedUrl.port
    ) {
      setError("Please enter a valid Instagram Reel link.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/extract-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: parsedUrl.toString(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.error || "Unable to extract audio. Please try again.",
        );
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("The audio file is empty.");
      }

      const objectUrl = URL.createObjectURL(blob);

      audioUrlRef.current = objectUrl;
      setAudioUrl(objectUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!audioUrl) return;

    const anchor = document.createElement("a");

    anchor.href = audioUrl;
    anchor.download = "instagram-audio.mp3";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  return (
    <main
      className={`${shadows.className} relative isolate min-h-screen overflow-hidden bg-[#4a56d4] text-[#14092e] selection:bg-[#ffd84d] selection:text-[#14092e]`}
    >
      <div
        className="fixed inset-0 -z-20 overflow-hidden bg-[#4a56d4] bg-cover bg-bottom"
        style={{ backgroundImage: "url(/bgposterillus.jpg)" }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/bgposterillus.jpg"
          aria-hidden="true"
          onLoadedData={() => setVideoReady(true)}
          onPlay={() => setVideoPlaying(true)}
          onPause={() => setVideoPlaying(false)}
          className={`absolute inset-0 h-full w-full object-cover object-bottom transition-opacity duration-1200 ease-out md:object-[50%_55%] ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src="/bgvidillus.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-[#14092e]/35" />

        <div
          className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
          style={{ backgroundImage: GRAIN, backgroundSize: "180px 180px" }}
        />
      </div>

      <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <a
          href="/"
          aria-label="InstaAud home"
          className="text-4xl text-white [text-shadow:3px_3px_0_#14092e]"
        >
          Insta<span className="text-[#ffd84d]">Aud</span>
        </a>

        <button
          type="button"
          onClick={toggleVideo}
          aria-label={
            videoPlaying ? "Pause background video" : "Play background video"
          }
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center border-2 border-[#14092e] bg-white text-[#14092e] shadow-[3px_3px_0_#14092e] transition hover:bg-[#ffd84d] active:translate-x-0.75 active:translate-y-0.75 active:shadow-none"
        >
          {videoPlaying ? (
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <rect x="6" y="5" width="4" height="14" />
              <rect x="14" y="5" width="4" height="14" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M7 4.5v15L19.5 12 7 4.5Z" />
            </svg>
          )}
        </button>
      </nav>

      <section className="relative z-10 mx-auto flex min-h-[calc(100svh-90px)] w-full max-w-7xl flex-col items-center px-5 pb-8 pt-8 sm:px-8 sm:pt-12 lg:px-12 lg:pt-14">
        <div className="max-w-4xl text-center">
          <h1 className="animate-[fadeIn_0.8s_ease-out_both] text-5xl leading-[1.1] text-white [text-shadow:4px_4px_0_#14092e] sm:text-6xl md:text-7xl lg:text-8xl">
            Download{" "}
            <span className="inline-block -rotate-2 bg-[#ffd84d] px-3 text-[#14092e] shadow-[4px_4px_0_#14092e] text-shadow-none">
              audio
            </span>{" "}
            from reels.
          </h1>

          <p className="mt-6 animate-[fadeIn_1s_ease-out_both] text-xl text-white [text-shadow:2px_2px_0_#14092e] sm:text-2xl">
            Paste a Reel link. Get the MP3.
          </p>
        </div>

        <div className="mt-9 w-full max-w-135 animate-[fadeIn_1.1s_ease-out_both] sm:mt-11">
          <div className="border-2 border-[#14092e] bg-white p-5 shadow-[8px_8px_0_#14092e] sm:p-7">
            <form onSubmit={handleSubmit} className="space-y-4">
              <label htmlFor="reel-url" className="sr-only">
                Instagram Reel link
              </label>

              <div className="flex items-center border-2 border-[#14092e] bg-[#f3f0ff] transition focus-within:bg-white focus-within:shadow-[4px_4px_0_#14092e]">
                <input
                  id="reel-url"
                  type="url"
                  value={url}
                  onChange={(event) => {
                    setUrl(event.target.value);
                    setError("");
                  }}
                  placeholder="Paste your Reel link here..."
                  required
                  disabled={loading}
                  autoComplete="url"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-xl text-[#14092e] outline-none placeholder:text-[#14092e]/45 disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={handlePaste}
                  disabled={loading}
                  className="mr-2 shrink-0 cursor-pointer border-2 border-[#14092e] bg-white px-3 py-1 text-lg text-[#14092e] transition hover:bg-[#ffd84d] disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
                >
                  Paste
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="flex w-full cursor-pointer items-center justify-center gap-3 border-2 border-[#14092e] bg-[#ffd84d] px-5 py-3 text-2xl text-[#14092e] shadow-[5px_5px_0_#14092e] transition enabled:hover:bg-[#ffe477] enabled:active:translate-x-1.25 enabled:active:translate-y-1.25 enabled:active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#14092e]/25 border-t-[#14092e]" />
                    Extracting...
                  </>
                ) : (
                  "Extract Audio"
                )}
              </button>
            </form>

            {error && (
              <p
                role="alert"
                className="mt-4 border-2 border-[#14092e] bg-[#ffd9df] p-3 text-lg leading-6 text-[#7a0f2a]"
              >
                {error}
              </p>
            )}

            {audioUrl && (
              <div className="mt-5 animate-[fadeIn_0.4s_ease-out_both] space-y-4">
                <audio controls src={audioUrl} className="h-11 w-full" />

                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex w-full cursor-pointer items-center justify-center gap-2.5 border-2 border-[#14092e] bg-[#14092e] px-4 py-3 text-xl text-white shadow-[5px_5px_0_#ffd84d] transition hover:bg-[#2a1860] active:translate-x-1.25 active:translate-y-1.25 active:shadow-none"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 4v11m0 0 4-4m-4 4-4-4M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Download MP3
                </button>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-auto w-full pt-14 sm:pt-16">
          <div className="flex  items-center justify-between gap-4 border-t-2 border-white/60 pt-5 sm:flex-row">
            <span className="text-xl text-white [text-shadow:2px_2px_0_#14092e]">
              InstaAud © {new Date().getFullYear()}
            </span>

            <div className="flex items-center gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-11 w-11 cursor-pointer items-center justify-center border-2 border-[#14092e] bg-white text-[#14092e] shadow-[3px_3px_0_#14092e] transition hover:bg-[#ffd84d] active:translate-x-0.75 active:translate-y-0.75 active:shadow-none"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      d={social.path}
                      fillRule={social.evenOdd ? "evenodd" : "nonzero"}
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}
