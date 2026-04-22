"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/store";
import { analyzeUndertoneFromImage } from "@/lib/colorAnalysis";
import { PALETTES } from "@/lib/palettes";

export default function CameraPage() {
  const { profile, update } = useProfile();
  const router = useRouter();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState(null);
  const [photo, setPhoto] = useState(profile.selfieDataUrl);
  const [photoResult, setPhotoResult] = useState(null);

  useEffect(() => {
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startCamera() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOn(true);
      // Video element is always mounted, so the ref is available here.
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch {
          // autoplay policies vary; muted+autoPlay attributes should cover.
        }
      }
    } catch (e) {
      setError(e.message || "Camera access denied.");
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
  }

  function captureSelfie() {
    const v = videoRef.current;
    if (!v) return;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(v, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPhoto(dataUrl);
    update({ selfieDataUrl: dataUrl });
    stopCamera();

    // run analysis
    const img = new Image();
    img.onload = () => {
      const result = analyzeUndertoneFromImage(img);
      setPhotoResult(result);
      update({ undertoneFromPhoto: result.undertone });
    };
    img.src = dataUrl;
  }

  function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setPhoto(dataUrl);
      update({ selfieDataUrl: dataUrl });
      const img = new Image();
      img.onload = () => {
        const result = analyzeUndertoneFromImage(img);
        setPhotoResult(result);
        update({ undertoneFromPhoto: result.undertone });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  const quizTone = profile.undertoneFromQuiz;
  const photoTone = photoResult?.undertone || profile.undertoneFromPhoto;
  const finalTone = profile.undertone;

  return (
    <main>
      <header className="flex items-center justify-between">
        <Link href="/quiz" className="text-sm text-ink/60 hover:text-ink">← Quiz</Link>
        <Link href="/results" className="text-sm text-ink/60 hover:text-ink">Skip →</Link>
      </header>

      <section className="mt-10 max-w-2xl">
        <p className="label">Optional</p>
        <h2 className="display mt-2 text-4xl md:text-5xl">Confirm your palette.</h2>
        <p className="mt-3 text-ink/70">
          Your quiz said{" "}
          <span className="font-medium text-ink">{quizTone || "—"}</span>. Take
          a selfie (or upload one) for a second read. The photo stays in your
          browser.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="card">
            <div className="label">Camera</div>
            <div className="relative mt-3 aspect-[3/4] overflow-hidden rounded-xl bg-ink/90">
              {/* Always mounted so the ref is ready before we attach the stream */}
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`absolute inset-0 h-full w-full object-cover ${
                  cameraOn ? "" : "hidden"
                }`}
              />
              {!cameraOn && photo && (
                <img
                  src={photo}
                  alt="selfie"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              {!cameraOn && !photo && (
                <div className="absolute inset-0 flex items-center justify-center text-cream/60 text-sm">
                  No photo yet
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {!cameraOn && (
                <button onClick={startCamera} className="btn-primary">
                  {photo ? "Retake" : "Start camera"}
                </button>
              )}
              {cameraOn && (
                <>
                  <button onClick={captureSelfie} className="btn-primary">
                    Capture
                  </button>
                  <button onClick={stopCamera} className="btn-ghost">
                    Cancel
                  </button>
                </>
              )}
              <label className="btn-ghost cursor-pointer">
                Upload instead
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
            </div>
            {error && <p className="mt-3 text-sm text-rust">{error}</p>}
          </div>

          <div className="card">
            <div className="label">Reads</div>
            <Row label="Quiz says" value={quizTone} />
            <Row label="Photo says" value={photoTone} />
            {photoResult && (
              <div className="mt-4 flex items-center gap-3 text-xs text-ink/60">
                <div
                  className="h-8 w-8 rounded-full border border-ink/15"
                  style={{
                    background: `rgb(${photoResult.rgb.join(",")})`,
                  }}
                />
                Sampled skin RGB ·{" "}
                {Math.round((photoResult.confidence || 0) * 100)}% confidence
              </div>
            )}

            <div className="mt-6">
              <div className="label">Final (override here)</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["warm", "cool", "neutral"].map((t) => (
                  <button
                    key={t}
                    onClick={() => update({ undertone: t })}
                    className={`chip capitalize ${
                      finalTone === t
                        ? "chip-active"
                        : ""
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {!finalTone && (quizTone || photoTone) && (
                <button
                  onClick={() =>
                    update({ undertone: photoTone || quizTone })
                  }
                  className="mt-3 text-xs text-ink/60 underline"
                >
                  Accept the {photoTone ? "photo" : "quiz"} read
                </button>
              )}
            </div>
          </div>
        </div>

        {finalTone && (
          <div className="mt-8 card">
            <div className="label">Your palette · {PALETTES[finalTone].name}</div>
            <p className="mt-2 text-sm text-ink/70">
              {PALETTES[finalTone].blurb}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {PALETTES[finalTone].hexes.map((h) => (
                <div
                  key={h}
                  className="h-10 w-10 rounded-full border border-ink/10"
                  style={{ background: h }}
                  title={h}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-between">
          <Link href="/quiz" className="btn-ghost">← Back</Link>
          <button
            onClick={() => router.push("/results")}
            className="btn-primary"
            disabled={!finalTone}
          >
            See my outfits →
          </button>
        </div>
      </section>
    </main>
  );
}

function Row({ label, value }) {
  return (
    <div className="mt-3 flex items-center justify-between text-sm">
      <span className="text-ink/60">{label}</span>
      <span className="font-medium capitalize">{value || "—"}</span>
    </div>
  );
}
