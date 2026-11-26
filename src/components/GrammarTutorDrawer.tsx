import { useEffect, useRef, useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, X, AlertCircle } from 'lucide-react';

interface TutorMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface GrammarTutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  studentToken: string | null;
  studentNickname?: string;
  currentContext?: {
    stageTitle: string;
    grammarLabel?: string;
    koreanPrompt?: string;
    format?: string;
  };
}

const SUGGESTED_QUESTIONS = [
  '능동태와 수동태의 차이가 뭔가요?',
  'was랑 were는 언제 구분해서 쓰나요?',
  '수동태 의문문은 왜 Did를 안 쓰나요?',
  '불규칙 과거분사(p.p.) 헷갈리지 않는 팁이 있나요?',
];

export function GrammarTutorDrawer({
  isOpen,
  onClose,
  studentToken,
  studentNickname,
  currentContext,
}: GrammarTutorDrawerProps) {
  const greetingPrefix = studentNickname
    ? `안녕, ${studentNickname} 탐정님! `
    : '안녕! ';
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'tutor-welcome',
      role: 'model',
      text: `${greetingPrefix}나는 수동태 문법 코치야. 문제를 풀다가 be동사, 과거분사(p.p.), by 행위자, 의문문 어순 등 헷갈리는 부분이 있으면 편하게 물어봐! (정답을 바로 알려주기보다 스스로 풀 수 있게 힌트를 줄게!)`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages.length, loading, isOpen]);

  const sendQuestion = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || loading) return;
    if (!studentToken) {
      setError('학생 세션이 만료되었습니다. 다시 입장해 주세요.');
      return;
    }

    setError(null);
    const userMsg: TutorMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const historySnapshot = messages
      .filter((m) => m.id !== 'tutor-welcome')
      .slice(-8)
      .map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/student/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({
          message: trimmed,
          history: historySnapshot,
          currentContext,
        }),
      });

      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok || !data.reply) {
        setError(data.error || '답변을 받아오지 못했습니다.');
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          role: 'model',
          text: data.reply!,
        },
      ]);
    } catch {
      setError('문법 튜터 서버와 통신하지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendQuestion(input);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tutor-drawer-title"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-800 bg-slate-950/70 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-400/40 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h2
                    id="tutor-drawer-title"
                    className="text-sm font-bold text-white"
                  >
                    수동태 문법 질문 챗봇
                  </h2>
                  <p className="text-xs text-slate-400">
                    {studentNickname
                      ? `${studentNickname} 탐정님 전담 문법 코치`
                      : '모르는 문법 개념을 바로 질문해 보세요'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="챗봇 닫기"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Active Question Context Bar */}
            {currentContext?.koreanPrompt && (
              <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 text-xs shrink-0">
                <span className="text-amber-400 font-semibold">현재 문제:</span>{' '}
                <span className="text-slate-300">
                  “{currentContext.koreanPrompt}”
                </span>
                {currentContext.grammarLabel && (
                  <span className="text-slate-500 ml-1.5">
                    · {currentContext.grammarLabel}
                  </span>
                )}
              </div>
            )}

            {/* Quick Suggested Questions */}
            <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/80 shrink-0">
              <p className="text-xs text-slate-400 mb-2">자주 묻는 문법 질문</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    disabled={loading}
                    onClick={() => sendQuestion(q)}
                    className="text-left px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Message Thread */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto clue-scroll p-5 space-y-3"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-amber-500/20 border border-amber-400/40 text-amber-50 rounded-tr-sm'
                        : 'bg-slate-800/90 border border-slate-700/70 text-slate-100 rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/80 border border-slate-700/70 rounded-xl rounded-tl-sm px-3.5 py-2.5 text-xs text-slate-400">
                    문법 설명을 정리하고 있어요...
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-950/50 border border-rose-600/50 text-xs text-rose-200">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 400))}
                placeholder="예: stolen 대신 stole을 쓰면 왜 안 되나요?"
                disabled={loading}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 focus:outline-none text-sm text-white placeholder:text-slate-500 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="질문 전송"
                className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
