// 보라색 테마 디자인 토큰
export const tokens = {
  bg: {
    base: "#faf8f6",
    gradientFrom: "#e9d5ff",
    gradientTo: "#c4b5fd",
  },
  text: {
    primary: "#1e1b2e",
    secondary: "#6b6580",
    highlight: "#8b5cf6",
  },
  card: {
    bg: "rgba(255, 255, 255, 0.8)",
    border: "rgba(196, 181, 253, 0.3)",
    radius: "16px",
  },
  terminal: {
    bg: "#2d2d2d",
    header: "#3d3d3d",
    text: "#e4e4e4",
    dots: {
      red: "#ff5f57",
      yellow: "#febc2e",
      green: "#28c840",
    },
  },
  badge: {
    bg: "#ede9fe",
    text: "#7c3aed",
  },
  size: {
    width: 1920,
    height: 1080,
  },
  font: {
    family:
      "'Pretendard Variable', 'Pretendard', 'Apple SD Gothic Neo', system-ui, sans-serif",
  },
};

// 텍스트 내 키워드를 보라색 하이라이트 span으로 치환
export function applyHighlights(
  text: string,
  keywords?: string[]
): string {
  if (!keywords || keywords.length === 0) return escapeHtml(text);
  let result = escapeHtml(text);
  for (const kw of keywords) {
    result = result.replaceAll(
      escapeHtml(kw),
      `<span class="hl">${escapeHtml(kw)}</span>`
    );
  }
  return result;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 줄바꿈을 <br>로 변환
export function nl2br(text: string): string {
  return text.replace(/\n/g, "<br>");
}

// 공통 HTML 래퍼 (슬라이드별 사이즈 오버라이드 가능)
export function wrapHtml(bodyContent: string, sizeOverride?: { width: number; height: number }): string {
  const w = sizeOverride?.width ?? tokens.size.width;
  const h = sizeOverride?.height ?? tokens.size.height;
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: ${w}px;
    height: ${h}px;
    background: ${tokens.bg.base};
    font-family: ${tokens.font.family};
    color: ${tokens.text.primary};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 100px;
    position: relative;
    overflow: hidden;
  }

  /* 우상단 보라색 그라데이션 블롭 */
  body::before {
    content: '';
    position: absolute;
    top: -200px;
    right: -200px;
    width: 700px;
    height: 700px;
    background: radial-gradient(circle, ${tokens.bg.gradientFrom} 0%, transparent 70%);
    opacity: 0.6;
    pointer-events: none;
  }

  /* 좌하단 연한 블롭 */
  body::after {
    content: '';
    position: absolute;
    bottom: -300px;
    left: -200px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, ${tokens.bg.gradientTo} 0%, transparent 70%);
    opacity: 0.3;
    pointer-events: none;
  }

  .hl {
    color: ${tokens.text.highlight};
    font-weight: 700;
  }

  .slide-badge {
    display: inline-block;
    background: ${tokens.badge.bg};
    color: ${tokens.badge.text};
    font-size: 18px;
    font-weight: 700;
    padding: 8px 24px;
    border-radius: 999px;
    margin-bottom: 20px;
    letter-spacing: 1px;
  }

  .slide-title {
    font-size: 52px;
    font-weight: 800;
    line-height: 1.3;
    margin-bottom: 16px;
    text-align: left;
    width: 100%;
    position: relative;
    z-index: 1;
  }

  .slide-subtitle {
    font-size: 28px;
    color: ${tokens.text.secondary};
    margin-bottom: 48px;
    text-align: left;
    width: 100%;
    position: relative;
    z-index: 1;
  }

  .page-number {
    position: absolute;
    top: 60px;
    right: 80px;
    font-size: 20px;
    color: ${tokens.text.secondary};
    font-weight: 500;
    z-index: 1;
  }

  .watermark {
    position: absolute;
    bottom: 40px;
    right: 60px;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.2);
    z-index: 1;
  }

  .footer-text {
    margin-top: auto;
    padding-top: 48px;
    font-size: 40px;
    font-weight: 800;
    text-align: center;
    line-height: 1.5;
    position: relative;
    z-index: 1;
  }

  .content {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
  }
</style>
</head>
<body>
  ${bodyContent}
</body>
</html>`;
}

// 공통 헤더 (뱃지 + 타이틀 + 서브타이틀 + 페이지번호 + 워터마크) 렌더링
export function renderHeader(slide: {
  badge?: string;
  title?: string;
  subtitle?: string;
  pageNumber?: string;
  watermark?: string;
}): string {
  let html = "";
  if (slide.pageNumber) {
    html += `<div class="page-number">${slide.pageNumber}</div>`;
  }
  if (slide.watermark) {
    html += `<div class="watermark">${slide.watermark}</div>`;
  }
  if (slide.badge) {
    html += `<div class="slide-badge">${slide.badge}</div>`;
  }
  if (slide.title) {
    html += `<h1 class="slide-title">${slide.title}</h1>`;
  }
  if (slide.subtitle) {
    html += `<p class="slide-subtitle">${slide.subtitle}</p>`;
  }
  return html;
}

// 공통 푸터 렌더링
export function renderFooter(footer?: {
  text: string;
  highlight?: string[];
}): string {
  if (!footer) return "";
  return `<div class="footer-text">${applyHighlights(footer.text, footer.highlight)}</div>`;
}
