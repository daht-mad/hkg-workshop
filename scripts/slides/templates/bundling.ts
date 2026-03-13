import type { BundlingSlide } from "../types";
import { wrapHtml, tokens } from "./base";

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderTreeLine(line: string): string {
  const match = line.match(/^([\s│├└─]*)(.+)$/);
  if (!match) return esc(line);
  const [, prefix, name] = match;
  const isFolder = name.endsWith("/");
  const cls = isFolder ? "tree-folder" : "tree-file";
  return `<span class="tree-chars">${esc(prefix)}</span><span class="${cls}">${esc(name)}</span>`;
}

/** 파일 확장자로 색상 variant 결정 */
function getVariant(path: string): "ref" | "script" {
  return /\.(ts|js|py|sh)$/.test(path) ? "script" : "ref";
}

export function renderBundling(slide: BundlingSlide): string {
  // 폴더 트리 (상단)
  let treeHtml = "";
  if (slide.folderTree) {
    const lines = slide.folderTree.lines
      .map((l) => `<div class="tl">${renderTreeLine(l)}</div>`)
      .join("\n");
    treeHtml = `
      <div class="tree-strip">
        <div class="tree-box">
          <div class="tree-hd">
            <span class="d d-r"></span><span class="d d-y"></span><span class="d d-g"></span>
          </div>
          <div class="tree-bd">${lines}</div>
        </div>
      </div>`;
  }

  // 메인 파일 섹션
  const sectionsHtml = slide.mainFile.sections
    .map((section) => {
      const linesHtml = section.lines
        .map((line) => {
          let p = esc(line);
          if (section.highlights) {
            for (const hl of section.highlights) {
              p = p.replace(esc(hl), `<span class="hl-${getVariant(hl)}">${esc(hl)}</span>`);
            }
          }
          return `<div class="cl">${p || "&nbsp;"}</div>`;
        })
        .join("\n");
      const isYaml = section.label.toLowerCase().includes("yaml");
      return `
        <div class="fs ${isYaml ? "fs-yaml" : "fs-md"}">
          <div class="sl">${section.label}</div>
          ${linesHtml}
        </div>`;
    })
    .join("\n");

  // 참조 파일들 (오른쪽 스택)
  const refsHtml = slide.referencedFiles
    .map((file) => {
      const v = getVariant(file.path);
      const linesHtml = file.lines
        .map((l) => `<div class="cl">${esc(l) || "&nbsp;"}</div>`)
        .join("\n");
      return `
        <div class="ref-block">
          <div class="fp fp-${v}">${file.path}</div>
          <div class="bx bx-${v}">${linesHtml}</div>
        </div>`;
    })
    .join("\n");

  const body = `
    <div class="wrap">
      ${treeHtml}

      <div class="files-row">
        <div class="col-main">
          <div class="fp fp-main">${slide.mainFile.path}</div>
          <div class="bx bx-main">${sectionsHtml}</div>
        </div>

        <div class="col-refs">${refsHtml}</div>
      </div>
    </div>

    <style>
      body { padding: 40px 36px; }

      .wrap {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      /* ====== 상단 트리 (풀와이드) ====== */
      .tree-strip { width: 100%; }
      .tree-box {
        display: inline-block;
        background: ${tokens.terminal.bg};
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 3px 16px rgba(0,0,0,0.08);
      }
      .tree-hd {
        background: ${tokens.terminal.header};
        padding: 9px 14px;
        display: flex; gap: 6px;
      }
      .d { width: 11px; height: 11px; border-radius: 50%; }
      .d-r { background: ${tokens.terminal.dots.red}; }
      .d-y { background: ${tokens.terminal.dots.yellow}; }
      .d-g { background: ${tokens.terminal.dots.green}; }
      .tree-bd {
        padding: 10px 18px;
        font-family: 'SF Mono', 'Fira Code', monospace;
        font-size: 21px;
        line-height: 1.6;
      }
      .tl { white-space: pre; }
      .tree-chars { color: #888; }
      .tree-folder { color: #6ec6ff; font-weight: 600; }
      .tree-file { color: #ddd; }

      /* ====== 하단 파일 영역 ====== */
      .files-row {
        flex: 1;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        gap: 40px;
      }
      .col-main { flex: 1; }
      .col-refs {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 28px;
      }

      /* ====== 파일 경로 ====== */
      .fp {
        font-size: 32px;
        font-weight: 800;
        margin-bottom: 5px;
        font-family: 'SF Mono', 'Fira Code', monospace;
      }
      .fp-main   { color: #1565c0; }
      .fp-ref    { color: #e65100; }
      .fp-script { color: #6a1b9a; }

      /* ====== 박스 공통 ====== */
      .bx {
        border-radius: 10px;
        font-family: 'SF Mono', 'Fira Code', monospace;
        font-size: 22px;
        line-height: 1.5;
      }

      /* 메인 (파란색) */
      .bx-main {
        background: rgba(227, 242, 253, 0.8);
        border: 2px solid #90caf9;
      }
      .fs-yaml {
        background: rgba(187, 222, 251, 0.45);
        border-bottom: 2px solid #90caf9;
        padding: 8px 14px;
      }
      .fs-md { padding: 8px 14px; }
      .sl {
        color: #1565c0;
        font-size: 19px;
        font-weight: 800;
        margin-bottom: 2px;
        font-family: ${tokens.font.family};
      }
      .cl { color: #333; white-space: pre; }

      /* 참조 (노란색) */
      .bx-ref {
        background: rgba(255, 248, 225, 0.9);
        border: 2px solid #ffe082;
        padding: 8px 14px 8px 14px;
      }

      /* 스크립트 (보라색) */
      .bx-script {
        background: rgba(237, 231, 246, 0.8);
        border: 2px solid #b39ddb;
        padding: 8px 14px 8px 14px;
      }

      /* 하이라이트 */
      .hl-ref {
        background: #ffcc80;
        padding: 1px 5px;
        border-radius: 4px;
        font-weight: 700;
        color: #333;
      }
      .hl-script {
        background: #ce93d8;
        padding: 1px 5px;
        border-radius: 4px;
        font-weight: 700;
        color: #fff;
      }
    </style>`;

  return wrapHtml(body, slide.size);
}
