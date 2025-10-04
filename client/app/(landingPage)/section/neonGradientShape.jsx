export default function NeonGradientShape() {
  return (
    <svg
      viewBox="0 0 800 800"
      width="1150"
      height="900"
      className="absolute right-0 bottom-0 pointer-events-none z-0"
      style={{ mixBlendMode: "screen", opacity: 0.75 }}
    >
      <defs>
        <radialGradient id="orangeGlow" cx="60%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#ffd388" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#ffa040" stopOpacity="0.58" />
          <stop offset="85%" stopColor="#ff5400" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#5128ff" stopOpacity="0.12" />
        </radialGradient>
        <linearGradient id="blueShard" x1="0%" y1="90%" x2="70%" y2="20%">
          <stop offset="0%" stopColor="#44a1e3" stopOpacity="0.9" />
          <stop offset="80%" stopColor="#1756e3" stopOpacity="0.13" />
        </linearGradient>
      </defs>
      <ellipse
        cx="670"
        cy="185"
        rx="330"
        ry="200"
        fill="url(#orangeGlow)"
        filter="url(#softBlur)"
      />
      <rect
        x="300"
        y="440"
        width="500"
        height="110"
        transform="rotate(-28 450 500)"
        fill="url(#blueShard)"
        opacity="0.80"
        rx="80"
      />
    </svg>
  );
}
