import { motion } from 'motion/react';
import { ArrowRight, MapPin, BookOpen, Compass } from 'lucide-react';
import { StageConfig } from '../types/game';
import { LocationBackdrop } from './LocationBackdrop';
import { CharacterAvatar } from './CharacterAvatar';

interface StageTransitionScreenProps {
  stage: StageConfig;
  totalStages: number;
  studentNickname?: string;
  onEnterStage: () => void;
}

const STAGE_PREVIEW_KEYS: Record<number, string> = {
  1: 's1-q1',
  2: 's2-q1',
  3: 's3-q1',
  4: 'stage-4',
};

export function StageTransitionScreen({
  stage,
  totalStages,
  studentNickname,
  onEnterStage,
}: StageTransitionScreenProps) {
  const previewKey = STAGE_PREVIEW_KEYS[stage.id] ?? 'stage-4';
  const cleanTitle = stage.title.includes('·')
    ? stage.title.split('·')[1].trim()
    : stage.title;

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 relative overflow-hidden flex items-center justify-center px-5 py-10">
      {/* Subtle location backdrop preview */}
      <div className="absolute inset-0 opacity-45 pointer-events-none">
        <LocationBackdrop sceneKey={previewKey} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/65 to-slate-950/90 pointer-events-none" />

      <motion.section
        key={stage.id}
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        aria-label={`스테이지 ${stage.id} 안내`}
        className="relative z-10 w-full max-w-2xl bg-slate-900/92 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Top Stage Progress Strip */}
        <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-slate-800/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-amber-400 uppercase font-mono-code">
            <Compass className="w-4 h-4 shrink-0" />
            <span>
              STAGE {String(stage.id).padStart(2, '0')} /{' '}
              {String(totalStages).padStart(2, '0')}
            </span>
          </div>

          <div
            className="flex items-center gap-2"
            aria-label={`전체 ${totalStages}단계 중 ${stage.id}단계`}
          >
            {Array.from({ length: totalStages }, (_, idx) => {
              const num = idx + 1;
              const isCurrent = num === stage.id;
              const isDone = num < stage.id;
              return (
                <span
                  key={num}
                  className={`h-2 rounded-full transition-all ${
                    isCurrent
                      ? 'w-8 bg-amber-400'
                      : isDone
                        ? 'w-4 bg-emerald-400/80'
                        : 'w-4 bg-slate-700'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-semibold text-amber-300">
                {studentNickname
                  ? `${studentNickname} 탐정님 · 스테이지 ${stage.id}`
                  : `스테이지 ${stage.id}`}
              </p>
              <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                {cleanTitle}
              </h1>
            </div>
            <CharacterAvatar
              characterId={stage.introSpeaker}
              mood="normal"
              size="md"
            />
          </div>

          {/* Location & Grammar Goal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400">수사 장소</p>
                <p className="font-semibold text-slate-100 truncate">
                  {stage.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3">
              <BookOpen className="w-4 h-4 text-sky-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400">이번 단계 핵심</p>
                <p className="font-semibold text-slate-100 truncate">
                  {stage.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Short Stage Briefing */}
          <div className="bg-slate-950/65 border border-amber-500/25 rounded-xl p-4 sm:p-5 space-y-2">
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {stage.transitionDescription}
            </p>
            <p className="text-xs text-slate-400 pt-1">
              {stage.id < 4
                ? '구성: 개념 확인 미니 퀴즈 1문제 + 실전 단서 문제 5문항'
                : '구성: 수집한 15개 단서 최종 확인 + 진짜 범인 지목'}
            </p>
          </div>

          {/* Continue Action */}
          <div className="flex justify-end pt-1">
            <button
              type="button"
              autoFocus
              onClick={onEnterStage}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 font-bold text-sm sm:text-base transition-all cursor-pointer shadow-lg shadow-amber-500/20 whitespace-nowrap"
            >
              <span>스테이지 {stage.id} 시작하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
