// Minimal SVG silhouettes, one per garment subtype, tinted with the item's
// real color. We use these instead of product photos because scraping
// retailer images would violate their ToS and the URLs rot over time.
//
// Every icon fits inside its own viewBox, scales to 100% of its container,
// and uses a single fill (the garment color) + a thin ink stroke.

const STROKE = "rgba(15,14,12,0.35)";
const STROKE_LIGHT = "rgba(15,14,12,0.5)";
const W = 1.5;

const wrap = (children, vb = "0 0 100 120") => (
  <svg
    viewBox={vb}
    className="h-full w-full"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >
    {children}
  </svg>
);

function Tee({ color }) {
  return wrap(
    <>
      <path
        d="M30,14 L12,22 L5,45 L26,48 L26,108 Q26,113 31,113 L69,113 Q74,113 74,108 L74,48 L95,45 L88,22 L70,14 Q50,32 30,14 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      <path
        d="M32,15 Q50,30 68,15"
        fill="none"
        stroke={STROKE_LIGHT}
        strokeWidth="1"
      />
    </>
  );
}

function LongSleeveTop({ color, knit }) {
  return wrap(
    <>
      <path
        d="M30,14 L12,22 L6,78 L22,82 L26,62 L26,108 Q26,113 31,113 L69,113 Q74,113 74,108 L74,62 L78,82 L94,78 L88,22 L70,14 Q50,32 30,14 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      <path
        d="M32,15 Q50,30 68,15"
        fill="none"
        stroke={STROKE_LIGHT}
        strokeWidth="1"
      />
      {knit && (
        <>
          <line
            x1="6"
            y1="78"
            x2="22"
            y2="82"
            stroke={STROKE_LIGHT}
            strokeWidth="0.8"
          />
          <line
            x1="78"
            y1="82"
            x2="94"
            y2="78"
            stroke={STROKE_LIGHT}
            strokeWidth="0.8"
          />
          <line
            x1="26"
            y1="108"
            x2="74"
            y2="108"
            stroke={STROKE_LIGHT}
            strokeWidth="0.8"
          />
        </>
      )}
    </>
  );
}

function Shirt({ color }) {
  return wrap(
    <>
      {/* body + sleeves */}
      <path
        d="M30,14 L12,22 L6,78 L22,82 L26,62 L26,108 Q26,113 31,113 L69,113 Q74,113 74,108 L74,62 L78,82 L94,78 L88,22 L70,14 L58,24 L50,30 L42,24 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* spread collar — two triangular lapels */}
      <path
        d="M42,24 L36,38 L50,32 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M58,24 L64,38 L50,32 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* button placket */}
      <line
        x1="50"
        y1="32"
        x2="50"
        y2="108"
        stroke={STROKE_LIGHT}
        strokeWidth="0.8"
      />
      {/* buttons */}
      <circle cx="50" cy="46" r="1.1" fill={STROKE} />
      <circle cx="50" cy="60" r="1.1" fill={STROKE} />
      <circle cx="50" cy="74" r="1.1" fill={STROKE} />
      <circle cx="50" cy="88" r="1.1" fill={STROKE} />
      <circle cx="50" cy="102" r="1.1" fill={STROKE} />
      {/* chest pocket */}
      <path
        d="M32,50 L42,50 L42,62 L32,62 Z"
        fill="none"
        stroke={STROKE_LIGHT}
        strokeWidth="0.8"
      />
      {/* cuffs */}
      <line x1="6" y1="74" x2="22" y2="78" stroke={STROKE_LIGHT} strokeWidth="0.9" />
      <line x1="78" y1="78" x2="94" y2="74" stroke={STROKE_LIGHT} strokeWidth="0.9" />
      {/* hem */}
      <line x1="26" y1="108" x2="74" y2="108" stroke={STROKE_LIGHT} strokeWidth="0.7" />
    </>
  );
}

function Dress({ color }) {
  return wrap(
    <>
      <path
        d="M32,14 L18,22 L14,40 L22,44 L22,56 L10,116 L90,116 L78,56 L78,44 L86,40 L82,22 L68,14 Q50,32 32,14 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      <line
        x1="22"
        y1="56"
        x2="78"
        y2="56"
        stroke={STROKE_LIGHT}
        strokeWidth="0.8"
      />
    </>
  );
}

function Pants({ color }) {
  return wrap(
    <>
      {/* body — slight taper from hip to ankle */}
      <path
        d="M22,10 L78,10 L80,32 L77,116 Q77,119 74,119 L58,119 Q55,119 55,116 L51,62 Q50,58 49,62 L45,116 Q45,119 42,119 L26,119 Q23,119 23,116 L20,32 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* waistband */}
      <path
        d="M22,10 L78,10 L79,20 L21,20 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* button + fly */}
      <circle cx="50" cy="16" r="1.6" fill={STROKE} />
      <line
        x1="50"
        y1="20"
        x2="50"
        y2="40"
        stroke={STROKE_LIGHT}
        strokeWidth="0.8"
        strokeDasharray="1.5 2.5"
      />
      {/* belt loops */}
      <line x1="30" y1="10" x2="30" y2="20" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      <line x1="50" y1="10" x2="50" y2="15" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      <line x1="70" y1="10" x2="70" y2="20" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      {/* slant front pockets */}
      <path d="M24,22 Q30,30 34,40" fill="none" stroke={STROKE_LIGHT} strokeWidth="0.9" />
      <path d="M76,22 Q70,30 66,40" fill="none" stroke={STROKE_LIGHT} strokeWidth="0.9" />
      {/* inseam */}
      <line
        x1="50"
        y1="62"
        x2="50"
        y2="116"
        stroke={STROKE_LIGHT}
        strokeWidth="0.7"
      />
      {/* cuff lines */}
      <line x1="23" y1="112" x2="46" y2="112" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      <line x1="54" y1="112" x2="77" y2="112" stroke={STROKE_LIGHT} strokeWidth="0.8" />
    </>
  );
}

function Shorts({ color }) {
  return wrap(
    <>
      <path
        d="M24,10 L76,10 L78,72 Q78,75 75,75 L58,75 Q55,75 55,72 L51,50 Q50,46 49,50 L45,72 Q45,75 42,75 L25,75 Q22,75 22,72 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      <line
        x1="24"
        y1="18"
        x2="76"
        y2="18"
        stroke={STROKE_LIGHT}
        strokeWidth="0.8"
      />
    </>,
    "0 0 100 85"
  );
}

function Skirt({ color }) {
  return wrap(
    <>
      <path
        d="M32,14 L68,14 L86,92 Q86,95 83,95 L17,95 Q14,95 14,92 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      <line
        x1="32"
        y1="18"
        x2="68"
        y2="18"
        stroke={STROKE_LIGHT}
        strokeWidth="0.8"
      />
    </>,
    "0 0 100 100"
  );
}

function Sneaker({ color }) {
  return wrap(
    <>
      {/* upper — taller at the heel (left), lower at the toe (right) */}
      <path
        d="M8,38 L8,22 Q10,10 22,8 Q26,8 28,14 L34,16 Q36,10 44,10 L54,10 Q62,12 66,20 L82,24 Q92,26 92,34 L92,38 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* eyestay — where laces live */}
      <path
        d="M34,16 Q38,20 40,30 L56,30 Q62,22 66,20"
        fill="none"
        stroke={STROKE_LIGHT}
        strokeWidth="0.9"
      />
      {/* simple horizontal laces */}
      <line x1="41" y1="22" x2="58" y2="22" stroke={STROKE_LIGHT} strokeWidth="0.9" />
      <line x1="41" y1="26" x2="57" y2="26" stroke={STROKE_LIGHT} strokeWidth="0.9" />
      <line x1="42" y1="30" x2="56" y2="30" stroke={STROKE_LIGHT} strokeWidth="0.9" />
      {/* heel counter seam */}
      <path d="M10,28 Q10,14 22,12" fill="none" stroke={STROKE_LIGHT} strokeWidth="0.9" />
      {/* swoosh / side stripe */}
      <path
        d="M22,32 Q48,22 80,30"
        fill="none"
        stroke={STROKE_LIGHT}
        strokeWidth="1.1"
      />
      {/* midsole */}
      <path
        d="M6,38 L94,38 L94,44 Q94,46 92,46 L8,46 Q6,46 6,44 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* midsole top seam */}
      <line x1="6" y1="41" x2="94" y2="41" stroke={STROKE} strokeWidth="0.7" />
      {/* outsole */}
      <path
        d="M8,46 L92,46 L90,50 Q88,52 86,52 L14,52 Q12,52 10,50 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* outsole tread hints */}
      <line x1="24" y1="48" x2="24" y2="52" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      <line x1="40" y1="48" x2="40" y2="52" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      <line x1="56" y1="48" x2="56" y2="52" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      <line x1="72" y1="48" x2="72" y2="52" stroke={STROKE_LIGHT} strokeWidth="0.8" />
    </>,
    "0 0 100 55"
  );
}

function Boot({ color }) {
  return wrap(
    <>
      {/* shaft + foot silhouette */}
      <path
        d="M26,8 L58,8 L58,56 Q62,56 68,60 L86,62 Q92,64 92,72 L92,82 Q92,86 88,86 L12,86 Q8,86 8,82 L8,74 Q10,62 26,58 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* shaft/foot seam */}
      <path d="M26,58 Q42,58 58,56" fill="none" stroke={STROKE_LIGHT} strokeWidth="0.9" />
      {/* side stitching detail */}
      <path d="M28,20 Q28,42 30,54" fill="none" stroke={STROKE_LIGHT} strokeWidth="0.7" strokeDasharray="1.5 2" />
      <path d="M56,20 Q56,42 54,54" fill="none" stroke={STROKE_LIGHT} strokeWidth="0.7" strokeDasharray="1.5 2" />
      {/* lace eyelets — 5 pairs up the shaft */}
      <circle cx="34" cy="14" r="0.9" fill={STROKE} />
      <circle cx="50" cy="14" r="0.9" fill={STROKE} />
      <circle cx="34" cy="22" r="0.9" fill={STROKE} />
      <circle cx="50" cy="22" r="0.9" fill={STROKE} />
      <circle cx="34" cy="30" r="0.9" fill={STROKE} />
      <circle cx="50" cy="30" r="0.9" fill={STROKE} />
      <circle cx="34" cy="38" r="0.9" fill={STROKE} />
      <circle cx="50" cy="38" r="0.9" fill={STROKE} />
      <circle cx="34" cy="46" r="0.9" fill={STROKE} />
      <circle cx="50" cy="46" r="0.9" fill={STROKE} />
      {/* criss-cross laces */}
      <line x1="34" y1="14" x2="50" y2="22" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      <line x1="50" y1="14" x2="34" y2="22" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      <line x1="34" y1="22" x2="50" y2="30" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      <line x1="50" y1="22" x2="34" y2="30" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      <line x1="34" y1="30" x2="50" y2="38" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      <line x1="50" y1="30" x2="34" y2="38" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      <line x1="34" y1="38" x2="50" y2="46" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      <line x1="50" y1="38" x2="34" y2="46" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      {/* tongue */}
      <path d="M36,12 L48,12 L48,46 L36,46 Z" fill="none" stroke={STROKE_LIGHT} strokeWidth="0.7" />
      {/* outsole */}
      <path
        d="M8,82 L92,82 L92,88 Q92,90 90,90 L10,90 Q8,90 8,88 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* heel block */}
      <rect
        x="12"
        y="82"
        width="14"
        height="8"
        fill={color}
        stroke={STROKE}
        strokeWidth="1"
      />
      {/* outsole top seam */}
      <line x1="8" y1="84" x2="92" y2="84" stroke={STROKE_LIGHT} strokeWidth="0.8" />
    </>,
    "0 0 100 95"
  );
}

function Loafer({ color }) {
  return wrap(
    <>
      {/* upper */}
      <path
        d="M10,30 Q12,16 26,14 L60,14 Q78,16 86,22 L92,30 L92,38 Q92,40 90,40 L12,40 Q10,40 10,38 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* vamp / top-line of the opening */}
      <path
        d="M22,16 Q36,26 50,26 Q64,26 74,18"
        fill="none"
        stroke={STROKE_LIGHT}
        strokeWidth="0.9"
      />
      {/* penny strap */}
      <path
        d="M38,22 L58,22 L58,26 L38,26 Z"
        fill="none"
        stroke={STROKE_LIGHT}
        strokeWidth="0.9"
      />
      {/* penny slot */}
      <line x1="46" y1="24" x2="50" y2="24" stroke={STROKE} strokeWidth="1.3" />
      {/* heel counter seam */}
      <path d="M12,26 Q12,16 22,14" fill="none" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      {/* midsole seam */}
      <line x1="10" y1="36" x2="92" y2="36" stroke={STROKE} strokeWidth="0.9" />
      {/* outsole */}
      <path
        d="M12,40 L90,40 L88,44 Q86,46 84,46 L16,46 Q14,46 12,44 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* heel block */}
      <rect
        x="14"
        y="40"
        width="10"
        height="6"
        fill={color}
        stroke={STROKE}
        strokeWidth="1"
      />
    </>,
    "0 0 100 48"
  );
}

function Outerwear({ color, long }) {
  const hem = long ? 120 : 108;
  const vbH = long ? 128 : 116;
  return wrap(
    <>
      <path
        d={`M30,14 L12,22 L6,80 L22,84 L26,64 L26,${hem - 4} L46,${hem} L50,30 L54,${hem} L74,${hem - 4} L74,64 L78,84 L94,80 L88,22 L70,14 L58,22 L50,30 L42,22 Z`}
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* lapels */}
      <path
        d={`M30,14 L42,22 L50,30 L58,22 L70,14`}
        fill="none"
        stroke={STROKE}
        strokeWidth="1"
      />
      {/* center seam */}
      <line
        x1="50"
        y1="30"
        x2="50"
        y2={hem}
        stroke={STROKE_LIGHT}
        strokeWidth="0.8"
      />
    </>,
    `0 0 100 ${vbH}`
  );
}

function Hoodie({ color }) {
  return wrap(
    <>
      {/* body + sleeves */}
      <path
        d="M28,28 L10,36 L4,86 L20,90 L24,70 L24,108 Q24,113 29,113 L71,113 Q76,113 76,108 L76,70 L80,90 L96,86 L90,36 L72,28 Q50,42 28,28 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* hood — rises above the shoulders, draped */}
      <path
        d="M30,28 Q34,6 50,4 Q66,6 70,28 Q60,34 50,36 Q40,34 30,28 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* hood inner opening — shadow arc suggesting depth */}
      <path
        d="M36,28 Q50,40 64,28"
        fill="none"
        stroke={STROKE}
        strokeWidth="1.2"
      />
      <path
        d="M38,30 Q50,38 62,30"
        fill="none"
        stroke={STROKE_LIGHT}
        strokeWidth="0.7"
      />
      {/* drawstrings — hanging from the hood opening */}
      <line x1="46" y1="33" x2="46" y2="54" stroke={STROKE} strokeWidth="0.9" />
      <line x1="54" y1="33" x2="54" y2="54" stroke={STROKE} strokeWidth="0.9" />
      {/* drawstring aglets */}
      <circle cx="46" cy="55" r="1.3" fill={STROKE} />
      <circle cx="54" cy="55" r="1.3" fill={STROKE} />
      {/* kangaroo pocket — trapezoid with opening lines */}
      <path
        d="M32,74 L68,74 L62,96 L38,96 Z"
        fill="none"
        stroke={STROKE_LIGHT}
        strokeWidth="0.9"
      />
      {/* pocket hand openings */}
      <line x1="36" y1="78" x2="42" y2="84" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      <line x1="64" y1="78" x2="58" y2="84" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      {/* ribbed cuffs */}
      <line x1="4" y1="83" x2="20" y2="87" stroke={STROKE_LIGHT} strokeWidth="0.9" />
      <line x1="8" y1="86" x2="22" y2="89" stroke={STROKE_LIGHT} strokeWidth="0.7" />
      <line x1="80" y1="87" x2="96" y2="83" stroke={STROKE_LIGHT} strokeWidth="0.9" />
      <line x1="78" y1="89" x2="92" y2="86" stroke={STROKE_LIGHT} strokeWidth="0.7" />
      {/* ribbed hem */}
      <line x1="24" y1="107" x2="76" y2="107" stroke={STROKE_LIGHT} strokeWidth="0.9" />
      <line x1="24" y1="110" x2="76" y2="110" stroke={STROKE_LIGHT} strokeWidth="0.7" />
    </>
  );
}

function Ring({ color }) {
  return wrap(
    <>
      <circle
        cx="50"
        cy="50"
        r="30"
        fill="none"
        stroke={color}
        strokeWidth="10"
      />
      <circle
        cx="50"
        cy="50"
        r="30"
        fill="none"
        stroke={STROKE}
        strokeWidth="1.2"
      />
      <circle
        cx="50"
        cy="50"
        r="20"
        fill="none"
        stroke={STROKE}
        strokeWidth="1"
      />
    </>,
    "0 0 100 100"
  );
}

function Necklace({ color }) {
  return wrap(
    <>
      {/* chain — a shallow U */}
      <path
        d="M14,18 Q50,82 86,18"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M14,18 Q50,82 86,18"
        fill="none"
        stroke={STROKE}
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      {/* pendant */}
      <circle
        cx="50"
        cy="74"
        r="8"
        fill={color}
        stroke={STROKE}
        strokeWidth="1.2"
      />
    </>,
    "0 0 100 100"
  );
}

function Bracelet({ color }) {
  return wrap(
    <>
      <ellipse
        cx="50"
        cy="50"
        rx="36"
        ry="22"
        fill="none"
        stroke={color}
        strokeWidth="9"
      />
      <ellipse
        cx="50"
        cy="50"
        rx="36"
        ry="22"
        fill="none"
        stroke={STROKE}
        strokeWidth="1"
      />
      <ellipse
        cx="50"
        cy="50"
        rx="27"
        ry="13"
        fill="none"
        stroke={STROKE_LIGHT}
        strokeWidth="0.8"
      />
    </>,
    "0 0 100 100"
  );
}

function Earrings({ color }) {
  return wrap(
    <>
      {/* left hoop */}
      <circle
        cx="30"
        cy="55"
        r="18"
        fill="none"
        stroke={color}
        strokeWidth="5"
      />
      <circle
        cx="30"
        cy="55"
        r="18"
        fill="none"
        stroke={STROKE}
        strokeWidth="0.8"
      />
      <circle cx="30" cy="36" r="2" fill={STROKE} />
      {/* right hoop */}
      <circle
        cx="70"
        cy="55"
        r="18"
        fill="none"
        stroke={color}
        strokeWidth="5"
      />
      <circle
        cx="70"
        cy="55"
        r="18"
        fill="none"
        stroke={STROKE}
        strokeWidth="0.8"
      />
      <circle cx="70" cy="36" r="2" fill={STROKE} />
    </>,
    "0 0 100 100"
  );
}

function Dot({ color }) {
  return wrap(
    <circle
      cx="50"
      cy="50"
      r="28"
      fill={color}
      stroke={STROKE}
      strokeWidth={W}
    />,
    "0 0 100 100"
  );
}

function Puffer({ color }) {
  return wrap(
    <>
      {/* body + sleeves */}
      <path
        d="M30,14 L12,22 L6,82 L24,86 L26,68 L26,108 Q26,113 31,113 L69,113 Q74,113 74,108 L74,68 L76,86 L94,82 L88,22 L70,14 Q50,32 30,14 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* quilting — horizontal baffles */}
      <path d="M12,36 L88,36" fill="none" stroke={STROKE_LIGHT} strokeWidth="0.9" />
      <path d="M10,52 L90,52" fill="none" stroke={STROKE_LIGHT} strokeWidth="0.9" />
      <path d="M8,68 L92,68" fill="none" stroke={STROKE_LIGHT} strokeWidth="0.9" />
      <path d="M26,84 L74,84" fill="none" stroke={STROKE_LIGHT} strokeWidth="0.9" />
      <path d="M26,98 L74,98" fill="none" stroke={STROKE_LIGHT} strokeWidth="0.9" />
      {/* center zip */}
      <line x1="50" y1="16" x2="50" y2="108" stroke={STROKE} strokeWidth="1" />
      {/* collar */}
      <path
        d="M38,14 Q50,24 62,14"
        fill="none"
        stroke={STROKE}
        strokeWidth="1.1"
      />
    </>
  );
}

function DenimJacket({ color }) {
  return wrap(
    <>
      {/* body + sleeves */}
      <path
        d="M30,14 L12,22 L6,78 L22,82 L26,62 L26,104 Q26,109 31,109 L69,109 Q74,109 74,104 L74,62 L78,82 L94,78 L88,22 L70,14 L58,22 L50,26 L42,22 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* collar */}
      <path d="M42,22 L34,34 L50,28 Z" fill={color} stroke={STROKE} strokeWidth="1" />
      <path d="M58,22 L66,34 L50,28 Z" fill={color} stroke={STROKE} strokeWidth="1" />
      {/* center placket */}
      <line x1="50" y1="28" x2="50" y2="104" stroke={STROKE_LIGHT} strokeWidth="0.9" />
      {/* chest pockets */}
      <path d="M30,44 L44,44 L44,60 L30,60 Z" fill="none" stroke={STROKE_LIGHT} strokeWidth="0.9" />
      <path d="M56,44 L70,44 L70,60 L56,60 Z" fill="none" stroke={STROKE_LIGHT} strokeWidth="0.9" />
      {/* pocket flap lines */}
      <line x1="30" y1="48" x2="44" y2="48" stroke={STROKE_LIGHT} strokeWidth="0.7" />
      <line x1="56" y1="48" x2="70" y2="48" stroke={STROKE_LIGHT} strokeWidth="0.7" />
      {/* buttons */}
      <circle cx="50" cy="36" r="1.2" fill={STROKE} />
      <circle cx="50" cy="56" r="1.2" fill={STROKE} />
      <circle cx="50" cy="76" r="1.2" fill={STROKE} />
      <circle cx="50" cy="96" r="1.2" fill={STROKE} />
      {/* waistband */}
      <line x1="26" y1="100" x2="74" y2="100" stroke={STROKE_LIGHT} strokeWidth="0.8" />
    </>
  );
}

function Bomber({ color }) {
  return wrap(
    <>
      {/* body + sleeves */}
      <path
        d="M30,22 L12,28 L8,78 L22,82 L26,64 L26,102 Q26,106 30,106 L70,106 Q74,106 74,102 L74,64 L78,82 L92,78 L88,28 L70,22 Q50,34 30,22 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* ribbed collar */}
      <path
        d="M30,22 Q50,32 70,22 L70,14 Q50,24 30,14 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <line x1="30" y1="18" x2="70" y2="18" stroke={STROKE_LIGHT} strokeWidth="0.7" />
      {/* center zip */}
      <line x1="50" y1="28" x2="50" y2="100" stroke={STROKE} strokeWidth="1" />
      {/* ribbed hem */}
      <path d="M26,100 L74,100 L74,108 Q74,112 70,112 L30,112 Q26,112 26,108 Z"
        fill={color} stroke={STROKE} strokeWidth="1" strokeLinejoin="round" />
      <line x1="26" y1="104" x2="74" y2="104" stroke={STROKE_LIGHT} strokeWidth="0.7" />
      <line x1="26" y1="108" x2="74" y2="108" stroke={STROKE_LIGHT} strokeWidth="0.7" />
      {/* ribbed cuffs */}
      <path d="M8,78 L22,82 L22,90 Q22,92 20,92 L10,90 Q8,90 8,88 Z"
        fill={color} stroke={STROKE} strokeWidth="1" strokeLinejoin="round" />
      <path d="M78,82 L92,78 L92,88 Q92,90 90,90 L80,92 Q78,92 78,90 Z"
        fill={color} stroke={STROKE} strokeWidth="1" strokeLinejoin="round" />
    </>
  );
}

function Polo({ color }) {
  return wrap(
    <>
      {/* body + short sleeves */}
      <path
        d="M30,14 L12,22 L5,45 L26,48 L26,108 Q26,113 31,113 L69,113 Q74,113 74,108 L74,48 L95,45 L88,22 L70,14 Q50,32 30,14 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* soft polo collar */}
      <path
        d="M40,14 L36,28 L50,22 L64,28 L60,14"
        fill={color}
        stroke={STROKE}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* button placket — short, 2 buttons */}
      <line x1="50" y1="22" x2="50" y2="42" stroke={STROKE_LIGHT} strokeWidth="0.9" />
      <circle cx="50" cy="28" r="1.1" fill={STROKE} />
      <circle cx="50" cy="36" r="1.1" fill={STROKE} />
      {/* sleeve cuffs */}
      <line x1="5" y1="41" x2="26" y2="44" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      <line x1="74" y1="44" x2="95" y2="41" stroke={STROKE_LIGHT} strokeWidth="0.8" />
    </>
  );
}

function DressShoe({ color }) {
  return wrap(
    <>
      {/* upper — sleek, low-profile */}
      <path
        d="M10,32 Q14,18 26,16 L60,16 Q80,18 88,24 L94,30 L94,38 Q94,40 92,40 L10,40 Q8,40 8,38 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* vamp seam (cap toe) */}
      <path
        d="M70,18 Q74,28 74,38"
        fill="none"
        stroke={STROKE_LIGHT}
        strokeWidth="0.9"
      />
      {/* top-line opening */}
      <path d="M22,18 Q38,26 52,26 Q62,26 72,20" fill="none" stroke={STROKE_LIGHT} strokeWidth="0.9" />
      {/* eyelets + thin laces */}
      <circle cx="34" cy="22" r="0.7" fill={STROKE} />
      <circle cx="42" cy="22" r="0.7" fill={STROKE} />
      <circle cx="34" cy="28" r="0.7" fill={STROKE} />
      <circle cx="42" cy="28" r="0.7" fill={STROKE} />
      <line x1="34" y1="22" x2="42" y2="22" stroke={STROKE_LIGHT} strokeWidth="0.7" />
      <line x1="34" y1="28" x2="42" y2="28" stroke={STROKE_LIGHT} strokeWidth="0.7" />
      {/* welt */}
      <line x1="10" y1="36" x2="94" y2="36" stroke={STROKE} strokeWidth="0.8" />
      {/* sole */}
      <path
        d="M12,40 L92,40 L90,44 Q88,46 86,46 L16,46 Q14,46 12,44 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* heel */}
      <rect x="14" y="40" width="12" height="7" fill={color} stroke={STROKE} strokeWidth="1" />
    </>,
    "0 0 100 50"
  );
}

function Cap({ color }) {
  return wrap(
    <>
      {/* crown */}
      <path
        d="M18,52 Q18,22 50,22 Q82,22 82,52 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* brim */}
      <path
        d="M10,52 L82,52 L82,60 Q82,64 76,64 L14,64 Q10,64 10,60 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* panel seams */}
      <line x1="50" y1="22" x2="50" y2="52" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      <path d="M34,24 Q34,38 28,52" fill="none" stroke={STROKE_LIGHT} strokeWidth="0.7" />
      <path d="M66,24 Q66,38 72,52" fill="none" stroke={STROKE_LIGHT} strokeWidth="0.7" />
      {/* button */}
      <circle cx="50" cy="22" r="1.6" fill={STROKE} />
    </>,
    "0 0 100 75"
  );
}

function Sunglasses({ color }) {
  return wrap(
    <>
      {/* left lens */}
      <rect
        x="8"
        y="36"
        width="34"
        height="22"
        rx="6"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
      />
      {/* right lens */}
      <rect
        x="58"
        y="36"
        width="34"
        height="22"
        rx="6"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
      />
      {/* bridge */}
      <path d="M42,42 L58,42" stroke={STROKE} strokeWidth="2" />
      {/* temples */}
      <path d="M8,40 L2,36" stroke={STROKE} strokeWidth="1.5" />
      <path d="M92,40 L98,36" stroke={STROKE} strokeWidth="1.5" />
      {/* lens highlights */}
      <path d="M14,42 L20,42" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <path d="M64,42 L70,42" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
    </>,
    "0 0 100 100"
  );
}

function Belt({ color }) {
  return wrap(
    <>
      {/* strap */}
      <rect
        x="6"
        y="42"
        width="68"
        height="16"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
      />
      {/* holes */}
      <circle cx="16" cy="50" r="1.4" fill={STROKE} />
      <circle cx="24" cy="50" r="1.4" fill={STROKE} />
      <circle cx="32" cy="50" r="1.4" fill={STROKE} />
      {/* buckle */}
      <rect
        x="74"
        y="38"
        width="20"
        height="24"
        fill="none"
        stroke={STROKE}
        strokeWidth="2"
      />
      <rect
        x="78"
        y="42"
        width="12"
        height="16"
        fill="none"
        stroke={STROKE_LIGHT}
        strokeWidth="1"
      />
      {/* prong */}
      <line x1="72" y1="50" x2="84" y2="50" stroke={STROKE} strokeWidth="1.5" />
    </>,
    "0 0 100 100"
  );
}

function Watch({ color }) {
  return wrap(
    <>
      {/* top strap */}
      <path d="M38,8 L62,8 L60,38 L40,38 Z" fill={color} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      {/* bottom strap */}
      <path d="M40,62 L60,62 L62,92 L38,92 Z" fill={color} stroke={STROKE} strokeWidth={W} strokeLinejoin="round" />
      {/* strap holes */}
      <circle cx="50" cy="18" r="1" fill={STROKE} />
      <circle cx="50" cy="82" r="1" fill={STROKE} />
      {/* case */}
      <circle cx="50" cy="50" r="18" fill={color} stroke={STROKE} strokeWidth={W} />
      {/* bezel */}
      <circle cx="50" cy="50" r="15" fill="none" stroke={STROKE_LIGHT} strokeWidth="0.9" />
      {/* crown */}
      <rect x="68" y="47" width="4" height="6" fill={color} stroke={STROKE} strokeWidth="0.8" />
      {/* hands */}
      <line x1="50" y1="50" x2="50" y2="40" stroke={STROKE} strokeWidth="1.3" />
      <line x1="50" y1="50" x2="58" y2="50" stroke={STROKE} strokeWidth="1.3" />
      <circle cx="50" cy="50" r="1.3" fill={STROKE} />
    </>,
    "0 0 100 100"
  );
}

function Bag({ color }) {
  return wrap(
    <>
      {/* handle */}
      <path
        d="M30,34 Q30,18 50,18 Q70,18 70,34"
        fill="none"
        stroke={STROKE}
        strokeWidth="2.2"
      />
      {/* body */}
      <path
        d="M14,34 L86,34 L80,88 Q80,92 76,92 L24,92 Q20,92 20,88 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* top seam */}
      <line x1="14" y1="38" x2="86" y2="38" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      {/* front stitching */}
      <line x1="50" y1="42" x2="50" y2="88" stroke={STROKE_LIGHT} strokeWidth="0.7" strokeDasharray="1.5 2" />
      {/* base shadow */}
      <line x1="22" y1="88" x2="78" y2="88" stroke={STROKE_LIGHT} strokeWidth="0.7" />
    </>,
    "0 0 100 100"
  );
}

function Scarf({ color }) {
  return wrap(
    <>
      {/* draped loop around neck */}
      <path
        d="M20,16 Q50,42 80,16 L82,28 Q50,54 18,28 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* left tail */}
      <path
        d="M26,34 L22,88 L38,92 L36,38 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* right tail */}
      <path
        d="M62,38 L64,92 L78,88 L72,34 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth={W}
        strokeLinejoin="round"
      />
      {/* fringe */}
      <line x1="24" y1="88" x2="24" y2="94" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      <line x1="28" y1="90" x2="28" y2="95" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      <line x1="32" y1="91" x2="32" y2="96" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      <line x1="36" y1="92" x2="36" y2="96" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      <line x1="66" y1="91" x2="66" y2="96" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      <line x1="70" y1="90" x2="70" y2="95" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      <line x1="74" y1="89" x2="74" y2="94" stroke={STROKE_LIGHT} strokeWidth="0.8" />
      {/* knit texture hint */}
      <line x1="24" y1="56" x2="36" y2="56" stroke={STROKE_LIGHT} strokeWidth="0.7" />
      <line x1="64" y1="56" x2="76" y2="56" stroke={STROKE_LIGHT} strokeWidth="0.7" />
    </>,
    "0 0 100 100"
  );
}

// Map catalog subtypes (and closet-item types) to the right silhouette.
function renderIcon(subtype, color) {
  switch (subtype) {
    case "t-shirt":
      return <Tee color={color} />;
    case "shirt":
      return <Shirt color={color} />;
    case "polo":
      return <Polo color={color} />;
    case "knit":
      return <LongSleeveTop color={color} knit />;
    case "sweatshirt":
      return <LongSleeveTop color={color} />;
    case "hoodie":
      return <Hoodie color={color} />;
    case "dress":
      return <Dress color={color} />;
    case "jeans":
    case "chinos":
    case "trousers":
      return <Pants color={color} />;
    case "shorts":
      return <Shorts color={color} />;
    case "skirt":
      return <Skirt color={color} />;
    case "sneakers":
      return <Sneaker color={color} />;
    case "boots":
      return <Boot color={color} />;
    case "loafers":
      return <Loafer color={color} />;
    case "dress-shoes":
      return <DressShoe color={color} />;
    case "overshirt":
    case "blazer":
      return <Outerwear color={color} />;
    case "coat":
      return <Outerwear color={color} long />;
    case "puffer":
      return <Puffer color={color} />;
    case "denim-jacket":
      return <DenimJacket color={color} />;
    case "bomber":
      return <Bomber color={color} />;
    case "ring":
      return <Ring color={color} />;
    case "necklace":
      return <Necklace color={color} />;
    case "bracelet":
      return <Bracelet color={color} />;
    case "earrings":
      return <Earrings color={color} />;
    case "watch":
      return <Watch color={color} />;
    case "hat":
    case "cap":
      return <Cap color={color} />;
    case "sunglasses":
      return <Sunglasses color={color} />;
    case "belt":
      return <Belt color={color} />;
    case "bag":
      return <Bag color={color} />;
    case "scarf":
      return <Scarf color={color} />;
    // closet fallbacks when only a broad type is logged
    case "top":
      return <Tee color={color} />;
    case "bottom":
      return <Pants color={color} />;
    case "shoes":
      return <Sneaker color={color} />;
    case "outerwear":
      return <Outerwear color={color} />;
    case "accessory":
      return <Dot color={color} />;
    default:
      return <Tee color={color} />;
  }
}

export default function GarmentIcon({ subtype, color, className = "" }) {
  return <div className={className}>{renderIcon(subtype, color)}</div>;
}
