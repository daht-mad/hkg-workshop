import type { TerminalSlide } from "../types";
import { wrapHtml, applyHighlights, renderHeader, renderFooter, tokens } from "./base";

/** 트리 라인을 파싱하여 폴더/파일/어노테이션에 색상을 입힌다 */
function renderTreeLine(line: string): string {
  const arrowIdx = line.indexOf("←");
  const main = arrowIdx >= 0 ? line.substring(0, arrowIdx) : line;
  const annotation = arrowIdx >= 0 ? line.substring(arrowIdx) : "";

  const match = main.match(/^([\s│├└─]*)([\w\-\.\/]+)\s*$/);
  if (!match) return line;

  const [, treeChars, name] = match;

  let nameClass = "tree-file";
  if (name.endsWith("/")) nameClass = "tree-folder";
  if (name === "SKILL.md") nameClass = "tree-skill";

  let annotHtml = "";
  if (annotation) {
    const isEssential = annotation.includes("핵심");
    annotHtml = `<span class="tree-annotation${isEssential ? " tree-essential" : ""}">${annotation}</span>`;
  }

  return `<span class="tree-chars">${treeChars}</span><span class="${nameClass}">${name}</span>${annotHtml}`;
}

export function renderTerminal(slide: TerminalSlide): string {
  const isTreeBlock = slide.terminal.lines.some((l) => /[├└│─]/.test(l));

  const linesHtml = slide.terminal.lines
    .map((line) => {
      // $ 로 시작하는 줄은 명령어 스타일
      if (line.startsWith("$")) {
        return `<div class="term-line"><span class="term-prompt">$</span><span class="term-cmd">${line.slice(1).trim()}</span></div>`;
      }
      // 트리 블록이면 색상 구분 렌더링
      if (isTreeBlock) {
        return `<div class="term-line">${renderTreeLine(line)}</div>`;
      }
      return `<div class="term-line term-output">${line}</div>`;
    })
    .join("");

  let tipHtml = "";
  if (slide.tip) {
    tipHtml = `
      <div class="tip-card">
        <span class="tip-emoji">${slide.tip.emoji}</span>
        <span class="tip-text">${applyHighlights(slide.tip.text, slide.tip.highlight)}</span>
      </div>`;
  }

  let bulletsHtml = "";
  if (slide.bullets) {
    bulletsHtml = slide.bullets
      .map(
        (b) => `
      <div class="bullet-item">
        <span class="bullet-emoji">${b.emoji}</span>
        <span class="bullet-text">${applyHighlights(b.text, b.highlight)}</span>
      </div>`
      )
      .join("\n");
    bulletsHtml = `<div class="bullets-container">${bulletsHtml}</div>`;
  }

  let metaHtml = "";
  if (slide.meta) {
    metaHtml = `<div class="meta-text">${applyHighlights(slide.meta, slide.metaHighlight)}</div>`;
  }

  const body = `
    ${renderHeader(slide)}
    <div class="content">
      ${slide.description ? `<p class="term-description">${slide.description}</p>` : ""}
      <div class="terminal">
        <div class="terminal-header">
          <div class="terminal-dots">
            <span class="dot dot-red"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
          </div>
          ${slide.terminal.title ? `<span class="terminal-title">${slide.terminal.title}</span>` : ""}
        </div>
        <div class="terminal-body">
          ${linesHtml}
        </div>
      </div>
      ${tipHtml}
      ${bulletsHtml}
      ${metaHtml}
    </div>
    ${renderFooter(slide.footer)}
    <style>
      .term-description {
        font-size: 28px;
        color: ${tokens.text.secondary};
        margin-bottom: 24px;
      }
      .terminal {
        width: 100%;
        background: ${tokens.terminal.bg};
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      }
      .terminal-header {
        background: ${tokens.terminal.header};
        padding: 14px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .terminal-dots {
        display: flex;
        gap: 8px;
      }
      .dot {
        width: 14px;
        height: 14px;
        border-radius: 50%;
      }
      .dot-red { background: ${tokens.terminal.dots.red}; }
      .dot-yellow { background: ${tokens.terminal.dots.yellow}; }
      .dot-green { background: ${tokens.terminal.dots.green}; }
      .terminal-title {
        font-size: 15px;
        color: #999;
        margin-left: 8px;
      }
      .terminal-body {
        padding: 24px 36px;
        font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
        font-size: 24px;
        line-height: 1.8;
        white-space: pre;
      }
      .term-line {
        color: ${tokens.terminal.text};
      }
      .term-prompt {
        color: #28c840;
        margin-right: 12px;
        font-weight: 700;
      }
      .term-cmd {
        color: #fff;
        font-weight: 600;
      }
      .term-output {
        color: #aaa;
      }
      /* 트리 구조 색상 */
      .tree-chars { color: #888; }
      .tree-folder { color: #6ec6ff; font-weight: 600; }
      .tree-file { color: #ccc; }
      .tree-skill {
        color: ${tokens.text.highlight};
        font-weight: 700;
        background: rgba(139, 92, 246, 0.15);
        padding: 2px 8px;
        border-radius: 4px;
      }
      .tree-annotation { color: #777; font-style: italic; }
      .tree-essential { color: #fbbf24; font-weight: 600; }
      .tip-card {
        margin-top: 24px;
        width: 100%;
        max-width: 1000px;
        background: ${tokens.card.bg};
        border: 1px solid ${tokens.card.border};
        border-radius: 14px;
        padding: 20px 28px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 22px;
        backdrop-filter: blur(8px);
      }
      .tip-emoji {
        font-size: 26px;
        flex-shrink: 0;
      }
      .bullets-container {
        margin-top: 32px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 100%;
        max-width: 1000px;
      }
      .bullet-item {
        display: flex;
        align-items: center;
        gap: 16px;
        font-size: 26px;
        line-height: 1.5;
      }
      .bullet-emoji {
        font-size: 30px;
        flex-shrink: 0;
      }
      .meta-text {
        margin-top: 32px;
        font-size: 24px;
        color: ${tokens.text.secondary};
      }
      /* 터미널 콘텐츠 수직 가운데 정렬 */
      .content {
        align-items: center;
        justify-content: center;
      }
    </style>`;

  return wrapHtml(body, slide.size);
}
