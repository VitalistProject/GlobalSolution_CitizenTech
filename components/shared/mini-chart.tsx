export function MiniChart({
  variant = "area",
  color = "#238354",
  height = 90,
}: {
  variant?: "area" | "line";
  color?: string;
  height?: number;
}) {
  const values = [
    39, 46, 41, 54, 48, 61, 55, 65, 57, 69, 63, 77, 66, 74, 67, 82, 73, 79, 72,
    85, 77, 88, 81, 92,
  ];

  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${100 - v}`)
    .join(" ");

  return (
    <svg
      className="mini-chart"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ height }}
      aria-label="Série temporal demonstrativa"
      role="img"
    >
      <defs>
        <linearGradient
          id={`fill-${color.replace("#", "")}`}
          x1="0"
          x2="0"
          y1="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity=".2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M ${points} L 100,100 L 0,100 Z`}
        fill={
          variant === "area" ? `url(#fill-${color.replace("#", "")})` : "none"
        }
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="0"
        y1="74"
        x2="100"
        y2="74"
        stroke="#d7e1d9"
        strokeDasharray="2 3"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
