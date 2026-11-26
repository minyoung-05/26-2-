import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Star, FileSearch } from 'lucide-react';
import { ChatLogEntry } from '../types/game';
import { CharacterAvatar } from './CharacterAvatar';

interface ClueChatLogProps {
  entries: ChatLogEntry[];
  clueCount: number;
  studentNickname?: string;
}

export function ClueChatLog({
  entries,
  clueCount,
  studentNickname,
}: ClueChatLogProps) {
  const [filter, setFilter] = useState<'all' | 'clues'>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  const visibleEntries =
    filter === 'clues' ? entries.filter((e) => e.type === 'clue') : entries;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [visibleEntries.length, filter]);

  return (
    <section
      aria-label="수사 채팅 및 단서 기록"
      className="flex-1 min-h-0 flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden"
    >
      {/* Header with segmented filter control */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-slate-800 bg-slate-900 shrink-0">
        <div className="flex items-center gap-2 text-xs text-slate-300 min-w-0">
          <FileSearch className="w-4 h-4 text-amber-400 shrink-0" />
          <h2 className="font-semibold text-slate-100 whitespace-nowrap">
            수사 기록 채팅창
          </h2>
          <span className="text-slate-500" aria-hidden="true">
            ·
          </span>
          <span className="text-slate-400 tabular-nums whitespace-nowrap">
            확보 단서 {clueCount}개
          </span>
        </div>

        <div className="flex items-center gap-1 p-0.5 bg-slate-950/70 rounded-lg border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              filter === 'all'
                ? 'bg-slate-800 text-slate-100'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            전체 대화
          </button>
          <button
            type="button"
            onClick={() => setFilter('clues')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              filter === 'clues'
                ? 'bg-amber-500/20 text-amber-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            단서만 보기
          </button>
        </div>
      </div>

      {/* Scrollable Chat Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto clue-scroll p-4 space-y-3"
      >
        {visibleEntries.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-8 text-slate-500 text-sm">
            <p>아직 확보된 단서가 없습니다.</p>
            <p className="text-xs mt-1">
              오른쪽 영어 문법 문제를 풀면 단서가 여기에 자동 기록됩니다.
            </p>
          </div>
        ) : (
          visibleEntries.map((entry) => {
            if (entry.type === 'system') {
              return (
                <div
                  key={entry.id}
                  className="flex items-center gap-2 py-1 text-xs text-slate-400"
                >
                  <div className="flex-1 h-px bg-slate-800" />
                  <span className="whitespace-nowrap">{entry.content}</span>
                  <div className="flex-1 h-px bg-slate-800" />
                </div>
              );
            }

            if (entry.type === 'student-answer') {
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-end"
                >
                  <div className="max-w-[88%] bg-sky-950/70 border border-sky-700/50 rounded-xl rounded-tr-sm px-3.5 py-2.5">
                    <div className="flex items-center justify-between gap-3 text-xs text-sky-300 mb-1">
                      <span className="font-medium">
                        {studentNickname ? `${studentNickname} 탐정님의 답안` : '내 영작 답안'}
                      </span>
                      <span className="text-slate-400 tabular-nums">
                        {entry.timestamp}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-100 leading-snug">
                      {entry.englishSentence}
                    </p>
                  </div>
                </motion.div>
              );
            }

            if (entry.type === 'clue') {
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-amber-950/35 border border-amber-500/35 rounded-xl px-3.5 py-2.5"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-amber-300">
                      {entry.clueTitle}
                    </span>
                    {typeof entry.starsEarned === 'number' && (
                      <div
                        className="flex items-center gap-0.5"
                        aria-label={`획득 단서 별 ${entry.starsEarned}개`}
                      >
                        {[1, 2, 3].map((idx) => (
                          <Star
                            key={idx}
                            className={`w-3.5 h-3.5 ${
                              idx <= (entry.starsEarned ?? 0)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {entry.content}
                  </p>
                  {entry.englishSentence && (
                    <p className="text-xs font-mono-code text-amber-200/80 mt-1.5 pt-1.5 border-t border-amber-500/20">
                      {entry.englishSentence}
                    </p>
                  )}
                </motion.div>
              );
            }

            // Story dialogue message
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-2.5"
              >
                {entry.characterId && (
                  <CharacterAvatar
                    characterId={entry.characterId}
                    size="sm"
                    animate={false}
                  />
                )}
                <div className="flex-1 min-w-0 bg-slate-800/80 border border-slate-700/60 rounded-xl rounded-tl-sm px-3.5 py-2.5">
                  <div className="flex items-center gap-2 text-xs mb-1">
                    <span className="font-semibold text-slate-200">
                      {entry.speakerName}
                    </span>
                    <span className="text-slate-500 tabular-nums">
                      {entry.timestamp}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {entry.content}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </section>
  );
}
