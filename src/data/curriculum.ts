import heroImg from '../assets/images/school_mystery_hero_1795186108185.jpg';
import stage1Img from '../assets/images/stage1_student_council_1795186107839.jpg';
import stage2Img from '../assets/images/stage2_school_hallway_1795186107809.jpg';
import stage3Img from '../assets/images/stage3_club_room_1795186107982.jpg';
import stage4Img from '../assets/images/stage4_school_auditorium_1795186107732.jpg';
import { CharacterId, StageConfig, SuspectProfile } from '../types/game';

export const SCENE_IMAGES = {
  hero: heroImg,
  stage1: stage1Img,
  stage2: stage2Img,
  stage3: stage3Img,
  stage4: stage4Img,
};

export const CHARACTER_META: Record<
  CharacterId,
  { name: string; role: string; accent: string }
> = {
  minji: {
    name: '민지',
    role: '학생회장 · 사건 수사 단장',
    accent: 'text-amber-300',
  },
  doyun: {
    name: '도윤',
    role: '학생회 서기 · 현장 목격 제보자',
    accent: 'text-sky-300',
  },
  haeun: {
    name: '하은',
    role: '단서 분석 담당 · 기록원',
    accent: 'text-emerald-300',
  },
  teacher_kim: {
    name: '김 선생님',
    role: '학생회 담당 교사 · 열쇠 관리자',
    accent: 'text-indigo-300',
  },
  librarian: {
    name: '사서 선생님',
    role: '도서관 앞 복도 목격자',
    accent: 'text-teal-300',
  },
  jihoon: {
    name: '지훈',
    role: '선도부 부장 · 2층 계단 목격자',
    accent: 'text-blue-300',
  },
  guard: {
    name: '지킴이 선생님',
    role: '보안실 CCTV 담당자',
    accent: 'text-amber-200',
  },
  yuna: {
    name: '유나',
    role: '방과 후 청소 당번 · 복도 창문 목격자',
    accent: 'text-rose-300',
  },
  minho: {
    name: '민호',
    role: '매점 앞 목격자 · 2학년 4반',
    accent: 'text-orange-300',
  },
  taeo: {
    name: '강태오',
    role: '미술부 부장 · 용의자 1',
    accent: 'text-cyan-300',
  },
  siwoo: {
    name: '시우',
    role: '체육부 부원 · 동아리방 참고인',
    accent: 'text-lime-300',
  },
  subin: {
    name: '박수빈',
    role: '댄스부 부장 · 용의자 2',
    accent: 'text-fuchsia-300',
  },
  junho: {
    name: '최준호',
    role: '방송부 부장 · 용의자 3',
    accent: 'text-violet-300',
  },
};

export const SUSPECTS: SuspectProfile[] = [
  {
    id: 'taeo',
    name: '강태오',
    role: '미술부 부장 · 용의자 1',
    alibi: '방과 후 5시까지 미술실에서 축제 포스터를 그렸다고 주장함.',
    keyEvidence:
      '파란 손수건 주인이지만, 당일 친구에게 손수건을 빌려준 사실이 확인됨.',
    isCulprit: false,
    wrongChoiceHint:
      '태오는 파란 손수건 주인이 맞지만, 그 손수건을 친구에게 빌려주었다는 반전이 있었어요. 방송실 출입 기록과 사물함 리본 단서를 다시 살펴보세요!',
  },
  {
    id: 'subin',
    name: '박수빈',
    role: '댄스부 부장 · 용의자 2',
    alibi: '5시부터 6시까지 강당 옆 연습실에서 안무 점검을 했다고 주장함.',
    keyEvidence:
      '학생회실 열쇠를 한 번 빌려간 적은 있으나, 5시 전에 이미 반납 완료됨.',
    isCulprit: false,
    wrongChoiceHint:
      '수빈이는 열쇠를 제시간에 반납했어요. CCTV 카메라가 꺼진 이유, 5시에 열린 방, 그리고 사물함에서 발견된 축제 리본이 가리키는 인물을 찾아보세요!',
  },
  {
    id: 'junho',
    name: '최준호',
    role: '방송부 부장 · 용의자 3',
    alibi: '5시에는 방송실에 아무도 들어가지 않았고 자기는 일찍 귀가했다고 주장함.',
    keyEvidence:
      '배터리·5시 목격·방송실 5시 출입·사물함 속 축제 리본이 모두 일치함.',
    isCulprit: true,
    wrongChoiceHint: '',
  },
];

export const STAGES: StageConfig[] = [
  {
    id: 1,
    title: '스테이지 1 · 사건 현장 조사',
    subtitle: '수동태 기본 평서문 (be + p.p.)',
    transitionDescription:
      '축제를 하루 앞둔 아침, 학생회실 유리 진열장이 비어 있습니다. 현장 단서를 하나씩 조사하며 수동태의 기본 문장 구조를 익혀 봅시다.',
    location: '학생회실 현장',
    backgroundImage: stage1Img,
    introSpeaker: 'minji',
    introMessage:
      '어젯밤 누군가 학생회실 황금 트로피를 가져갔어! 먼저 수동태 개념을 확인하고 현장 단서를 모으자.',
    miniQuiz: {
      id: 'mq-1',
      title: '스테이지 1 도입 · 능동태 vs 수동태 개념',
      prompt:
        '행동을 "누가 했는지(능동태)"보다 "대상이 어떤 일을 당했는지(수동태)"를 말할 때 be동사 + 과거분사(p.p.)를 씁니다.',
      exampleCompare: {
        active: 'Someone stole the trophy.',
        activeKorean: '누군가가 그 트로피를 훔쳤다. (능동태)',
        passive: 'The trophy was stolen.',
        passiveKorean: '그 트로피가 도난당했다. (수동태)',
      },
      question:
        '다음 중 "황금 트로피가 어제 도난당했다"를 뜻하는 수동태 문장으로 알맞은 것은?',
      options: [
        {
          id: 'opt-a',
          label: 'The golden trophy stole yesterday.',
          isCorrect: false,
          feedback:
            'be동사(was) 없이 stole만 쓰면 트로피가 직접 무언가를 훔쳤다는 뜻이 돼요!',
        },
        {
          id: 'opt-b',
          label: 'The golden trophy was stolen yesterday.',
          isCorrect: true,
          feedback:
            '정확해요! 주어(The golden trophy) + was + 과거분사(stolen) 형태가 수동태입니다.',
        },
        {
          id: 'opt-c',
          label: 'The golden trophy was stole yesterday.',
          isCorrect: false,
          feedback:
            'steal의 과거형은 stole이지만, 수동태에는 과거분사(p.p.)인 stolen을 써야 해요.',
        },
      ],
      summaryTip:
        '과거 시제 수동태는 [주어 + was/were + 과거분사(p.p.)] 형태를 기억하세요!',
    },
    questions: [
      {
        id: 's1-q1',
        stageId: 1,
        orderInStage: 1,
        format: 'word-order',
        grammarCategory: 'passive-statement',
        grammarLabel: '수동태 평서문 (과거)',
        character: 'minji',
        sceneLocation: '학생회실 빈 진열장',
        characterSpeech:
          '진열장이 텅 비어 있어! 사건 보고서 첫 줄부터 영어로 정확히 기록해 보자.',
        koreanPrompt: '황금 트로피가 어제 도난당했다.',
        instruction:
          '동사 형태(현재형·과거형·과거분사형 중 1개)를 고르고, 나머지 단어 카드와 올바르게 배열하세요.',
        wordTiles: ['yesterday.', 'The golden trophy', 'was'],
        verbChoices: {
          correctTense: 'pp',
          choices: [
            { id: 's1q1-past', word: 'stole', tense: 'past' },
            { id: 's1q1-pp', word: 'stolen', tense: 'pp' },
            { id: 's1q1-pres', word: 'steal', tense: 'present' },
          ],
        },
        canonicalAnswer: 'The golden trophy was stolen yesterday.',
        acceptedAnswers: ['The golden trophy was stolen yesterday.'],
        hints: [
          '주어(The golden trophy) 뒤에 과거형 be동사 was와 과거분사 stolen이 와야 해요.',
          '시간 표현 yesterday는 문장 맨 뒤에 놓습니다.',
        ],
        explanation:
          '주어가 단수(The golden trophy)이고 과거 사건이므로 was + stolen(steal의 과거분사)을 씁니다.',
        clueTitle: '단서 #1 · 도난 시점 확인',
        clueSummary: '황금 트로피는 어제(축제 전날) 학생회실에서 도난당했다.',
        speakerResponse:
          '좋아! 첫 번째 사건 기록이 완성됐어. 이제 진열장 유리문을 살펴보자.',
      },
      {
        id: 's1-q2',
        stageId: 1,
        orderInStage: 2,
        format: 'word-order',
        grammarCategory: 'active-statement',
        grammarLabel: '능동태 평서문 (과거)',
        character: 'doyun',
        sceneLocation: '학생회실 유리 진열장 앞',
        characterSpeech:
          '자물쇠가 부서진 흔적이 없어! 누군가가 열쇠로 유리 진열장을 직접 열었나 봐.',
        koreanPrompt: '누군가가 그 유리 진열장을 열었다.',
        instruction:
          '동사의 올바른 시제 형태를 고른 뒤, 나머지 단어들과 함께 능동태 문장으로 배열하세요.',
        wordTiles: ['the glass case.', 'Someone'],
        verbChoices: {
          correctTense: 'past',
          choices: [
            { id: 's1q2-pres', word: 'open', tense: 'present', showTenseTag: true },
            { id: 's1q2-pp', word: 'opened', tense: 'pp', showTenseTag: true },
            { id: 's1q2-past', word: 'opened', tense: 'past', showTenseTag: true },
          ],
        },
        canonicalAnswer: 'Someone opened the glass case.',
        acceptedAnswers: ['Someone opened the glass case.'],
        hints: [
          '능동태는 행동을 한 사람(Someone)이 주어로 옵니다.',
          '[주어 Someone + 동사 과거형 opened + 목적어 the glass case] 순서예요.',
        ],
        explanation:
          '행동 주체(Someone)가 직접 문을 연 능동태 문장이므로 be동사 없이 일반동사 과거형 opened를 씁니다.',
        clueTitle: '단서 #2 · 파손 없는 진열장',
        clueSummary: '유리 진열장은 파손 없이 열쇠로 조용히 열렸다.',
        speakerResponse:
          '맞아, 열쇠가 사용된 게 분명해! 책상 위쪽도 한번 확인해 볼까?',
      },
      {
        id: 's1-q3',
        stageId: 1,
        orderInStage: 3,
        format: 'word-order',
        grammarCategory: 'passive-statement',
        grammarLabel: '수동태 평서문 (과거)',
        character: 'haeun',
        sceneLocation: '학생회실 교사 책상',
        characterSpeech:
          '여기 봐! 반짝이는 열쇠 하나가 책상 위에 그대로 놓여 있어!',
        koreanPrompt: '그 열쇠는 책상 위에서 발견되었다.',
        instruction:
          '동사 형태 3가지 중 알맞은 것을 고르고, 나머지 단어 카드를 순서대로 배열하세요.',
        wordTiles: ['on the desk.', 'was', 'The key'],
        verbChoices: {
          correctTense: 'pp',
          choices: [
            { id: 's1q3-pp', word: 'found', tense: 'pp', showTenseTag: true },
            { id: 's1q3-pres', word: 'find', tense: 'present', showTenseTag: true },
            { id: 's1q3-past', word: 'found', tense: 'past', showTenseTag: true },
          ],
        },
        canonicalAnswer: 'The key was found on the desk.',
        acceptedAnswers: ['The key was found on the desk.'],
        hints: [
          'find(찾다)의 과거분사(p.p.)는 found입니다.',
          '[The key + was + found + on the desk.] 순서로 배열해 보세요.',
        ],
        explanation:
          '열쇠가 사람에 의해 "발견된" 것이므로 수동태 [was found]를 사용합니다.',
        clueTitle: '단서 #3 · 책상 위 열쇠',
        clueSummary: '범인이 사용한 것으로 보이는 열쇠가 책상 위에서 발견되었다.',
        speakerResponse:
          '열쇠가 제자리에 돌아와 있었다니 이상하네… 바닥에 떨어진 것도 확인하자!',
      },
      {
        id: 's1-q4',
        stageId: 1,
        orderInStage: 4,
        format: 'writing',
        grammarCategory: 'passive-statement',
        grammarLabel: '수동태 직접 영작 (과거)',
        character: 'haeun',
        sceneLocation: '학생회실 진열장 바닥',
        characterSpeech:
          '진열장 아래 구석에 작은 AA 건전지 하나가 떨어져 있어. 마이크나 무전기용일까?',
        koreanPrompt: '배터리 하나가 바닥에 남겨져 있었다.',
        instruction: '제시된 핵심 단어를 활용해 수동태 영어 문장을 직접 작성하세요.',
        writingGuides: ['A battery', 'leave → left', 'on the floor'],
        canonicalAnswer: 'A battery was left on the floor.',
        acceptedAnswers: [
          'A battery was left on the floor.',
          'One battery was left on the floor.',
        ],
        hints: [
          '"남겨져 있었다"는 수동태 [was + leave의 과거분사(left)]로 써야 해요.',
          'A battery 뒤에 was left를 쓰고, 장소를 나타내는 on the floor로 마무리하세요.',
        ],
        explanation:
          'leave(남기다)의 과거분사는 left입니다. 단수 주어 A battery에 맞춰 was left를 씁니다.',
        clueTitle: '단서 #4 · 바닥의 AA 배터리',
        clueSummary: '방송·음향 장비에 쓰이는 AA 배터리 하나가 현장에 남겨져 있었다.',
        speakerResponse:
          'AA 배터리라니, 음향 장비를 쓰는 동아리와 관련이 있을지도 몰라!',
      },
      {
        id: 's1-q5',
        stageId: 1,
        orderInStage: 5,
        format: 'word-order',
        grammarCategory: 'passive-statement',
        grammarLabel: '수동태 평서문 (현재 + by)',
        character: 'teacher_kim',
        sceneLocation: '학생회실 출입문',
        characterSpeech:
          '이상하군요. 평소 규칙대로라면 방과 후 이 방은 늘 잠겨 있어야 하는데요.',
        koreanPrompt: '이 방은 매일 선생님에 의해 잠긴다.',
        instruction:
          '동사 형태를 알맞게 선택하고, 나머지 단어와 함께 수동태 문장을 완성하세요.',
        wordTiles: ['every day.', 'is', 'by the teacher', 'This room'],
        verbChoices: {
          correctTense: 'pp',
          choices: [
            { id: 's1q5-past', word: 'locked', tense: 'past', showTenseTag: true },
            { id: 's1q5-pres', word: 'lock', tense: 'present', showTenseTag: true },
            { id: 's1q5-pp', word: 'locked', tense: 'pp', showTenseTag: true },
          ],
        },
        canonicalAnswer: 'This room is locked by the teacher every day.',
        acceptedAnswers: ['This room is locked by the teacher every day.'],
        hints: [
          '"매일" 일어나는 현재 습관이므로 과거형 was가 아니라 현재형 is를 써요.',
          '"선생님에 의해"는 [by the teacher]로 표현합니다.',
        ],
        explanation:
          '현재 시제 수동태는 [is/are + p.p.]를 쓰며, 동작을 한 사람은 [by + 행위자]로 뒤에 붙입니다.',
        clueTitle: '단서 #5 · 방과 후 출입 규정',
        clueSummary: '학생회실은 매일 선생님에 의해 잠기므로 5시 전후 열쇠 소지자만 출입 가능하다.',
        speakerResponse:
          '그렇다면 어제 5시 전후로 복도를 지나간 사람을 찾아야겠어. 복도로 나가자!',
      },
    ],
  },
  {
    id: 2,
    title: '스테이지 2 · 목격자 심문',
    subtitle: '능동→수동 전환 & by + 행위자',
    transitionDescription:
      '학교 곳곳의 목격자 5명을 차례로 만나 어제 방과 후 행적을 확인합니다. 행위자(by ~) 표현과 수동태 의문문을 완성해 보세요.',
    location: '도서관 · 계단 · 보안실 · 복도 · 매점 앞',
    backgroundImage: stage2Img,
    introSpeaker: 'librarian',
    introMessage:
      '방과 후 학교 곳곳에 남아 있던 선생님과 친구들의 증언을 들으면 범인의 동선이 보일 거예요.',
    miniQuiz: {
      id: 'mq-2',
      title: '스테이지 2 도입 · 능동→수동 문장 전환',
      prompt:
        '능동태의 목적어가 수동태의 주어가 되고, 능동태의 주어는 [by + 목적격] 형태로 문장 뒤에 옵니다.',
      exampleCompare: {
        active: 'Someone turned off the camera.',
        activeKorean: '누군가가 그 카메라를 껐다.',
        passive: 'The camera was turned off by someone.',
        passiveKorean: '그 카메라는 누군가에 의해 꺼졌다.',
      },
      question:
        '능동태 "A student dropped the wrapper."를 수동태로 바르게 바꾼 문장은?',
      options: [
        {
          id: 'opt-a',
          label: 'The wrapper dropped by a student.',
          isCorrect: false,
          feedback:
            '포장지가 직접 떨어뜨린 것이 아니므로 dropped 앞에 be동사(was)가 필요해요!',
        },
        {
          id: 'opt-b',
          label: 'The wrapper was dropped by a student.',
          isCorrect: true,
          feedback:
            '완벽해요! 목적어(The wrapper)가 주어가 되고, was dropped 뒤에 by a student가 붙었어요.',
        },
        {
          id: 'opt-c',
          label: 'A student was dropped by the wrapper.',
          isCorrect: false,
          feedback:
            '주어와 행위자의 위치가 바뀌었어요. 떨어뜨려진 대상인 The wrapper가 주어가 되어야 해요.',
        },
      ],
      summaryTip:
        '동작을 당한 대상을 맨 앞(주어)으로 보내고, 동작을 한 사람은 [by + 행위자]로 연결하세요!',
    },
    questions: [
      {
        id: 's2-q1',
        stageId: 2,
        orderInStage: 1,
        format: 'word-order',
        grammarCategory: 'passive-question',
        grammarLabel: '수동태 Yes/No 의문문 (과거)',
        character: 'librarian',
        sceneLocation: '도서관 앞 복도',
        characterSpeech:
          '어제 도서관을 정리하던 중 창밖 복도 쪽이 어수선했어요. 먼저 내게 확인해 보고 싶은 게 있나요?',
        koreanPrompt: '그 큰 가방이 복도에서 목격되었나요?',
        instruction:
          '올바른 동사 형태를 선택하고, be동사로 시작하는 수동태 Yes/No 의문문을 배열하세요.',
        wordTiles: ['in the hallway?', 'the big bag', 'Was'],
        verbChoices: {
          correctTense: 'pp',
          choices: [
            { id: 's2q1-pres', word: 'see', tense: 'present' },
            { id: 's2q1-pp', word: 'seen', tense: 'pp' },
            { id: 's2q1-past', word: 'saw', tense: 'past' },
          ],
        },
        canonicalAnswer: 'Was the big bag seen in the hallway?',
        acceptedAnswers: ['Was the big bag seen in the hallway?'],
        hints: [
          '수동태 의문문은 Did가 아니라 be동사(Was/Were)가 맨 앞에 나와요.',
          '[Was + 주어(the big bag) + p.p.(seen) + in the hallway?] 순서예요.',
        ],
        explanation:
          '과거 수동태 의문문은 [Was/Were + 주어 + 과거분사(p.p.) ~ ?] 어순으로 만듭니다.',
        clueTitle: '단서 #6 · 커다란 가방 목격',
        clueSummary: '사서 선생님이 도서관 앞 복도에서 큰 가방을 들고 가는 모습을 보셨다.',
        speakerResponse:
          '네, 맞아요. 트로피가 들어갈 만큼 꽤 묵직하고 큰 가방이 복도를 지나갔어요.',
      },
      {
        id: 's2-q2',
        stageId: 2,
        orderInStage: 2,
        format: 'word-order',
        grammarCategory: 'active-statement',
        grammarLabel: '능동태 평서문 (과거)',
        character: 'jihoon',
        sceneLocation: '2층 중앙 계단',
        characterSpeech:
          '선도부 순찰 일지를 확인해 보니, 사서 선생님이 시계를 보시던 시간과 딱 겹쳐요!',
        koreanPrompt: '사서 선생님이 5시에 한 학생을 보셨다.',
        instruction:
          '알맞은 동사 형태를 선택해 목격 사실을 전하는 능동태 문장을 완성하세요.',
        wordTiles: ['at five.', 'a student', 'The librarian'],
        verbChoices: {
          correctTense: 'past',
          choices: [
            { id: 's2q2-pp', word: 'seen', tense: 'pp' },
            { id: 's2q2-past', word: 'saw', tense: 'past' },
            { id: 's2q2-pres', word: 'see', tense: 'present' },
          ],
        },
        canonicalAnswer: 'The librarian saw a student at five.',
        acceptedAnswers: ['The librarian saw a student at five.'],
        hints: [
          '사서 선생님(The librarian)이 직접 본 것이므로 능동태 동사 saw를 씁니다.',
          '[The librarian + saw + a student + at five.] 순서로 배열하세요.',
        ],
        explanation:
          '주어(The librarian)가 직접 목적어(a student)를 보았으므로 능동태 과거형 saw를 씁니다.',
        clueTitle: '단서 #7 · 오후 5시 알리바이 기준점',
        clueSummary: '목격 시점은 정확히 오후 5시경이었다.',
        speakerResponse:
          '5시 정각이라… 그렇다면 그 시간대 복도 CCTV 화면도 꼭 확인해야겠어!',
      },
      {
        id: 's2-q3',
        stageId: 2,
        orderInStage: 3,
        format: 'word-order',
        grammarCategory: 'passive-statement',
        grammarLabel: '수동태 평서문 (과거 + by)',
        character: 'guard',
        sceneLocation: '학교 보안실',
        characterSpeech:
          '학생들, 큰일 났어요. 2층 복도 CCTV가 4시 55분부터 녹화가 끊겨 있네요!',
        koreanPrompt: '그 카메라는 누군가에 의해 꺼졌다.',
        instruction:
          '올바른 동사 형태를 고르고, by + 행위자 표현과 함께 수동태 문장을 완성하세요.',
        wordTiles: ['by someone.', 'was', 'The camera'],
        verbChoices: {
          correctTense: 'pp',
          choices: [
            { id: 's2q3-pres', word: 'turn off', tense: 'present', showTenseTag: true },
            { id: 's2q3-past', word: 'turned off', tense: 'past', showTenseTag: true },
            { id: 's2q3-pp', word: 'turned off', tense: 'pp', showTenseTag: true },
          ],
        },
        canonicalAnswer: 'The camera was turned off by someone.',
        acceptedAnswers: ['The camera was turned off by someone.'],
        hints: [
          '"꺼졌다"는 turn off의 수동태 [was turned off]로 씁니다.',
          '문장 마지막에 "누군가에 의해"라는 뜻의 [by someone.]을 붙이세요.',
        ],
        explanation:
          '구동사 turn off가 수동태가 될 때는 [was turned off]처럼 한 덩어리로 쓰고 뒤에 by someone을 연결합니다.',
        clueTitle: '단서 #8 · 차단된 CCTV',
        clueSummary: '복도 카메라는 범행 직전 누군가에 의해 의도적으로 꺼졌다.',
        speakerResponse:
          '카메라까지 꺼져 있었다니 계획적인 범행이야! 2층 창가 쪽 청소 당번에게도 물어보자.',
      },
      {
        id: 's2-q4',
        stageId: 2,
        orderInStage: 4,
        format: 'writing',
        grammarCategory: 'passive-question',
        grammarLabel: '수동태 Yes/No 의문문 직접 영작',
        character: 'yuna',
        sceneLocation: '2층 복도 창가',
        characterSpeech:
          '어제 청소할 때 복도 창문 근처에 흙 자국이 조금 묻어 있어서 자세히 살펴봤어요.',
        koreanPrompt: '그 창문이 깨졌나요?',
        instruction: '제시된 단어를 활용해 수동태 의문문을 직접 영작하세요.',
        writingGuides: ['the window', 'break → broken', 'Was ~ ?'],
        canonicalAnswer: 'Was the window broken?',
        acceptedAnswers: ['Was the window broken?'],
        hints: [
          '의문문이므로 Was를 맨 앞에 쓰고, break의 과거분사 broken을 사용하세요.',
          'Did로 시작하면 안 돼요! [Was + the window + broken?] 형태입니다.',
        ],
        explanation:
          'break의 과거분사는 broken입니다. 수동태 의문문은 [Was + 주어 + p.p.?]로 묻습니다.',
        clueTitle: '단서 #9 · 파손 없는 복도 창문',
        clueSummary: '외부 침입 흔적(깨진 창문)은 전혀 없었으므로 내부 학생의 소행이다.',
        speakerResponse:
          '아니요, 창문은 멀쩡했어요! 대신 매점 쪽 계단에서 바스락거리는 소리가 났어요.',
      },
      {
        id: 's2-q5',
        stageId: 2,
        orderInStage: 5,
        format: 'writing',
        grammarCategory: 'passive-statement',
        grammarLabel: '수동태 직접 영작 (과거 + by)',
        character: 'minho',
        sceneLocation: '학교 매점 앞 복도',
        characterSpeech:
          '5시쯤 급하게 뛰어가는 학생 뒷모습을 봤는데, 주머니에서 무언가 떨어졌어요!',
        koreanPrompt: '초콜릿 포장지가 한 학생에 의해 떨어뜨려졌다.',
        instruction: '과거 시제 수동태와 by + 행위자를 사용해 직접 영작하세요.',
        writingGuides: [
          'The chocolate wrapper',
          'drop → dropped',
          'by a student',
        ],
        canonicalAnswer: 'The chocolate wrapper was dropped by a student.',
        acceptedAnswers: [
          'The chocolate wrapper was dropped by a student.',
          'A chocolate wrapper was dropped by a student.',
        ],
        hints: [
          '단수 주어 The chocolate wrapper 뒤에 was dropped를 써 보세요.',
          'drop의 과거분사는 p를 하나 더 써서 dropped입니다. 뒤에 by a student를 붙이세요.',
        ],
        explanation:
          'drop의 과거분사 dropped(단모음+단자음 → pp)와 행위자 표현 by a student를 결합한 수동태입니다.',
        clueTitle: '단서 #10 · 매점 앞 초콜릿 포장지',
        clueSummary: '5시경 뛰어간 학생이 동아리방 방향 계단에 초콜릿 포장지를 떨어뜨렸다.',
        speakerResponse:
          '발자국과 포장지가 모두 동아리방 층으로 향하고 있어! 이제 용의자들을 직접 심문하자!',
      },
    ],
  },
  {
    id: 3,
    title: '스테이지 3 · 용의자 추리',
    subtitle: '수동태 Yes/No 의문문 심문',
    transitionDescription:
      '미술부 강태오, 댄스부 박수빈, 방송부 최준호 세 명의 알리바이를 수동태 의문문으로 낱낱이 검증해 진짜 범인을 좁혀 나갑니다.',
    location: '동아리방 · 미술실 · 방송실 · 사물함 앞',
    backgroundImage: stage3Img,
    introSpeaker: 'taeo',
    introMessage:
      '동아리방 층에 남아 있던 세 명의 부장이 용의선상에 올랐습니다. 수동태 의문문으로 사실 여부를 확인하세요!',
    miniQuiz: {
      id: 'mq-3',
      title: '스테이지 3 도입 · 수동태 Yes/No 의문문',
      prompt:
        '수동태 의문문은 일반동사 의문문처럼 Do/Did를 쓰지 않고, be동사(Was/Were/Is/Are)를 문장 맨 앞으로 보냅니다.',
      exampleCompare: {
        active: 'Did Junho open the door?',
        activeKorean: '준호가 그 문을 열었나요? (능동 의문문)',
        passive: 'Was the door opened by Junho?',
        passiveKorean: '그 문이 준호에 의해 열렸나요? (수동 의문문)',
      },
      question:
        '"그 방 열쇠는 수빈이에 의해 보관되었나요?"로 알맞은 수동태 의문문은?',
      options: [
        {
          id: 'opt-a',
          label: 'Did the room key kept by Subin?',
          isCorrect: false,
          feedback:
            '수동태 의문문에는 Did를 쓰지 않아요! be동사 Was가 맨 앞에 나와야 합니다.',
        },
        {
          id: 'opt-b',
          label: 'Was the room key kept by Subin?',
          isCorrect: true,
          feedback:
            '정확해요! [Was + 주어(the room key) + p.p.(kept) + by Subin?] 구조입니다.',
        },
        {
          id: 'opt-c',
          label: 'The room key was kept by Subin?',
          isCorrect: false,
          feedback:
            '의문문이 되려면 주어와 be동사의 자리를 바꿔 Was가 문장 맨 앞에 와야 해요!',
        },
      ],
      summaryTip:
        '수동태 의문문 공식: [Was / Were + 주어 + 과거분사(p.p.) (+ by 행위자)?]',
    },
    questions: [
      {
        id: 's3-q1',
        stageId: 3,
        orderInStage: 1,
        format: 'word-order',
        grammarCategory: 'passive-question',
        grammarLabel: '수동태 Yes/No 의문문 (과거 + by)',
        character: 'taeo',
        sceneLocation: '미술실 앞',
        characterSpeech:
          '잠깐, 학생회실 근처에 떨어진 파란 손수건이 내 거라고? 난 어제 쓰지도 않았는데!',
        koreanPrompt: '그 파란 손수건이 태오에 의해 사용되었나요?',
        instruction:
          '알맞은 동사 형태를 선택하고, 수동태 Yes/No 의문문 어순으로 배열하세요.',
        wordTiles: ['Was', 'by Taeo?', 'the blue handkerchief'],
        verbChoices: {
          correctTense: 'pp',
          choices: [
            { id: 's3q1-pp', word: 'used', tense: 'pp', showTenseTag: true },
            { id: 's3q1-past', word: 'used', tense: 'past', showTenseTag: true },
            { id: 's3q1-pres', word: 'use', tense: 'present', showTenseTag: true },
          ],
        },
        canonicalAnswer: 'Was the blue handkerchief used by Taeo?',
        acceptedAnswers: ['Was the blue handkerchief used by Taeo?'],
        hints: [
          'be동사 Was로 질문을 시작하고 주어(the blue handkerchief)를 바로 뒤에 놓으세요.',
          '[Was + the blue handkerchief + used + by Taeo?] 순서입니다.',
        ],
        explanation:
          '과거 수동태 의문문은 [Was + 주어 + 과거분사(used) + by 행위자?]로 씁니다.',
        clueTitle: '단서 #11 · 파란 손수건 확인',
        clueSummary: '태오는 자신의 파란 손수건을 어제 직접 사용하지 않았다고 증언했다.',
        speakerResponse:
          '아니요! 내 손수건은 맞지만 어제 낮에 다른 친구에게 잠깐 빌려줬어요.',
      },
      {
        id: 's3-q2',
        stageId: 3,
        orderInStage: 2,
        format: 'word-order',
        grammarCategory: 'active-statement',
        grammarLabel: '능동태 평서문 (과거)',
        character: 'siwoo',
        sceneLocation: '동아리방 복도',
        characterSpeech:
          '맞아요! 내가 점심시간 지나고 태오가 친구에게 손수건 건네주는 걸 봤어요.',
        koreanPrompt: '태오는 친구에게 그 손수건을 빌려주었다.',
        instruction:
          '올바른 동사 형태를 선택한 뒤, 증인의 말을 능동태 문장으로 배열하세요.',
        wordTiles: ['to a friend.', 'Taeo', 'the handkerchief'],
        verbChoices: {
          correctTense: 'past',
          choices: [
            { id: 's3q2-pres', word: 'lend', tense: 'present', showTenseTag: true },
            { id: 's3q2-past', word: 'lent', tense: 'past', showTenseTag: true },
            { id: 's3q2-pp', word: 'lent', tense: 'pp', showTenseTag: true },
          ],
        },
        canonicalAnswer: 'Taeo lent the handkerchief to a friend.',
        acceptedAnswers: ['Taeo lent the handkerchief to a friend.'],
        hints: [
          'lend(빌려주다)의 과거형은 lent입니다.',
          '[Taeo + lent + the handkerchief + to a friend.] 순서로 배열하세요.',
        ],
        explanation:
          '주어(Taeo)가 직접 친구에게 건네준 능동태 사건이므로 일반동사 과거형 lent를 씁니다.',
        clueTitle: '단서 #12 · 태오의 알리바이 입증',
        clueSummary: '태오는 손수건을 친구에게 빌려주었으며 미술실 알리바이가 사실로 확인되었다.',
        speakerResponse:
          '태오가 빌려준 손수건을 들고 갔던 그 친구가 진짜 범인일 가능성이 커졌네!',
      },
      {
        id: 's3-q3',
        stageId: 3,
        orderInStage: 3,
        format: 'writing',
        grammarCategory: 'passive-question',
        grammarLabel: '수동태 Yes/No 의문문 직접 영작',
        character: 'subin',
        sceneLocation: '댄스부 동아리방',
        characterSpeech:
          '어제 낮에 제가 학생회실 열쇠를 잠깐 빌린 건 맞지만, 바로 제자리에 돌려놓았어요!',
        koreanPrompt: '그 방 열쇠는 수빈이에 의해 보관되었나요?',
        instruction: '제시어를 참고해 수동태 Yes/No 의문문을 직접 영작하세요.',
        writingGuides: ['Was ~ ?', 'the room key', 'keep → kept', 'by Subin'],
        canonicalAnswer: 'Was the room key kept by Subin?',
        acceptedAnswers: ['Was the room key kept by Subin?'],
        hints: [
          'keep의 과거분사는 kept입니다. Was로 시작해 의문문을 만드세요.',
          '[Was + the room key + kept + by Subin?] 순서로 작성하세요.',
        ],
        explanation:
          'keep의 과거분사 kept를 써서 [Was + 주어 + kept + by Subin?]으로 질문합니다.',
        clueTitle: '단서 #13 · 수빈이의 열쇠 반납 확인',
        clueSummary: '수빈이는 열쇠를 계속 보관하지 않고 5시 전에 책상 위에 반납했다.',
        speakerResponse:
          '아니요, 4시 반에 책상에 반납했고, 그 뒤에 누군가가 방송실 쪽으로 급히 갔어요.',
      },
      {
        id: 's3-q4',
        stageId: 3,
        orderInStage: 4,
        format: 'word-order',
        grammarCategory: 'passive-question',
        grammarLabel: '수동태 Yes/No 의문문 (과거)',
        character: 'junho',
        sceneLocation: '방송실 문 앞',
        characterSpeech:
          '난 5시에 방송실에 들어간 적도 없고, 문도 내내 잠겨 있었을 걸?',
        koreanPrompt: '방송실 문이 5시에 열렸나요?',
        instruction:
          '알맞은 동사 형태를 고르고, 출입 기록을 묻는 수동태 의문문을 배열하세요.',
        wordTiles: ['at five?', 'Was', 'the broadcasting room door'],
        verbChoices: {
          correctTense: 'pp',
          choices: [
            { id: 's3q4-past', word: 'opened', tense: 'past', showTenseTag: true },
            { id: 's3q4-pp', word: 'opened', tense: 'pp', showTenseTag: true },
            { id: 's3q4-pres', word: 'open', tense: 'present', showTenseTag: true },
          ],
        },
        canonicalAnswer: 'Was the broadcasting room door opened at five?',
        acceptedAnswers: ['Was the broadcasting room door opened at five?'],
        hints: [
          '주어(the broadcasting room door)가 길지만 하나의 덩어리로 보세요.',
          '[Was + the broadcasting room door + opened + at five?] 순서입니다.',
        ],
        explanation:
          '문(the broadcasting room door)이 열렸는지 묻는 수동태 의문문으로 [Was + 주어 + opened ~ ?]를 씁니다.',
        clueTitle: '단서 #14 · 오후 5시 방송실 출입 로그',
        clueSummary: '전자 출입 기록 확인 결과, 방송실 문은 정확히 오후 5시 05분에 열렸다.',
        speakerResponse:
          '앗, 전자 출입 로그에 5시 05분 개방 기록이 남아 있잖아! 준호의 사물함도 확인해 보자!',
      },
      {
        id: 's3-q5',
        stageId: 3,
        orderInStage: 5,
        format: 'writing',
        grammarCategory: 'passive-statement',
        grammarLabel: '수동태 직접 영작 (과거)',
        character: 'minji',
        sceneLocation: '복도 사물함 구역',
        characterSpeech:
          '준호 사물함 문틈에 황금 트로피에 묶여 있던 바로 그 빨간 리본 조각이 끼어 있어!',
        koreanPrompt: '그 축제 리본은 준호의 사물함에서 발견되었다.',
        instruction: '마지막 결정적 단서를 수동태 문장으로 직접 영작하세요.',
        writingGuides: [
          'The festival ribbon',
          'find → found',
          "in Junho's locker",
        ],
        canonicalAnswer: "The festival ribbon was found in Junho's locker.",
        acceptedAnswers: ["The festival ribbon was found in Junho's locker."],
        hints: [
          '단수 주어 The festival ribbon 뒤에 was found를 써 보세요.',
          '장소 표현 in Junho\'s locker로 문장을 마무리하고 마침표를 찍으세요.',
        ],
        explanation:
          "find의 과거분사 found를 써서 [The festival ribbon was found in Junho's locker.]로 완성합니다.",
        clueTitle: '단서 #15 · 사물함 속 축제 리본',
        clueSummary: '트로피에 묶여 있던 축제 리본이 준호의 사물함 안에서 발견되었다.',
        speakerResponse:
          '모든 단서가 하나로 이어졌어! 이제 대강당 무대에서 진짜 범인을 지목하자!',
      },
    ],
  },
  {
    id: 4,
    title: '스테이지 4 · 범인 검거',
    subtitle: '단서 종합 & 최종 범인 지목',
    transitionDescription:
      '지금까지 모은 15개의 수동태·능동태 단서를 종합해 대강당 무대 위에서 진짜 범인을 밝혀낼 마지막 순간입니다.',
    location: '대강당 무대',
    backgroundImage: stage4Img,
    introSpeaker: 'minji',
    introMessage:
      '15개의 단서가 모두 모였어! 지금까지 모은 수동태 단서를 바탕으로 황금 트로피를 훔친 범인을 지목해 줘.',
    questions: [],
  },
];
