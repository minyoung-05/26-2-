import { motion } from 'motion/react';
import { CharacterId, CharacterMood } from '../types/game';

interface CharacterAvatarProps {
  characterId: CharacterId;
  mood?: CharacterMood;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

type AccessoryType =
  | 'detective'
  | 'goggles'
  | 'camera'
  | 'teacher_tie'
  | 'glasses'
  | 'armband'
  | 'cap'
  | 'hairpin'
  | 'snack'
  | 'beret'
  | 'sportband'
  | 'badge'
  | 'headphones';

type HairStyle = 'long' | 'bob' | 'short' | 'spiky' | 'bun' | 'parted';

const PALETTES: Record<
  CharacterId,
  {
    bg: string;
    hair: string;
    hairStyle: HairStyle;
    outfit: string;
    accent: string;
    skin: string;
    accessory: AccessoryType;
  }
> = {
  minji: {
    bg: '#1E293B',
    hair: '#292524',
    hairStyle: 'long',
    outfit: '#1E3A5F',
    accent: '#F59E0B',
    skin: '#FDE4CF',
    accessory: 'detective',
  },
  doyun: {
    bg: '#0F172A',
    hair: '#1E293B',
    hairStyle: 'spiky',
    outfit: '#0E7490',
    accent: '#22D3EE',
    skin: '#FCE1CA',
    accessory: 'goggles',
  },
  haeun: {
    bg: '#1E1B4B',
    hair: '#4A2C2A',
    hairStyle: 'bob',
    outfit: '#9D174D',
    accent: '#F472B6',
    skin: '#FDE8D7',
    accessory: 'camera',
  },
  teacher_kim: {
    bg: '#1E293B',
    hair: '#334155',
    hairStyle: 'parted',
    outfit: '#374151',
    accent: '#FBBF24',
    skin: '#F9D6BA',
    accessory: 'teacher_tie',
  },
  librarian: {
    bg: '#1E293B',
    hair: '#475569',
    hairStyle: 'bun',
    outfit: '#065F46',
    accent: '#34D399',
    skin: '#FCE1CA',
    accessory: 'glasses',
  },
  jihoon: {
    bg: '#0F172A',
    hair: '#172554',
    hairStyle: 'short',
    outfit: '#1D4ED8',
    accent: '#60A5FA',
    skin: '#FBDAC0',
    accessory: 'armband',
  },
  guard: {
    bg: '#1E293B',
    hair: '#64748B',
    hairStyle: 'short',
    outfit: '#115E59',
    accent: '#2DD4BF',
    skin: '#F5CCA8',
    accessory: 'cap',
  },
  yuna: {
    bg: '#1E1B4B',
    hair: '#3B2F2F',
    hairStyle: 'long',
    outfit: '#6D28D9',
    accent: '#C084FC',
    skin: '#FDE8D7',
    accessory: 'hairpin',
  },
  minho: {
    bg: '#1E293B',
    hair: '#451A03',
    hairStyle: 'spiky',
    outfit: '#C2410C',
    accent: '#FDBA74',
    skin: '#FCDDC4',
    accessory: 'snack',
  },
  taeo: {
    bg: '#1E293B',
    hair: '#3F2E26',
    hairStyle: 'parted',
    outfit: '#0F766E',
    accent: '#2DD4BF',
    skin: '#FDE4CF',
    accessory: 'beret',
  },
  siwoo: {
    bg: '#0F172A',
    hair: '#27272A',
    hairStyle: 'short',
    outfit: '#3F6212',
    accent: '#A3E635',
    skin: '#F9D6BA',
    accessory: 'sportband',
  },
  subin: {
    bg: '#1E293B',
    hair: '#1E1B4B',
    hairStyle: 'long',
    outfit: '#3730A3',
    accent: '#818CF8',
    skin: '#FDE8D7',
    accessory: 'badge',
  },
  junho: {
    bg: '#1E293B',
    hair: '#1F2937',
    hairStyle: 'parted',
    outfit: '#7C2D12',
    accent: '#FB923C',
    skin: '#FCDDC4',
    accessory: 'headphones',
  },
};

export function CharacterAvatar({
  characterId,
  mood = 'normal',
  size = 'md',
  animate = true,
}: CharacterAvatarProps) {
  const p = PALETTES[characterId];
  const dims =
    size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-28 h-28' : 'w-16 h-16';

  const renderMouth = () => {
    switch (mood) {
      case 'happy':
        return (
          <path
            d="M 41 62 Q 50 71 59 62"
            fill="none"
            stroke="#7C2D12"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        );
      case 'surprised':
        return <ellipse cx="50" cy="64" rx="4" ry="5" fill="#9A3412" />;
      case 'nervous':
        return (
          <path
            d="M 42 65 Q 46 62 50 65 T 58 65"
            fill="none"
            stroke="#7C2D12"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        );
      case 'thinking':
        return (
          <path
            d="M 44 64 L 56 62"
            fill="none"
            stroke="#7C2D12"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        );
      default:
        return (
          <path
            d="M 43 63 Q 50 67 57 63"
            fill="none"
            stroke="#7C2D12"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        );
    }
  };

  return (
    <motion.div
      className={`${dims} relative shrink-0 rounded-2xl overflow-hidden border border-slate-600/60 shadow-lg bg-slate-800`}
      initial={animate ? { opacity: 0, y: 8, scale: 0.96 } : false}
      animate={
        animate
          ? {
              opacity: 1,
              y: mood === 'happy' ? [0, -4, 0] : [0, -1.5, 0],
              scale: 1,
            }
          : undefined
      }
      transition={{
        opacity: { duration: 0.25 },
        y: {
          duration: mood === 'happy' ? 0.6 : 3.2,
          repeat: mood === 'happy' ? 1 : Infinity,
          ease: 'easeInOut',
        },
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
        <defs>
          <linearGradient id={`bg-${characterId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={p.bg} />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#bg-${characterId})`} />

        {/* Subtle accent aura */}
        <circle cx="50" cy="48" r="36" fill={p.accent} opacity="0.14" />

        {/* Bun hair top-back */}
        {p.hairStyle === 'bun' && (
          <circle cx="50" cy="17" r="10" fill={p.hair} />
        )}

        {/* Shoulders / Uniform */}
        <path
          d="M 18 100 C 18 78, 32 74, 50 74 C 68 74, 82 78, 82 100 Z"
          fill={p.outfit}
        />
        <polygon points="41,74 50,86 59,74" fill="#F8FAFC" />
        <polygon points="48,79 52,79 53,93 50,97 47,93" fill={p.accent} />

        {/* Neck */}
        <rect x="44" y="66" width="12" height="12" rx="4" fill={p.skin} />

        {/* Hair back for long/bob */}
        {p.hairStyle === 'long' && (
          <path
            d="M 24 44 C 22 66, 25 78, 32 80 L 68 80 C 75 78, 78 66, 76 44 Z"
            fill={p.hair}
          />
        )}
        {p.hairStyle === 'bob' && (
          <path
            d="M 24 42 C 22 57, 25 65, 31 68 L 69 68 C 75 65, 78 57, 76 42 Z"
            fill={p.hair}
          />
        )}

        {/* Head / Face */}
        <ellipse cx="50" cy="47" rx="22" ry="24" fill={p.skin} />

        {/* Blush */}
        <ellipse cx="36" cy="54" rx="4" ry="2" fill="#FDA4AF" opacity="0.45" />
        <ellipse cx="64" cy="54" rx="4" ry="2" fill="#FDA4AF" opacity="0.45" />

        {/* Eyes */}
        {mood === 'happy' ? (
          <>
            <path
              d="M 36 48 Q 41 43 46 48"
              fill="none"
              stroke="#1E293B"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path
              d="M 54 48 Q 59 43 64 48"
              fill="none"
              stroke="#1E293B"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <circle cx="41" cy="48" r="3.2" fill="#1E293B" />
            <circle cx="59" cy="48" r="3.2" fill="#1E293B" />
            <circle cx="42" cy="46.8" r="1.1" fill="#FFFFFF" />
            <circle cx="60" cy="46.8" r="1.1" fill="#FFFFFF" />
          </>
        )}

        {/* Eyebrows */}
        <path
          d={
            mood === 'nervous'
              ? 'M 36 41 Q 41 43 45 40'
              : 'M 36 41 Q 41 39 45 41'
          }
          fill="none"
          stroke={p.hair}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d={
            mood === 'nervous'
              ? 'M 55 40 Q 59 43 64 41'
              : 'M 55 41 Q 59 39 64 41'
          }
          fill="none"
          stroke={p.hair}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Mouth */}
        {renderMouth()}

        {/* Nervous sweat drop */}
        {mood === 'nervous' && (
          <path
            d="M 70 36 Q 73 42 70 45 Q 67 42 70 36 Z"
            fill="#38BDF8"
          />
        )}

        {/* Front Hair Bangs */}
        {p.hairStyle === 'spiky' ? (
          <path
            d="M 27 42 C 28 24, 38 18, 50 18 C 62 18, 72 24, 73 42 L 66 31 L 58 37 L 50 28 L 42 37 L 34 31 Z"
            fill={p.hair}
          />
        ) : p.hairStyle === 'parted' ? (
          <path
            d="M 27 42 C 28 23, 40 19, 50 19 C 60 19, 72 23, 73 42 C 67 33, 59 30, 52 37 C 46 31, 35 33, 27 42 Z"
            fill={p.hair}
          />
        ) : (
          <path
            d="M 27 42 C 28 24, 40 19, 50 19 C 60 19, 72 24, 73 42 C 67 34, 60 32, 54 36 C 50 31, 44 31, 39 36 C 34 33, 30 36, 27 42 Z"
            fill={p.hair}
          />
        )}

        {/* Character-specific Accessories */}
        {p.accessory === 'detective' && (
          <g>
            <path
              d="M 30 26 Q 50 13 70 26 L 74 30 Q 50 24 26 30 Z"
              fill="#B45309"
            />
            <path
              d="M 32 27 Q 50 22 68 27"
              stroke="#FBBF24"
              strokeWidth="2.5"
              fill="none"
            />
          </g>
        )}

        {p.accessory === 'goggles' && (
          <g>
            <rect x="29" y="23" width="42" height="5" rx="2.5" fill="#0E7490" />
            <rect
              x="33"
              y="20"
              width="14"
              height="10"
              rx="4"
              fill="#67E8F9"
              stroke="#ECFEFF"
              strokeWidth="1.8"
            />
            <rect
              x="53"
              y="20"
              width="14"
              height="10"
              rx="4"
              fill="#67E8F9"
              stroke="#ECFEFF"
              strokeWidth="1.8"
            />
          </g>
        )}

        {p.accessory === 'camera' && (
          <g>
            <rect x="37" y="81" width="26" height="16" rx="3" fill="#1F2937" stroke="#F472B6" strokeWidth="1.5" />
            <circle cx="50" cy="89" r="5" fill="#38BDF8" stroke="#E2E8F0" strokeWidth="1.5" />
            <rect x="42" y="78" width="7" height="3" rx="1" fill="#374151" />
          </g>
        )}

        {p.accessory === 'teacher_tie' && (
          <g>
            <g stroke="#FBBF24" strokeWidth="1.8" fill="rgba(255,255,255,0.1)">
              <circle cx="41" cy="48" r="6.5" />
              <circle cx="59" cy="48" r="6.5" />
              <line x1="47.5" y1="48" x2="52.5" y2="48" />
            </g>
            <circle cx="64" cy="85" r="3" fill="#FBBF24" />
          </g>
        )}

        {p.accessory === 'glasses' && (
          <g stroke="#CBD5E1" strokeWidth="2" fill="rgba(255,255,255,0.12)">
            <rect x="33" y="43" width="14" height="10" rx="3" />
            <rect x="53" y="43" width="14" height="10" rx="3" />
            <line x1="47" y1="48" x2="53" y2="48" />
          </g>
        )}

        {p.accessory === 'armband' && (
          <g>
            <rect x="20" y="82" width="13" height="12" rx="2" fill="#EF4444" />
            <rect x="22" y="86" width="9" height="4" rx="1" fill="#FEF08A" />
          </g>
        )}

        {p.accessory === 'cap' && (
          <g>
            <path
              d="M 27 28 Q 50 13 73 28 Z"
              fill="#0F766E"
            />
            <rect x="25" y="26" width="52" height="5" rx="2.5" fill="#134E4A" />
            <circle cx="50" cy="21" r="2.8" fill="#FBBF24" />
          </g>
        )}

        {p.accessory === 'hairpin' && (
          <g>
            <rect
              x="60"
              y="32"
              width="10"
              height="4"
              rx="2"
              transform="rotate(20 65 34)"
              fill="#E879F9"
            />
            <circle cx="69" cy="35" r="2.2" fill="#FEF08A" />
          </g>
        )}

        {p.accessory === 'snack' && (
          <g>
            <rect x="61" y="79" width="14" height="16" rx="2" fill="#78350F" stroke="#FDBA74" strokeWidth="1.4" />
            <line x1="64" y1="84" x2="72" y2="84" stroke="#FDE68A" strokeWidth="1.5" />
          </g>
        )}

        {p.accessory === 'beret' && (
          <path
            d="M 27 28 C 32 14, 68 14, 74 28 C 62 24, 38 24, 27 28 Z"
            fill="#0F766E"
          />
        )}

        {p.accessory === 'sportband' && (
          <g>
            <path
              d="M 28 32 Q 50 26 72 32 L 73 37 Q 50 31 27 37 Z"
              fill="#84CC16"
            />
            <line x1="44" y1="31" x2="56" y2="31" stroke="#ECFCCB" strokeWidth="2" />
          </g>
        )}

        {p.accessory === 'badge' && (
          <g>
            <circle cx="65" cy="86" r="4.5" fill="#FBBF24" />
            <circle cx="65" cy="86" r="2" fill="#FFFBEB" />
          </g>
        )}

        {p.accessory === 'headphones' && (
          <g>
            <path
              d="M 26 48 C 24 20, 76 20, 74 48"
              fill="none"
              stroke="#EA580C"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <rect x="22" y="42" width="7" height="16" rx="3.5" fill="#FB923C" />
            <rect x="71" y="42" width="7" height="16" rx="3.5" fill="#FB923C" />
          </g>
        )}
      </svg>
    </motion.div>
  );
}
