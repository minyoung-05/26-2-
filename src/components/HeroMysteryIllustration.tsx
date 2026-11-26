import { motion } from 'motion/react';

export function HeroMysteryIllustration() {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#3B1F2B] overflow-hidden">
      {/* Soft twilight glows */}
      <div className="absolute -top-16 -left-12 w-72 h-72 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-64 h-64 rounded-full bg-sky-400/12 blur-3xl pointer-events-none" />

      <svg
        viewBox="0 0 640 520"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.45" />
            <stop offset="55%" stopColor="#F97316" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="hero-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Simple School Room Wall & Wooden Floor */}
        <rect width="640" height="360" fill="#171C3A" fillOpacity="0.65" />
        <rect x="0" y="340" width="640" height="180" fill="#1E1418" />
        <line x1="0" y1="378" x2="640" y2="378" stroke="#3B2324" strokeWidth="2" />
        <line x1="0" y1="422" x2="640" y2="422" stroke="#3B2324" strokeWidth="2" />

        {/* Left School Window with Sunset Sky */}
        <rect
          x="36"
          y="46"
          width="148"
          height="168"
          rx="10"
          fill="url(#hero-sky)"
          stroke="#475569"
          strokeWidth="6"
        />
        <line x1="110" y1="46" x2="110" y2="214" stroke="#475569" strokeWidth="4" />
        <line x1="36" y1="130" x2="184" y2="130" stroke="#475569" strokeWidth="4" />
        {/* Crescent moon / evening stars */}
        <circle cx="72" cy="84" r="10" fill="#FEF08A" opacity="0.8" />
        <circle cx="145" cy="78" r="2.5" fill="#FFFFFF" opacity="0.85" />
        <circle cx="158" cy="102" r="2" fill="#FFFFFF" opacity="0.7" />

        {/* Right Clean School Wall Clock & Minimalist Bulletin Board */}
        <circle
          cx="548"
          cy="86"
          r="26"
          fill="#F8FAFC"
          fillOpacity="0.92"
          stroke="#475569"
          strokeWidth="5"
        />
        <line x1="548" y1="86" x2="548" y2="70" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
        <line x1="548" y1="86" x2="560" y2="92" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="548" cy="86" r="3" fill="#1E293B" />

        <rect
          x="458"
          y="130"
          width="144"
          height="92"
          rx="8"
          fill="#1E293B"
          fillOpacity="0.85"
          stroke="#475569"
          strokeWidth="4"
        />
        <rect x="474" y="146" width="46" height="30" rx="4" fill="#FDE68A" fillOpacity="0.85" />
        <rect x="530" y="152" width="56" height="36" rx="4" fill="#BAE6FD" fillOpacity="0.75" />
        <circle cx="497" cy="150" r="3.5" fill="#E11D48" />
        <circle cx="558" cy="156" r="3.5" fill="#F59E0B" />
        <line
          x1="476"
          y1="198"
          x2="584"
          y2="198"
          stroke="#94A3B8"
          strokeOpacity="0.35"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Overhead Golden Spotlight Cone on Center Trophy Pedestal */}
        <polygon points="274,0 366,0 440,340 200,340" fill="url(#hero-beam)" />

        {/* Center Velvet Trophy Pedestal */}
        <rect
          x="248"
          y="258"
          width="144"
          height="84"
          rx="8"
          fill="#78350F"
          stroke="#D97706"
          strokeWidth="2.5"
        />
        <rect x="236" y="246" width="168" height="16" rx="4" fill="#B45309" />
        <rect
          x="282"
          y="286"
          width="76"
          height="24"
          rx="4"
          fill="#1E293B"
          stroke="#FBBF24"
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />
        <text
          x="320"
          y="302"
          textAnchor="middle"
          fill="#FDE68A"
          fontSize="10"
          fontWeight="800"
        >
          1st TROPHY
        </text>

        {/* Glass Display Case with Door Swung Open */}
        <rect
          x="252"
          y="98"
          width="136"
          height="148"
          rx="6"
          fill="#38BDF8"
          fillOpacity="0.08"
          stroke="#7DD3FC"
          strokeOpacity="0.55"
          strokeWidth="2.5"
        />
        {/* Open door */}
        <motion.g
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '388px 172px' }}
        >
          <polygon
            points="388,98 446,84 446,260 388,246"
            fill="#38BDF8"
            fillOpacity="0.16"
            stroke="#BAE6FD"
            strokeOpacity="0.7"
            strokeWidth="2.2"
          />
          <circle cx="434" cy="172" r="4" fill="#FBBF24" />
        </motion.g>

        {/* Missing Trophy Dashed Outline + Question Mark */}
        <motion.g
          animate={{ opacity: [0.45, 1, 0.45], y: [0, -3, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M 290 126 L 350 126 L 344 170 C 340 188, 330 194, 320 194 C 310 194, 300 188, 296 170 Z"
            fill="#FBBF24"
            fillOpacity="0.14"
            stroke="#FBBF24"
            strokeWidth="3"
            strokeDasharray="7 5"
          />
          <path
            d="M 290 134 C 272 134, 272 162, 293 164"
            fill="none"
            stroke="#FBBF24"
            strokeWidth="2.5"
            strokeDasharray="5 4"
          />
          <path
            d="M 350 134 C 368 134, 368 162, 347 164"
            fill="none"
            stroke="#FBBF24"
            strokeWidth="2.5"
            strokeDasharray="5 4"
          />
          <line
            x1="320"
            y1="194"
            x2="320"
            y2="226"
            stroke="#FBBF24"
            strokeWidth="3"
            strokeDasharray="4 4"
          />
          <rect
            x="298"
            y="226"
            width="44"
            height="16"
            rx="4"
            fill="#FBBF24"
            fillOpacity="0.18"
            stroke="#FBBF24"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
          <text
            x="320"
            y="168"
            textAnchor="middle"
            fill="#FEF08A"
            fontSize="28"
            fontWeight="800"
          >
            ?
          </text>
        </motion.g>

        {/* Subtle detective footprints leading away on floor */}
        <g fill="#FBBF24" opacity="0.28">
          <ellipse cx="385" cy="355" rx="9" ry="4.5" transform="rotate(-12 385 355)" />
          <ellipse cx="425" cy="368" rx="9" ry="4.5" transform="rotate(-8 425 368)" />
          <ellipse cx="468" cy="356" rx="9" ry="4.5" transform="rotate(-10 468 356)" />
        </g>
      </svg>
    </div>
  );
}
