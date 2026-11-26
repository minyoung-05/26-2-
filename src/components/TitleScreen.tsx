import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  KeyRound,
  Lock,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
} from 'lucide-react';
import { ActiveJoinCodeInfo } from '../types/game';
import { HeroMysteryIllustration } from './HeroMysteryIllustration';

interface TitleScreenProps {
  onStartStudent: (joinCode: string, nickname: string) => Promise<void>;
  onTeacherAuthenticated: (
    token: string,
    activeJoinCode: ActiveJoinCodeInfo | null
  ) => void;
  isStartingStudent: boolean;
  studentError: string | null;
}

const STAGE_PREVIEWS = [
  { num: '01', title: '사건 현장 조사', desc: '학생회실 빈 진열장 · 수동태 기본 평서문' },
  { num: '02', title: '목격자 심문', desc: '사서·선도부·지킴이 등 5명 목격자 · by 행위자 & 의문문' },
  { num: '03', title: '용의자 추리', desc: '동아리방 심문 · 능동/수동 & Yes/No 의문문' },
  { num: '04', title: '범인 검거', desc: '대강당 무대 · 단서 종합 후 범인 지목' },
];

export function TitleScreen({
  onStartStudent,
  onTeacherAuthenticated,
  isStartingStudent,
  studentError,
}: TitleScreenProps) {
  const [roleTab, setRoleTab] = useState<'student' | 'teacher'>('student');

  // Student join-code & nickname state
  const [nickname, setNickname] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [studentValidationError, setStudentValidationError] = useState<
    string | null
  >(null);

  // Teacher auth state
  const [authStatus, setAuthStatus] = useState<{
    loading: boolean;
    configured: boolean;
  }>({ loading: false, configured: true });
  const [passcodeInput, setPasscodeInput] = useState('');
  const [confirmPasscodeInput, setConfirmPasscodeInput] = useState('');
  const [teacherError, setTeacherError] = useState<string | null>(null);
  const [teacherSubmitting, setTeacherSubmitting] = useState(false);

  useEffect(() => {
    if (roleTab !== 'teacher') return;
    let cancelled = false;
    setAuthStatus((prev) => ({ ...prev, loading: true }));
    fetch('/api/teacher/auth/status')
      .then((res) => res.json())
      .then((data: { configured?: boolean }) => {
        if (!cancelled) {
          setAuthStatus({
            loading: false,
            configured: Boolean(data.configured),
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAuthStatus({ loading: false, configured: true });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [roleTab]);

  const handleStudentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cleanedNickname = nickname.replace(/\s+/g, ' ').trim();
    const cleanedCode = joinCode.replace(/\s+/g, '').toUpperCase();

    if (!cleanedNickname) {
      setStudentValidationError('게임에서 불릴 탐정 별명을 입력해 주세요.');
      return;
    }
    if (!cleanedCode) {
      setStudentValidationError('선생님이 안내한 수업 입장 코드를 입력해 주세요.');
      return;
    }
    setStudentValidationError(null);
    await onStartStudent(cleanedCode, cleanedNickname);
  };

  const handleTeacherSetup = async (e: FormEvent) => {
    e.preventDefault();
    setTeacherError(null);
    if (passcodeInput.trim().length < 4) {
      setTeacherError('비밀번호는 4자 이상으로 설정해 주세요.');
      return;
    }
    if (passcodeInput.trim() !== confirmPasscodeInput.trim()) {
      setTeacherError('비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    setTeacherSubmitting(true);
    try {
      const res = await fetch('/api/teacher/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcodeInput.trim() }),
      });
      const data = (await res.json()) as {
        token?: string;
        activeJoinCode?: ActiveJoinCodeInfo;
        error?: string;
      };
      if (!res.ok || !data.token) {
        setTeacherError(data.error || '비밀번호 설정에 실패했습니다.');
        return;
      }
      setPasscodeInput('');
      setConfirmPasscodeInput('');
      onTeacherAuthenticated(data.token, data.activeJoinCode ?? null);
    } catch {
      setTeacherError('교사용 서버에 연결할 수 없습니다.');
    } finally {
      setTeacherSubmitting(false);
    }
  };

  const handleTeacherLogin = async (e: FormEvent) => {
    e.preventDefault();
    setTeacherError(null);
    if (!passcodeInput.trim()) {
      setTeacherError('교사 비밀번호를 입력해 주세요.');
      return;
    }
    setTeacherSubmitting(true);
    try {
      const res = await fetch('/api/teacher/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcodeInput.trim() }),
      });
      const data = (await res.json()) as {
        token?: string;
        activeJoinCode?: ActiveJoinCodeInfo;
        error?: string;
      };
      if (!res.ok || !data.token) {
        setTeacherError(data.error || '교사 비밀번호가 일치하지 않습니다.');
        return;
      }
      setPasscodeInput('');
      onTeacherAuthenticated(data.token, data.activeJoinCode ?? null);
    } catch {
      setTeacherError('교사용 서버에 연결할 수 없습니다.');
    } finally {
      setTeacherSubmitting(false);
    }
  };

  const displayStudentError = studentValidationError || studentError;

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Visual Mystery Poster */}
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 min-h-[380px] lg:min-h-[540px]">
            <HeroMysteryIllustration />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-xs font-medium text-amber-300 mb-2">
                중학교 2학년 영어 3단원 · 수동태 추리 프로젝트
              </p>
              <h1
                className="text-2xl sm:text-4xl font-bold text-white leading-tight tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                The Trophy Was Stolen!
              </h1>
              <p className="text-sm sm:text-base font-semibold text-amber-200 mt-1.5">
                트로피가 도난당했다 · 수동태로 진실을 밝히는 추리 영작 미션
              </p>
              <p className="text-sm text-slate-300 mt-2.5 leading-relaxed max-w-xl">
                학생회실의 황금 트로피가 어젯밤 감쪽같이 도난당했다! 영어 문장을 직접
                완성하며 15개의 단서를 모으고, 사라진 트로피의 진짜 행방과 범인을
                밝혀내세요.
              </p>
            </div>
          </div>

          {/* Right: Role Selector (Student vs Teacher) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="lg:col-span-5 flex flex-col bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7"
          >
            {/* Role Segmented Switcher */}
            <div
              role="tablist"
              aria-label="접속 역할 선택"
              className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl mb-5 shrink-0"
            >
              <button
                type="button"
                role="tab"
                aria-selected={roleTab === 'student'}
                onClick={() => {
                  setRoleTab('student');
                  setTeacherError(null);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  roleTab === 'student'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span>학생 입장</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={roleTab === 'teacher'}
                onClick={() => {
                  setRoleTab('teacher');
                  setStudentValidationError(null);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  roleTab === 'teacher'
                    ? 'bg-slate-800 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserCheck className="w-4 h-4 shrink-0" />
                <span>교사 접속</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {roleTab === 'student' ? (
                <motion.div
                  key="student-tab"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16 }}
                  className="flex-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                      <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>학습 목표</span>
                      <span aria-hidden="true">·</span>
                      <span>능동태 · 수동태 평서문 · Yes/No 의문문</span>
                    </div>

                    <h2 className="text-lg font-bold text-white mb-3.5">
                      4단계 학교 추리 수사 일정
                    </h2>

                    <ol className="space-y-2.5">
                      {STAGE_PREVIEWS.map((stage) => (
                        <li
                          key={stage.num}
                          className="flex items-start gap-3 pb-2.5 border-b border-slate-800/80 last:border-b-0 last:pb-0"
                        >
                          <span className="font-mono-code text-xs font-semibold text-amber-400 pt-0.5 tabular-nums">
                            {stage.num}.
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-100">
                              {stage.title}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {stage.desc}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>

                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300 leading-relaxed">
                      <div className="flex items-start gap-2.5">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0 mt-0.5" />
                        <p>
                          각 문제마다{' '}
                          <strong className="text-amber-300">단서 별 3개</strong>가
                          주어지며, 오답 시 맞춤형 힌트와 함께 별이 1개씩 차감됩니다.
                        </p>
                      </div>
                      <div className="flex items-start gap-2.5 text-slate-400">
                        <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <p>
                          실명·학번 없이{' '}
                          <strong className="text-slate-200">별명과 입장 코드</strong>
                          만으로 익명 참여하며, 게임 내내 별명으로 불립니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Student Nickname + Required Join Code Form */}
                  <form
                    onSubmit={handleStudentSubmit}
                    className="mt-5 pt-4 border-t border-slate-800 space-y-3"
                  >
                    <div>
                      <label
                        htmlFor="student-nickname"
                        className="block text-xs font-medium text-slate-300 mb-1.5"
                      >
                        탐정 별명 (게임에서 불릴 이름)
                      </label>
                      <div className="relative">
                        <Sparkles className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="student-nickname"
                          type="text"
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value.slice(0, 16))}
                          placeholder="예: 파란여우, 꼬마셜록"
                          autoComplete="off"
                          maxLength={16}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none text-sm text-white placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="student-join-code"
                        className="block text-xs font-medium text-slate-300 mb-1.5"
                      >
                        수업 입장 코드 (선생님 화면에서 확인)
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="student-join-code"
                          type="text"
                          value={joinCode}
                          onChange={(e) =>
                            setJoinCode(e.target.value.toUpperCase().slice(0, 12))
                          }
                          placeholder="예: K7M9P2"
                          autoComplete="off"
                          spellCheck={false}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none text-base font-mono-code tracking-widest text-white placeholder:text-slate-600 placeholder:tracking-normal uppercase"
                        />
                      </div>
                    </div>

                    {displayStudentError && (
                      <p className="text-xs text-rose-400 leading-relaxed" role="alert">
                        {displayStudentError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isStartingStudent}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 font-bold text-sm transition-all cursor-pointer shadow-lg shadow-amber-500/20 whitespace-nowrap disabled:opacity-60"
                    >
                      <span>
                        {isStartingStudent
                          ? '입장 코드 확인 중...'
                          : '입장 코드로 수사 시작하기'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="teacher-tab"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16 }}
                  className="flex-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-3">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>교사용 분석 서버 접속</span>
                    </div>

                    <h2 className="text-lg font-bold text-white mb-2">
                      학생 오답률 분석 & 입장 코드 발급
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-5">
                      교사용 서버에 로그인하면 학생들에게 공유할{' '}
                      <strong className="text-slate-200">새 수업 입장 코드</strong>가
                      자동 발급되며, 문항별·문법 유형별 오답률 리포트를 실시간으로
                      확인할 수 있습니다.
                    </p>

                    <ul className="space-y-2 text-xs text-slate-300 bg-slate-950/60 border border-slate-800 rounded-xl p-4 mb-5">
                      <li>· 학생 화면에는 오답률과 분석 메뉴가 전혀 노출되지 않습니다.</li>
                      <li>· 로그인할 때마다 수업 입장 코드가 새로 갱신됩니다.</li>
                      <li>· 학생들의 대표 오답과 취약 문법(be동사, p.p., 의문문)을 자동 집계합니다.</li>
                    </ul>
                  </div>

                  {authStatus.loading ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      교사용 서버 상태를 확인하는 중...
                    </div>
                  ) : !authStatus.configured ? (
                    <form
                      onSubmit={handleTeacherSetup}
                      className="pt-4 border-t border-slate-800 space-y-3"
                    >
                      <p className="text-xs font-semibold text-amber-300">
                        최초 접속 · 교사용 비밀번호를 설정해 주세요
                      </p>
                      <div>
                        <label
                          htmlFor="title-teacher-setup-pw"
                          className="block text-xs font-medium text-slate-300 mb-1"
                        >
                          새 교사 비밀번호 (4자 이상)
                        </label>
                        <input
                          id="title-teacher-setup-pw"
                          type="password"
                          value={passcodeInput}
                          onChange={(e) => setPasscodeInput(e.target.value)}
                          placeholder="비밀번호 입력"
                          autoComplete="new-password"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none text-sm text-white"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="title-teacher-confirm-pw"
                          className="block text-xs font-medium text-slate-300 mb-1"
                        >
                          비밀번호 확인
                        </label>
                        <input
                          id="title-teacher-confirm-pw"
                          type="password"
                          value={confirmPasscodeInput}
                          onChange={(e) => setConfirmPasscodeInput(e.target.value)}
                          placeholder="비밀번호 다시 입력"
                          autoComplete="new-password"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none text-sm text-white"
                        />
                      </div>

                      {teacherError && (
                        <p className="text-xs text-rose-400" role="alert">
                          {teacherError}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={teacherSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all cursor-pointer whitespace-nowrap disabled:opacity-60"
                      >
                        <span>
                          {teacherSubmitting
                            ? '설정 및 코드 발급 중...'
                            : '비밀번호 설정 후 교사용 서버 접속'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <form
                      onSubmit={handleTeacherLogin}
                      className="pt-4 border-t border-slate-800 space-y-3"
                    >
                      <div>
                        <label
                          htmlFor="title-teacher-login-pw"
                          className="block text-xs font-medium text-slate-300 mb-1.5"
                        >
                          교사 비밀번호
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            id="title-teacher-login-pw"
                            type="password"
                            value={passcodeInput}
                            onChange={(e) => setPasscodeInput(e.target.value)}
                            placeholder="교사 비밀번호 입력"
                            autoComplete="current-password"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none text-sm text-white"
                          />
                        </div>
                      </div>

                      {teacherError && (
                        <p className="text-xs text-rose-400" role="alert">
                          {teacherError}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={teacherSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all cursor-pointer whitespace-nowrap disabled:opacity-60"
                      >
                        <span>
                          {teacherSubmitting
                            ? '인증 및 입장 코드 발급 중...'
                            : '교사용 분석 서버 접속하기'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
