import { GrammarQuestion, MistakeTag, VerbTenseForm } from '../types/game';

export interface CheckResult {
  isCorrect: boolean;
  diagnosticHint?: string;
  mistakeTag?: MistakeTag;
}

function normalizeSentence(raw: string): string {
  return raw
    .trim()
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/\s+([?.!,])/g, '$1')
    .replace(/[?.!]+$/g, '')
    .toLowerCase();
}

/**
 * Optimal String Alignment (restricted Damerau-Levenshtein) distance.
 * Counts single-char insert/delete/substitute AND adjacent transpositions (e.g. wsa <-> was) as cost 1.
 */
function damerauLevenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array<number>(n + 1).fill(0)
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let best = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
      if (
        i > 1 &&
        j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1]
      ) {
        best = Math.min(best, dp[i - 2][j - 2] + cost); // transposition
      }
      dp[i][j] = best;
    }
  }
  return dp[m][n];
}

// Words that represent real English grammatical form choices rather than mere spelling typos
const GRAMMAR_CONFUSION_WORDS = new Set([
  'do',
  'does',
  'did',
  'am',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'steal',
  'stole',
  'stolen',
  'stealed',
  'break',
  'broke',
  'broken',
  'breaked',
  'see',
  'saw',
  'seen',
  'seed',
  'find',
  'found',
  'finded',
  'leave',
  'left',
  'leaved',
  'keep',
  'kept',
  'keeped',
  'drop',
  'dropped',
  'use',
  'used',
  'open',
  'opened',
  'lock',
  'locked',
  'lend',
  'lent',
  'lended',
  'turn',
  'turned',
]);

function maxTypoDistance(targetLen: number): number {
  if (targetLen <= 2) return 1;
  if (targetLen <= 5) return 1;
  if (targetLen <= 9) return 2;
  return 3;
}

/**
 * Checks whether a writing submission matches the grammar & word order of an accepted answer,
 * differing ONLY by spelling typos or minor spacing slips.
 */
function detectPureSpellingError(
  rawUserInput: string,
  normalizedUser: string,
  question: GrammarQuestion
): string | null {
  if (question.format !== 'writing') return null;

  const userWords = normalizedUser.split(' ');
  const rawWords = rawUserInput
    .trim()
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/\s+([?.!,])/g, '$1')
    .replace(/[?.!]+$/g, '')
    .split(' ');

  for (const ans of question.acceptedAnswers) {
    const normAns = normalizeSentence(ans);
    const ansWords = normAns.split(' ');

    if (userWords.length === ansWords.length) {
      const misspelledDisplayWords: string[] = [];
      let hasGrammarMismatch = false;

      for (let i = 0; i < ansWords.length; i++) {
        const u = userWords[i];
        const t = ansWords[i];
        if (u === t) continue;

        // If the user typed a distinct grammatical form (e.g., broke vs broken, did vs was, is vs was, leaved vs left),
        // let grammar diagnostics handle it instead of calling it a spelling typo.
        if (GRAMMAR_CONFUSION_WORDS.has(u)) {
          hasGrammarMismatch = true;
          break;
        }

        const dist = damerauLevenshtein(u, t);
        if (dist <= maxTypoDistance(t.length)) {
          misspelledDisplayWords.push(rawWords[i] ?? u);
        } else {
          hasGrammarMismatch = true;
          break;
        }
      }

      if (!hasGrammarMismatch && misspelledDisplayWords.length > 0) {
        const quoted = misspelledDisplayWords
          .map((w) => `"${w}"`)
          .join(', ');
        return `문법과 어순은 아주 좋아요! 다만 ${quoted}의 스펠링(철자)에 오타가 있어요. 철자를 다시 확인해 보세요.`;
      }
    }

    // Check spacing + minor typo mismatch (e.g., missing/extra space in "Junho's" or "chocolate wrapper")
    const compactUser = normalizedUser.replace(/\s+/g, '');
    const compactAns = normAns.replace(/\s+/g, '');
    if (
      Math.abs(userWords.length - ansWords.length) <= 1 &&
      damerauLevenshtein(compactUser, compactAns) <= 2 &&
      !userWords.some(
        (u) => GRAMMAR_CONFUSION_WORDS.has(u) && !ansWords.includes(u)
      )
    ) {
      return '문법과 어순은 맞아요! 단어 사이의 띄어쓰기나 철자(스펠링)를 다시 한번 확인해 보세요.';
    }
  }

  return null;
}

export function checkGrammarAnswer(
  userInput: string,
  question: GrammarQuestion,
  wrongAttemptCount: number,
  selectedVerbTense?: VerbTenseForm
): CheckResult {
  const normalizedUser = normalizeSentence(userInput);

  if (!normalizedUser) {
    return {
      isCorrect: false,
      mistakeTag: 'empty-input',
      diagnosticHint:
        '아직 문장이 비어 있어요! 동사 형태를 고르고 단어들을 올바르게 배열해 보세요.',
    };
  }

  const isExactMatch = question.acceptedAnswers.some(
    (ans) => normalizeSentence(ans) === normalizedUser
  );

  if (isExactMatch) {
    if (
      question.verbChoices &&
      selectedVerbTense &&
      selectedVerbTense !== question.verbChoices.correctTense
    ) {
      if (question.verbChoices.correctTense === 'pp') {
        return {
          isCorrect: false,
          mistakeTag: 'pp-form',
          diagnosticHint:
            '문장 순서는 맞았지만, 수동태(be + p.p.)에는 과거형이 아니라 "과거분사형"을 선택해야 해요!',
        };
      }
      if (question.verbChoices.correctTense === 'past') {
        return {
          isCorrect: false,
          mistakeTag: 'active-passive-mixup',
          diagnosticHint:
            '문장 순서는 맞았지만, 주어가 직접 행동한 능동태 과거 문장이므로 "과거형"을 선택해야 해요!',
        };
      }
    }
    return { isCorrect: true };
  }

  // 1. Check pure spelling / spacing typos in writing questions before running grammar diagnostics
  const spellingHint = detectPureSpellingError(
    userInput,
    normalizedUser,
    question
  );
  if (spellingHint) {
    return {
      isCorrect: false,
      mistakeTag: 'word-order-spelling',
      diagnosticHint: spellingHint,
    };
  }

  // 2. Targeted grammar diagnostics tailored to 8th-grade passive voice errors
  const diagnostic = detectGrammarMistake(normalizedUser, question);
  const fallbackHint =
    question.hints[Math.min(wrongAttemptCount, question.hints.length - 1)];

  return {
    isCorrect: false,
    mistakeTag: diagnostic?.tag ?? 'word-order-spelling',
    diagnosticHint: diagnostic
      ? `${diagnostic.hint} (${fallbackHint})`
      : fallbackHint,
  };
}

function detectGrammarMistake(
  userNorm: string,
  question: GrammarQuestion
): { tag: MistakeTag; hint: string } | null {
  const words = userNorm.split(' ');

  if (question.grammarCategory === 'passive-question') {
    if (words[0] === 'did' || words[0] === 'do' || words[0] === 'does') {
      return {
        tag: 'question-did',
        hint: '수동태 의문문에서는 Do/Did 대신 be동사(Was/Were/Is/Are)가 문장 맨 앞으로 나와야 해요!',
      };
    }
    if (!['was', 'were', 'is', 'are'].includes(words[0])) {
      return {
        tag: 'question-order',
        hint: '수동태 Yes/No 의문문은 "Be동사 + 주어 + 과거분사(p.p.) ~?" 순서로 시작해요!',
      };
    }
  }

  if (
    question.grammarCategory === 'passive-statement' ||
    question.grammarCategory === 'passive-question'
  ) {
    const hasBeVerb = words.some((w) =>
      ['is', 'are', 'am', 'was', 'were'].includes(w)
    );
    if (!hasBeVerb) {
      return {
        tag: 'be-missing',
        hint: '수동태의 핵심 공식은 "be동사 + 과거분사(p.p.)"예요. 시제에 맞는 be동사가 빠졌어요!',
      };
    }

    // Check common present/past-tense vs past-participle mixups
    const irregularMixups: Record<string, string> = {
      steal: 'stolen',
      stole: 'stolen',
      stealed: 'stolen',
      break: 'broken',
      broke: 'broken',
      breaked: 'broken',
      see: 'seen',
      saw: 'seen',
      seed: 'seen',
      find: 'found',
      finded: 'found',
      leave: 'left',
      leaved: 'left',
      keep: 'kept',
      keeped: 'kept',
      drop: 'dropped',
      use: 'used',
      open: 'opened',
      lock: 'locked',
      turn: 'turned off',
    };
    for (const [wrongForm, correctPP] of Object.entries(irregularMixups)) {
      if (
        words.includes(wrongForm) &&
        question.canonicalAnswer.toLowerCase().includes(correctPP)
      ) {
        return {
          tag: 'pp-form',
          hint: `동사 형태를 확인해 보세요! 수동태에는 "${wrongForm}" 대신 과거분사 "${correctPP}"를 써야 해요.`,
        };
      }
    }

    if (
      question.canonicalAnswer.toLowerCase().includes(' by ') &&
      !userNorm.includes(' by ')
    ) {
      return {
        tag: 'by-missing',
        hint: '행위자("~에 의해")를 나타낼 때는 전치사 "by"를 꼭 넣어 주세요!',
      };
    }
  }

  if (question.grammarCategory === 'active-statement') {
    const hasBeVerb = words.some((w) =>
      ['was', 'were', 'is', 'are'].includes(w)
    );
    if (hasBeVerb) {
      return {
        tag: 'active-passive-mixup',
        hint: '이 문제는 주어가 직접 행동하는 "능동태" 문장이에요. be동사 없이 일반동사 과거형을 써 보세요!',
      };
    }

    const activeMixups: Record<string, string> = {
      open: 'opened',
      see: 'saw',
      seen: 'saw',
      lend: 'lent',
      lended: 'lent',
    };
    for (const [wrongForm, correctPast] of Object.entries(activeMixups)) {
      if (
        words.includes(wrongForm) &&
        question.canonicalAnswer.toLowerCase().includes(correctPast)
      ) {
        return {
          tag: 'active-passive-mixup',
          hint: `능동태 과거 사건이므로 "${wrongForm}" 대신 과거형 "${correctPast}"를 선택해야 해요!`,
        };
      }
    }
  }

  return null;
}
