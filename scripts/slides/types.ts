// 공통 기본 타입
interface SlideBase {
  id: string;
  title?: string;
  subtitle?: string;
  // 슬라이드별 사이즈 (미지정 시 기본 1920x1080)
  size?: { width: number; height: number };
  // 상단 뱃지 (예: "STEP 1", "AI x MISSION")
  badge?: string;
  // 페이지 번호 (예: "04 / 07")
  pageNumber?: string;
  // 하단 워터마크
  watermark?: string;
  // 하단 굵은 문구
  footer?: {
    text: string;
    highlight?: string[];
  };
}

// 텍스트에서 하이라이트할 부분 표시
// 일반 텍스트에 **키워드** 형태로 작성하면 보라색 강조 적용
export interface TextWithHighlight {
  text: string;
  highlight?: string[];
}

// 1) 채팅 스타일 슬라이드
export interface ChatSlide extends SlideBase {
  type: "chat";
  messages: {
    emoji: string;
    text: string;
    highlight?: string[];
    align: "left" | "right";
  }[];
  // 구분선 + 텍스트 (예: "— 다음 날 아침 🌅 —")
  divider?: string;
  // 구분선 아래 추가 메시지
  afterMessages?: {
    emoji: string;
    text: string;
    highlight?: string[];
  }[];
}

// 2) 비교 카드 슬라이드
export interface ComparisonSlide extends SlideBase {
  type: "comparison";
  left: {
    icon: string;
    title: string;
    items: {
      icon?: string;
      text: string;
    }[];
    variant: "negative" | "neutral";
  };
  right: {
    icon: string;
    title: string;
    items: {
      icon?: string;
      text: string;
    }[];
    variant: "positive" | "neutral";
  };
  // 하단 뱃지 (예: "gog CLI" + 설명)
  bottomBadge?: {
    label: string;
    description: string;
  };
}

// 3) 터미널 + 불릿 리스트 슬라이드
export interface TerminalSlide extends SlideBase {
  type: "terminal";
  description?: string;
  terminal: {
    title?: string;
    lines: string[];
  };
  // 팁/힌트 카드
  tip?: {
    emoji: string;
    text: string;
    highlight?: string[];
  };
  bullets?: {
    emoji: string;
    text: string;
    highlight?: string[];
  }[];
  // 소요 시간 등 부가 정보
  meta?: string;
  metaHighlight?: string[];
}

// 4) 파일 번들링 다이어그램 슬라이드
export interface BundlingSlide extends SlideBase {
  type: "bundling";
  folderTree?: {
    lines: string[];
  };
  mainFile: {
    path: string;
    sections: {
      label: string;
      lines: string[];
      highlights?: string[];
    }[];
  };
  referencedFiles: {
    path: string;
    lines: string[];
  }[];
}

// 5) 2열 터미널 슬라이드 (좌우 비교)
export interface DualTerminalSlide extends SlideBase {
  type: "dualTerminal";
  left: {
    badge: string;
    terminal: {
      title?: string;
      lines: string[];
    };
  };
  right: {
    badge: string;
    terminal: {
      title?: string;
      lines: string[];
    };
  };
}

// 6) 허브형 다이어그램 (중앙 노드 + 주변 서비스 연결)
export interface HubSlide extends SlideBase {
  type: "hub";
  center: {
    icon?: string;
    label: string;
    sublabel?: string;
  };
  connectorLabel?: string;
  nodes: {
    icon?: string;
    label: string;
    tools?: string[];
  }[];
}

// 7) 그리드 카드 슬라이드 (2x2 등 카드 배열)
export interface GridSlide extends SlideBase {
  type: "grid";
  cards: {
    icon?: string;
    title: string;
    subtitle?: string;
    description?: string;
    badge?: string;
  }[];
}

// 8) 플로우 다이어그램 (수평 단계별 흐름)
export interface FlowSlide extends SlideBase {
  type: "flow";
  steps: {
    icon?: string;
    label: string;
    description?: string;
  }[];
}

export type Slide = ChatSlide | ComparisonSlide | TerminalSlide | BundlingSlide | DualTerminalSlide | HubSlide | GridSlide | FlowSlide;
