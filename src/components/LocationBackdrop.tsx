import { motion, AnimatePresence } from 'motion/react';

interface LocationBackdropProps {
  sceneKey: string;
}

type LocationTheme =
  | 'council'
  | 'library_hall'
  | 'stairs_hall'
  | 'security_room'
  | 'window_hall'
  | 'canteen_hall'
  | 'art_room'
  | 'club_room'
  | 'broadcast_room'
  | 'locker_hall'
  | 'auditorium';

function getLocationTheme(sceneKey: string): LocationTheme {
  switch (sceneKey) {
    case 'mq-1':
    case 's1-q1':
    case 's1-q2':
    case 's1-q3':
    case 's1-q4':
    case 's1-q5':
      return 'council';
    case 'mq-2':
    case 's2-q1':
      return 'library_hall';
    case 's2-q2':
      return 'stairs_hall';
    case 's2-q3':
      return 'security_room';
    case 's2-q4':
      return 'window_hall';
    case 's2-q5':
      return 'canteen_hall';
    case 's3-q1':
      return 'art_room';
    case 'mq-3':
    case 's3-q2':
    case 's3-q3':
      return 'club_room';
    case 's3-q4':
      return 'broadcast_room';
    case 's3-q5':
      return 'locker_hall';
    case 'stage-4':
    default:
      return 'auditorium';
  }
}

export function LocationBackdrop({ sceneKey }: LocationBackdropProps) {
  const theme = getLocationTheme(sceneKey);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={theme}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="absolute inset-0 pointer-events-none"
      >
        <svg
          viewBox="0 0 640 360"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
          aria-hidden="true"
        >
          {theme === 'council' && (
            <g>
              {/* Warm Twilight Student Council Room */}
              <defs>
                <linearGradient id="bg-council" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="55%" stopColor="#272448" />
                  <stop offset="100%" stopColor="#3B2336" />
                </linearGradient>
                <linearGradient id="sunset-win" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.65" />
                  <stop offset="55%" stopColor="#F97316" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.7" />
                </linearGradient>
              </defs>
              <rect width="640" height="360" fill="url(#bg-council)" />
              {/* Back wall paneling */}
              <rect x="0" y="210" width="640" height="54" fill="#1E1B2E" opacity="0.6" />
              {/* Wooden floor */}
              <rect x="0" y="264" width="640" height="96" fill="#2B1E1A" />
              <line x1="0" y1="295" x2="640" y2="295" stroke="#452D24" strokeWidth="1.5" />
              <line x1="0" y1="328" x2="640" y2="328" stroke="#452D24" strokeWidth="1.5" />
              {/* Left Sunset Window */}
              <rect x="34" y="34" width="150" height="150" rx="6" fill="url(#sunset-win)" stroke="#475569" strokeWidth="5" />
              <line x1="109" y1="34" x2="109" y2="184" stroke="#475569" strokeWidth="4" />
              <line x1="34" y1="109" x2="184" y2="109" stroke="#475569" strokeWidth="4" />
              {/* Diagonal sunlight beam */}
              <polygon points="34,184 184,184 290,360 80,360" fill="#FBBF24" opacity="0.08" />
              {/* Right Chalkboard & Bulletin Board */}
              <rect x="445" y="42" width="166" height="106" rx="6" fill="#0F3D3E" stroke="#92400E" strokeWidth="5" />
              <line x1="468" y1="74" x2="562" y2="74" stroke="#E2E8F0" strokeOpacity="0.28" strokeWidth="3" strokeLinecap="round" />
              <line x1="468" y1="96" x2="538" y2="96" stroke="#FDE68A" strokeOpacity="0.25" strokeWidth="3" strokeLinecap="round" />
              <rect x="458" y="166" width="138" height="42" rx="4" fill="#78350F" opacity="0.55" />
              {/* Ceiling hanging light */}
              <line x1="320" y1="0" x2="320" y2="22" stroke="#64748B" strokeWidth="3" />
              <polygon points="292,22 348,22 362,36 278,36" fill="#F59E0B" opacity="0.7" />
              <ellipse cx="320" cy="48" rx="140" ry="40" fill="#FBBF24" opacity="0.09" />
            </g>
          )}

          {theme === 'library_hall' && (
            <g>
              {/* Library & Corridor */}
              <defs>
                <linearGradient id="bg-lib" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0F172A" />
                  <stop offset="100%" stopColor="#064E3B" />
                </linearGradient>
              </defs>
              <rect width="640" height="360" fill="url(#bg-lib)" />
              {/* Corridor perspective walls */}
              <polygon points="0,0 130,52 130,248 0,305" fill="#134E4A" opacity="0.55" />
              <polygon points="640,0 510,52 510,248 640,305" fill="#134E4A" opacity="0.55" />
              {/* Bookshelves on left and right */}
              <rect x="20" y="42" width="90" height="196" rx="4" fill="#3F271E" opacity="0.85" />
              <line x1="20" y1="90" x2="110" y2="90" stroke="#78350F" strokeWidth="3" />
              <line x1="20" y1="140" x2="110" y2="140" stroke="#78350F" strokeWidth="3" />
              <line x1="20" y1="190" x2="110" y2="190" stroke="#78350F" strokeWidth="3" />
              <rect x="30" y="54" width="12" height="34" fill="#34D399" opacity="0.6" />
              <rect x="45" y="58" width="10" height="30" fill="#FBBF24" opacity="0.6" />
              <rect x="58" y="52" width="14" height="36" fill="#38BDF8" opacity="0.6" />
              <rect x="530" y="42" width="90" height="196" rx="4" fill="#3F271E" opacity="0.85" />
              <line x1="530" y1="90" x2="620" y2="90" stroke="#78350F" strokeWidth="3" />
              <line x1="530" y1="140" x2="620" y2="140" stroke="#78350F" strokeWidth="3" />
              <rect x="544" y="102" width="12" height="36" fill="#F472B6" opacity="0.55" />
              <rect x="560" y="106" width="14" height="32" fill="#60A5FA" opacity="0.55" />
              {/* Polished hallway floor */}
              <polygon points="0,305 130,248 510,248 640,305 640,360 0,360" fill="#0F292E" />
              <line x1="130" y1="248" x2="60" y2="360" stroke="#14B8A6" strokeOpacity="0.2" strokeWidth="2" />
              <line x1="510" y1="248" x2="580" y2="360" stroke="#14B8A6" strokeOpacity="0.2" strokeWidth="2" />
              {/* Warm ceiling lights */}
              <ellipse cx="320" cy="24" rx="160" ry="26" fill="#34D399" opacity="0.12" />
            </g>
          )}

          {theme === 'stairs_hall' && (
            <g>
              <defs>
                <linearGradient id="bg-stairs" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0F172A" />
                  <stop offset="100%" stopColor="#1E3A8A" />
                </linearGradient>
              </defs>
              <rect width="640" height="360" fill="url(#bg-stairs)" />
              {/* Staircase steps silhouette on left */}
              <g fill="#1E293B" stroke="#3B82F6" strokeOpacity="0.3" strokeWidth="1.5">
                <rect x="18" y="210" width="110" height="20" />
                <rect x="34" y="190" width="94" height="20" />
                <rect x="50" y="170" width="78" height="20" />
                <rect x="66" y="150" width="62" height="20" />
                <rect x="82" y="130" width="46" height="20" />
              </g>
              {/* Handrail */}
              <line x1="14" y1="185" x2="100" y2="104" stroke="#60A5FA" strokeWidth="4" strokeOpacity="0.55" strokeLinecap="round" />
              {/* Hallway archway & tall windows on right */}
              <rect x="505" y="42" width="102" height="175" rx="6" fill="#38BDF8" fillOpacity="0.16" stroke="#60A5FA" strokeOpacity="0.45" strokeWidth="3" />
              <line x1="556" y1="42" x2="556" y2="217" stroke="#60A5FA" strokeOpacity="0.35" strokeWidth="2" />
              {/* Floor */}
              <rect x="0" y="258" width="640" height="102" fill="#0B192C" />
              <line x1="0" y1="286" x2="640" y2="286" stroke="#1E40AF" strokeOpacity="0.35" strokeWidth="1.5" />
            </g>
          )}

          {theme === 'security_room' && (
            <g>
              <defs>
                <linearGradient id="bg-sec" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#091520" />
                  <stop offset="100%" stopColor="#115E59" />
                </linearGradient>
              </defs>
              <rect width="640" height="360" fill="url(#bg-sec)" />
              {/* Left security booth window + monitor bank */}
              <rect x="26" y="44" width="154" height="145" rx="8" fill="#0F172A" stroke="#2DD4BF" strokeOpacity="0.5" strokeWidth="3" />
              <rect x="42" y="64" width="54" height="38" rx="4" fill="#134E4A" stroke="#5EEAD4" strokeOpacity="0.5" strokeWidth="1.5" />
              <rect x="108" y="64" width="54" height="38" rx="4" fill="#1E293B" stroke="#EF4444" strokeOpacity="0.6" strokeWidth="1.5" />
              <rect x="42" y="114" width="54" height="38" rx="4" fill="#134E4A" stroke="#5EEAD4" strokeOpacity="0.5" strokeWidth="1.5" />
              <rect x="108" y="114" width="54" height="38" rx="4" fill="#134E4A" stroke="#5EEAD4" strokeOpacity="0.5" strokeWidth="1.5" />
              {/* Right electrical breaker panel */}
              <rect x="506" y="54" width="96" height="148" rx="6" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
              <circle cx="554" cy="84" r="6" fill="#F59E0B" opacity="0.7" />
              <rect x="528" y="108" width="52" height="68" rx="4" fill="#0F172A" />
              {/* Floor */}
              <rect x="0" y="256" width="640" height="104" fill="#0A1A1F" />
              <rect x="0" y="248" width="640" height="8" fill="#F59E0B" opacity="0.28" />
            </g>
          )}

          {theme === 'window_hall' && (
            <g>
              <defs>
                <linearGradient id="bg-winhall" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1E1B4B" />
                  <stop offset="100%" stopColor="#0369A1" />
                </linearGradient>
              </defs>
              <rect width="640" height="360" fill="url(#bg-winhall)" />
              {/* Row of bright corridor windows */}
              {[34, 194, 354, 514].map((x) => (
                <g key={x}>
                  <rect x={x} y="34" width="110" height="140" rx="6" fill="#38BDF8" fillOpacity="0.22" stroke="#BAE6FD" strokeOpacity="0.45" strokeWidth="3" />
                  <line x1={x + 55} y1="34" x2={x + 55} y2="174" stroke="#BAE6FD" strokeOpacity="0.3" strokeWidth="2" />
                </g>
              ))}
              {/* Wainscoting & polished floor */}
              <rect x="0" y="200" width="640" height="58" fill="#1E293B" opacity="0.75" />
              <rect x="0" y="258" width="640" height="102" fill="#0F172A" />
              <polygon points="34,258 144,258 194,360 14,360" fill="#38BDF8" opacity="0.06" />
              <polygon points="514,258 624,258 640,360 460,360" fill="#38BDF8" opacity="0.06" />
            </g>
          )}

          {theme === 'canteen_hall' && (
            <g>
              <defs>
                <linearGradient id="bg-canteen" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1E1B2E" />
                  <stop offset="100%" stopColor="#7C2D12" />
                </linearGradient>
              </defs>
              <rect width="640" height="360" fill="url(#bg-canteen)" />
              {/* School store awning on left */}
              <rect x="26" y="42" width="170" height="175" rx="8" fill="#292524" stroke="#FB923C" strokeOpacity="0.45" strokeWidth="2.5" />
              <polygon points="18,42 204,42 214,76 8,76" fill="#EA580C" opacity="0.85" />
              {[24, 62, 100, 138, 176].map((x) => (
                <rect key={x} x={x} y="42" width="18" height="34" fill="#FEF3C7" opacity="0.75" />
              ))}
              {/* Vending machine on right */}
              <rect x="512" y="54" width="96" height="190" rx="8" fill="#1E293B" stroke="#FDBA74" strokeOpacity="0.45" strokeWidth="2.5" />
              <rect x="526" y="72" width="68" height="92" rx="4" fill="#0F172A" />
              <circle cx="542" cy="96" r="7" fill="#F59E0B" opacity="0.7" />
              <circle cx="562" cy="96" r="7" fill="#38BDF8" opacity="0.7" />
              <circle cx="580" cy="96" r="7" fill="#34D399" opacity="0.7" />
              {/* Checkered floor */}
              <rect x="0" y="256" width="640" height="104" fill="#1C1917" />
              <line x1="0" y1="296" x2="640" y2="296" stroke="#FDBA74" strokeOpacity="0.16" strokeWidth="2" />
            </g>
          )}

          {theme === 'art_room' && (
            <g>
              <defs>
                <linearGradient id="bg-art" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1E1B4B" />
                  <stop offset="100%" stopColor="#0F766E" />
                </linearGradient>
              </defs>
              <rect width="640" height="360" fill="url(#bg-art)" />
              {/* Easel silhouette on left */}
              <line x1="90" y1="68" x2="54" y2="256" stroke="#92400E" strokeWidth="6" strokeLinecap="round" />
              <line x1="90" y1="68" x2="126" y2="256" stroke="#92400E" strokeWidth="6" strokeLinecap="round" />
              <rect x="46" y="88" width="88" height="72" rx="4" fill="#F8FAFC" fillOpacity="0.16" stroke="#2DD4BF" strokeOpacity="0.5" strokeWidth="2.5" />
              {/* Framed posters on right */}
              <rect x="498" y="46" width="104" height="130" rx="6" fill="#0F172A" fillOpacity="0.6" stroke="#38BDF8" strokeOpacity="0.45" strokeWidth="2.5" />
              <circle cx="550" cy="100" r="24" fill="#F472B6" opacity="0.25" />
              <rect x="0" y="256" width="640" height="104" fill="#172554" opacity="0.65" />
            </g>
          )}

          {theme === 'club_room' && (
            <g>
              <defs>
                <linearGradient id="bg-club" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1E1B4B" />
                  <stop offset="100%" stopColor="#312E81" />
                </linearGradient>
              </defs>
              <rect width="640" height="360" fill="url(#bg-club)" />
              {/* Club corkboard on left */}
              <rect x="32" y="42" width="144" height="114" rx="6" fill="#78350F" fillOpacity="0.65" stroke="#A78BFA" strokeOpacity="0.45" strokeWidth="3" />
              <rect x="52" y="60" width="44" height="32" rx="2" fill="#FDE68A" opacity="0.45" />
              <rect x="110" y="70" width="46" height="40" rx="2" fill="#BAE6FD" opacity="0.4" />
              {/* Club cabinet on right */}
              <rect x="488" y="42" width="118" height="205" rx="6" fill="#1E293B" stroke="#818CF8" strokeOpacity="0.45" strokeWidth="2.5" />
              <line x1="488" y1="108" x2="606" y2="108" stroke="#6366F1" strokeOpacity="0.35" strokeWidth="2" />
              <line x1="488" y1="172" x2="606" y2="172" stroke="#6366F1" strokeOpacity="0.35" strokeWidth="2" />
              {/* Floor */}
              <rect x="0" y="256" width="640" height="104" fill="#0F172A" opacity="0.85" />
              <ellipse cx="320" cy="60" rx="200" ry="45" fill="#A78BFA" opacity="0.1" />
            </g>
          )}

          {theme === 'broadcast_room' && (
            <g>
              <defs>
                <linearGradient id="bg-bcast" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#18181B" />
                  <stop offset="100%" stopColor="#7C2D12" />
                </linearGradient>
              </defs>
              <rect width="640" height="360" fill="url(#bg-bcast)" />
              {/* Studio soundproof acoustic panels */}
              {[36, 92, 502, 558].map((x) => (
                <rect key={x} x={x} y="42" width="42" height="160" rx="4" fill="#27272A" stroke="#FB923C" strokeOpacity="0.35" strokeWidth="1.5" />
              ))}
              {/* Studio window silhouette */}
              <rect x="150" y="38" width="340" height="164" rx="8" fill="#09090B" fillOpacity="0.55" stroke="#FB923C" strokeOpacity="0.4" strokeWidth="3" />
              <rect x="0" y="256" width="640" height="104" fill="#18181B" />
              <ellipse cx="320" cy="70" rx="180" ry="50" fill="#FB923C" opacity="0.14" />
            </g>
          )}

          {theme === 'locker_hall' && (
            <g>
              <defs>
                <linearGradient id="bg-lockers" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0F172A" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>
              </defs>
              <rect width="640" height="360" fill="url(#bg-lockers)" />
              {/* Row of school lockers on left and right */}
              {[24, 88, 492, 556].map((x) => (
                <g key={x}>
                  <rect x={x} y="40" width="58" height="214" rx="4" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
                  <line x1={x + 12} y1="60" x2={x + 46} y2="60" stroke="#475569" strokeWidth="3" />
                  <line x1={x + 12} y1="70" x2={x + 46} y2="70" stroke="#475569" strokeWidth="3" />
                  <circle cx={x + 48} cy="145" r="3" fill="#FBBF24" opacity="0.7" />
                </g>
              ))}
              <rect x="0" y="254" width="640" height="106" fill="#0B1120" />
            </g>
          )}

          {theme === 'auditorium' && (
            <g>
              <defs>
                <linearGradient id="bg-audit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E0B1A" />
                  <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>
              </defs>
              <rect width="640" height="360" fill="url(#bg-audit)" />
              {/* Left & Right Stage Curtains */}
              <path d="M 0 0 L 125 0 Q 95 140 112 268 L 0 268 Z" fill="#881337" opacity="0.88" />
              <path d="M 640 0 L 515 0 Q 545 140 528 268 L 640 268 Z" fill="#881337" opacity="0.88" />
              {/* Top stage valance */}
              <path d="M 0 0 L 640 0 L 640 34 Q 480 54 320 32 Q 160 54 0 34 Z" fill="#9F1239" />
              {/* Wooden stage floor */}
              <rect x="0" y="264" width="640" height="96" fill="#451A03" />
              <line x1="0" y1="292" x2="640" y2="292" stroke="#78350F" strokeWidth="2" />
              <line x1="0" y1="324" x2="640" y2="324" stroke="#78350F" strokeWidth="2" />
              {/* Overhead golden spotlight cones */}
              <polygon points="180,0 260,264 110,264" fill="#FBBF24" opacity="0.1" />
              <polygon points="460,0 530,264 380,264" fill="#FBBF24" opacity="0.1" />
            </g>
          )}
        </svg>
      </motion.div>
    </AnimatePresence>
  );
}
