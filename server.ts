import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express, { type NextFunction, type Request, type Response } from 'express';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const PORT = Number(process.env.PORT) || 3000;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}
const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'classroom-store.json');

// Session signing key from env or ephemeral CSPRNG fallback
const SESSION_SECRET =
  process.env.SESSION_SECRET && process.env.SESSION_SECRET.trim().length >= 16
    ? process.env.SESSION_SECRET.trim()
    : crypto.randomBytes(32).toString('hex');

const JOIN_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

interface QuestionMeta {
  questionId: string;
  stageId: number;
  orderInStage: number;
  format: 'word-order' | 'writing';
  grammarCategory: 'passive-statement' | 'active-statement' | 'passive-question';
  grammarLabel: string;
  koreanPrompt: string;
  canonicalAnswer: string;
}

interface MiniQuizMeta {
  miniQuizId: string;
  stageId: number;
  title: string;
}

const QUESTION_CATALOG: QuestionMeta[] = [
  {
    questionId: 's1-q1',
    stageId: 1,
    orderInStage: 1,
    format: 'word-order',
    grammarCategory: 'passive-statement',
    grammarLabel: '수동태 평서문 (과거)',
    koreanPrompt: '황금 트로피가 어제 도난당했다.',
    canonicalAnswer: 'The golden trophy was stolen yesterday.',
  },
  {
    questionId: 's1-q2',
    stageId: 1,
    orderInStage: 2,
    format: 'word-order',
    grammarCategory: 'active-statement',
    grammarLabel: '능동태 평서문 (과거)',
    koreanPrompt: '누군가가 그 유리 진열장을 열었다.',
    canonicalAnswer: 'Someone opened the glass case.',
  },
  {
    questionId: 's1-q3',
    stageId: 1,
    orderInStage: 3,
    format: 'word-order',
    grammarCategory: 'passive-statement',
    grammarLabel: '수동태 평서문 (과거)',
    koreanPrompt: '그 열쇠는 책상 위에서 발견되었다.',
    canonicalAnswer: 'The key was found on the desk.',
  },
  {
    questionId: 's1-q4',
    stageId: 1,
    orderInStage: 4,
    format: 'writing',
    grammarCategory: 'passive-statement',
    grammarLabel: '수동태 직접 영작 (과거)',
    koreanPrompt: '배터리 하나가 바닥에 남겨져 있었다.',
    canonicalAnswer: 'A battery was left on the floor.',
  },
  {
    questionId: 's1-q5',
    stageId: 1,
    orderInStage: 5,
    format: 'word-order',
    grammarCategory: 'passive-statement',
    grammarLabel: '수동태 평서문 (현재 + by)',
    koreanPrompt: '이 방은 매일 선생님에 의해 잠긴다.',
    canonicalAnswer: 'This room is locked by the teacher every day.',
  },
  {
    questionId: 's2-q1',
    stageId: 2,
    orderInStage: 1,
    format: 'word-order',
    grammarCategory: 'passive-question',
    grammarLabel: '수동태 Yes/No 의문문 (과거)',
    koreanPrompt: '그 큰 가방이 복도에서 목격되었나요?',
    canonicalAnswer: 'Was the big bag seen in the hallway?',
  },
  {
    questionId: 's2-q2',
    stageId: 2,
    orderInStage: 2,
    format: 'word-order',
    grammarCategory: 'active-statement',
    grammarLabel: '능동태 평서문 (과거)',
    koreanPrompt: '사서 선생님이 5시에 한 학생을 보셨다.',
    canonicalAnswer: 'The librarian saw a student at five.',
  },
  {
    questionId: 's2-q3',
    stageId: 2,
    orderInStage: 3,
    format: 'word-order',
    grammarCategory: 'passive-statement',
    grammarLabel: '수동태 평서문 (과거 + by)',
    koreanPrompt: '그 카메라는 누군가에 의해 꺼졌다.',
    canonicalAnswer: 'The camera was turned off by someone.',
  },
  {
    questionId: 's2-q4',
    stageId: 2,
    orderInStage: 4,
    format: 'writing',
    grammarCategory: 'passive-question',
    grammarLabel: '수동태 Yes/No 의문문 직접 영작',
    koreanPrompt: '그 창문이 깨졌나요?',
    canonicalAnswer: 'Was the window broken?',
  },
  {
    questionId: 's2-q5',
    stageId: 2,
    orderInStage: 5,
    format: 'writing',
    grammarCategory: 'passive-statement',
    grammarLabel: '수동태 직접 영작 (과거 + by)',
    koreanPrompt: '초콜릿 포장지가 한 학생에 의해 떨어뜨려졌다.',
    canonicalAnswer: 'The chocolate wrapper was dropped by a student.',
  },
  {
    questionId: 's3-q1',
    stageId: 3,
    orderInStage: 1,
    format: 'word-order',
    grammarCategory: 'passive-question',
    grammarLabel: '수동태 Yes/No 의문문 (과거 + by)',
    koreanPrompt: '그 파란 손수건이 태오에 의해 사용되었나요?',
    canonicalAnswer: 'Was the blue handkerchief used by Taeo?',
  },
  {
    questionId: 's3-q2',
    stageId: 3,
    orderInStage: 2,
    format: 'word-order',
    grammarCategory: 'active-statement',
    grammarLabel: '능동태 평서문 (과거)',
    koreanPrompt: '태오는 친구에게 그 손수건을 빌려주었다.',
    canonicalAnswer: 'Taeo lent the handkerchief to a friend.',
  },
  {
    questionId: 's3-q3',
    stageId: 3,
    orderInStage: 3,
    format: 'writing',
    grammarCategory: 'passive-question',
    grammarLabel: '수동태 Yes/No 의문문 직접 영작',
    koreanPrompt: '그 방 열쇠는 수빈이에 의해 보관되었나요?',
    canonicalAnswer: 'Was the room key kept by Subin?',
  },
  {
    questionId: 's3-q4',
    stageId: 3,
    orderInStage: 4,
    format: 'word-order',
    grammarCategory: 'passive-question',
    grammarLabel: '수동태 Yes/No 의문문 (과거)',
    koreanPrompt: '방송실 문이 5시에 열렸나요?',
    canonicalAnswer: 'Was the broadcasting room door opened at five?',
  },
  {
    questionId: 's3-q5',
    stageId: 3,
    orderInStage: 5,
    format: 'writing',
    grammarCategory: 'passive-statement',
    grammarLabel: '수동태 직접 영작 (과거)',
    koreanPrompt: '그 축제 리본은 준호의 사물함에서 발견되었다.',
    canonicalAnswer: "The festival ribbon was found in Junho's locker.",
  },
];

const MINI_QUIZ_CATALOG: MiniQuizMeta[] = [
  {
    miniQuizId: 'mq-1',
    stageId: 1,
    title: '스테이지 1 도입 · 능동태 vs 수동태 개념',
  },
  {
    miniQuizId: 'mq-2',
    stageId: 2,
    title: '스테이지 2 도입 · 능동→수동 문장 전환',
  },
  {
    miniQuizId: 'mq-3',
    stageId: 3,
    title: '스테이지 3 도입 · 수동태 Yes/No 의문문',
  },
];

const VALID_QUESTION_IDS = new Set(QUESTION_CATALOG.map((q) => q.questionId));
const VALID_MINI_QUIZ_IDS = new Set(MINI_QUIZ_CATALOG.map((m) => m.miniQuizId));
const VALID_MISTAKE_TAGS = new Set([
  'be-missing',
  'pp-form',
  'question-did',
  'question-order',
  'by-missing',
  'active-passive-mixup',
  'word-order-spelling',
  'empty-input',
]);

const MISTAKE_LABELS: Record<string, string> = {
  'be-missing': 'be동사 누락 (be + p.p.)',
  'pp-form': '과거분사(p.p.) 형태 오류',
  'question-did': '수동태 의문문 Did 오용',
  'question-order': '수동태 의문문 어순 오류',
  'by-missing': '행위자 전치사 by 누락',
  'active-passive-mixup': '능동태/수동태 혼동',
  'word-order-spelling': '어순 배열 및 철자 오류',
  'empty-input': '빈 답안 제출',
};

const CATEGORY_LABELS: Record<string, string> = {
  'passive-statement': '수동태 평서문 (be + p.p.)',
  'active-statement': '능동태 평서문 비교',
  'passive-question': '수동태 Yes/No 의문문',
};

interface JoinCodeRecord {
  code: string;
  createdAt: string;
}

interface StudentSessionRecord {
  sessionId: string;
  anonymousLabel: string;
  nickname?: string;
  joinCode: string;
  startedAt: string;
  lastActiveAt: string;
  completed: boolean;
  totalStars: number;
}

interface AttemptRecord {
  id: string;
  sessionId: string;
  questionId: string;
  stageId: number;
  isCorrect: boolean;
  attemptNumber: number;
  mistakeTag: string | null;
  submittedText: string;
  starsRemainingAfter: number;
  createdAt: string;
}

interface MiniQuizAttemptRecord {
  id: string;
  sessionId: string;
  miniQuizId: string;
  stageId: number;
  isCorrect: boolean;
  selectedLabel: string;
  createdAt: string;
}

interface ClassroomStore {
  teacherCredential: {
    salt: string;
    hash: string;
    claimedAt: string;
  } | null;
  activeJoinCode: JoinCodeRecord | null;
  joinCodeHistory: JoinCodeRecord[];
  sessions: StudentSessionRecord[];
  attempts: AttemptRecord[];
  miniQuizAttempts: MiniQuizAttemptRecord[];
}

function createEmptyStore(): ClassroomStore {
  return {
    teacherCredential: null,
    activeJoinCode: null,
    joinCodeHistory: [],
    sessions: [],
    attempts: [],
    miniQuizAttempts: [],
  };
}

function readStore(): ClassroomStore {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      return createEmptyStore();
    }
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<ClassroomStore>;
    return {
      teacherCredential: parsed.teacherCredential ?? null,
      activeJoinCode: parsed.activeJoinCode ?? null,
      joinCodeHistory: Array.isArray(parsed.joinCodeHistory)
        ? parsed.joinCodeHistory
        : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [],
      miniQuizAttempts: Array.isArray(parsed.miniQuizAttempts)
        ? parsed.miniQuizAttempts
        : [],
    };
  } catch {
    return createEmptyStore();
  }
}

function writeStore(store: ClassroomStore): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmpPath = `${STORE_PATH}.${process.pid}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(store, null, 2), 'utf8');
  fs.renameSync(tmpPath, STORE_PATH);
}

function generateJoinCode(existingCodes: Set<string>): string {
  for (let attempt = 0; attempt < 20; attempt++) {
    let code = '';
    for (let i = 0; i < 6; i++) {
      const idx = crypto.randomInt(0, JOIN_CODE_ALPHABET.length);
      code += JOIN_CODE_ALPHABET[idx];
    }
    if (!existingCodes.has(code)) {
      return code;
    }
  }
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

function issueFreshJoinCode(store: ClassroomStore): JoinCodeRecord {
  const existing = new Set([
    ...(store.activeJoinCode ? [store.activeJoinCode.code] : []),
    ...store.joinCodeHistory.map((h) => h.code),
  ]);
  const nextCode: JoinCodeRecord = {
    code: generateJoinCode(existing),
    createdAt: new Date().toISOString(),
  };
  store.activeJoinCode = nextCode;
  store.joinCodeHistory.unshift(nextCode);
  if (store.joinCodeHistory.length > 50) {
    store.joinCodeHistory = store.joinCodeHistory.slice(0, 50);
  }
  return nextCode;
}

// Token utilities (HMAC-SHA256)
interface TokenPayload {
  role: 'student' | 'teacher';
  sub: string;
  exp: number;
}

function signToken(payload: TokenPayload): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${sig}`;
}

function verifyToken(token: string): TokenPayload | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encoded, sig] = parts;
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encoded)
    .digest('base64url');

  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  try {
    const parsed = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8')
    ) as TokenPayload;
    if (!parsed || typeof parsed.exp !== 'number' || Date.now() > parsed.exp) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function extractBearer(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.slice(7).trim();
}

function hashPasscode(passcode: string, salt: string): string {
  return crypto.scryptSync(passcode, salt, 64).toString('hex');
}

function verifyEnvPasscode(input: string, envPasscode: string): boolean {
  const a = crypto.createHash('sha256').update(input).digest();
  const b = crypto.createHash('sha256').update(envPasscode).digest();
  return crypto.timingSafeEqual(a, b);
}

function sanitizeText(val: unknown, maxLen: number): string {
  if (typeof val !== 'string') return '';
  return val.replace(/[\r\n\t]+/g, ' ').trim().slice(0, maxLen);
}

function escapeCsvCell(value: string | number): string {
  const str = String(value);
  const safe = /^[=+\-@]/.test(str) ? `'${str}` : str;
  if (/[",\n]/.test(safe)) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}

interface AuthenticatedRequest extends Request {
  authPayload?: TokenPayload;
}

function requireStudentAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const token = extractBearer(req);
  if (!token) {
    res.status(401).json({ error: '학생 세션 인증이 필요합니다.' });
    return;
  }
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'student') {
    res.status(401).json({ error: '유효하지 않은 학생 세션입니다.' });
    return;
  }
  req.authPayload = payload;
  next();
}

function requireTeacherAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const token = extractBearer(req);
  if (!token) {
    res.status(401).json({ error: '교사용 서버 인증이 필요합니다.' });
    return;
  }
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'teacher') {
    res.status(403).json({ error: '교사 권한이 없는 접근입니다.' });
    return;
  }
  req.authPayload = payload;
  next();
}

function buildAnalytics(store: ClassroomStore, joinCodeFilter?: string) {
  const normalizedFilter =
    joinCodeFilter && joinCodeFilter !== 'all'
      ? joinCodeFilter.trim().toUpperCase()
      : null;

  const availableJoinCodes = Array.from(
    new Set([
      ...(store.activeJoinCode ? [store.activeJoinCode.code] : []),
      ...store.sessions.map((s) => s.joinCode).filter(Boolean),
    ])
  );

  const filteredSessions = normalizedFilter
    ? store.sessions.filter((s) => s.joinCode === normalizedFilter)
    : store.sessions;

  const sessionIds = new Set(filteredSessions.map((s) => s.sessionId));
  const filteredAttempts = store.attempts.filter((a) =>
    sessionIds.has(a.sessionId)
  );
  const filteredMiniAttempts = store.miniQuizAttempts.filter((m) =>
    sessionIds.has(m.sessionId)
  );

  const questionStats = QUESTION_CATALOG.map((meta) => {
    const qAttempts = filteredAttempts.filter(
      (a) => a.questionId === meta.questionId
    );
    const totalAttempts = qAttempts.length;
    const wrongList = qAttempts.filter((a) => !a.isCorrect);
    const wrongAttempts = wrongList.length;
    const errorRate =
      totalAttempts > 0 ? Math.round((wrongAttempts / totalAttempts) * 100) : 0;

    const firstTryList = qAttempts.filter((a) => a.attemptNumber === 1);
    const firstTryTotal = firstTryList.length;
    const firstTryWrong = firstTryList.filter((a) => !a.isCorrect).length;
    const firstTryErrorRate =
      firstTryTotal > 0 ? Math.round((firstTryWrong / firstTryTotal) * 100) : 0;

    const mistakeBreakdown: Record<string, number> = {};
    const wrongSubmissionMap = new Map<string, number>();

    for (const w of wrongList) {
      if (w.mistakeTag) {
        mistakeBreakdown[w.mistakeTag] =
          (mistakeBreakdown[w.mistakeTag] || 0) + 1;
      }
      const txt = w.submittedText.trim();
      if (txt) {
        wrongSubmissionMap.set(txt, (wrongSubmissionMap.get(txt) || 0) + 1);
      }
    }

    const topWrongSubmissions = Array.from(wrongSubmissionMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([text, count]) => ({ text, count }));

    return {
      ...meta,
      totalAttempts,
      wrongAttempts,
      errorRate,
      firstTryTotal,
      firstTryWrong,
      firstTryErrorRate,
      mistakeBreakdown,
      topWrongSubmissions,
    };
  });

  const miniQuizStats = MINI_QUIZ_CATALOG.map((meta) => {
    const mAttempts = filteredMiniAttempts.filter(
      (m) => m.miniQuizId === meta.miniQuizId
    );
    const totalAttempts = mAttempts.length;
    const wrongList = mAttempts.filter((m) => !m.isCorrect);
    const wrongAttempts = wrongList.length;
    const errorRate =
      totalAttempts > 0 ? Math.round((wrongAttempts / totalAttempts) * 100) : 0;

    const optionCounts = new Map<string, number>();
    for (const w of wrongList) {
      if (w.selectedLabel) {
        optionCounts.set(
          w.selectedLabel,
          (optionCounts.get(w.selectedLabel) || 0) + 1
        );
      }
    }
    const topWrongOption =
      Array.from(optionCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      null;

    return {
      ...meta,
      totalAttempts,
      wrongAttempts,
      errorRate,
      topWrongOption,
    };
  });

  const categories: Array<
    'passive-statement' | 'active-statement' | 'passive-question'
  > = ['passive-statement', 'active-statement', 'passive-question'];

  const categoryStats = categories.map((cat) => {
    const catQIds = new Set(
      QUESTION_CATALOG.filter((q) => q.grammarCategory === cat).map(
        (q) => q.questionId
      )
    );
    const catAttempts = filteredAttempts.filter((a) =>
      catQIds.has(a.questionId)
    );
    const totalAttempts = catAttempts.length;
    const wrongAttempts = catAttempts.filter((a) => !a.isCorrect).length;
    const errorRate =
      totalAttempts > 0 ? Math.round((wrongAttempts / totalAttempts) * 100) : 0;

    return {
      category: cat,
      label: CATEGORY_LABELS[cat],
      totalAttempts,
      wrongAttempts,
      errorRate,
    };
  });

  const totalWrongAll = filteredAttempts.filter((a) => !a.isCorrect).length;
  const mistakeCounter = new Map<string, number>();
  for (const a of filteredAttempts) {
    if (!a.isCorrect && a.mistakeTag) {
      mistakeCounter.set(
        a.mistakeTag,
        (mistakeCounter.get(a.mistakeTag) || 0) + 1
      );
    }
  }

  const mistakeStats = Array.from(mistakeCounter.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({
      tag,
      label: MISTAKE_LABELS[tag] || tag,
      count,
      percentage:
        totalWrongAll > 0 ? Math.round((count / totalWrongAll) * 100) : 0,
    }));

  const students = filteredSessions
    .map((session) => {
      const sAttempts = filteredAttempts.filter(
        (a) => a.sessionId === session.sessionId
      );
      const totalAttempts = sAttempts.length;
      const wrongAttempts = sAttempts.filter((a) => !a.isCorrect).length;
      const errorRate =
        totalAttempts > 0
          ? Math.round((wrongAttempts / totalAttempts) * 100)
          : 0;
      const attemptedQSet = new Set(sAttempts.map((a) => a.questionId));
      const struggledQSet = new Set(
        sAttempts.filter((a) => !a.isCorrect).map((a) => a.questionId)
      );

      return {
        sessionId: session.sessionId,
        anonymousLabel: session.anonymousLabel,
        nickname: session.nickname || session.anonymousLabel,
        joinCode: session.joinCode,
        startedAt: session.startedAt,
        lastActiveAt: session.lastActiveAt,
        completed: session.completed,
        totalStars: session.totalStars,
        questionsAttempted: attemptedQSet.size,
        totalAttempts,
        wrongAttempts,
        errorRate,
        struggledQuestionIds: Array.from(struggledQSet),
      };
    })
    .sort((a, b) => b.lastActiveAt.localeCompare(a.lastActiveAt));

  const attemptedQuestions = questionStats.filter((q) => q.totalAttempts > 0);
  const hardest =
    attemptedQuestions.length > 0
      ? [...attemptedQuestions].sort((a, b) => {
          if (b.errorRate !== a.errorRate) return b.errorRate - a.errorRate;
          return b.wrongAttempts - a.wrongAttempts;
        })[0]
      : null;

  const overallErrorRate =
    filteredAttempts.length > 0
      ? Math.round((totalWrongAll / filteredAttempts.length) * 100)
      : 0;

  return {
    generatedAt: new Date().toISOString(),
    activeJoinCode: store.activeJoinCode,
    joinCodes: availableJoinCodes,
    summary: {
      totalStudents: filteredSessions.length,
      completedStudents: filteredSessions.filter((s) => s.completed).length,
      totalAttempts: filteredAttempts.length,
      totalWrongAttempts: totalWrongAll,
      overallErrorRate,
      hardestQuestion: hardest
        ? {
            questionId: hardest.questionId,
            stageId: hardest.stageId,
            orderInStage: hardest.orderInStage,
            koreanPrompt: hardest.koreanPrompt,
            errorRate: hardest.errorRate,
          }
        : null,
      topMistake:
        mistakeStats.length > 0
          ? {
              tag: mistakeStats[0].tag,
              label: mistakeStats[0].label,
              count: mistakeStats[0].count,
            }
          : null,
    },
    questionStats,
    miniQuizStats,
    categoryStats,
    mistakeStats,
    students,
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  // =========================================================================
  // 1. STUDENT SERVER ROUTER (/api/student/*)
  // Anonymous entry via rotating teacher join code; write-only telemetry
  // =========================================================================
  const studentRouter = express.Router();

  studentRouter.post('/session', (req: Request, res: Response) => {
    const rawCode = sanitizeText(req.body?.joinCode, 16)
      .replace(/\s+/g, '')
      .toUpperCase();
    const rawNickname = sanitizeText(req.body?.nickname, 16);

    if (!rawNickname) {
      res.status(400).json({
        error: '게임에서 불릴 별명을 입력해 주세요.',
      });
      return;
    }

    if (!rawCode) {
      res.status(400).json({
        error: '선생님이 안내한 수업 입장 코드를 입력해 주세요.',
      });
      return;
    }

    const store = readStore();
    if (!store.activeJoinCode) {
      res.status(403).json({
        error:
          '아직 교사용 서버에서 입장 코드가 발급되지 않았습니다. 선생님께 입장 코드 발급을 요청해 주세요.',
      });
      return;
    }

    const expectedBuf = Buffer.from(store.activeJoinCode.code);
    const inputBuf = Buffer.from(rawCode);
    const isCodeMatch =
      expectedBuf.length === inputBuf.length &&
      crypto.timingSafeEqual(expectedBuf, inputBuf);

    if (!isCodeMatch) {
      res.status(403).json({
        error:
          '입장 코드가 일치하지 않거나 만료되었습니다. 선생님 화면의 최신 입장 코드를 확인해 주세요.',
      });
      return;
    }

    const assignedCode = store.activeJoinCode.code;

    // Assign anonymous sequential detective codename alongside student's chosen nickname
    const sameCodeCount = store.sessions.filter(
      (s) => s.joinCode === assignedCode
    ).length;
    const anonymousLabel = `익명 탐정 #${String(sameCodeCount + 1).padStart(
      2,
      '0'
    )}`;

    const sessionId = crypto.randomUUID();
    const now = new Date().toISOString();
    store.sessions.push({
      sessionId,
      anonymousLabel,
      nickname: rawNickname,
      joinCode: assignedCode,
      startedAt: now,
      lastActiveAt: now,
      completed: false,
      totalStars: 0,
    });
    writeStore(store);

    const studentToken = signToken({
      role: 'student',
      sub: sessionId,
      exp: Date.now() + 1000 * 60 * 60 * 12,
    });

    res.json({
      sessionId,
      studentToken,
      anonymousLabel,
      nickname: rawNickname,
      joinCode: assignedCode,
    });
  });

  studentRouter.post(
    '/attempt',
    requireStudentAuth,
    (req: AuthenticatedRequest, res: Response) => {
      const sessionId = req.authPayload!.sub;
      const questionId = sanitizeText(req.body?.questionId, 24);
      const isCorrect = Boolean(req.body?.isCorrect);
      const attemptNumber = Number(req.body?.attemptNumber);
      const starsRemainingAfter = Number(req.body?.starsRemainingAfter);
      const submittedText = sanitizeText(req.body?.submittedText, 200);
      const rawTag = sanitizeText(req.body?.mistakeTag, 40);
      const mistakeTag =
        !isCorrect && VALID_MISTAKE_TAGS.has(rawTag) ? rawTag : null;

      if (!VALID_QUESTION_IDS.has(questionId)) {
        res.status(400).json({ error: '유효하지 않은 문항입니다.' });
        return;
      }
      if (!Number.isInteger(attemptNumber) || attemptNumber < 1 || attemptNumber > 10) {
        res.status(400).json({ error: '유효하지 않은 시도 횟수입니다.' });
        return;
      }

      const meta = QUESTION_CATALOG.find((q) => q.questionId === questionId)!;
      const store = readStore();
      const session = store.sessions.find((s) => s.sessionId === sessionId);
      if (!session) {
        res.status(404).json({ error: '학생 세션을 찾을 수 없습니다.' });
        return;
      }

      const now = new Date().toISOString();
      session.lastActiveAt = now;
      if (isCorrect) {
        const earned = Math.max(0, Math.min(3, Math.trunc(starsRemainingAfter)));
        const prevEarnedForQ = store.attempts.some(
          (a) =>
            a.sessionId === sessionId &&
            a.questionId === questionId &&
            a.isCorrect
        );
        if (!prevEarnedForQ) {
          session.totalStars += earned;
        }
      }

      store.attempts.push({
        id: crypto.randomUUID(),
        sessionId,
        questionId,
        stageId: meta.stageId,
        isCorrect,
        attemptNumber,
        mistakeTag,
        submittedText,
        starsRemainingAfter: Math.max(
          0,
          Math.min(3, Math.trunc(starsRemainingAfter || 0))
        ),
        createdAt: now,
      });

      writeStore(store);
      res.json({ ok: true });
    }
  );

  studentRouter.post(
    '/mini-quiz',
    requireStudentAuth,
    (req: AuthenticatedRequest, res: Response) => {
      const sessionId = req.authPayload!.sub;
      const miniQuizId = sanitizeText(req.body?.miniQuizId, 24);
      const isCorrect = Boolean(req.body?.isCorrect);
      const selectedLabel = sanitizeText(req.body?.selectedLabel, 120);

      if (!VALID_MINI_QUIZ_IDS.has(miniQuizId)) {
        res.status(400).json({ error: '유효하지 않은 미니 퀴즈입니다.' });
        return;
      }

      const meta = MINI_QUIZ_CATALOG.find((m) => m.miniQuizId === miniQuizId)!;
      const store = readStore();
      const session = store.sessions.find((s) => s.sessionId === sessionId);
      if (!session) {
        res.status(404).json({ error: '학생 세션을 찾을 수 없습니다.' });
        return;
      }

      const now = new Date().toISOString();
      session.lastActiveAt = now;
      store.miniQuizAttempts.push({
        id: crypto.randomUUID(),
        sessionId,
        miniQuizId,
        stageId: meta.stageId,
        isCorrect,
        selectedLabel,
        createdAt: now,
      });
      writeStore(store);
      res.json({ ok: true });
    }
  );

  studentRouter.post(
    '/complete',
    requireStudentAuth,
    (req: AuthenticatedRequest, res: Response) => {
      const sessionId = req.authPayload!.sub;
      const totalStars = Number(req.body?.totalStars);
      const store = readStore();
      const session = store.sessions.find((s) => s.sessionId === sessionId);
      if (!session) {
        res.status(404).json({ error: '학생 세션을 찾을 수 없습니다.' });
        return;
      }

      session.completed = true;
      session.lastActiveAt = new Date().toISOString();
      if (Number.isFinite(totalStars)) {
        session.totalStars = Math.max(0, Math.min(45, Math.trunc(totalStars)));
      }
      writeStore(store);
      res.json({ ok: true });
    }
  );

  studentRouter.post(
    '/tutor',
    requireStudentAuth,
    async (req: AuthenticatedRequest, res: Response) => {
      const message = sanitizeText(req.body?.message, 400);
      if (!message) {
        res.status(400).json({ error: '질문 내용을 입력해 주세요.' });
        return;
      }

      const ai = getGeminiClient();
      if (!ai) {
        res.status(503).json({
          error:
            'AI 문법 튜터 API 키가 아직 설정되지 않았습니다. 선생님께 Settings > Secrets의 GEMINI_API_KEY 설정을 요청해 주세요.',
        });
        return;
      }

      const rawHistory = Array.isArray(req.body?.history)
        ? req.body.history.slice(-8)
        : [];
      const historyContents: Array<{
        role: 'user' | 'model';
        parts: Array<{ text: string }>;
      }> = [];

      for (const item of rawHistory) {
        const role = item?.role === 'model' ? 'model' : item?.role === 'user' ? 'user' : null;
        const text = sanitizeText(item?.text, 1000);
        if (role && text) {
          historyContents.push({ role, parts: [{ text }] });
        }
      }

      const ctxStage = sanitizeText(req.body?.currentContext?.stageTitle, 60);
      const ctxGrammar = sanitizeText(req.body?.currentContext?.grammarLabel, 60);
      const ctxPrompt = sanitizeText(req.body?.currentContext?.koreanPrompt, 120);
      const ctxFormat = sanitizeText(req.body?.currentContext?.format, 20);

      const contextLine = ctxPrompt
        ? `\n[현재 학생이 풀고 있는 문제 정보]\n- 단계: ${ctxStage || '수사 진행 중'}\n- 문법 유형: ${ctxGrammar || '수동태'}\n- 문제 형식: ${ctxFormat === 'writing' ? '직접 영작' : '단어 카드 배열'}\n- 한국어 제시문: "${ctxPrompt}"\n주의: 학생이 스스로 학습할 수 있도록 위 한국어 제시문의 정확한 영어 정답 문장 전체를 그대로 써주지 말고, 문법 원리와 비슷한 다른 예문(예: The window was cleaned.)으로 설명해 주세요.`
        : '';

      const sessionId = req.authPayload!.sub;
      const storeSnapshot = readStore();
      const studentSession = storeSnapshot.sessions.find(
        (s) => s.sessionId === sessionId
      );
      const studentNickname = studentSession?.nickname || '탐정';

      const systemInstruction =
        '당신은 한국 중학교 2학년 학생들을 돕는 친절하고 명쾌한 영어 수동태 문법 튜터 "탐정 코치"입니다.\n' +
        `현재 대화 중인 학생의 별명은 "${studentNickname}"입니다. 호칭할 때 "${studentNickname} 탐정님"이라고 다정하게 불러 주세요.\n` +
        '규칙:\n' +
        '1. 중학교 2학년 1학기 수준(be동사 + 과거분사 p.p., 능동태 vs 수동태 차이, by + 행위자, 수동태 Yes/No 의문문 [Be + 주어 + p.p.?], 불규칙 과거분사 변화)에 맞춰 쉬운 한국어로 설명하세요.\n' +
        '2. 현재 풀고 있는 문제의 정답 문장 전체를 직접 알려주지 마세요. 대신 핵심 공식과 유사 예문으로 학생이 스스로 답을 찾게 유도하세요.\n' +
        '3. 답변은 3~5문장 또는 짧은 글머리 기호로 간결하고 읽기 쉽게 작성하세요.\n' +
        '4. 영어 문법·수동태 학습과 무관한 질문에는 정중하게 수동태 학습 주제로 돌아오도록 안내하세요.' +
        contextLine;

      const contents = [
        ...historyContents,
        { role: 'user' as const, parts: [{ text: message }] },
      ];

      let lastErr: unknown = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-4-hydrogen',
            contents,
            config: {
              systemInstruction,
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          });

          const reply = response.text?.trim();
          if (!reply) {
            res.status(502).json({
              error: '답변을 생성하지 못했습니다. 질문을 조금 바꿔 다시 물어봐 주세요.',
            });
            return;
          }
          res.json({ reply });
          return;
        } catch (err) {
          lastErr = err;
          if (attempt === 0) {
            await new Promise((resolve) => setTimeout(resolve, 400));
          }
        }
      }

      const errMessage = lastErr instanceof Error ? lastErr.message : String(lastErr);
      if (errMessage.includes('403') || errMessage.includes('400') || errMessage.includes('API_KEY')) {
        res.status(502).json({
          error:
            'Gemini API 키가 유효하지 않거나 권한 오류가 발생했습니다. Settings > Secrets에서 GEMINI_API_KEY를 확인해 주세요.',
        });
        return;
      }
      if (errMessage.includes('429') || errMessage.includes('RESOURCE_EXHAUSTED')) {
        res.status(429).json({
          error: '잠시 질문 요청이 많아 지연되고 있습니다. 몇 초 뒤에 다시 질문해 주세요.',
        });
        return;
      }
      res.status(502).json({
        error: '문법 튜터 서버와 연결하는 중 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      });
    }
  );

  app.use('/api/student', studentRouter);

  // =========================================================================
  // 2. TEACHER SERVER ROUTER (/api/teacher/*)
  // Passcode-protected teacher access + rotating join code generation
  // =========================================================================
  const teacherRouter = express.Router();

  teacherRouter.get('/auth/status', (_req: Request, res: Response) => {
    const envPass = process.env.TEACHER_PASSCODE?.trim() || '';
    if (envPass.length > 0) {
      res.json({ configured: true, source: 'env' });
      return;
    }
    const store = readStore();
    if (store.teacherCredential) {
      res.json({ configured: true, source: 'claimed' });
      return;
    }
    res.json({ configured: false, source: 'unset' });
  });

  teacherRouter.post('/auth/setup', (req: Request, res: Response) => {
    const envPass = process.env.TEACHER_PASSCODE?.trim() || '';
    if (envPass.length > 0) {
      res.status(409).json({
        error: '환경 변수(TEACHER_PASSCODE)로 이미 교사 비밀번호가 설정되어 있습니다.',
      });
      return;
    }

    const store = readStore();
    if (store.teacherCredential) {
      res.status(409).json({
        error: '이미 교사 비밀번호가 등록되어 있습니다. 로그인을 진행해 주세요.',
      });
      return;
    }

    const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode.trim() : '';
    if (passcode.length < 4 || passcode.length > 64) {
      res.status(400).json({
        error: '교사 비밀번호는 4자 이상 64자 이하로 설정해 주세요.',
      });
      return;
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPasscode(passcode, salt);
    store.teacherCredential = {
      salt,
      hash,
      claimedAt: new Date().toISOString(),
    };
    // Rotate a fresh join code upon teacher server login/setup
    const activeJoinCode = issueFreshJoinCode(store);
    writeStore(store);

    const token = signToken({
      role: 'teacher',
      sub: 'teacher-admin',
      exp: Date.now() + 1000 * 60 * 60 * 24,
    });
    res.json({ token, activeJoinCode });
  });

  teacherRouter.post('/auth/login', (req: Request, res: Response) => {
    const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode.trim() : '';
    if (!passcode) {
      res.status(400).json({ error: '교사 비밀번호를 입력해 주세요.' });
      return;
    }

    const envPass = process.env.TEACHER_PASSCODE?.trim() || '';
    let valid = false;

    const store = readStore();
    if (envPass.length > 0) {
      valid = verifyEnvPasscode(passcode, envPass);
    } else {
      if (!store.teacherCredential) {
        res.status(400).json({
          error: '아직 교사 비밀번호가 설정되지 않았습니다.',
        });
        return;
      }
      const attemptHash = hashPasscode(passcode, store.teacherCredential.salt);
      const a = Buffer.from(attemptHash, 'hex');
      const b = Buffer.from(store.teacherCredential.hash, 'hex');
      valid = a.length === b.length && crypto.timingSafeEqual(a, b);
    }

    if (!valid) {
      res.status(401).json({ error: '교사 비밀번호가 일치하지 않습니다.' });
      return;
    }

    // Automatically rotate to a fresh join code every time the teacher accesses the server
    const activeJoinCode = issueFreshJoinCode(store);
    writeStore(store);

    const token = signToken({
      role: 'teacher',
      sub: 'teacher-admin',
      exp: Date.now() + 1000 * 60 * 60 * 24,
    });
    res.json({ token, activeJoinCode });
  });

  teacherRouter.post(
    '/join-code/rotate',
    requireTeacherAuth,
    (_req: Request, res: Response) => {
      const store = readStore();
      const activeJoinCode = issueFreshJoinCode(store);
      writeStore(store);
      res.json({ activeJoinCode });
    }
  );

  teacherRouter.get(
    '/analytics',
    requireTeacherAuth,
    (req: Request, res: Response) => {
      const joinCodeFilter =
        typeof req.query.joinCode === 'string' ? req.query.joinCode : 'all';
      const store = readStore();
      res.json(buildAnalytics(store, joinCodeFilter));
    }
  );

  teacherRouter.get(
    '/export',
    requireTeacherAuth,
    (req: Request, res: Response) => {
      const joinCodeFilter =
        typeof req.query.joinCode === 'string' ? req.query.joinCode : 'all';
      const store = readStore();
      const analytics = buildAnalytics(store, joinCodeFilter);

      const header = [
        '문항ID',
        '스테이지',
        '문항순서',
        '유형',
        '문법영역',
        '한국어제시문',
        '정답문장',
        '총시도수',
        '오답수',
        '전체오답률(%)',
        '1차시도오답률(%)',
        '대표오답',
      ];

      const rows = analytics.questionStats.map((q) => [
        q.questionId,
        `스테이지 ${q.stageId}`,
        q.orderInStage,
        q.format === 'word-order' ? '단어 배열' : '직접 영작',
        q.grammarLabel,
        q.koreanPrompt,
        q.canonicalAnswer,
        q.totalAttempts,
        q.wrongAttempts,
        q.errorRate,
        q.firstTryErrorRate,
        q.topWrongSubmissions.map((w) => `${w.text}(${w.count})`).join(' | '),
      ]);

      const csvBody = [header, ...rows]
        .map((row) => row.map(escapeCsvCell).join(','))
        .join('\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="passive_voice_error_report.csv"'
      );
      res.send(`\uFEFF${csvBody}`);
    }
  );

  teacherRouter.post(
    '/reset',
    requireTeacherAuth,
    (_req: Request, res: Response) => {
      const store = readStore();
      const nextStore: ClassroomStore = {
        teacherCredential: store.teacherCredential,
        activeJoinCode: store.activeJoinCode,
        joinCodeHistory: store.activeJoinCode ? [store.activeJoinCode] : [],
        sessions: [],
        attempts: [],
        miniQuizAttempts: [],
      };
      writeStore(nextStore);
      res.json({ ok: true });
    }
  );

  app.use('/api/teacher', teacherRouter);

  app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'API 경로를 찾을 수 없습니다.' });
  });

  // =========================================================================
  // 3. Vite Dev Middleware / Production Static Serving
  // =========================================================================
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
