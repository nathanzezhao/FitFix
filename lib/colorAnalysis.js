// Two paths to an undertone:
//   1) Quiz (vein color + jewelry preference + sun reaction)
//   2) Photo (sample skin-ish pixels, classify warmth vs. rosiness)

export function undertoneFromQuiz({ vein, jewelry, sun }) {
  let warm = 0;
  let cool = 0;
  if (vein === "green") warm++;
  if (vein === "blue") cool++;
  if (jewelry === "gold") warm++;
  if (jewelry === "silver") cool++;
  if (sun === "tan") warm++;
  if (sun === "burn") cool++;
  if (warm > cool + 0) return "warm";
  if (cool > warm + 0) return "cool";
  return "neutral";
}

// img: an already-loaded HTMLImageElement. Returns { undertone, rgb, confidence }.
export function analyzeUndertoneFromImage(img) {
  if (typeof document === "undefined") {
    return { undertone: "neutral", rgb: [0, 0, 0], confidence: 0 };
  }
  const canvas = document.createElement("canvas");
  const w = (canvas.width = img.naturalWidth || img.width);
  const h = (canvas.height = img.naturalHeight || img.height);
  if (!w || !h) return { undertone: "neutral", rgb: [0, 0, 0], confidence: 0 };

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  // Sample a rectangle roughly where a centered face sits.
  const x0 = Math.floor(w * 0.3);
  const y0 = Math.floor(h * 0.2);
  const sw = Math.floor(w * 0.4);
  const sh = Math.floor(h * 0.45);
  const data = ctx.getImageData(x0, y0, sw, sh).data;

  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  // step by 16 to skip pixels (speed)
  for (let i = 0; i < data.length; i += 16) {
    const rp = data[i];
    const gp = data[i + 1];
    const bp = data[i + 2];
    // loose skin-tone filter
    const isSkinish =
      rp > 60 &&
      gp > 30 &&
      bp > 15 &&
      rp > bp &&
      Math.abs(rp - gp) > 5 &&
      rp - bp < 140; // drop super-red (lips/lighting)
    if (isSkinish) {
      r += rp;
      g += gp;
      b += bp;
      n++;
    }
  }

  if (n < 40) {
    return { undertone: "neutral", rgb: [0, 0, 0], confidence: 0 };
  }

  r = r / n;
  g = g / n;
  b = b / n;

  const yellow = (r + g) / 2 - b; // warmth signal
  const rosy = r - g; // rosiness signal

  let undertone = "neutral";
  if (yellow > 28 && rosy < 22) undertone = "warm";
  else if (rosy > 22 && yellow < 24) undertone = "cool";
  else if (yellow > 32) undertone = "warm";
  else if (yellow < 14) undertone = "cool";

  return {
    undertone,
    rgb: [Math.round(r), Math.round(g), Math.round(b)],
    confidence: Math.min(1, n / 400),
  };
}
