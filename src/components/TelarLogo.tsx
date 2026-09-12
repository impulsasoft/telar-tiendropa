interface Props {
  size?: number;
  className?: string;
  /** "full" = pill badge con texto TELAR | "icon" = solo T para favicon/icono pequeño */
  variant?: "full" | "icon";
}

export default function TelarLogo({ size = 40, className = "", variant = "full" }: Props) {
  if (variant === "icon") {
    return (
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none"
        xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="44" height="44" rx="11" fill="url(#ic-bg)" />
        <text x="22" y="30" textAnchor="middle"
          fontFamily="system-ui,-apple-system,'Segoe UI',sans-serif"
          fontWeight="900" fontSize="22" fill="white" letterSpacing="-1">T</text>
        <rect x="8" y="35" width="28" height="1.5" rx="0.75" fill="white" fillOpacity="0.3" />
        <defs>
          <linearGradient id="ic-bg" x1="0" y1="0" x2="44" y2="44">
            <stop stopColor="#7C2D9E" /><stop offset="1" stopColor="#C9267A" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // full variant — pill badge con "TELAR"
  const h = size;
  const w = Math.round(size * 3.1);
  return (
    <svg width={w} height={h} viewBox="0 0 140 46" fill="none"
      xmlns="http://www.w3.org/2000/svg" className={className}>

      {/* Badge background */}
      <rect width="140" height="46" rx="12" fill="url(#tl-bg)" />

      {/* Shimmer stripe top */}
      <rect x="0" y="0" width="140" height="46" rx="12"
        fill="url(#tl-shine)" />

      {/* Thread lines decoration */}
      <line x1="10" y1="11" x2="130" y2="11"
        stroke="white" strokeOpacity="0.18" strokeWidth="1" />
      <line x1="10" y1="35" x2="130" y2="35"
        stroke="white" strokeOpacity="0.18" strokeWidth="1" />

      {/* Diamond accents */}
      <rect x="7" y="20" width="5" height="5" rx="1"
        fill="white" fillOpacity="0.25" transform="rotate(45 9.5 22.5)" />
      <rect x="128" y="20" width="5" height="5" rx="1"
        fill="white" fillOpacity="0.25" transform="rotate(45 130.5 22.5)" />

      {/* TELAR wordmark — SVG text, always readable */}
      <text
        x="70" y="31"
        textAnchor="middle"
        fontFamily="system-ui,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif"
        fontWeight="900"
        fontSize="19"
        fill="white"
        letterSpacing="5"
      >TELAR</text>

      {/* Tagline */}
      <text
        x="70" y="43"
        textAnchor="middle"
        fontFamily="system-ui,-apple-system,sans-serif"
        fontWeight="500"
        fontSize="6"
        fill="white"
        fillOpacity="0.55"
        letterSpacing="3"
      >MODA FASHION</text>

      <defs>
        <linearGradient id="tl-bg" x1="0" y1="0" x2="140" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6A1B8A" />
          <stop offset="0.5" stopColor="#9C27B0" />
          <stop offset="1" stopColor="#C9267A" />
        </linearGradient>
        {/* Subtle top-left shine */}
        <linearGradient id="tl-shine" x1="0" y1="0" x2="0" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.12" />
          <stop offset="0.5" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
