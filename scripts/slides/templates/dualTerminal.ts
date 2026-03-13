import type { DualTerminalSlide } from "../types";
import { wrapHtml, tokens } from "./base";

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
    annotHtml = `<span class="tree-annotation">${annotation}</span>`;
  }

  return `<span class="tree-chars">${treeChars}</span><span class="${nameClass}">${name}</span>${annotHtml}`;
}

function renderColumn(col: DualTerminalSlide["left"]): string {
  const linesHtml = col.terminal.lines
    .map((line) => `<div class="term-line">${renderTreeLine(line)}</div>`)
    .join("");

  return `
    <div class="dual-col">
      <div class="dual-badge">${col.badge}</div>
      <div class="terminal">
        <div class="terminal-header">
          <div class="terminal-dots">
            <span class="dot dot-red"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
          </div>
          ${col.terminal.title ? `<span class="terminal-title">${col.terminal.title}</span>` : ""}
        </div>
        <div class="terminal-body">${linesHtml}</div>
      </div>
    </div>`;
}

export function renderDualTerminal(slide: DualTerminalSlide): string {
  const body = `
    <div class="dual-wrap">
      ${renderColumn(slide.left)}
      ${renderColumn(slide.right)}
    </div>

    <style>
      body { padding: 28px 80px; }
      .dual-wrap {
        width: 100%;
        height: 100%;
        display: flex;
        gap: 48px;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 1;
      }
      .dual-col {
        flex: none;
        width: 42%;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .dual-badge {
        display: inline-block;
        align-self: flex-start;
        background: ${tokens.badge.bg};
        color: ${tokens.badge.text};
        font-size: 20px;
        font-weight: 700;
        padding: 10px 28px;
        border-radius: 999px;
        letter-spacing: 1px;
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
        padding: 12px 18px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .terminal-dots { display: flex; gap: 7px; }
      .dot { width: 12px; height: 12px; border-radius: 50%; }
      .dot-red { background: ${tokens.terminal.dots.red}; }
      .dot-yellow { background: ${tokens.terminal.dots.yellow}; }
      .dot-green { background: ${tokens.terminal.dots.green}; }
      .terminal-title {
        font-size: 14px;
        color: #999;
        margin-left: 6px;
      }
      .terminal-body {
        padding: 28px 32px;
        font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
        font-size: 24px;
        line-height: 1.7;
        white-space: pre;
      }
      .term-line { color: ${tokens.terminal.text}; }
      .tree-chars { color: #888; }
      .tree-folder { color: #6ec6ff; font-weight: 600; }
      .tree-file { color: #ccc; }
      .tree-skill {
        color: ${tokens.text.highlight};
        font-weight: 700;
        background: rgba(139, 92, 246, 0.15);
        padding: 2px 6px;
        border-radius: 4px;
      }
      .tree-annotation { color: #777; font-style: italic; }
    </style>`;

  return wrapHtml(body, slide.size);
}
