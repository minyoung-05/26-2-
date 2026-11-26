import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  HelpCircle,
  Sparkles,
  Gavel,
} from 'lucide-react';
import {
  GrammarQuestion,
  IntroMiniQuiz,
  SuspectProfile,
  VerbFormChoice,
  VerbTenseForm,
} from '../types/game';
import { SUSPECTS } from '../data/curriculum';
import { CharacterAvatar } from './CharacterAvatar';
import { playCorrectSound, playTileClick, playWrongSound } from '../utils/sound';

interface QuizPanelProps {
  stageNumber: number;
  stageTitle: string;
  mode: 'MINI_QUIZ' | 'QUESTION' | 'CULPRIT_SELECT';
  miniQuiz?: IntroMiniQuiz;
  question?: GrammarQuestion;
  starsRemaining: number;
  feedback: {
    type: 'correct' | 'wrong' | 'revealed' | null;
    message: string;
    detail?: string;
    starsEarned?: number;
  };
  muted: boolean;
  onCompleteMiniQuiz: () => void;
  onAttemptMiniQuiz?: (
    miniQuizId: string,
    isCorrect: boolean,
    selectedLabel: string
  ) => void;
  onSubmitAnswer: (answer: string, selectedVerbTense?: VerbTenseForm) => void;
  onNextQuestion: () => void;
  onSelectSuspect: (suspect: SuspectProfile) => void;
  wrongSuspectFeedback: string | null;
}

type SelectedToken =
  | { kind: 'tile'; tileIdx: number; text: string }
  | {
      kind: 'verb';
      choiceId: string;
      text: string;
      tense: VerbTenseForm;
      showTenseTag?: boolean;
    };

const TENSE_LABELS: Record<VerbTenseForm, string> = {
  present: '현재형',
  past: '과거형',
  pp: '과거분사형',
};

export function QuizPanel({
  stageNumber,
  stageTitle,
  mode,
  miniQuiz,
  question,
  starsRemaining,
  feedback,
  muted,
  onCompleteMiniQuiz,
  onAttemptMiniQuiz,
  onSubmitAnswer,
  onNextQuestion,
  onSelectSuspect,
  wrongSuspectFeedback,
}: QuizPanelProps) {
  // Mini-quiz local state
  const [selectedMiniOption, setSelectedMiniOption] = useState<string | null>(
    null
  );

  // Word-order local state (combines remaining wordTiles + selected verb form)
  const [selectedTokens, setSelectedTokens] = useState<SelectedToken[]>([]);

  // Writing input local state
  const [writingInput, setWritingInput] = useState('');

  // Reset local inputs whenever question or miniQuiz changes
  useEffect(() => {
    setSelectedMiniOption(null);
    setSelectedTokens([]);
    setWritingInput('');
  }, [question?.id, miniQuiz?.id, mode]);

  // 1. INTRO MINI-QUIZ VIEW
  if (mode === 'MINI_QUIZ' && miniQuiz) {
    const chosenOption = miniQuiz.options.find(
      (opt) => opt.id === selectedMiniOption
    );
    const isMiniCorrect = chosenOption?.isCorrect ?? false;

    return (
      <section className="h-full flex flex-col justify-between bg-slate-900/95 border border-slate-800 rounded-xl p-5 sm:p-6 overflow-y-auto clue-scroll">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-3">
            <span className="font-semibold text-amber-400">
              {miniQuiz.title}
            </span>
            <span>단계 도입 개념 확인</span>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed mb-4">
            {miniQuiz.prompt}
          </p>

          {/* Active vs Passive Comparison Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
              <p className="text-xs text-sky-400 font-medium mb-1">
                능동태 (Active Voice)
              </p>
              <p className="text-sm font-semibold text-white">
                {miniQuiz.exampleCompare.active}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {miniQuiz.exampleCompare.activeKorean}
              </p>
            </div>
            <div className="bg-slate-950/70 border border-amber-500/30 rounded-xl p-3.5">
              <p className="text-xs text-amber-400 font-medium mb-1">
                수동태 (Passive Voice)
              </p>
              <p className="text-sm font-semibold text-white">
                {miniQuiz.exampleCompare.passive}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {miniQuiz.exampleCompare.passiveKorean}
              </p>
            </div>
          </div>

          {/* Mini Quiz Question */}
          <h3 className="text-sm sm:text-base font-bold text-white mb-3 leading-snug">
            Q. {miniQuiz.question}
          </h3>

          <div className="space-y-2.5">
            {miniQuiz.options.map((opt) => {
              const isSelected = selectedMiniOption === opt.id;
              let styleClass =
                'bg-slate-800/70 border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-slate-500';
              if (isSelected && opt.isCorrect) {
                styleClass =
                  'bg-emerald-950/70 border-emerald-500 text-emerald-100';
              } else if (isSelected && !opt.isCorrect) {
                styleClass = 'bg-rose-950/70 border-rose-500 text-rose-100';
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    if (opt.isCorrect) {
                      playCorrectSound(muted);
                    } else {
                      playWrongSound(muted);
                    }
                    setSelectedMiniOption(opt.id);
                    onAttemptMiniQuiz?.(miniQuiz.id, opt.isCorrect, opt.label);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${styleClass}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Mini-Quiz Feedback */}
          <AnimatePresence mode="wait">
            {chosenOption && (
              <motion.div
                key={chosenOption.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-4 rounded-xl p-3.5 border text-xs sm:text-sm leading-relaxed ${
                  chosenOption.isCorrect
                    ? 'bg-emerald-950/45 border-emerald-600/50 text-emerald-200'
                    : 'bg-rose-950/45 border-rose-600/50 text-rose-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  {chosenOption.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p>{chosenOption.feedback}</p>
                    {chosenOption.isCorrect && (
                      <p className="text-amber-300 font-medium mt-1.5">
                        핵심 정리: {miniQuiz.summaryTip}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Proceed button once answered correctly */}
        <div className="pt-5 mt-5 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            disabled={!isMiniCorrect}
            onClick={onCompleteMiniQuiz}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              isMiniCorrect
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>개념 확인 완료 · 본 수사 시작</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    );
  }

  // 2. STAGE 4: CULPRIT SELECTION VIEW
  if (mode === 'CULPRIT_SELECT') {
    return (
      <section className="h-full flex flex-col justify-between bg-slate-900/95 border border-slate-800 rounded-xl p-5 sm:p-6 overflow-y-auto clue-scroll">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-2">
            <Gavel className="w-4 h-4 shrink-0" />
            <span>최종 스테이지 · 범인 지목</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-1.5">
            황금 트로피를 가져간 진짜 범인은 누구일까요?
          </h2>
          <p className="text-sm text-slate-400 mb-5 leading-relaxed">
            왼쪽 수사 기록 채팅창의 단서들을 다시 확인하고, 알리바이가 거짓인
            용의자 한 명을 선택하세요!
          </p>

          <div className="space-y-3">
            {SUSPECTS.map((suspect) => (
              <button
                key={suspect.id}
                type="button"
                onClick={() => onSelectSuspect(suspect)}
                className="w-full text-left flex items-start gap-4 p-4 rounded-xl bg-slate-950/70 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-400/70 transition-all cursor-pointer group"
              >
                <CharacterAvatar
                  characterId={suspect.id}
                  mood="normal"
                  size="md"
                  animate={false}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                        {suspect.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        · {suspect.role}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-amber-400 opacity-80 group-hover:opacity-100 whitespace-nowrap">
                      범인으로 지목 →
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    <span className="text-slate-500 font-medium">알리바이:</span>{' '}
                    {suspect.alibi}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    <span className="text-slate-500 font-medium">관련 단서:</span>{' '}
                    {suspect.keyEvidence}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {wrongSuspectFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-4 rounded-xl bg-rose-950/50 border border-rose-600/50 text-sm text-rose-200 flex items-start gap-2.5"
              >
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{wrongSuspectFeedback}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-xs text-slate-500 pt-4 mt-4 border-t border-slate-800">
          팁: 왼쪽 채팅창 상단의 [단서만 보기] 버튼을 누르면 핵심 증거 15개를 한눈에 볼 수 있어요.
        </p>
      </section>
    );
  }

  // 3. MAIN GRAMMAR QUESTION VIEW (Stages 1~3, 5 questions each)
  if (!question) return null;

  const isLocked =
    feedback.type === 'correct' || feedback.type === 'revealed';

  const selectedVerbToken = selectedTokens.find(
    (t): t is Extract<SelectedToken, { kind: 'verb' }> => t.kind === 'verb'
  );

  const handleTileAdd = (tileIdx: number) => {
    if (isLocked || !question.wordTiles) return;
    if (
      selectedTokens.some((t) => t.kind === 'tile' && t.tileIdx === tileIdx)
    ) {
      return;
    }
    playTileClick(muted);
    setSelectedTokens((prev) => [
      ...prev,
      { kind: 'tile', tileIdx, text: question.wordTiles![tileIdx] },
    ]);
  };

  const handleVerbSelect = (choice: VerbFormChoice) => {
    if (isLocked) return;
    playTileClick(muted);
    setSelectedTokens((prev) => {
      const existingIdx = prev.findIndex((t) => t.kind === 'verb');
      const nextVerbToken: SelectedToken = {
        kind: 'verb',
        choiceId: choice.id,
        text: choice.word,
        tense: choice.tense,
        showTenseTag: choice.showTenseTag,
      };
      if (existingIdx >= 0) {
        // Clicking the already selected verb removes it; clicking another verb swaps it in-place
        if (
          prev[existingIdx].kind === 'verb' &&
          prev[existingIdx].choiceId === choice.id
        ) {
          return prev.filter((_, i) => i !== existingIdx);
        }
        return prev.map((item, i) => (i === existingIdx ? nextVerbToken : item));
      }
      return [...prev, nextVerbToken];
    });
  };

  const handleTokenRemove = (positionIdx: number) => {
    if (isLocked) return;
    playTileClick(muted);
    setSelectedTokens((prev) => prev.filter((_, i) => i !== positionIdx));
  };

  const handleResetTokens = () => {
    if (isLocked) return;
    playTileClick(muted);
    setSelectedTokens([]);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    if (question.format === 'word-order' && question.wordTiles) {
      const sentence = selectedTokens.map((t) => t.text).join(' ');
      onSubmitAnswer(sentence, selectedVerbToken?.tense);
    } else {
      onSubmitAnswer(writingInput);
    }
  };

  const assembledSentence =
    question.format === 'word-order' && question.wordTiles
      ? selectedTokens.map((t) => t.text).join(' ')
      : writingInput;

  return (
    <section className="h-full flex flex-col justify-between bg-slate-900/95 border border-slate-800 rounded-xl p-5 sm:p-6 overflow-y-auto clue-scroll">
      <div>
        {/* Question Header: Stage metadata + Clue Stars (3 -> 0) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-amber-400">
              {stageTitle}
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums text-slate-200 font-medium">
              문제 {question.orderInStage} / 5
            </span>
            <span aria-hidden="true">·</span>
            <span>{question.grammarLabel}</span>
          </div>

          <div
            className="flex items-center gap-1.5"
            aria-label={`남은 단서 별 ${starsRemaining}개 (최대 3개)`}
          >
            <span className="text-xs text-slate-400 mr-1">단서 별</span>
            {[1, 2, 3].map((idx) => {
              const active = idx <= starsRemaining;
              return (
                <motion.div
                  key={idx}
                  animate={{
                    scale: active ? 1 : 0.85,
                    opacity: active ? 1 : 0.3,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Star
                    className={`w-5 h-5 ${
                      active
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Korean Target Sentence & Instruction */}
        <div className="mt-4 mb-4">
          <p className="text-xs text-slate-400 mb-1.5">
            {question.instruction}
          </p>
          <div className="bg-slate-950/75 border border-slate-800 rounded-xl px-4 py-3">
            <p className="text-base sm:text-lg font-bold text-white leading-snug">
              “{question.koreanPrompt}”
            </p>
          </div>
        </div>

        {/* Interactive Input Area */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {question.format === 'word-order' && question.wordTiles ? (
            <div className="space-y-3.5">
              {/* Sentence Assembly Tray */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-400">
                    조합된 영어 문장 (클릭하면 취소됩니다)
                  </span>
                  {selectedTokens.length > 0 && !isLocked && (
                    <button
                      type="button"
                      onClick={handleResetTokens}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>다시 배열</span>
                    </button>
                  )}
                </div>

                <div className="min-h-[60px] p-3 rounded-xl bg-slate-950 border border-slate-700/80 flex flex-wrap items-center gap-2">
                  {selectedTokens.length === 0 ? (
                    <span className="text-sm text-slate-500">
                      아래 동사 카드(1개)와 나머지 단어 카드를 순서대로 클릭해
                      문장을 완성하세요...
                    </span>
                  ) : (
                    selectedTokens.map((token, pos) => (
                      <motion.button
                        key={`${token.kind}-${token.kind === 'tile' ? token.tileIdx : token.choiceId}-${pos}`}
                        type="button"
                        layout
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.14 }}
                        disabled={isLocked}
                        onClick={() => handleTokenRemove(pos)}
                        className={`px-3.5 py-2 rounded-lg border font-medium text-sm transition-colors cursor-pointer disabled:cursor-default ${
                          token.kind === 'verb'
                            ? 'bg-sky-500/20 border-sky-400/70 text-sky-100 hover:bg-sky-500/30'
                            : 'bg-amber-500/20 border-amber-400/60 text-amber-100 hover:bg-amber-500/30'
                        }`}
                      >
                        <span>{token.text}</span>
                        {token.kind === 'verb' && token.showTenseTag && (
                          <span className="ml-1.5 text-[11px] text-sky-300/90">
                            ({TENSE_LABELS[token.tense]})
                          </span>
                        )}
                      </motion.button>
                    ))
                  )}
                </div>
              </div>

              {/* Verb Form Choice Group (Present / Past / Past Participle) */}
              {question.verbChoices && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-sky-300">
                      동사 형태 선택 (현재형 · 과거형 · 과거분사형 중 1개)
                    </span>
                    {selectedVerbToken && (
                      <span className="text-[11px] text-slate-400">
                        다른 동사 카드를 누르면 교체됩니다
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {question.verbChoices.choices.map((choice) => {
                      const isChosen =
                        selectedVerbToken?.choiceId === choice.id;
                      return (
                        <button
                          key={choice.id}
                          type="button"
                          disabled={isLocked}
                          onClick={() => handleVerbSelect(choice)}
                          className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 ${
                            isChosen
                              ? 'bg-sky-500/25 border-sky-400 text-sky-100 shadow-sm'
                              : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-100 hover:border-sky-400/70 active:scale-[0.98] cursor-pointer'
                          } disabled:cursor-default`}
                        >
                          <span>{choice.word}</span>
                          {choice.showTenseTag && (
                            <span className="text-[11px] text-slate-400 font-normal">
                              {TENSE_LABELS[choice.tense]}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Remaining Word Tile Bank */}
              <div>
                <span className="block text-xs font-medium text-slate-400 mb-1.5">
                  나머지 단어 카드 선택
                </span>
                <div className="flex flex-wrap gap-2">
                  {question.wordTiles.map((tile, idx) => {
                    const isUsed = selectedTokens.some(
                      (t) => t.kind === 'tile' && t.tileIdx === idx
                    );
                    return (
                      <button
                        key={`${tile}-${idx}`}
                        type="button"
                        disabled={isUsed || isLocked}
                        onClick={() => handleTileAdd(idx)}
                        className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                          isUsed
                            ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-default'
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-100 hover:border-amber-400/70 active:scale-[0.98] cursor-pointer'
                        }`}
                      >
                        {tile}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Direct English Writing Mode */
            <div className="space-y-3">
              {question.writingGuides && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300 bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5">
                  <span className="text-amber-400 font-semibold">제시어:</span>
                  {question.writingGuides.map((guide, i) => (
                    <span key={guide} className="font-mono-code text-slate-200">
                      {guide}
                      {i < question.writingGuides!.length - 1 && (
                        <span className="text-slate-600 ml-3">/</span>
                      )}
                    </span>
                  ))}
                </div>
              )}

              <div>
                <label
                  htmlFor="english-writing-input"
                  className="block text-xs font-medium text-slate-400 mb-1.5"
                >
                  영어 문장 직접 입력
                </label>
                <input
                  id="english-writing-input"
                  type="text"
                  value={writingInput}
                  disabled={isLocked}
                  onChange={(e) => setWritingInput(e.target.value)}
                  placeholder="여기에 영어 문장을 입력하세요..."
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 text-base text-white placeholder:text-slate-500 disabled:opacity-60"
                />
              </div>
            </div>
          )}

          {/* Submit Action (Hidden once solved/revealed) */}
          {!isLocked && (
            <div className="pt-1">
              <button
                type="submit"
                disabled={!assembledSentence.trim()}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  assembledSentence.trim()
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-[0.99]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                정답 확인하기
              </button>
            </div>
          )}
        </form>

        {/* Feedback Area (Correct / Wrong+Hint / 0-Star Auto-Reveal) */}
        <AnimatePresence mode="wait">
          {feedback.type && (
            <motion.div
              key={`${feedback.type}-${feedback.message}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`mt-4 rounded-xl p-4 border ${
                feedback.type === 'correct'
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-100'
                  : feedback.type === 'wrong'
                    ? 'bg-amber-950/45 border-amber-500/50 text-amber-100'
                    : 'bg-sky-950/50 border-sky-500/50 text-sky-100'
              }`}
            >
              <div className="flex items-start gap-3">
                {feedback.type === 'correct' ? (
                  <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : feedback.type === 'wrong' ? (
                  <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                )}

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-sm font-bold">{feedback.message}</p>
                    {feedback.type === 'correct' &&
                      typeof feedback.starsEarned === 'number' && (
                        <span className="text-xs font-semibold text-amber-300 tabular-nums">
                          단서 별 +{feedback.starsEarned}개 획득!
                        </span>
                      )}
                  </div>

                  {feedback.detail && (
                    <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                      {feedback.detail}
                    </p>
                  )}

                  {(feedback.type === 'correct' ||
                    feedback.type === 'revealed') && (
                    <div className="mt-2 pt-2.5 border-t border-white/10">
                      <p className="text-xs text-slate-300 mb-1">
                        정답 문장:
                      </p>
                      <p className="font-mono-code text-sm font-semibold text-white">
                        {question.canonicalAnswer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Next Button when Solved or Revealed */}
      {isLocked && (
        <div className="pt-4 mt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onNextQuestion}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all cursor-pointer shadow-md shadow-emerald-500/20 whitespace-nowrap"
          >
            <span>
              {question.orderInStage === 5
                ? `스테이지 ${stageNumber + 1}로 이동`
                : '다음 단서 문제로'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}
