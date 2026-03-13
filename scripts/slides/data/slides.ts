import type { Slide } from "../types";

export const slides: Slide[] = [
  // 1) 채팅형 - AI x MISSION
  {
    id: "ai-mission",
    type: "chat",
    badge: "AI x MISSION",
    messages: [
      {
        emoji: "👩",
        text: '"뽀야, 우리 미션이 뭐야?"',
        align: "left",
      },
      {
        emoji: "🐱",
        text: '"반복을 도구로 바꿔서,\n미션이 있는 사람들이 미션에만 집중하게 하는 거!"',
        highlight: ["미션에만 집중"],
        align: "right",
      },
      {
        emoji: "👩",
        text: '"좋아. 그거에 맞는 일을 알아서 찾아서 해."',
        align: "left",
      },
    ],
    divider: "— 다음 날 아침 —",
    afterMessages: [
      {
        emoji: "🐱",
        text: '"같은 데이터 조회 3번 반복하길래 스킬로 만들어뒀어"',
        highlight: ["스킬로 만들어뒀어"],
      },
      {
        emoji: "🐱",
        text: '"매주 보내는 문자, 템플릿으로 만들까?"',
        highlight: ["템플릿"],
      },
    ],
    footer: {
      text: "할 일을 주면 매니저\n미션을 주면 파트너",
      highlight: ["매니저", "파트너"],
    },
  },

  // 2) 비교형 - AI의 데이터 범위
  {
    id: "data-scope",
    type: "comparison",
    title: "AI의 똑똑함이 아니라\nAI가 읽을 수 있는 데이터의 범위가 비서의 품질을 결정한다.",
    subtitle: "",
    left: {
      icon: "❌",
      title: "데이터 없는 AI",
      items: [
        { icon: "📅", text: '"오늘 일정?" → 모름' },
        { icon: "📧", text: '"급한 메일?" → 모름' },
        { icon: "📁", text: '"파일 찾아줘" → 모름' },
      ],
      variant: "negative",
    },
    right: {
      icon: "✅",
      title: "GOG 연결한 AI",
      items: [
        { icon: "📅", text: "캘린더 → 일정 브리핑" },
        { icon: "📧", text: "Gmail → 메일 확인" },
        { icon: "📁", text: "드라이브 → 파일 검색" },
      ],
      variant: "positive",
    },
    bottomBadge: {
      label: "gog CLI",
      description: "구글 워크스페이스 전체를 터미널 한 줄로 여는 열쇠 🔑",
    },
  },

  // 3) 터미널형 - 설치 가이드
  {
    id: "install-step",
    type: "terminal",
    badge: "STEP 1",
    title: "설치",
    description: "터미널 열고 딱 한 줄:",
    pageNumber: "04 / 07",
    terminal: {
      title: "터미널",
      lines: ["$ npx create-video@latest"],
    },
    tip: {
      emoji: "💡",
      text: "Node.js 없으면 Claude 에게 물어보세요",
      highlight: ["Claude"],
    },
    meta: "소요 시간: 3분",
    metaHighlight: ["3분"],
  },

  // 4) 터미널형 - 스킬의 정체
  {
    id: "skill-folder",
    type: "terminal",
    terminal: {
      lines: [
        "meeting-summary/",
        "├── SKILL.md              ← 핵심! 업무 지침서",
        "├── scripts/              ← (선택) 실행할 코드",
        "│   └── extract-actions.ts",
        "└── references/           ← (선택) 참고 문서",
        "    └── template.md",
      ],
    },
  },

  // 5) 2열 터미널 - 스킬 폴더 위치 (전역 vs 프로젝트)
  {
    id: "skill-location",
    type: "dualTerminal",
    size: { width: 1920, height: 820 },
    left: {
      badge: "PERSONAL (전역)",
      terminal: {
        title: "~/.claude/skills/",
        lines: [
          "/Users/나의이름/",
          "└── .claude/",
          "    └── skills/",
          "        ├── skill-creator/",
          "        │   └── SKILL.md",
          "        ├── frontend-design/",
          "        │   └── SKILL.md",
          "        └── .../",
        ],
      },
    },
    right: {
      badge: "PROJECT (프로젝트)",
      terminal: {
        title: "my-project/.claude/skills/",
        lines: [
          "my-project/",
          "├── .claude/",
          "│   └── skills/",
          "│       └── deploy/",
          "│           └── SKILL.md",
          "├── src/",
          "├── package.json",
          "└── README.md",
        ],
      },
    },
  },

  // 7) 번들링형 - 참고 파일 포함하기
  {
    id: "skill-bundling",
    type: "bundling",
    mainFile: {
      path: "SKILL.md",
      sections: [
        {
          label: "YAML Frontmatter",
          lines: [
            "---",
            "name: meeting-summary",
            "description: 회의록을 구조화된 요약으로 변환",
            "---",
          ],
        },
        {
          label: "Markdown",
          lines: [
            "## 개요",
            "",
            "회의 녹취록이나 메모를 받아 핵심 내용을",
            "구조화된 요약으로 변환합니다.",
            "출력은 ./references/template.md 형식을 따르세요.",
            "",
            "액션아이템 추출 시",
            "./scripts/extract-actions.ts 를 실행합니다.",
          ],
          highlights: [
            "./references/template.md",
            "./scripts/extract-actions.ts",
          ],
        },
      ],
    },
    referencedFiles: [
      {
        path: "references/template.md",
        lines: [
          "# {날짜} {회의 제목}",
          "",
          "## 핵심 논의사항",
          "- 주요 안건 1",
          "",
          "## 결정사항",
          "- 결정 1: ...",
          "",
          "## 액션아이템",
          "| 담당자 | 할 일 | 기한 |",
          "...",
        ],
      },
      {
        path: "scripts/extract-actions.ts",
        lines: [
          'import { readFileSync } from "fs";',
          "",
          "interface ActionItem {",
          "  assignee: string;",
          "  task: string;",
          "  deadline?: string;",
          "}",
          "",
          "export function extractActions(",
          "  text: string",
          "): ActionItem[] {",
          "  // 액션아이템 패턴 매칭",
          "  ...",
          "}",
        ],
      },
    ],
  },
  // 8) 허브형 - MCP 개념도
  {
    id: "mcp-concept",
    type: "hub",
    center: {
      icon: "🤖",
      label: "Claude",
    },
    connectorLabel: "MCP",
    nodes: [
      {
        icon: "📅",
        label: "Google",
        tools: ["캘린더", "드라이브", "시트", "Gmail"],
      },
      {
        icon: "🌐",
        label: "Chrome DevTools",
        tools: ["웹 열기", "클릭", "스크린샷"],
      },
      {
        icon: "📊",
        label: "Airtable",
        tools: ["레코드 조회", "생성", "수정"],
      },
      {
        icon: "📚",
        label: "Context7",
        tools: ["문서 검색", "코드 예시"],
      },
    ],
  },

  // 9) 비교형 - 예전 방식 vs 지금 방식
  {
    id: "before-after",
    type: "comparison",
    title: "",
    left: {
      icon: "😵",
      title: "예전: 웹 AI 투어",
      items: [
        { icon: "🔄", text: "ChatGPT → Gemini → Claude 왔다갔다" },
        { icon: "📋", text: "코드 복붙, 매번 상황 설명" },
        { icon: "🖼️", text: "파일 못 봄 → 스크린샷 첨부" },
      ],
      variant: "negative",
    },
    right: {
      icon: "🚀",
      title: "지금: CLI 에이전트",
      items: [
        { icon: "📂", text: "내 파일을 직접 읽고 수정" },
        { icon: "🧠", text: "CLAUDE.md로 맥락 자동 기억" },
        { icon: "💻", text: "한 화면에서 완결" },
      ],
      variant: "positive",
    },
    bottomBadge: {
      label: "바이브코딩",
      description: "\"이런 느낌으로 해줘\" → AI가 구현",
    },
  },

  // 10) 플로우형 - /init 실행 흐름
  {
    id: "init-flow",
    type: "flow",
    steps: [
      {
        icon: "🔍",
        label: "폴더 스캔",
        description: "프로젝트 구조 파악",
      },
      {
        icon: "📝",
        label: "요약 생성",
        description: "기술 스택·규칙 분석",
      },
      {
        icon: "📄",
        label: "CLAUDE.md 작성",
        description: "프로젝트 맥락 문서화",
      },
      {
        icon: "🔁",
        label: "매 대화에 포함",
        description: "자동으로 읽혀서 기억",
      },
    ],
  },

  // 11) 그리드형 - 필수 기능 4가지
  {
    id: "essential-features",
    type: "grid",
    cards: [
      {
        icon: "⏪",
        title: "되돌리기",
        subtitle: "Esc  Esc",
        description: "실수해도 괜찮아요.\n언제든 이전 상태로 복구",
      },
      {
        icon: "🔀",
        title: "모드 전환",
        subtitle: "Shift + Tab",
        description: "자동수정 / 허락받기 /\n계획만 세우기",
      },
      {
        icon: "📎",
        title: "파일 참조",
        subtitle: "@ 파일명",
        description: "이 파일 봐줘!\n정확한 맥락 전달",
      },
      {
        icon: "⚡",
        title: "슬래시 명령",
        subtitle: "/ 명령어",
        description: "/init  /clear  /compact\n빠른 실행",
      },
    ],
  },

  // 12) 터미널형 - CLAUDE.md 예시
  {
    id: "claudemd-example",
    type: "terminal",
    terminal: {
      title: "CLAUDE.md",
      lines: [
        "# 프로젝트 설명",
        "이 프로젝트는 워크샵 교육자료 웹사이트입니다.",
        "",
        "# 작업 스타일",
        "- 모든 응답은 한국어로",
        "- 커밋 메시지는 영어 conventional commits",
        "- 이모지 사용하지 않기",
        "",
        "# 주의사항",
        "- .env 파일 절대 커밋 금지",
        "- 테스트 통과 확인 후 PR 생성",
        "",
        "# 자주 쓰는 명령어",
        "- npm run dev  → 개발 서버",
        "- npm run build → 빌드",
      ],
    },
  },
];
