import { motion } from 'motion/react';

interface ClueSceneIllustrationProps {
  sceneKey: string;
}

export function ClueSceneIllustration({ sceneKey }: ClueSceneIllustrationProps) {
  switch (sceneKey) {
    // =========================================================================
    // MINI-QUIZZES
    // =========================================================================
    case 'mq-1':
      return (
        <svg viewBox="0 0 360 150" className="w-full h-full" aria-hidden="true">
          {/* Simple classroom chalkboard card */}
          <rect x="38" y="16" width="284" height="114" rx="14" fill="#0F3D3E" stroke="#F59E0B" strokeOpacity="0.45" strokeWidth="2.5" />
          {/* Active vs Passive comparison diagram */}
          <g transform="translate(66, 40)">
            <rect x="0" y="0" width="96" height="58" rx="10" fill="#0284C7" fillOpacity="0.25" stroke="#38BDF8" strokeWidth="1.8" />
            <circle cx="28" cy="24" r="10" fill="#38BDF8" />
            <path d="M 46 24 L 78 24" stroke="#F8FAFC" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="78,19 88,24 78,29" fill="#F8FAFC" />
            <text x="48" y="48" textAnchor="middle" fill="#BAE6FD" fontSize="10" fontWeight="700">능동: 직접 함</text>
          </g>
          <text x="180" y="74" textAnchor="middle" fill="#FBBF24" fontSize="13" fontWeight="800">VS</text>
          <g transform="translate(198, 40)">
            <rect x="0" y="0" width="96" height="58" rx="10" fill="#D97706" fillOpacity="0.25" stroke="#FBBF24" strokeWidth="1.8" />
            <path d="M 16 24 L 46 24" stroke="#FDE68A" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="46,19 56,24 46,29" fill="#FDE68A" />
            <rect x="62" y="12" width="20" height="24" rx="4" fill="#FBBF24" />
            <text x="48" y="48" textAnchor="middle" fill="#FDE68A" fontSize="10" fontWeight="700">수동: be + p.p.</text>
          </g>
        </svg>
      );

    case 'mq-2':
      return (
        <svg viewBox="0 0 360 150" className="w-full h-full" aria-hidden="true">
          <rect x="44" y="20" width="272" height="106" rx="14" fill="#0F172A" fillOpacity="0.7" stroke="#34D399" strokeOpacity="0.45" strokeWidth="2" />
          <rect x="64" y="42" width="102" height="44" rx="9" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
          <text x="115" y="61" textAnchor="middle" fill="#E0F2FE" fontSize="10" fontWeight="700">행위자 (주어)</text>
          <text x="115" y="75" textAnchor="middle" fill="#38BDF8" fontSize="9">A student</text>
          <motion.g
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d="M 172 64 L 194 64" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
            <polygon points="193,58 203,64 193,70" fill="#FBBF24" />
          </motion.g>
          <rect x="208" y="42" width="90" height="44" rx="9" fill="#451A03" fillOpacity="0.65" stroke="#FBBF24" strokeWidth="1.8" />
          <text x="253" y="62" textAnchor="middle" fill="#FDE68A" fontSize="12" fontWeight="800">by + 행위자</text>
          <text x="253" y="76" textAnchor="middle" fill="#FCD34D" fontSize="9">by a student</text>
          <text x="180" y="109" textAnchor="middle" fill="#6EE7B7" fontSize="10" fontWeight="600">목격자 진술 · 능동 → 수동 전환</text>
        </svg>
      );

    case 'mq-3':
      return (
        <svg viewBox="0 0 360 150" className="w-full h-full" aria-hidden="true">
          <rect x="44" y="20" width="272" height="106" rx="14" fill="#1E1B4B" fillOpacity="0.72" stroke="#A78BFA" strokeOpacity="0.5" strokeWidth="2" />
          <rect x="66" y="44" width="66" height="42" rx="9" fill="#F59E0B" />
          <text x="99" y="69" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="800">Was / Were</text>
          <text x="143" y="69" textAnchor="middle" fill="#CBD5E1" fontSize="14" fontWeight="700">+</text>
          <rect x="154" y="44" width="62" height="42" rx="9" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.8" />
          <text x="185" y="69" textAnchor="middle" fill="#E0F2FE" fontSize="12" fontWeight="700">주어</text>
          <text x="227" y="69" textAnchor="middle" fill="#CBD5E1" fontSize="14" fontWeight="700">+</text>
          <rect x="238" y="44" width="60" height="42" rx="9" fill="#1E293B" stroke="#34D399" strokeWidth="1.8" />
          <text x="268" y="69" textAnchor="middle" fill="#A7F3D0" fontSize="12" fontWeight="700">p.p. ?</text>
          <text x="180" y="108" textAnchor="middle" fill="#FCA5A5" fontSize="10" fontWeight="700">주의: Did는 절대 쓰지 않아요!</text>
        </svg>
      );

    // =========================================================================
    // STAGE 1: 학생회실 단서별 그림
    // =========================================================================
    case 's1-q1':
      // 황금 트로피가 어제 도난당했다 -> 빈 트로피 진열대와 점선 트로피 실루엣
      return (
        <svg viewBox="0 0 360 150" className="w-full h-full" aria-hidden="true">
          <rect x="115" y="96" width="130" height="32" rx="6" fill="#78350F" stroke="#F59E0B" strokeWidth="1.5" />
          <rect x="128" y="88" width="104" height="10" rx="3" fill="#B45309" />
          {/* Dashed missing trophy outline */}
          <motion.g
            animate={{ opacity: [0.45, 0.95, 0.45] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <path
              d="M 158 32 L 202 32 L 198 60 C 196 72, 188 76, 180 76 C 172 76, 164 72, 162 60 Z"
              fill="#FBBF24"
              fillOpacity="0.14"
              stroke="#FBBF24"
              strokeWidth="2.4"
              strokeDasharray="5 4"
            />
            <path d="M 158 38 C 145 38, 145 55, 160 56" fill="none" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4 3" />
            <path d="M 202 38 C 215 38, 215 55, 200 56" fill="none" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4 3" />
            <line x1="180" y1="76" x2="180" y2="88" stroke="#FBBF24" strokeWidth="2.5" strokeDasharray="3 3" />
          </motion.g>
          <rect x="220" y="24" width="68" height="24" rx="6" fill="#E11D48" />
          <text x="254" y="40" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="800">MISSING!</text>
        </svg>
      );

    case 's1-q2':
      // 누군가가 그 유리 진열장을 열었다 -> 문이 활짝 열린 유리 진열장
      return (
        <svg viewBox="0 0 360 150" className="w-full h-full" aria-hidden="true">
          {/* Cabinet frame */}
          <rect x="115" y="22" width="100" height="100" rx="6" fill="#1E293B" fillOpacity="0.8" stroke="#38BDF8" strokeWidth="2.5" />
          <line x1="115" y1="74" x2="215" y2="74" stroke="#38BDF8" strokeOpacity="0.4" strokeWidth="1.5" />
          {/* Swung open glass door */}
          <motion.g
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '215px 72px' }}
          >
            <polygon points="215,22 268,14 268,130 215,122" fill="#38BDF8" fillOpacity="0.22" stroke="#7DD3FC" strokeWidth="2.2" />
            <circle cx="256" cy="72" r="4" fill="#FBBF24" />
          </motion.g>
          {/* Open glow indicator */}
          <circle cx="165" cy="52" r="14" fill="#38BDF8" fillOpacity="0.16" stroke="#38BDF8" strokeDasharray="3 3" strokeWidth="1.5" />
          <text x="165" y="110" textAnchor="middle" fill="#7DD3FC" fontSize="10" fontWeight="700">OPENED</text>
        </svg>
      );

    case 's1-q3':
      // 그 열쇠는 책상 위에서 발견되었다 -> 책상 위 황금 열쇠와 돋보기
      return (
        <svg viewBox="0 0 360 150" className="w-full h-full" aria-hidden="true">
          {/* Wooden Desk */}
          <polygon points="65,88 295,88 318,128 42,128" fill="#78350F" stroke="#B45309" strokeWidth="2" />
          <rect x="42" y="124" width="276" height="8" rx="3" fill="#451A03" />
          {/* Brass Key */}
          <g transform="translate(135, 92) rotate(-8)">
            <circle cx="14" cy="14" r="11" fill="none" stroke="#FBBF24" strokeWidth="4.5" />
            <rect x="24" y="11" width="46" height="6" rx="2" fill="#FBBF24" />
            <rect x="54" y="17" width="5" height="9" rx="1" fill="#FBBF24" />
            <rect x="63" y="17" width="5" height="7" rx="1" fill="#FBBF24" />
          </g>
          {/* Animated Magnifying Glass */}
          <motion.g
            animate={{ x: [-6, 6, -6], y: [-3, 3, -3] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle cx="174" cy="64" r="24" fill="#38BDF8" fillOpacity="0.18" stroke="#E2E8F0" strokeWidth="4" />
            <line x1="191" y1="81" x2="212" y2="102" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" />
          </motion.g>
        </svg>
      );

    case 's1-q4':
      // 배터리 하나가 바닥에 남겨져 있었다 -> 바닥 타일 위 원통형 배터리
      return (
        <svg viewBox="0 0 360 150" className="w-full h-full" aria-hidden="true">
          {/* Floor tiles */}
          <polygon points="50,86 310,86 334,132 26,132" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
          <line x1="140" y1="86" x2="120" y2="132" stroke="#334155" strokeWidth="1.5" />
          <line x1="220" y1="86" x2="240" y2="132" stroke="#334155" strokeWidth="1.5" />
          {/* Dropped Battery */}
          <g transform="translate(136, 86) rotate(-10)">
            <rect x="0" y="6" width="66" height="24" rx="5" fill="#F59E0B" stroke="#FDE68A" strokeWidth="2" />
            <rect x="38" y="6" width="28" height="24" rx="4" fill="#0F172A" />
            <rect x="66" y="12" width="6" height="12" rx="2" fill="#CBD5E1" />
            <text x="19" y="22" textAnchor="middle" fill="#0F172A" fontSize="11" fontWeight="800">+</text>
            <text x="52" y="22" textAnchor="middle" fill="#FBBF24" fontSize="11" fontWeight="800">-</text>
          </g>
          {/* Glow ring */}
          <motion.circle
            cx="172"
            cy="95"
            r="36"
            fill="none"
            stroke="#F472B6"
            strokeWidth="2"
            strokeDasharray="4 4"
            animate={{ scale: [0.92, 1.06, 0.92], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
      );

    case 's1-q5':
      // 이 방은 매일 선생님에 의해 잠긴다 -> 5:30 시계와 자물쇠가 채워진 교실 문
      return (
        <svg viewBox="0 0 360 150" className="w-full h-full" aria-hidden="true">
          {/* Classroom door */}
          <rect x="92" y="18" width="76" height="114" rx="6" fill="#475569" stroke="#94A3B8" strokeWidth="2" />
          <rect x="104" y="30" width="52" height="32" rx="4" fill="#1E293B" stroke="#38BDF8" strokeOpacity="0.5" strokeWidth="1.5" />
          {/* Padlock */}
          <motion.g
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            <path d="M 146 78 C 146 66, 166 66, 166 78" fill="none" stroke="#CBD5E1" strokeWidth="4" />
            <rect x="140" y="78" width="32" height="26" rx="5" fill="#F59E0B" stroke="#FEF3C7" strokeWidth="1.8" />
            <circle cx="156" cy="90" r="3.5" fill="#0F172A" />
          </motion.g>
          {/* Clock showing 5:30 */}
          <circle cx="242" cy="64" r="34" fill="#0F172A" stroke="#FBBF24" strokeWidth="3" />
          <circle cx="242" cy="64" r="3" fill="#FBBF24" />
          <line x1="242" y1="64" x2="255" y2="75" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
          <line x1="242" y1="64" x2="242" y2="90" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
          <text x="242" y="114" textAnchor="middle" fill="#FDE68A" fontSize="11" fontWeight="700">EVERY DAY 5:30</text>
        </svg>
      );

    // =========================================================================
    // STAGE 2: 여러 목격자 증언별 단서 그림
    // =========================================================================
    case 's2-q1':
      // 그 큰 가방이 복도에서 목격되었나요? -> 복도 속 커다란 검은 가방 실루엣
      return (
        <svg viewBox="0 0 360 150" className="w-full h-full" aria-hidden="true">
          {/* Simple hallway perspective */}
          <polygon points="30,18 330,18 280,108 80,108" fill="#0F172A" fillOpacity="0.45" stroke="#34D399" strokeOpacity="0.35" strokeWidth="1.5" />
          {/* Large dark equipment bag */}
          <motion.g
            animate={{ x: [-4, 4, -4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d="M 154 50 C 154 36, 206 36, 206 50" fill="none" stroke="#94A3B8" strokeWidth="4" />
            <rect x="130" y="48" width="100" height="58" rx="12" fill="#1E293B" stroke="#34D399" strokeWidth="2.5" />
            <line x1="130" y1="70" x2="230" y2="70" stroke="#34D399" strokeOpacity="0.6" strokeWidth="2" />
            <rect x="172" y="65" width="16" height="10" rx="2" fill="#FBBF24" />
          </motion.g>
          <text x="180" y="126" textAnchor="middle" fill="#6EE7B7" fontSize="11" fontWeight="700">LARGE BAG IN HALLWAY?</text>
        </svg>
      );

    case 's2-q2':
      // 사서 선생님이 5시에 한 학생을 보셨다 -> 5시 정각 시계 & 복도 그림자 목격
      return (
        <svg viewBox="0 0 360 150" className="w-full h-full" aria-hidden="true">
          {/* 5:00 Clock */}
          <circle cx="110" cy="64" r="32" fill="#0F172A" stroke="#60A5FA" strokeWidth="3" />
          <line x1="110" y1="64" x2="110" y2="38" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="110" y1="64" x2="124" y2="78" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
          <circle cx="110" cy="64" r="3" fill="#60A5FA" />
          <text x="110" y="112" textAnchor="middle" fill="#93C5FD" fontSize="11" fontWeight="700">PM 5:00</text>
          {/* Witness sighting beam & hurrying student silhouette */}
          <motion.polygon
            points="152,64 252,32 252,96"
            fill="#60A5FA"
            fillOpacity="0.18"
            animate={{ opacity: [0.12, 0.3, 0.12] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <circle cx="242" cy="48" r="11" fill="#38BDF8" />
          <path d="M 224 94 L 236 62 L 252 62 L 266 94 Z" fill="#1D4ED8" stroke="#93C5FD" strokeWidth="1.5" />
        </svg>
      );

    case 's2-q3':
      // 그 카메라는 누군가에 의해 꺼졌다 -> 전원이 꺼진 복도 CCTV 카메라
      return (
        <svg viewBox="0 0 360 150" className="w-full h-full" aria-hidden="true">
          {/* Wall mount */}
          <rect x="86" y="34" width="12" height="44" rx="4" fill="#475569" />
          <line x1="98" y1="54" x2="132" y2="54" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
          {/* CCTV Body */}
          <g transform="translate(128, 36) rotate(12)">
            <rect x="0" y="0" width="84" height="36" rx="8" fill="#1E293B" stroke="#2DD4BF" strokeWidth="2.2" />
            <rect x="84" y="6" width="14" height="24" rx="3" fill="#334155" />
            <circle cx="18" cy="18" r="5" fill="#EF4444" />
          </g>
          {/* OFF badge */}
          <motion.g
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            <rect x="226" y="42" width="66" height="30" rx="8" fill="#991B1B" stroke="#F87171" strokeWidth="1.8" />
            <text x="259" y="61" textAnchor="middle" fill="#FEE2E2" fontSize="11" fontWeight="800">PWR OFF</text>
          </motion.g>
          <text x="180" y="114" textAnchor="middle" fill="#5EEAD4" fontSize="10" fontWeight="700">CCTV TURNED OFF</text>
        </svg>
      );

    case 's2-q4':
      // 그 창문이 깨졌나요? -> 흠집 없이 반짝이는 복도 창문
      return (
        <svg viewBox="0 0 360 150" className="w-full h-full" aria-hidden="true">
          {/* Window Frame */}
          <rect x="108" y="18" width="144" height="104" rx="8" fill="#0EA5E9" fillOpacity="0.22" stroke="#C084FC" strokeWidth="3" />
          <line x1="180" y1="18" x2="180" y2="122" stroke="#C084FC" strokeWidth="2.5" />
          <line x1="108" y1="70" x2="252" y2="70" stroke="#C084FC" strokeWidth="2.5" />
          {/* Shine streaks */}
          <line x1="124" y1="34" x2="148" y2="54" stroke="#E0F2FE" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
          <line x1="202" y1="84" x2="228" y2="106" stroke="#E0F2FE" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
          {/* Intact checkmark */}
          <motion.g
            animate={{ scale: [0.95, 1.08, 0.95] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            style={{ transformOrigin: '252px 32px' }}
          >
            <circle cx="252" cy="32" r="14" fill="#10B981" />
            <path d="M 245 32 L 250 37 L 260 27" fill="none" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>
        </svg>
      );

    case 's2-q5':
      // 초콜릿 포장지가 한 학생에 의해 떨어뜨려졌다 -> 매점 앞 복도에 떨어진 초콜릿 포장지
      return (
        <svg viewBox="0 0 360 150" className="w-full h-full" aria-hidden="true">
          <polygon points="50,84 310,84 334,132 26,132" fill="#1E293B" stroke="#FB923C" strokeOpacity="0.35" strokeWidth="1.5" />
          {/* Dropped Chocolate Wrapper */}
          <motion.g
            transform="translate(132, 74) rotate(-9)"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          >
            <polygon points="0,8 12,18 0,28" fill="#FDBA74" />
            <rect x="10" y="6" width="76" height="24" rx="4" fill="#7C2D12" stroke="#FDBA74" strokeWidth="2" />
            <polygon points="96,8 84,18 96,28" fill="#FDBA74" />
            <rect x="22" y="11" width="52" height="14" rx="2" fill="#F59E0B" />
            <text x="48" y="21" textAnchor="middle" fill="#451A03" fontSize="8.5" fontWeight="800">CHOCO</text>
          </motion.g>
          <text x="180" y="122" textAnchor="middle" fill="#FDBA74" fontSize="10" fontWeight="700">DROPPED WRAPPER</text>
        </svg>
      );

    // =========================================================================
    // STAGE 3: 용의자 추리 단서별 그림
    // =========================================================================
    case 's3-q1':
      // 그 파란 손수건이 태오에 의해 사용되었나요? -> 증거 스포트라이트 아래 파란 손수건
      return (
        <svg viewBox="0 0 360 150" className="w-full h-full" aria-hidden="true">
          <ellipse cx="180" cy="112" rx="78" ry="14" fill="#38BDF8" fillOpacity="0.16" />
          <motion.g
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '180px 66px' }}
          >
            <path
              d="M 134 32 L 222 26 L 232 98 L 138 106 Z"
              fill="#2563EB"
              stroke="#93C5FD"
              strokeWidth="2.5"
            />
            <path
              d="M 148 44 L 210 38 L 218 88 L 150 94 Z"
              fill="none"
              stroke="#BFDBFE"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
            <text x="184" y="72" textAnchor="middle" fill="#E0F2FE" fontSize="11" fontWeight="800">TAEO?</text>
          </motion.g>
        </svg>
      );

    case 's3-q2':
      // 태오는 친구에게 그 손수건을 빌려주었다 -> 농구공과 함께 손수건을 건네는 모습
      return (
        <svg viewBox="0 0 360 150" className="w-full h-full" aria-hidden="true">
          <rect x="64" y="28" width="84" height="74" rx="12" fill="#0F766E" fillOpacity="0.35" stroke="#2DD4BF" strokeWidth="2" />
          <text x="106" y="56" textAnchor="middle" fill="#99F6E4" fontSize="11" fontWeight="800">태오</text>
          <text x="106" y="76" textAnchor="middle" fill="#CCFBF1" fontSize="9.5">미술부</text>

          <motion.g
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <rect x="160" y="48" width="34" height="24" rx="4" fill="#3B82F6" stroke="#BFDBFE" strokeWidth="1.8" />
            <path d="M 156 84 L 198 84" stroke="#A3E635" strokeWidth="3" strokeLinecap="round" />
            <polygon points="196,79 206,84 196,89" fill="#A3E635" />
          </motion.g>

          <rect x="212" y="28" width="84" height="74" rx="12" fill="#3F6212" fillOpacity="0.4" stroke="#A3E635" strokeWidth="2" />
          <text x="254" y="56" textAnchor="middle" fill="#ECFCCB" fontSize="11" fontWeight="800">시우</text>
          <text x="254" y="76" textAnchor="middle" fill="#D9F99D" fontSize="9.5">체육부 (빌림)</text>
        </svg>
      );

    case 's3-q3':
      // 그 방 열쇠는 수빈이에 의해 보관되었나요? -> 반납 도장이 찍힌 열쇠와 관리 대장
      return (
        <svg viewBox="0 0 360 150" className="w-full h-full" aria-hidden="true">
          {/* Return ledger */}
          <rect x="90" y="24" width="122" height="96" rx="8" fill="#F8FAFC" stroke="#818CF8" strokeWidth="2.5" />
          <line x1="106" y1="46" x2="196" y2="46" stroke="#CBD5E1" strokeWidth="2" />
          <line x1="106" y1="64" x2="196" y2="64" stroke="#CBD5E1" strokeWidth="2" />
          <rect x="116" y="78" width="76" height="24" rx="5" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="2" />
          <text x="154" y="94" textAnchor="middle" fill="#047857" fontSize="10" fontWeight="800">4:50 반납</text>
          {/* Key tag */}
          <motion.g
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 2.6, repeat: Infinity }}
            style={{ transformOrigin: '254px 44px' }}
          >
            <circle cx="254" cy="44" r="14" fill="none" stroke="#FBBF24" strokeWidth="4.5" />
            <rect x="250" y="58" width="8" height="44" rx="3" fill="#FBBF24" />
            <rect x="258" y="84" width="10" height="6" rx="1" fill="#FBBF24" />
            <rect x="258" y="94" width="8" height="6" rx="1" fill="#FBBF24" />
          </motion.g>
        </svg>
      );

    case 's3-q4':
      // 방송실 문이 5시에 열렸나요? -> 살짝 열린 방송실 문과 ON AIR 사인
      return (
        <svg viewBox="0 0 360 150" className="w-full h-full" aria-hidden="true">
          {/* ON AIR sign */}
          <motion.g
            animate={{ opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            <rect x="132" y="14" width="96" height="24" rx="6" fill="#9A3412" stroke="#FB923C" strokeWidth="2" />
            <text x="180" y="30" textAnchor="middle" fill="#FFEDD5" fontSize="10.5" fontWeight="800">BROADCAST</text>
          </motion.g>
          {/* Doorway slightly ajar with light beam */}
          <rect x="138" y="44" width="84" height="86" rx="4" fill="#F59E0B" fillOpacity="0.25" stroke="#FB923C" strokeWidth="2" />
          <polygon points="138,44 198,52 198,122 138,130" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />
          <circle cx="188" cy="88" r="3.5" fill="#FBBF24" />
          {/* 5:00 badge */}
          <rect x="242" y="64" width="56" height="28" rx="8" fill="#0F172A" stroke="#FB923C" strokeWidth="1.8" />
          <text x="270" y="82" textAnchor="middle" fill="#FDBA74" fontSize="11" fontWeight="800">5:00 PM</text>
        </svg>
      );

    case 's3-q5':
      // 그 축제 리본은 준호의 사물함에서 발견되었다 -> 반쯤 열린 사물함 #14 밖으로 나온 황금 축제 리본
      return (
        <svg viewBox="0 0 360 150" className="w-full h-full" aria-hidden="true">
          {/* Locker #14 */}
          <rect x="132" y="18" width="96" height="112" rx="8" fill="#334155" stroke="#94A3B8" strokeWidth="2.5" />
          <line x1="148" y1="32" x2="212" y2="32" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
          <line x1="148" y1="42" x2="212" y2="42" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
          <rect x="164" y="54" width="32" height="18" rx="4" fill="#0F172A" />
          <text x="180" y="67" textAnchor="middle" fill="#FBBF24" fontSize="10" fontWeight="800">#14</text>
          {/* Golden festival ribbon peeking out */}
          <motion.g
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <path d="M 218 82 Q 252 72 272 94 Q 250 102 222 92 Z" fill="#F59E0B" stroke="#FEF08A" strokeWidth="2" />
            <path d="M 220 88 Q 248 106 262 122 L 246 124 Q 232 108 218 92 Z" fill="#D97706" stroke="#FEF08A" strokeWidth="1.5" />
          </motion.g>
        </svg>
      );

    // =========================================================================
    // STAGE 4: 범인 검거 최종 무대
    // =========================================================================
    case 'stage-4':
    default:
      return (
        <svg viewBox="0 0 360 150" className="w-full h-full" aria-hidden="true">
          {/* Spotlight beams */}
          <polygon points="100,0 165,130 65,130" fill="#FBBF24" fillOpacity="0.14" />
          <polygon points="260,0 295,130 195,130" fill="#38BDF8" fillOpacity="0.12" />
          {/* Three suspect silhouettes */}
          <circle cx="105" cy="54" r="14" fill="#334155" stroke="#64748B" strokeWidth="2" />
          <path d="M 83 102 C 83 80, 127 80, 127 102 Z" fill="#334155" />
          <circle cx="180" cy="48" r="16" fill="#475569" stroke="#FBBF24" strokeWidth="2.5" />
          <path d="M 154 102 C 154 76, 206 76, 206 102 Z" fill="#475569" />
          <circle cx="255" cy="54" r="14" fill="#334155" stroke="#64748B" strokeWidth="2" />
          <path d="M 233 102 C 233 80, 277 80, 277 102 Z" fill="#334155" />
          <text x="180" y="124" textAnchor="middle" fill="#FDE68A" fontSize="11" fontWeight="800">WHO IS THE CULPRIT?</text>
        </svg>
      );
  }
}
