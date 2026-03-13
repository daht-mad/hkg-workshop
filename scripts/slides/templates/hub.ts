import type { HubSlide } from "../types";
import { wrapHtml, tokens } from "./base";

export function renderHub(slide: HubSlide): string {
  const n = slide.nodes.length;
  const radius = 37;

  // 원형 배치 (12시 방향부터 시계방향)
  const positions = slide.nodes.map((_, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return {
      x: Math.round(50 + radius * Math.cos(angle)),
      y: Math.round(50 + radius * Math.sin(angle)),
    };
  });

  // 서비스 노드 카드
  const nodesHtml = slide.nodes
    .map((node, i) => {
      const pos = positions[i];
      const toolsHtml = node.tools
        ? `<div class="node-tools">${node.tools.map((t) => `<span class="nt">${t}</span>`).join("")}</div>`
        : "";
      return `<div class="hub-node" style="left:${pos.x}%;top:${pos.y}%">
        ${node.icon ? `<div class="ni">${node.icon}</div>` : ""}
        <div class="nl">${node.label}</div>
        ${toolsHtml}
      </div>`;
    })
    .join("\n");

  // MCP 뱃지 (중앙↔노드 중간점)
  const badgesHtml = positions
    .map((pos) => {
      const mx = (50 + pos.x) / 2;
      const my = (50 + pos.y) / 2;
      return `<div class="mcp-tag" style="left:${mx}%;top:${my}%">${slide.connectorLabel || "MCP"}</div>`;
    })
    .join("\n");

  // 연결선 (4노드: 십자, 그 외: 개별 수평/수직)
  let linesHtml = "";
  if (n === 4) {
    linesHtml = `
      <div class="line-h" style="left:${positions[3].x}%;right:${100 - positions[1].x}%;top:50%"></div>
      <div class="line-v" style="top:${positions[0].y}%;bottom:${100 - positions[2].y}%;left:50%"></div>`;
  } else {
    linesHtml = positions
      .map((pos) => {
        if (pos.x === 50) {
          const top = Math.min(50, pos.y);
          const bottom = 100 - Math.max(50, pos.y);
          return `<div class="line-v" style="top:${top}%;bottom:${bottom}%;left:50%"></div>`;
        } else if (pos.y === 50) {
          const left = Math.min(50, pos.x);
          const right = 100 - Math.max(50, pos.x);
          return `<div class="line-h" style="left:${left}%;right:${right}%;top:50%"></div>`;
        }
        return "";
      })
      .join("\n");
  }

  const body = `
    <div class="hub-wrap">
      ${linesHtml}

      <div class="hub-center">
        ${slide.center.icon ? `<div class="ci">${slide.center.icon}</div>` : ""}
        <div class="cl">${slide.center.label}</div>
        ${slide.center.sublabel ? `<div class="cs">${slide.center.sublabel}</div>` : ""}
      </div>

      ${nodesHtml}
      ${badgesHtml}
    </div>

    <style>
      body { padding: 48px 60px; }

      .hub-wrap {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 1;
      }

      /* 연결선 */
      .line-h {
        position: absolute;
        height: 3px;
        background: linear-gradient(90deg,
          rgba(139,92,246,0.06),
          rgba(139,92,246,0.22) 30%,
          rgba(139,92,246,0.22) 70%,
          rgba(139,92,246,0.06));
        transform: translateY(-50%);
      }
      .line-v {
        position: absolute;
        width: 3px;
        background: linear-gradient(180deg,
          rgba(139,92,246,0.06),
          rgba(139,92,246,0.22) 30%,
          rgba(139,92,246,0.22) 70%,
          rgba(139,92,246,0.06));
        transform: translateX(-50%);
      }

      /* 중앙 원 */
      .hub-center {
        position: absolute;
        left: 50%; top: 50%;
        transform: translate(-50%, -50%);
        width: 190px; height: 190px;
        border-radius: 50%;
        background: linear-gradient(135deg, #8b5cf6, #7c3aed, #6d28d9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 40px rgba(124,58,237,0.35);
        z-index: 3;
      }
      .ci { font-size: 44px; margin-bottom: 2px; }
      .cl {
        color: #fff;
        font-size: 30px;
        font-weight: 800;
        font-family: ${tokens.font.family};
      }
      .cs {
        color: rgba(255,255,255,0.7);
        font-size: 15px;
        margin-top: 2px;
        font-family: ${tokens.font.family};
      }

      /* 서비스 노드 카드 */
      .hub-node {
        position: absolute;
        transform: translate(-50%, -50%);
        background: rgba(255,255,255,0.95);
        border-radius: 16px;
        padding: 22px 28px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        border: 2px solid rgba(139,92,246,0.12);
        text-align: center;
        min-width: 220px;
        z-index: 2;
      }
      .ni { font-size: 36px; margin-bottom: 8px; }
      .nl {
        font-size: 24px;
        font-weight: 700;
        color: ${tokens.text.primary};
        font-family: 'SF Mono', 'Fira Code', monospace;
        margin-bottom: 10px;
      }
      .node-tools {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        justify-content: center;
      }
      .nt {
        background: ${tokens.badge.bg};
        color: ${tokens.badge.text};
        font-size: 15px;
        padding: 4px 12px;
        border-radius: 999px;
        font-weight: 500;
        font-family: ${tokens.font.family};
      }

      /* MCP 뱃지 */
      .mcp-tag {
        position: absolute;
        transform: translate(-50%, -50%);
        background: ${tokens.text.highlight};
        color: white;
        font-size: 14px;
        font-weight: 700;
        padding: 5px 14px;
        border-radius: 999px;
        z-index: 4;
        font-family: 'SF Mono', monospace;
        letter-spacing: 1px;
      }
    </style>`;

  return wrapHtml(body, slide.size);
}
