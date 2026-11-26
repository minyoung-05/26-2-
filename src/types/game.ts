export type CharacterId =
  | 'minji'
  | 'doyun'
  | 'haeun'
  | 'teacher_kim'
  | 'librarian'
  | 'jihoon'
  | 'guard'
  | 'yuna'
  | 'minho'
  | 'taeo'
  | 'siwoo'
  | 'subin'
  | 'junho';

export type CharacterMood = 'normal' | 'thinking' | 'happy' | 'surprised' | 'nervous';

export type QuestionFormat = 'word-order' | 'writing';

export type VerbTenseForm = 'present' | 'past' | 'pp';

export interface VerbFormChoice {
  id: string;
  word: string;
  tense: VerbTenseForm;
  /** Shown when past and past participle share the same spelling */
  showTenseTag?: boolean;
}

export type GrammarCategory =
  | 'passive-statement'
  | 'active-statement'
  | 'passive-question';

export type MistakeTag =
  | 'be-missing'
  | 'pp-form'
  | 'question-did'
  | 'question-order'
  | 'by-missing'
  | 'active-passive-mixup'
  | 'word-order-spelling'
  | 'empty-input';

export interface StudentProfile {
  sessionId: string;
  studentToken: string;
  anonymousLabel: string;
  nickname: string;
  joinCode: string;
}

export interface IntroMiniQuiz {
  id: string;
  title: string;
  prompt: string;
  exampleCompare: {
    active: string;
    activeKorean: string;
    passive: string;
    passiveKorean: string;
  };
  question: string;
  options: {
    id: string;
    label: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  summaryTip: string;
}

export interface GrammarQuestion {
  id: string;
  stageId: number;
  orderInStage: number; // 1 to 5
  format: QuestionFormat;
  grammarCategory: GrammarCategory;
  grammarLabel: string;
  character: CharacterId;
  sceneLocation?: string;
  characterSpeech: string;
  koreanPrompt: string;
  instruction: string;
  /** For 'word-order': shuffled remaining words/phrases to arrange. */
  wordTiles?: string[];
  /** For 'word-order': verb present/past/past-participle choices to pick 1 from. */
  verbChoices?: {
    choices: VerbFormChoice[];
    correctTense: VerbTenseForm;
  };
  /** For 'writing': clue keywords shown to guide writing. */
  writingGuides?: string[];
  /** Canonical display answer. */
  canonicalAnswer: string;
  /** All acceptable normalized answers. */
  acceptedAnswers: string[];
  /** Hints shown sequentially on wrong attempts (1st wrong, 2nd wrong). */
  hints: [string, string];
  /** Concise grammar explanation shown on success or when 0 stars remain. */
  explanation: string;
  /** Clue unlocked and logged to the left chat panel. */
  clueTitle: string;
  clueSummary: string;
  speakerResponse: string;
}

export interface SuspectProfile {
  id: 'taeo' | 'subin' | 'junho';
  name: string;
  role: string;
  alibi: string;
  keyEvidence: string;
  isCulprit: boolean;
  wrongChoiceHint: string;
}

export interface StageConfig {
  id: number;
  title: string;
  subtitle: string;
  transitionDescription: string;
  location: string;
  backgroundImage: string;
  introSpeaker: CharacterId;
  introMessage: string;
  miniQuiz?: IntroMiniQuiz;
  questions: GrammarQuestion[];
}

export interface ChatLogEntry {
  id: string;
  stageId: number;
  type: 'story' | 'student-answer' | 'clue' | 'system';
  speakerName?: string;
  characterId?: CharacterId;
  content: string;
  englishSentence?: string;
  clueTitle?: string;
  starsEarned?: number;
  timestamp: string;
}

export interface QuestionResult {
  questionId: string;
  stageId: number;
  grammarCategory: GrammarCategory;
  starsEarned: number; // 0 to 3
  solved: boolean;
}

export type AppScreen = 'TITLE' | 'PLAYING' | 'CASE_CLOSED';

export interface QuestionAnalyticsItem {
  questionId: string;
  stageId: number;
  orderInStage: number;
  format: QuestionFormat;
  grammarCategory: GrammarCategory;
  grammarLabel: string;
  koreanPrompt: string;
  canonicalAnswer: string;
  totalAttempts: number;
  wrongAttempts: number;
  errorRate: number;
  firstTryTotal: number;
  firstTryWrong: number;
  firstTryErrorRate: number;
  mistakeBreakdown: Record<string, number>;
  topWrongSubmissions: { text: string; count: number }[];
}

export interface MiniQuizAnalyticsItem {
  miniQuizId: string;
  stageId: number;
  title: string;
  totalAttempts: number;
  wrongAttempts: number;
  errorRate: number;
  topWrongOption: string | null;
}

export interface GrammarCategoryStat {
  category: GrammarCategory;
  label: string;
  totalAttempts: number;
  wrongAttempts: number;
  errorRate: number;
}

export interface MistakeStat {
  tag: MistakeTag;
  label: string;
  count: number;
  percentage: number;
}

export interface StudentRosterItem {
  sessionId: string;
  anonymousLabel: string;
  nickname: string;
  joinCode: string;
  startedAt: string;
  lastActiveAt: string;
  completed: boolean;
  totalStars: number;
  questionsAttempted: number;
  totalAttempts: number;
  wrongAttempts: number;
  errorRate: number;
  struggledQuestionIds: string[];
}

export interface ActiveJoinCodeInfo {
  code: string;
  createdAt: string;
}

export interface TeacherAnalyticsPayload {
  generatedAt: string;
  activeJoinCode: ActiveJoinCodeInfo | null;
  joinCodes: string[];
  summary: {
    totalStudents: number;
    completedStudents: number;
    totalAttempts: number;
    totalWrongAttempts: number;
    overallErrorRate: number;
    hardestQuestion: {
      questionId: string;
      stageId: number;
      orderInStage: number;
      koreanPrompt: string;
      errorRate: number;
    } | null;
    topMistake: {
      tag: MistakeTag;
      label: string;
      count: number;
    } | null;
  };
  questionStats: QuestionAnalyticsItem[];
  miniQuizStats: MiniQuizAnalyticsItem[];
  categoryStats: GrammarCategoryStat[];
  mistakeStats: MistakeStat[];
  students: StudentRosterItem[];
}
