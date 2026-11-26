/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from 'react';
import {
  BookOpen,
  MessageCircleQuestion,
  Star,
  Volume2,
  VolumeX,
  RotateCcw,
} from 'lucide-react';
import {
  ActiveJoinCodeInfo,
  AppScreen,
  CharacterId,
  CharacterMood,
  ChatLogEntry,
  QuestionResult,
  StudentProfile,
  SuspectProfile,
  VerbTenseForm,
} from './types/game';
import { CHARACTER_META, STAGES } from './data/curriculum';
import { checkGrammarAnswer } from './utils/grammarChecker';
import {
  playCorrectSound,
  playStageClearSound,
  playSuspenseCue,
  playWrongSound,
  startSuspenseAmbience,
  stopSuspenseAmbience,
} from './utils/sound';
import { TitleScreen } from './components/TitleScreen';
import { SceneStage } from './components/SceneStage';
import { ClueChatLog } from './components/ClueChatLog';
import { QuizPanel } from './components/QuizPanel';
import { GrammarFormulaModal } from './components/GrammarFormulaModal';
import { CaseClosedScreen } from './components/CaseClosedScreen';
import { TeacherDashboard } from './components/TeacherDashboard';
import { GrammarTutorDrawer } from './components/GrammarTutorDrawer';
import { StageTransitionScreen } from './components/StageTransitionScreen';

function getCurrentTimeLabel(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;
}

export default function App() {
  // Separate SPA view path: '/teacher' vs '/' (student app)
  const [routePath, setRoutePath] = useState<'student' | 'teacher'>(() =>
    typeof window !== 'undefined' &&
    window.location.pathname.startsWith('/teacher')
      ? 'teacher'
      : 'student'
  );

  useEffect(() => {
    const onPopState = () => {
      setRoutePath(
        window.location.pathname.startsWith('/teacher') ? 'teacher' : 'student'
      );
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateTo = useCallback((target: 'student' | 'teacher') => {
    const nextUrl = target === 'teacher' ? '/teacher' : '/';
    if (window.location.pathname !== nextUrl) {
      window.history.pushState({}, '', nextUrl);
    }
    setRoutePath(target);
  }, []);

  // Student session (write-only telemetry; never reads error rates)
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
    null
  );
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  // Teacher session held strictly in memory
  const [teacherSession, setTeacherSession] = useState<{
    token: string | null;
    activeJoinCode: ActiveJoinCodeInfo | null;
  }>({ token: null, activeJoinCode: null });

  const [screen, setScreen] = useState<AppScreen>('TITLE');
  const [stageIndex, setStageIndex] = useState(0); // 0..3 -> Stage 1..4
  const [showStageTransition, setShowStageTransition] = useState(false);
  const [inMiniQuiz, setInMiniQuiz] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0); // 0..4 within current stage

  // Per-question scoring & feedback state
  const [starsRemaining, setStarsRemaining] = useState(3);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'wrong' | 'revealed' | null;
    message: string;
    detail?: string;
    starsEarned?: number;
  }>({ type: null, message: '' });

  // Visual character & speech state on the left crime scene
  const [sceneMood, setSceneMood] = useState<CharacterMood>('normal');
  const [customSpeech, setCustomSpeech] = useState<string | null>(null);
  const [celebrateClue, setCelebrateClue] = useState(false);

  // Stage 4 wrong suspect feedback
  const [wrongSuspectFeedback, setWrongSuspectFeedback] = useState<
    string | null
  >(null);

  // Cumulative records
  const [chatLog, setChatLog] = useState<ChatLogEntry[]>([]);
  const [results, setResults] = useState<QuestionResult[]>([]);

  // UI utilities
  const [muted, setMuted] = useState(false);
  const [formulaOpen, setFormulaOpen] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);

  // Subtle tense detective ambience during active gameplay
  useEffect(() => {
    if (routePath === 'student' && screen === 'PLAYING' && !muted) {
      startSuspenseAmbience(false);
    } else {
      stopSuspenseAmbience();
    }
    return () => {
      stopSuspenseAmbience();
    };
  }, [routePath, screen, muted]);

  const currentStage = STAGES[stageIndex];
  const currentQuestion =
    !inMiniQuiz && currentStage.questions.length > 0
      ? currentStage.questions[questionIndex]
      : undefined;

  const totalStarsEarned = results.reduce((sum, r) => sum + r.starsEarned, 0);
  const unlockedClueCount = chatLog.filter((e) => e.type === 'clue').length;

  const appendLog = useCallback(
    (entries: Omit<ChatLogEntry, 'id' | 'timestamp'>[]) => {
      const time = getCurrentTimeLabel();
      setChatLog((prev) => [
        ...prev,
        ...entries.map((item, idx) => ({
          ...item,
          id: `${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
          timestamp: time,
        })),
      ]);
    },
    []
  );

  const resetLocalPlayState = useCallback((nickname: string) => {
    const firstStage = STAGES[0];
    setStageIndex(0);
    setInMiniQuiz(Boolean(firstStage.miniQuiz));
    setQuestionIndex(0);
    setStarsRemaining(3);
    setWrongAttempts(0);
    setFeedback({ type: null, message: '' });
    setSceneMood('normal');
    setCustomSpeech(`${nickname} 탐정님, 큰일 났어! ${firstStage.introMessage}`);
    setWrongSuspectFeedback(null);
    setResults([]);
    setChatLog([
      {
        id: 'init-sys-1',
        stageId: 1,
        type: 'system',
        content: `스테이지 1 · ${nickname} 탐정님의 사건 현장 조사 시작`,
        timestamp: getCurrentTimeLabel(),
      },
      {
        id: 'init-story-1',
        stageId: 1,
        type: 'story',
        speakerName: CHARACTER_META[firstStage.introSpeaker].name,
        characterId: firstStage.introSpeaker,
        content: `${nickname} 탐정님, 큰일 났어! ${firstStage.introMessage}`,
        timestamp: getCurrentTimeLabel(),
      },
    ]);
    setShowStageTransition(true);
    setScreen('PLAYING');
  }, []);

  const handleStartStudentSession = useCallback(
    async (joinCode: string, nickname: string) => {
      setIsStarting(true);
      setStartError(null);
      try {
        const res = await fetch('/api/student/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ joinCode, nickname }),
        });
        const data = (await res.json()) as Partial<StudentProfile> & {
          error?: string;
        };
        if (!res.ok || !data.studentToken || !data.sessionId) {
          setStartError(data.error || '입장 코드 확인에 실패했습니다.');
          return;
        }
        const resolvedNickname = data.nickname || nickname;
        setStudentProfile({
          sessionId: data.sessionId,
          studentToken: data.studentToken,
          anonymousLabel: data.anonymousLabel || '익명 탐정',
          nickname: resolvedNickname,
          joinCode: data.joinCode || joinCode,
        });
        resetLocalPlayState(resolvedNickname);
      } catch {
        setStartError('학생용 서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.');
      } finally {
        setIsStarting(false);
      }
    },
    [resetLocalPlayState]
  );

  const handleRestartSameStudent = useCallback(async () => {
    if (studentProfile) {
      resetLocalPlayState(studentProfile.nickname);
    } else {
      setScreen('TITLE');
    }
  }, [studentProfile, resetLocalPlayState]);

  const handleReturnToTitle = useCallback(() => {
    setStudentProfile(null);
    setShowStageTransition(false);
    setStartError(null);
    setTutorOpen(false);
    setFormulaOpen(false);
    setScreen('TITLE');
  }, []);

  const sendStudentAttempt = useCallback(
    (payload: {
      questionId: string;
      isCorrect: boolean;
      attemptNumber: number;
      mistakeTag?: string;
      submittedText: string;
      starsRemainingAfter: number;
    }) => {
      if (!studentProfile?.studentToken) return;
      fetch('/api/student/attempt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentProfile.studentToken}`,
        },
        body: JSON.stringify(payload),
      }).catch(() => {});
    },
    [studentProfile]
  );

  const handleAttemptMiniQuiz = useCallback(
    (miniQuizId: string, isCorrect: boolean, selectedLabel: string) => {
      if (!studentProfile?.studentToken) return;
      fetch('/api/student/mini-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentProfile.studentToken}`,
        },
        body: JSON.stringify({ miniQuizId, isCorrect, selectedLabel }),
      }).catch(() => {});
    },
    [studentProfile]
  );

  const handleCompleteMiniQuiz = () => {
    const detectiveName = studentProfile?.nickname || '탐정';
    playCorrectSound(muted);
    setInMiniQuiz(false);
    setQuestionIndex(0);
    setStarsRemaining(3);
    setWrongAttempts(0);
    setFeedback({ type: null, message: '' });
    setSceneMood('normal');
    setCustomSpeech(null);

    appendLog([
      {
        stageId: currentStage.id,
        type: 'story',
        speakerName: CHARACTER_META.minji.name,
        characterId: 'minji',
        content: `좋아, ${detectiveName} 탐정님! 개념 정리를 마쳤으니 이제 ${currentStage.location}에서 5개의 단서를 영어로 확보해 보자.`,
      },
    ]);
  };

  const handleSubmitAnswer = (
    userAnswer: string,
    selectedVerbTense?: VerbTenseForm
  ) => {
    if (!currentQuestion) return;
    const detectiveName = studentProfile?.nickname || '탐정';

    const attemptNumber = wrongAttempts + 1;
    const result = checkGrammarAnswer(
      userAnswer,
      currentQuestion,
      wrongAttempts,
      selectedVerbTense
    );

    if (result.isCorrect) {
      playCorrectSound(muted);
      const earned = starsRemaining;

      sendStudentAttempt({
        questionId: currentQuestion.id,
        isCorrect: true,
        attemptNumber,
        submittedText: userAnswer,
        starsRemainingAfter: earned,
      });

      setFeedback({
        type: 'correct',
        message: `정답입니다, ${detectiveName} 탐정님! 멋진 수동태·능동태 실력이네요!`,
        detail: currentQuestion.explanation,
        starsEarned: earned,
      });
      setSceneMood('happy');
      setCustomSpeech(currentQuestion.speakerResponse);
      setCelebrateClue(true);
      setTimeout(() => setCelebrateClue(false), 700);

      setResults((prev) => [
        ...prev,
        {
          questionId: currentQuestion.id,
          stageId: currentStage.id,
          grammarCategory: currentQuestion.grammarCategory,
          starsEarned: earned,
          solved: true,
        },
      ]);

      appendLog([
        {
          stageId: currentStage.id,
          type: 'student-answer',
          content: currentQuestion.koreanPrompt,
          englishSentence: currentQuestion.canonicalAnswer,
        },
        {
          stageId: currentStage.id,
          type: 'clue',
          clueTitle: currentQuestion.clueTitle,
          content: currentQuestion.clueSummary,
          englishSentence: currentQuestion.canonicalAnswer,
          starsEarned: earned,
        },
        {
          stageId: currentStage.id,
          type: 'story',
          speakerName: CHARACTER_META[currentQuestion.character].name,
          characterId: currentQuestion.character,
          content: currentQuestion.speakerResponse,
        },
      ]);
      return;
    }

    // Wrong answer: deduct 1 star & report mistakeTag to student server
    playWrongSound(muted);
    const nextStars = Math.max(0, starsRemaining - 1);
    const nextWrongCount = wrongAttempts + 1;

    sendStudentAttempt({
      questionId: currentQuestion.id,
      isCorrect: false,
      attemptNumber,
      mistakeTag: result.mistakeTag,
      submittedText: userAnswer,
      starsRemainingAfter: nextStars,
    });

    setStarsRemaining(nextStars);
    setWrongAttempts(nextWrongCount);

    if (nextStars === 0) {
      setSceneMood('thinking');
      setCustomSpeech(
        `괜찮아, ${detectiveName} 탐정님! 이번 문장 구조를 익혀 두고 다음 단서로 넘어가 보자.`
      );
      setFeedback({
        type: 'revealed',
        message: '단서 별이 모두 사라졌어요. 정답과 핵심 설명을 확인해 보세요!',
        detail: currentQuestion.explanation,
      });

      setResults((prev) => [
        ...prev,
        {
          questionId: currentQuestion.id,
          stageId: currentStage.id,
          grammarCategory: currentQuestion.grammarCategory,
          starsEarned: 0,
          solved: false,
        },
      ]);

      appendLog([
        {
          stageId: currentStage.id,
          type: 'clue',
          clueTitle: `${currentQuestion.clueTitle} (해설 확인)`,
          content: currentQuestion.clueSummary,
          englishSentence: currentQuestion.canonicalAnswer,
          starsEarned: 0,
        },
      ]);
    } else {
      setSceneMood('thinking');
      setCustomSpeech(
        `${detectiveName} 탐정님, 조금만 더 힘내! 아래 힌트를 보고 다시 도전해 보자.`
      );
      setFeedback({
        type: 'wrong',
        message: `아쉬워요, ${detectiveName} 탐정님! 다시 한 번 도전해 볼까요? (남은 단서 별 ${nextStars}개)`,
        detail: result.diagnosticHint,
      });
    }
  };

  const handleNextQuestion = () => {
    const hasMoreQuestions = questionIndex < currentStage.questions.length - 1;

    if (hasMoreQuestions) {
      playSuspenseCue(muted);
      setQuestionIndex((prev) => prev + 1);
      setStarsRemaining(3);
      setWrongAttempts(0);
      setFeedback({ type: null, message: '' });
      setSceneMood('normal');
      setCustomSpeech(null);
      return;
    }

    const nextStageIdx = stageIndex + 1;
    if (nextStageIdx < STAGES.length) {
      const detectiveName = studentProfile?.nickname || '탐정';
      playStageClearSound(muted);
      const nextStage = STAGES[nextStageIdx];
      setStageIndex(nextStageIdx);
      setInMiniQuiz(Boolean(nextStage.miniQuiz));
      setQuestionIndex(0);
      setStarsRemaining(3);
      setWrongAttempts(0);
      setFeedback({ type: null, message: '' });
      setSceneMood('normal');
      const stageGreeting = `${detectiveName} 탐정님! ${nextStage.introMessage}`;
      setCustomSpeech(stageGreeting);
      setWrongSuspectFeedback(null);

      appendLog([
        {
          stageId: nextStage.id,
          type: 'system',
          content: `${nextStage.title} 시작`,
        },
        {
          stageId: nextStage.id,
          type: 'story',
          speakerName: CHARACTER_META[nextStage.introSpeaker].name,
          characterId: nextStage.introSpeaker,
          content: stageGreeting,
        },
      ]);
      setShowStageTransition(true);
    }
  };

  const handleSelectSuspect = (suspect: SuspectProfile) => {
    if (suspect.isCulprit) {
      playStageClearSound(muted);
      if (studentProfile?.studentToken) {
        fetch('/api/student/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${studentProfile.studentToken}`,
          },
          body: JSON.stringify({ totalStars: totalStarsEarned }),
        }).catch(() => {});
      }
      setScreen('CASE_CLOSED');
    } else {
      playWrongSound(muted);
      setSceneMood('surprised');
      setCustomSpeech(suspect.wrongChoiceHint);
      setWrongSuspectFeedback(suspect.wrongChoiceHint);
    }
  };

  // =========================================================================
  // SEPARATED TEACHER PORTAL VIEW (/teacher)
  // =========================================================================
  if (routePath === 'teacher') {
    return (
      <TeacherDashboard
        initialToken={teacherSession.token}
        initialJoinCode={teacherSession.activeJoinCode}
        onTokenChange={(token) =>
          setTeacherSession((prev) => ({ ...prev, token }))
        }
        onBackToStudent={() => navigateTo('student')}
      />
    );
  }

  // =========================================================================
  // STUDENT GAME VIEWS (/) - Never exposes error rate analytics
  // =========================================================================
  if (screen === 'TITLE') {
    return (
      <TitleScreen
        onStartStudent={handleStartStudentSession}
        onTeacherAuthenticated={(token, activeJoinCode) => {
          setTeacherSession({ token, activeJoinCode });
          navigateTo('teacher');
        }}
        isStartingStudent={isStarting}
        studentError={startError}
      />
    );
  }

  if (screen === 'CASE_CLOSED') {
    return (
      <CaseClosedScreen
        results={results}
        studentNickname={studentProfile?.nickname}
        onRestart={handleRestartSameStudent}
        onBackToTitle={handleReturnToTitle}
      />
    );
  }

  if (showStageTransition) {
    return (
      <StageTransitionScreen
        stage={currentStage}
        totalStages={STAGES.length}
        studentNickname={studentProfile?.nickname}
        onEnterStage={() => {
          playSuspenseCue(muted);
          setShowStageTransition(false);
        }}
      />
    );
  }

  const activeCharacter: CharacterId = inMiniQuiz
    ? currentStage.introSpeaker
    : currentQuestion
      ? currentQuestion.character
      : currentStage.introSpeaker;

  const activeSpeech =
    customSpeech ??
    (inMiniQuiz
      ? currentStage.introMessage
      : currentQuestion
        ? currentQuestion.characterSpeech
        : currentStage.introMessage);

  const quizMode =
    currentStage.id === 4
      ? 'CULPRIT_SELECT'
      : inMiniQuiz
        ? 'MINI_QUIZ'
        : 'QUESTION';

  const activeSceneKey =
    inMiniQuiz && currentStage.miniQuiz
      ? currentStage.miniQuiz.id
      : currentQuestion
        ? currentQuestion.id
        : 'stage-4';

  const activeLocation = currentQuestion?.sceneLocation ?? currentStage.location;

  return (
    <div className="min-h-screen lg:h-screen bg-[#0B1120] text-slate-100 flex flex-col lg:overflow-hidden">
      {/* Top Bar: Clean 3-Zone Header */}
      <header className="flex items-center justify-between gap-6 px-5 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md shrink-0">
        <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
          The Trophy Was Stolen!{' '}
          <span className="hidden sm:inline text-xs font-medium text-amber-300 ml-1">
            · 수동태 추리 미션
          </span>
        </span>

        <nav
          aria-label="수사 진행 단계"
          className="hidden md:flex items-center gap-6 text-xs sm:text-sm"
        >
          {STAGES.map((stage, idx) => {
            const isActive = idx === stageIndex;
            const isCompleted = idx < stageIndex;
            return (
              <span
                key={stage.id}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5'
                    : isCompleted
                      ? 'text-slate-300 font-medium'
                      : 'text-slate-500'
                }`}
              >
                {stage.id}. {stage.title.split('·')[1]?.trim()}
              </span>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setFormulaOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>수동태 공식 노트</span>
          </button>
        </div>
      </header>

      {/* Secondary Quiet Status & Utility Bar inside Workspace */}
      <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-2 bg-slate-900/60 border-b border-slate-800/70 text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-2 min-w-0 truncate">
          <span className="text-slate-200 font-medium truncate">
            {currentStage.title}
          </span>
          <span aria-hidden="true" className="hidden sm:inline">
            ·
          </span>
          <span className="hidden sm:inline truncate">
            {currentStage.subtitle}
          </span>
          {studentProfile && (
            <>
              <span aria-hidden="true" className="hidden md:inline">
                ·
              </span>
              <span className="hidden md:inline text-amber-300 font-semibold whitespace-nowrap">
                {studentProfile.nickname} 탐정님
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3.5 shrink-0">
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold tabular-nums whitespace-nowrap">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>누적 별 {totalStarsEarned} / 45</span>
          </div>

          <button
            type="button"
            onClick={() => setTutorOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-200 font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            <MessageCircleQuestion className="w-3.5 h-3.5 text-amber-400" />
            <span>문법 질문 챗봇</span>
          </button>

          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? '효과음 켜기' : '효과음 끄기'}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            {muted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              {muted ? '음소거' : '효과음'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleRestartSameStudent}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">처음부터</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Top Wide Scene Illustration / Bottom Split (Left Chat Log + Right Quiz Panel) */}
      <main className="flex-1 min-h-0 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4 sm:gap-5">
        {/* Top: Wide Scene & Per-Clue Illustration */}
        <SceneStage
          stageNumber={currentStage.id}
          location={activeLocation}
          sceneKey={activeSceneKey}
          activeCharacter={activeCharacter}
          characterMood={sceneMood}
          speechText={activeSpeech}
          celebrateClue={celebrateClue}
        />

        {/* Bottom Split: Left Chat Log / Right Grammar Question */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          <div className="lg:col-span-5 min-h-[280px] lg:min-h-0 flex flex-col">
            <ClueChatLog
              entries={chatLog}
              clueCount={unlockedClueCount}
              studentNickname={studentProfile?.nickname}
            />
          </div>

          <div className="lg:col-span-7 min-h-[400px] lg:min-h-0 flex flex-col">
            <QuizPanel
              stageNumber={currentStage.id}
              stageTitle={currentStage.title}
              mode={quizMode}
              miniQuiz={currentStage.miniQuiz}
              question={currentQuestion}
              starsRemaining={starsRemaining}
              feedback={feedback}
              muted={muted}
              onCompleteMiniQuiz={handleCompleteMiniQuiz}
              onAttemptMiniQuiz={handleAttemptMiniQuiz}
              onSubmitAnswer={handleSubmitAnswer}
              onNextQuestion={handleNextQuestion}
              onSelectSuspect={handleSelectSuspect}
              wrongSuspectFeedback={wrongSuspectFeedback}
            />
          </div>
        </div>
      </main>

      <GrammarFormulaModal
        isOpen={formulaOpen}
        onClose={() => setFormulaOpen(false)}
      />

      <GrammarTutorDrawer
        isOpen={tutorOpen}
        onClose={() => setTutorOpen(false)}
        studentToken={studentProfile?.studentToken ?? null}
        studentNickname={studentProfile?.nickname}
        currentContext={
          currentQuestion
            ? {
                stageTitle: currentStage.title,
                grammarLabel: currentQuestion.grammarLabel,
                koreanPrompt: currentQuestion.koreanPrompt,
                format: currentQuestion.format,
              }
            : {
                stageTitle: currentStage.title,
              }
        }
      />
    </div>
  );
}
