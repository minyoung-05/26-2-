import { useEffect, useState, useCallback, FormEvent } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Check,
  Copy,
  Download,
  KeyRound,
  Lock,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react';
import {
  ActiveJoinCodeInfo,
  MistakeTag,
  TeacherAnalyticsPayload,
} from '../types/game';

interface TeacherDashboardProps {
  initialToken?: string | null;
  initialJoinCode?: ActiveJoinCodeInfo | null;
  onTokenChange?: (token: string | null) => void;
  onBackToStudent: () => void;
}

type DashboardTab = 'overview' | 'questions' | 'mistakes' | 'students';

const MISTAKE_TEACHING_TIPS: Record<MistakeTag, string> = {
  'be-missing':
    '수동태에서 과거분사(p.p.)만 쓰고 시제에 맞는 be동사(am/is/are/was/were)를 빠뜨리는 경우가 많습니다. "수동태 = be + p.p. 세트"를 강조해 주세요.',
  'pp-form':
    '불규칙 동사의 과거형(stole, broke, saw)과 과거분사(stolen, broken, seen)를 혼동하고 있습니다. 3단 변화표 복습이 효과적입니다.',
  'question-did':
    '일반동사 과거 의문문 습관 때문에 수동태 의문문에도 Did를 붙이는 오류입니다. "be동사가 이미 있으므로 Was/Were만 앞으로!"를 지도해 주세요.',
  'question-order':
    '수동태 Yes/No 의문문에서 주어와 be동사, p.p.의 어순([Be + 주어 + p.p.?])이 헷갈리는 상태입니다.',
  'by-missing':
    '"~에 의해"를 나타내는 전치사 by를 생략하는 실수입니다. 행위자 앞에는 반드시 by가 필요함을 안내해 주세요.',
  'active-passive-mixup':
    '주어가 직접 행동하는 능동태 문장에도 습관적으로 was/were를 붙이는 과잉 일반화 오류입니다. "주어가 하는지 당하는지" 의미 구분 연습이 필요합니다.',
  'word-order-spelling':
    '문장 전체 어순(주어 + 동사 + 장소/시간 부사)이나 철자·마침표 위치 오류입니다.',
  'empty-input': '답안을 작성하지 않고 제출 버튼을 눌렀습니다.',
};

export function TeacherDashboard({
  initialToken = null,
  initialJoinCode = null,
  onTokenChange,
  onBackToStudent,
}: TeacherDashboardProps) {
  const [authStatus, setAuthStatus] = useState<{
    loading: boolean;
    configured: boolean;
    source: 'env' | 'claimed' | 'unset';
  }>({ loading: true, configured: true, source: 'env' });

  // Teacher Bearer token kept strictly in React memory (never localStorage)
  const [teacherToken, setTeacherTokenState] = useState<string | null>(
    initialToken
  );
  const setTeacherToken = useCallback(
    (next: string | null) => {
      setTeacherTokenState(next);
      onTokenChange?.(next);
    },
    [onTokenChange]
  );

  const [passcodeInput, setPasscodeInput] = useState('');
  const [confirmPasscodeInput, setConfirmPasscodeInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Active rotating join code
  const [activeJoinCode, setActiveJoinCode] =
    useState<ActiveJoinCodeInfo | null>(initialJoinCode);
  const [rotatingCode, setRotatingCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Dashboard data & filters
  const [analytics, setAnalytics] = useState<TeacherAnalyticsPayload | null>(
    null
  );
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [joinCodeFilter, setJoinCodeFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<'all' | '1' | '2' | '3'>('all');
  const [formatFilter, setFormatFilter] = useState<
    'all' | 'word-order' | 'writing'
  >('all');
  const [studentSearch, setStudentSearch] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  const fetchAuthStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/teacher/auth/status');
      const data = (await res.json()) as {
        configured: boolean;
        source: 'env' | 'claimed' | 'unset';
      };
      setAuthStatus({
        loading: false,
        configured: Boolean(data.configured),
        source: data.source,
      });
    } catch {
      setAuthStatus({ loading: false, configured: true, source: 'env' });
    }
  }, []);

  useEffect(() => {
    fetchAuthStatus();
  }, [fetchAuthStatus]);

  const fetchAnalytics = useCallback(
    async (token: string, selectedJoinCode: string) => {
      setLoadingData(true);
      setDataError(null);
      try {
        const qs = new URLSearchParams({ joinCode: selectedJoinCode });
        const res = await fetch(`/api/teacher/analytics?${qs.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401 || res.status === 403) {
          setTeacherToken(null);
          setAuthError('교사 세션이 만료되었습니다. 다시 로그인해 주세요.');
          return;
        }
        if (!res.ok) {
          throw new Error('데이터를 불러오지 못했습니다.');
        }
        const payload = (await res.json()) as TeacherAnalyticsPayload;
        setAnalytics(payload);
        if (payload.activeJoinCode) {
          setActiveJoinCode(payload.activeJoinCode);
        }
      } catch (err) {
        setDataError(
          err instanceof Error
            ? err.message
            : '교사용 서버와 통신 중 오류가 발생했습니다.'
        );
      } finally {
        setLoadingData(false);
      }
    },
    []
  );

  useEffect(() => {
    if (teacherToken) {
      fetchAnalytics(teacherToken, joinCodeFilter);
    }
  }, [teacherToken, joinCodeFilter, fetchAnalytics]);

  const handleSetupPasscode = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (passcodeInput.trim().length < 4) {
      setAuthError('비밀번호는 4자 이상으로 설정해 주세요.');
      return;
    }
    if (passcodeInput.trim() !== confirmPasscodeInput.trim()) {
      setAuthError('비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    setAuthSubmitting(true);
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
        setAuthError(data.error || '비밀번호 설정에 실패했습니다.');
        await fetchAuthStatus();
        return;
      }
      setPasscodeInput('');
      setConfirmPasscodeInput('');
      setActiveJoinCode(data.activeJoinCode ?? null);
      setTeacherToken(data.token);
      await fetchAuthStatus();
    } catch {
      setAuthError('교사용 서버에 연결할 수 없습니다.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!passcodeInput.trim()) {
      setAuthError('교사 비밀번호를 입력해 주세요.');
      return;
    }
    setAuthSubmitting(true);
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
        setAuthError(data.error || '로그인에 실패했습니다.');
        return;
      }
      setPasscodeInput('');
      setActiveJoinCode(data.activeJoinCode ?? null);
      setTeacherToken(data.token);
    } catch {
      setAuthError('교사용 서버에 연결할 수 없습니다.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleRotateJoinCode = async () => {
    if (!teacherToken) return;
    setRotatingCode(true);
    try {
      const res = await fetch('/api/teacher/join-code/rotate', {
        method: 'POST',
        headers: { Authorization: `Bearer ${teacherToken}` },
      });
      if (!res.ok) return;
      const data = (await res.json()) as { activeJoinCode: ActiveJoinCodeInfo };
      setActiveJoinCode(data.activeJoinCode);
      setCopiedCode(false);
      await fetchAnalytics(teacherToken, joinCodeFilter);
    } finally {
      setRotatingCode(false);
    }
  };

  const handleCopyJoinCode = async () => {
    if (!activeJoinCode?.code) return;
    try {
      await navigator.clipboard.writeText(activeJoinCode.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1800);
    } catch {
      // ignore clipboard denial
    }
  };

  const handleExportCsv = async () => {
    if (!teacherToken) return;
    try {
      const qs = new URLSearchParams({ joinCode: joinCodeFilter });
      const res = await fetch(`/api/teacher/export?${qs.toString()}`, {
        headers: { Authorization: `Bearer ${teacherToken}` },
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'passive_voice_error_report.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setDataError('CSV 내보내기에 실패했습니다.');
    }
  };

  const handleResetData = async () => {
    if (!teacherToken) return;
    setResetting(true);
    try {
      const res = await fetch('/api/teacher/reset', {
        method: 'POST',
        headers: { Authorization: `Bearer ${teacherToken}` },
      });
      if (res.ok) {
        setConfirmReset(false);
        setJoinCodeFilter('all');
        await fetchAnalytics(teacherToken, 'all');
      }
    } finally {
      setResetting(false);
    }
  };

  // =========================================================================
  // AUTH GATE (Setup or Login)
  // =========================================================================
  if (!teacherToken) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col">
        <header className="flex items-center justify-between gap-6 px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <span className="text-base font-bold text-white whitespace-nowrap shrink-0">
            The Trophy Was Stolen! · 교사용 서버
          </span>
          <button
            type="button"
            onClick={onBackToStudent}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>학생용 게임으로 돌아가기</span>
          </button>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center gap-2.5 text-amber-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>교사 전용 오답률 분석 & 입장 코드 발급 서버</span>
            </div>

            {authStatus.loading ? (
              <div className="py-10 text-center text-sm text-slate-400">
                교사용 서버 인증 상태를 확인하는 중...
              </div>
            ) : !authStatus.configured ? (
              <>
                <h1 className="text-xl font-bold text-white mb-2">
                  최초 교사용 비밀번호 설정
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-5">
                  오답률 데이터 보호와 학생 입장 코드 발급을 위해 교사 전용
                  비밀번호를 설정하세요. 로그인 즉시 새 수업 입장 코드가 자동
                  생성됩니다.
                </p>

                <form onSubmit={handleSetupPasscode} className="space-y-4">
                  <div>
                    <label
                      htmlFor="setup-passcode"
                      className="block text-xs font-medium text-slate-300 mb-1.5"
                    >
                      새 교사 비밀번호 (4자 이상)
                    </label>
                    <input
                      id="setup-passcode"
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
                      htmlFor="confirm-passcode"
                      className="block text-xs font-medium text-slate-300 mb-1.5"
                    >
                      비밀번호 확인
                    </label>
                    <input
                      id="confirm-passcode"
                      type="password"
                      value={confirmPasscodeInput}
                      onChange={(e) => setConfirmPasscodeInput(e.target.value)}
                      placeholder="비밀번호 다시 입력"
                      autoComplete="new-password"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none text-sm text-white"
                    />
                  </div>

                  {authError && (
                    <p className="text-xs text-rose-400" role="alert">
                      {authError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={authSubmitting}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {authSubmitting
                      ? '설정 저장 중...'
                      : '비밀번호 설정 및 입장 코드 발급'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h1 className="text-xl font-bold text-white mb-2">
                  교사용 분석 서버 로그인
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-5">
                  교사 비밀번호를 입력하면 익명 학생들의 오답률을 확인하고,
                  이번 수업에 사용할 새 입장 코드를 즉시 발급합니다.
                </p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label
                      htmlFor="teacher-passcode"
                      className="block text-xs font-medium text-slate-300 mb-1.5"
                    >
                      교사 비밀번호
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="teacher-passcode"
                        type="password"
                        value={passcodeInput}
                        onChange={(e) => setPasscodeInput(e.target.value)}
                        placeholder="교사 비밀번호 입력"
                        autoComplete="current-password"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none text-sm text-white"
                      />
                    </div>
                  </div>

                  {authError && (
                    <p className="text-xs text-rose-400" role="alert">
                      {authError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={authSubmitting}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {authSubmitting
                      ? '인증 및 입장 코드 발급 중...'
                      : '로그인 및 새 입장 코드 발급'}
                  </button>
                </form>
              </>
            )}
          </div>
        </main>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED TEACHER ANALYTICS DASHBOARD
  // =========================================================================
  const filteredQuestions = (analytics?.questionStats ?? []).filter((q) => {
    if (stageFilter !== 'all' && String(q.stageId) !== stageFilter) return false;
    if (formatFilter !== 'all' && q.format !== formatFilter) return false;
    return true;
  });

  const filteredStudents = (analytics?.students ?? []).filter((s) => {
    if (!studentSearch.trim()) return true;
    const query = studentSearch.trim().toLowerCase();
    return (
      s.anonymousLabel.toLowerCase().includes(query) ||
      (s.nickname ?? '').toLowerCase().includes(query) ||
      s.joinCode.toLowerCase().includes(query)
    );
  });

  const sortedByErrorDesc = [...(analytics?.questionStats ?? [])]
    .filter((q) => q.totalAttempts > 0)
    .sort((a, b) => b.errorRate - a.errorRate);

  const displayedJoinCode = activeJoinCode ?? analytics?.activeJoinCode ?? null;

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col">
      {/* 3-Zone Top Bar */}
      <header className="flex items-center justify-between gap-6 px-6 py-3.5 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md sticky top-0 z-30">
        <span className="text-base sm:text-lg font-bold text-white whitespace-nowrap shrink-0">
          The Trophy Was Stolen! · 교사용 분석 서버
        </span>

        <nav
          aria-label="교사용 분석 메뉴"
          className="hidden md:flex items-center gap-6 text-sm"
        >
          {(
            [
              ['overview', '전체 현황'],
              ['questions', '문항별 오답률'],
              ['mistakes', '오류 유형 분석'],
              ['students', '익명 참여자 현황'],
            ] as const
          ).map(([tabKey, label]) => (
            <button
              key={tabKey}
              type="button"
              onClick={() => setActiveTab(tabKey)}
              className={`whitespace-nowrap shrink-0 pb-0.5 transition-colors cursor-pointer ${
                activeTab === tabKey
                  ? 'text-amber-400 font-bold border-b-2 border-amber-400'
                  : 'text-slate-400 hover:text-slate-100 font-medium'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onBackToStudent}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>학생 화면으로</span>
          </button>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden items-center gap-1 px-4 py-2 bg-slate-900 border-b border-slate-800 overflow-x-auto">
        {(
          [
            ['overview', '전체 현황'],
            ['questions', '문항별 오답률'],
            ['mistakes', '오류 유형'],
            ['students', '익명 참여자'],
          ] as const
        ).map(([tabKey, label]) => (
          <button
            key={tabKey}
            type="button"
            onClick={() => setActiveTab(tabKey)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 ${
              activeTab === tabKey
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-5 sm:px-6 py-5 space-y-5">
        {/* Active Rotating Join Code Banner */}
        <section
          aria-label="현재 수업 입장 코드"
          className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-300">
                현재 활성 수업 입장 코드 (교사 로그인 시 자동 갱신)
              </p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                학생들에게 이 코드를 알려주면 이름·학번 없이 익명으로 입장합니다.
                새 코드를 발급해도 이미 수사를 시작한 학생은 중단 없이 이어서 풀 수
                있습니다.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono-code text-xl sm:text-2xl font-bold tracking-[0.22em] text-amber-300 select-all">
              {displayedJoinCode?.code ?? '------'}
            </div>

            <button
              type="button"
              onClick={handleCopyJoinCode}
              disabled={!displayedJoinCode}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">복사됨</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>코드 복사</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleRotateJoinCode}
              disabled={rotatingCode}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${rotatingCode ? 'animate-spin' : ''}`}
              />
              <span>새 입장 코드 발급</span>
            </button>
          </div>
        </section>

        {/* Workspace Filter & Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <label htmlFor="code-filter" className="text-xs text-slate-400">
              입장 코드 회차 필터
            </label>
            <select
              id="code-filter"
              value={joinCodeFilter}
              onChange={(e) => setJoinCodeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono-code focus:border-amber-400 focus:outline-none"
            >
              <option value="all">전체 입장 코드 회차</option>
              {(analytics?.joinCodes ?? []).map((code) => (
                <option key={code} value={code}>
                  {code === 'OPEN' ? 'OPEN (코드 없이 자유 입장)' : code}
                  {displayedJoinCode?.code === code ? ' (현재 활성)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fetchAnalytics(teacherToken, joinCodeFilter)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`}
              />
              <span>새로고침</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              disabled={!analytics || analytics.summary.totalAttempts === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>CSV 내보내기</span>
            </button>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-700/60 text-xs font-medium text-slate-300 hover:text-rose-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>기록 초기화</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-rose-950/70 border border-rose-600/60 rounded-lg px-2.5 py-1">
                <span className="text-xs text-rose-200">전체 삭제할까요?</span>
                <button
                  type="button"
                  disabled={resetting}
                  onClick={handleResetData}
                  className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white cursor-pointer"
                >
                  확인
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-0.5 rounded bg-slate-800 text-xs text-slate-300 cursor-pointer"
                >
                  취소
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setTeacherToken(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>

        {dataError && (
          <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-600/50 text-sm text-rose-200">
            {dataError}
          </div>
        )}

        {/* Loading Skeleton */}
        {loadingData && !analytics ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-24 rounded-xl bg-slate-900 border border-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : analytics ? (
          <>
            {/* 4-Column KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span>익명 참여 학생 수</span>
                  <Users className="w-4 h-4 text-sky-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white tabular-nums">
                    {analytics.summary.totalStudents}명
                  </span>
                  <span className="text-xs text-slate-400 tabular-nums">
                    (수사 완료 {analytics.summary.completedStudents}명)
                  </span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span>전체 평균 오답률</span>
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-amber-300 tabular-nums">
                    {analytics.summary.overallErrorRate}%
                  </span>
                  <span className="text-xs text-slate-400 tabular-nums">
                    ({analytics.summary.totalWrongAttempts} /{' '}
                    {analytics.summary.totalAttempts}회)
                  </span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span>최고 오답률 문항</span>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                </div>
                {analytics.summary.hardestQuestion ? (
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-rose-300 tabular-nums">
                        {analytics.summary.hardestQuestion.errorRate}%
                      </span>
                      <span className="text-xs font-mono-code text-slate-300">
                        S{analytics.summary.hardestQuestion.stageId}-Q
                        {analytics.summary.hardestQuestion.orderInStage}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {analytics.summary.hardestQuestion.koreanPrompt}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 pt-1">데이터 없음</p>
                )}
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span>최다 문법 오류 유형</span>
                  <Lock className="w-4 h-4 text-emerald-400" />
                </div>
                {analytics.summary.topMistake ? (
                  <div>
                    <p className="text-sm font-bold text-white truncate">
                      {analytics.summary.topMistake.label}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 tabular-nums">
                      누적 {analytics.summary.topMistake.count}회 발생
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 pt-1">오답 기록 없음</p>
                )}
              </div>
            </div>

            {/* Empty State Notice */}
            {analytics.summary.totalStudents === 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center space-y-2">
                <p className="text-base font-semibold text-white">
                  아직 입장 코드({displayedJoinCode?.code ?? '-'})로 참여한 학생 기록이 없습니다
                </p>
                <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  학생 화면에서 위의 입장 코드를 입력해 익명으로 수사를 시작하면,
                  문항별 오답률과 취약 문법 유형이 실시간으로 집계됩니다.
                </p>
              </div>
            )}

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && analytics.summary.totalStudents > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <section className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div>
                    <h2 className="text-sm font-bold text-white">
                      문법 영역별 오답률 비교
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      학습자가 어느 문법 형식(평서문·의문문·능동/수동 구분)에서
                      어려움을 겪는지 한눈에 확인하세요.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    {analytics.categoryStats.map((cat) => (
                      <div key={cat.category}>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-medium text-slate-200">
                            {cat.label}
                          </span>
                          <span className="text-slate-400 tabular-nums">
                            오답률{' '}
                            <strong
                              className={
                                cat.errorRate >= 50
                                  ? 'text-rose-400'
                                  : cat.errorRate >= 25
                                    ? 'text-amber-300'
                                    : 'text-emerald-400'
                              }
                            >
                              {cat.errorRate}%
                            </strong>{' '}
                            ({cat.wrongAttempts}/{cat.totalAttempts}회)
                          </span>
                        </div>
                        <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              cat.errorRate >= 50
                                ? 'bg-rose-500'
                                : cat.errorRate >= 25
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-500'
                            }`}
                            style={{ width: `${cat.errorRate}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <h3 className="text-xs font-semibold text-slate-300 mb-3">
                      스테이지 도입 미니 퀴즈(개념 이해) 오답률
                    </h3>
                    <div className="space-y-2.5">
                      {analytics.miniQuizStats.map((mq) => (
                        <div
                          key={mq.miniQuizId}
                          className="flex items-center justify-between gap-3 text-xs bg-slate-950/60 border border-slate-800/80 rounded-lg px-3 py-2"
                        >
                          <span className="text-slate-300 truncate">{mq.title}</span>
                          <span className="font-mono-code font-semibold text-amber-300 tabular-nums shrink-0">
                            {mq.errorRate}% ({mq.wrongAttempts}/{mq.totalAttempts})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-white">
                        오답률 상위 문항 TOP 5
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        수업 중 피드백이 가장 시급한 문항 순서입니다.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('questions')}
                      className="text-xs text-amber-400 hover:text-amber-300 cursor-pointer whitespace-nowrap"
                    >
                      전체 15문항 보기 →
                    </button>
                  </div>

                  {sortedByErrorDesc.length === 0 ? (
                    <p className="text-xs text-slate-500 py-8 text-center">
                      집계된 문항 풀이 기록이 아직 없습니다.
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {sortedByErrorDesc.slice(0, 5).map((q) => (
                        <div
                          key={q.questionId}
                          className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5"
                        >
                          <div className="flex items-center justify-between gap-3 mb-1">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-mono-code font-semibold text-amber-400">
                                S{q.stageId}-Q{q.orderInStage}
                              </span>
                              <span className="text-slate-400">
                                · {q.grammarLabel}
                              </span>
                            </div>
                            <span
                              className={`text-xs font-bold tabular-nums ${
                                q.errorRate >= 50
                                  ? 'text-rose-400'
                                  : q.errorRate >= 25
                                    ? 'text-amber-300'
                                    : 'text-emerald-400'
                              }`}
                            >
                              오답률 {q.errorRate}%
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm font-medium text-slate-100">
                            {q.koreanPrompt}
                          </p>
                          <p className="text-xs font-mono-code text-slate-400 mt-0.5">
                            정답: {q.canonicalAnswer}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* TAB 2: ALL 15 QUESTIONS BREAKDOWN */}
            {activeTab === 'questions' && (
              <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-sm font-bold text-white">
                    문항별 오답률 및 대표 오답 상세 (총 15문항)
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded-lg text-xs">
                      {(['all', '1', '2', '3'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setStageFilter(st)}
                          className={`px-2.5 py-1 rounded-md cursor-pointer ${
                            stageFilter === st
                              ? 'bg-slate-800 text-white font-semibold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {st === 'all' ? '전체 단계' : `스테이지 ${st}`}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded-lg text-xs">
                      {(
                        [
                          ['all', '전체 유형'],
                          ['word-order', '단어 배열'],
                          ['writing', '직접 영작'],
                        ] as const
                      ).map(([fmt, label]) => (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => setFormatFilter(fmt)}
                          className={`px-2.5 py-1 rounded-md cursor-pointer ${
                            formatFilter === fmt
                              ? 'bg-slate-800 text-white font-semibold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4 font-medium whitespace-nowrap">문항</th>
                        <th className="py-3 px-4 font-medium whitespace-nowrap">유형 / 문법</th>
                        <th className="py-3 px-4 font-medium">문제 및 정답</th>
                        <th className="py-3 px-4 font-medium text-right whitespace-nowrap">시도 / 오답</th>
                        <th className="py-3 px-4 font-medium text-right whitespace-nowrap">1차 오답률</th>
                        <th className="py-3 px-4 font-medium text-right whitespace-nowrap">전체 오답률</th>
                        <th className="py-3 px-4 font-medium">학생 대표 오답</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {filteredQuestions.map((q) => (
                        <tr key={q.questionId} className="hover:bg-slate-800/35 align-top">
                          <td className="py-3 px-4 font-mono-code font-semibold text-amber-400 whitespace-nowrap">
                            S{q.stageId}-Q{q.orderInStage}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <p className="text-slate-200 font-medium">
                              {q.format === 'word-order' ? '단어 배열' : '직접 영작'}
                            </p>
                            <p className="text-slate-400 mt-0.5">{q.grammarLabel}</p>
                          </td>
                          <td className="py-3 px-4 min-w-[230px]">
                            <p className="text-slate-100 font-medium">{q.koreanPrompt}</p>
                            <p className="font-mono-code text-slate-400 mt-0.5">
                              {q.canonicalAnswer}
                            </p>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums text-slate-300 whitespace-nowrap">
                            {q.totalAttempts} / {q.wrongAttempts}
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums text-slate-300 whitespace-nowrap">
                            {q.firstTryErrorRate}%
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums whitespace-nowrap">
                            <span
                              className={`font-bold ${
                                q.totalAttempts === 0
                                  ? 'text-slate-500'
                                  : q.errorRate >= 50
                                    ? 'text-rose-400'
                                    : q.errorRate >= 25
                                      ? 'text-amber-300'
                                      : 'text-emerald-400'
                              }`}
                            >
                              {q.errorRate}%
                            </span>
                          </td>
                          <td className="py-3 px-4 min-w-[200px]">
                            {q.topWrongSubmissions.length === 0 ? (
                              <span className="text-slate-500">-</span>
                            ) : (
                              <ul className="space-y-1">
                                {q.topWrongSubmissions.map((sub) => (
                                  <li
                                    key={sub.text}
                                    className="font-mono-code text-rose-300/90"
                                  >
                                    “{sub.text}”{' '}
                                    <span className="text-slate-400">({sub.count}회)</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* TAB 3: MISTAKE TYPES BREAKDOWN */}
            {activeTab === 'mistakes' && (
              <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-white">
                    수동태 문법 오류 유형별 빈도 및 수업 처방
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    학생들이 제출한 오답을 문법 엔진이 자동 분류한 결과입니다.
                  </p>
                </div>

                {analytics.mistakeStats.length === 0 ? (
                  <p className="text-xs text-slate-500 py-8 text-center">
                    아직 기록된 문법 오류 데이터가 없습니다.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {analytics.mistakeStats.map((m) => (
                      <div
                        key={m.tag}
                        className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-bold text-white">
                            {m.label}
                          </span>
                          <span className="text-xs font-semibold text-amber-300 tabular-nums">
                            {m.count}회 · 전체 오답 중 {m.percentage}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${m.percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed pt-1">
                          지도 포인트: {MISTAKE_TEACHING_TIPS[m.tag]}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* TAB 4: ANONYMOUS STUDENT ROSTER */}
            {activeTab === 'students' && (
              <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-sm font-bold text-white">
                    익명 참여자별 풀이 진도 및 오답률
                  </h2>
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="별명, 익명 번호 또는 입장 코드 검색..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-none text-xs text-white"
                    />
                  </div>
                </div>

                {filteredStudents.length === 0 ? (
                  <p className="text-xs text-slate-500 py-8 text-center">
                    조건에 맞는 익명 참여 기록이 없습니다.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="py-3 px-4 font-medium">별명 (익명 ID)</th>
                          <th className="py-3 px-4 font-medium">입장 코드</th>
                          <th className="py-3 px-4 font-medium">수사 상태</th>
                          <th className="py-3 px-4 font-medium text-right">해결 문항</th>
                          <th className="py-3 px-4 font-medium text-right">단서 별</th>
                          <th className="py-3 px-4 font-medium text-right">개인 오답률</th>
                          <th className="py-3 px-4 font-medium">오답이 발생한 문항</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {filteredStudents.map((st) => (
                          <tr key={st.sessionId} className="hover:bg-slate-800/35">
                            <td className="py-3 px-4 font-semibold text-white whitespace-nowrap tabular-nums">
                              {st.nickname && st.nickname !== st.anonymousLabel ? (
                                <span>
                                  {st.nickname}{' '}
                                  <span className="text-slate-400 font-normal">
                                    ({st.anonymousLabel})
                                  </span>
                                </span>
                              ) : (
                                st.anonymousLabel
                              )}
                            </td>
                            <td className="py-3 px-4 font-mono-code text-slate-300 whitespace-nowrap">
                              {st.joinCode === 'OPEN' ? '자유 입장' : st.joinCode}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              {st.completed ? (
                                <span className="text-emerald-400 font-medium">
                                  범인 검거 완료
                                </span>
                              ) : (
                                <span className="text-amber-300">진행 중</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right tabular-nums text-slate-200">
                              {st.questionsAttempted} / 15
                            </td>
                            <td className="py-3 px-4 text-right tabular-nums text-amber-300 font-semibold">
                              {st.totalStars} / 45
                            </td>
                            <td className="py-3 px-4 text-right tabular-nums">
                              <span
                                className={`font-bold ${
                                  st.errorRate >= 50
                                    ? 'text-rose-400'
                                    : st.errorRate >= 25
                                      ? 'text-amber-300'
                                      : 'text-emerald-400'
                                }`}
                              >
                                {st.errorRate}%
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono-code text-slate-400">
                              {st.struggledQuestionIds.length === 0
                                ? '-'
                                : st.struggledQuestionIds
                                    .map((id) => id.toUpperCase())
                                    .join(', ')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
}
