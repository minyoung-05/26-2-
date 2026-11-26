import { motion, AnimatePresence } from 'motion/react';
import { MapPin } from 'lucide-react';
import { CharacterId, CharacterMood } from '../types/game';
import { CHARACTER_META } from '../data/curriculum';
import { CharacterAvatar } from './CharacterAvatar';
import { ClueSceneIllustration } from './ClueSceneIllustration';
import { LocationBackdrop } from './LocationBackdrop';

interface SceneStageProps {
  stageNumber: number;
  location: string;
  sceneKey: string;
  activeCharacter: CharacterId;
  characterMood: CharacterMood;
  speechText: string;
  celebrateClue?: boolean;
}

export function SceneStage({
  stageNumber,
  location,
  sceneKey,
  activeCharacter,
  characterMood,
  speechText,
  celebrateClue = false,
}: SceneStageProps) {
  const speaker = CHARACTER_META[activeCharacter];

  return (
    <section
      aria-label="사건 현장 일러스트 및 등장인물 대화"
      className="relative w-full min-h-[240px] sm:h-[225px] lg:h-[235px] rounded-2xl overflow-hidden border border-slate-700/70 bg-slate-900 shrink-0 px-4 py-3.5 sm:px-6 sm:py-4"
    >
      {/* Wide Stylized School Room / Location Backdrop */}
      <LocationBackdrop sceneKey={sceneKey} />

      {/* Measured contrast scrim for foreground clarity */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/82 via-slate-950/40 to-slate-950/65 pointer-events-none" />

      {/* Subtle golden flash when a clue is unlocked */}
      <AnimatePresence>
        {celebrateClue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.28, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65 }}
            className="absolute inset-0 bg-amber-400 pointer-events-none z-20"
          />
        )}
      </AnimatePresence>

      {/* Panoramic Content Grid: Left (Location + Character Speech) / Right (Wide Clue Illustration) */}
      <div className="relative z-10 h-full flex flex-col sm:flex-row items-stretch justify-between gap-4 sm:gap-6">
        {/* Left: Location Badge & Character Dialogue */}
        <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-xs text-slate-100 shrink-0">
            <div className="inline-flex items-center gap-1.5 font-medium bg-slate-950/70 backdrop-blur-xs border border-white/12 rounded-lg px-3 py-1 max-w-full">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{location}</span>
              <span className="text-slate-400" aria-hidden="true">
                ·
              </span>
              <span className="text-amber-300 tabular-nums shrink-0">
                Stage {stageNumber} / 4
              </span>
            </div>
          </div>

          <div className="flex items-end gap-3.5 shrink-0">
            <CharacterAvatar
              characterId={activeCharacter}
              mood={characterMood}
              size="md"
            />
            <motion.div
              key={`${activeCharacter}-${speechText}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 min-w-0 bg-slate-950/88 backdrop-blur-sm border border-slate-700/75 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-2 text-xs mb-1">
                <span className="font-semibold text-amber-300">
                  {speaker.name}
                </span>
                <span className="text-slate-500" aria-hidden="true">
                  ·
                </span>
                <span className="text-slate-400 truncate">{speaker.role}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed line-clamp-3">
                {speechText}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right: Wide Animated Per-Clue Illustration */}
        <div className="sm:w-[300px] md:w-[360px] lg:w-[420px] shrink-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={sceneKey}
              initial={{ opacity: 0, scale: 0.96, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -4 }}
              transition={{ duration: 0.24 }}
              className="w-full h-[145px] sm:h-full max-h-[205px] bg-slate-950/65 backdrop-blur-xs border border-white/15 rounded-2xl shadow-xl px-3 py-2 flex items-center justify-center"
            >
              <ClueSceneIllustration sceneKey={sceneKey} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
