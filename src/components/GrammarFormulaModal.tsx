import { X } from 'lucide-react';
import { motion } from 'motion/react';

interface GrammarFormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VERB_TABLE = [
  { base: 'steal', past: 'stole', pp: 'stolen', meaning: '훔치다' },
  { base: 'find', past: 'found', pp: 'found', meaning: '발견하다' },
  { base: 'leave', past: 'left', pp: 'left', meaning: '남기다' },
  { base: 'see', past: 'saw', pp: 'seen', meaning: '보다' },
  { base: 'break', past: 'broke', pp: 'broken', meaning: '깨다' },
  { base: 'keep', past: 'kept', pp: 'kept', meaning: '보관하다' },
  { base: 'lend', past: 'lent', pp: 'lent', meaning: '빌려주다' },
];

export function GrammarFormulaModal({
  isOpen,
  onClose,
}: GrammarFormulaModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="formula-title"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto clue-scroll"
      >
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 id="formula-title" className="text-lg font-bold text-white">
              수동태 핵심 공식 노트
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              문제가 헷갈릴 때 언제든 펼쳐서 문장 구조를 확인해 보세요.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="공식 노트 닫기"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5 text-sm">
          {/* 1. Active vs Passive */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-amber-400">
              01. 능동태 vs 수동태 평서문
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
                <p className="text-xs text-slate-400 mb-1">능동태 (주어가 직접 ~하다)</p>
                <p className="font-mono-code text-xs text-sky-300 mb-1.5">
                  주어 + 동사 + 목적어
                </p>
                <p className="text-slate-200 text-xs">
                  Someone <strong className="text-sky-300">opened</strong> the door.
                </p>
              </div>
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
                <p className="text-xs text-slate-400 mb-1">수동태 (주어가 ~되다 / 당하다)</p>
                <p className="font-mono-code text-xs text-amber-300 mb-1.5">
                  주어 + be동사 + p.p. (+ by 행위자)
                </p>
                <p className="text-slate-200 text-xs">
                  The door <strong className="text-amber-300">was opened</strong> by someone.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Passive Yes/No Question */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-amber-400">
              02. 수동태 Yes / No 의문문
            </h3>
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
              <p className="font-mono-code text-xs text-emerald-300 mb-1.5">
                Am / Is / Are / Was / Were + 주어 + 과거분사(p.p.) ~?
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                평서문에 이미 있는 <strong className="text-white">be동사</strong>만 문장 맨 앞으로 보내면 됩니다.
                (Did를 쓰지 않도록 주의하세요!)
              </p>
              <p className="text-xs text-slate-200 mt-2">
                예: <strong className="text-emerald-300">Was</strong> the window{' '}
                <strong className="text-emerald-300">broken</strong>? (그 창문이 깨졌나요?)
              </p>
            </div>
          </div>

          {/* 3. Irregular Past Participles Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-amber-400">
              03. 이번 수사에 자주 나오는 불규칙 과거분사 (p.p.)
            </h3>
            <div className="overflow-hidden rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3 font-medium">원형</th>
                    <th className="py-2 px-3 font-medium">과거형</th>
                    <th className="py-2 px-3 font-medium text-amber-300">과거분사 (p.p.)</th>
                    <th className="py-2 px-3 font-medium">뜻</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
                  {VERB_TABLE.map((row) => (
                    <tr key={row.base}>
                      <td className="py-2 px-3 font-mono-code text-slate-300">{row.base}</td>
                      <td className="py-2 px-3 font-mono-code text-slate-400">{row.past}</td>
                      <td className="py-2 px-3 font-mono-code font-semibold text-amber-300">
                        {row.pp}
                      </td>
                      <td className="py-2 px-3 text-slate-300">{row.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
