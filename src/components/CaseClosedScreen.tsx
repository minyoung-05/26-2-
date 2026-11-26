import { motion } from 'motion/react';
import { Award, Home, RotateCcw, Star, CheckCircle2 } from 'lucide-react';
import { QuestionResult } from '../types/game';
import { CharacterAvatar } from './CharacterAvatar';
import { LocationBackdrop } from './LocationBackdrop';

interface CaseClosedScreenProps {
  results: QuestionResult[];
  studentNickname?: string;
  onRestart: () => void;
  onBackToTitle: () => void;
}

export function CaseClosedScreen({
  results,
  studentNickname,
  onRestart,
  onBackToTitle,
}: CaseClosedScreenProps) {
  const totalStars = results.reduce((sum, r) => sum + r.starsEarned, 0);
  const maxStars = 45; // 15 questions x 3 stars
  const solvedCount = results.filter((r) => r.solved).length;

  const categoryStats = [
    {
      key: 'passive-statement',
      label: '수동태 평서문 (be + p.p.)',
      items: results.filter((r) => r.grammarCategory === 'passive-statement'),
    },
    {
      key: 'active-statement',
      label: '능동태 평서문 비교',
      items: results.filter((r) => r.grammarCategory === 'active-statement'),
    },
    {
      key: 'passive-question',
      label: '수동태 Yes/No 의문문',
      items: results.filter((r) => r.grammarCategory === 'passive-question'),
    },
  ];

  const rankTitle =
    totalStars >= 40
      ? '전설의 수석 탐정'
      : totalStars >= 30
        ? '우수 수동태 탐정'
        : '성실한 신입 탐정';

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex items-center justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Top Banner */}
        <div className="relative h-48 sm:h-56 overflow-hidden border-b border-slate-800 bg-slate-950">
          <LocationBackdrop sceneKey="stage-4" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent pointer-events-none" />
          <div className="relative z-10 h-full px-6 py-6 flex flex-col justify-end">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-amber-400 mb-1.5">
                  {studentNickname
                    ? `${studentNickname} 탐정님 사건 해결 완료 · 해누리 중학교 축제 정상 개최!`
                    : '사건 해결 완료 · 해누리 중학교 축제 정상 개최!'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  진범은 방송부 준호! 황금 트로피를 되찾았습니다
                </h1>
              </div>
              <div className="flex items-center gap-2 bg-slate-950/85 border border-amber-500/40 rounded-xl px-4 py-2.5 shrink-0">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-bold text-amber-300">
                  {rankTitle}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Epilogue Story Twist */}
          <div className="flex items-start gap-4 bg-slate-950/70 border border-slate-800 rounded-xl p-4 sm:p-5">
            <CharacterAvatar characterId="junho" mood="nervous" size="md" />
            <div className="text-sm text-slate-200 leading-relaxed space-y-1.5">
              <p className="font-bold text-amber-300">
                준호의 고백 (사건의 전말)
              </p>
              <p>
                “미안해 얘들아! 사실 트로피 명판에 우리 학교 이름이 오타로 새겨져
                있어서, 축제 전날 밤 몰래 수정 스티커를 붙여 돌려놓으려다 들킬까 봐
                잠깐 방송실에 숨겨 둔 거였어... 트로피는 멀쩡해!”
              </p>
              <p className="text-xs text-slate-400 pt-1">
                The golden trophy was returned safely to the stage by Junho!
              </p>
            </div>
          </div>

          {/* Quantitative Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">총 획득 단서 별</p>
              <div className="flex items-baseline gap-1.5">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400 self-center" />
                <span className="text-2xl font-bold text-white tabular-nums">
                  {totalStars}
                </span>
                <span className="text-sm text-slate-500 tabular-nums">
                  / {maxStars}
                </span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">직접 해결한 영작 단서</p>
              <div className="flex items-baseline gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 self-center" />
                <span className="text-2xl font-bold text-white tabular-nums">
                  {solvedCount}
                </span>
                <span className="text-sm text-slate-500 tabular-nums">
                  / 15 문항
                </span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">정확도 달성률</p>
              <span className="text-2xl font-bold text-amber-300 tabular-nums">
                {Math.round((totalStars / maxStars) * 100)}%
              </span>
            </div>
          </div>

          {/* Grammar Mastery Breakdown */}
          <div>
            <h2 className="text-sm font-bold text-white mb-3">
              영역별 수동태 문법 성취도
            </h2>
            <div className="space-y-3">
              {categoryStats.map((cat) => {
                const earned = cat.items.reduce((s, i) => s + i.starsEarned, 0);
                const max = cat.items.length * 3 || 1;
                const pct = Math.round((earned / max) * 100);
                return (
                  <div key={cat.key}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium">
                        {cat.label}
                      </span>
                      <span className="text-slate-400 tabular-nums">
                        {earned} / {max} 별 ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Restart & Back-to-Title CTAs */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={onBackToTitle}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-semibold text-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <Home className="w-4 h-4 text-slate-300" />
              <span>처음 입장 화면으로</span>
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" />
              <span>처음부터 다시 수사하기</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
