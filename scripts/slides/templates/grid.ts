import type { GridSlide } from "../types";
import { wrapHtml, tokens } from "./base";

export function renderGrid(slide: GridSlide): string {
  const cardsHtml = slide.cards
    .map((card) => {
      const iconHtml = card.icon
        ? `<div class="grid-icon">${card.icon}</div>`
        : "";
      const subtitleHtml = card.subtitle
        ? `<div class="grid-subtitle">${card.subtitle}</div>`
        : "";
      const descHtml = card.description
        ? `<div class="grid-desc">${card.description}</div>`
        : "";
      const badgeHtml = card.badge
        ? `<span class="grid-badge">${card.badge}</span>`
        : "";

      return `<div class="grid-card">
        ${iconHtml}
        <div class="grid-title">${card.title}</div>
        ${subtitleHtml}
        ${descHtml}
        ${badgeHtml}
      </div>`;
    })
    .join("\n");

  const body = `
    <div class="grid-wrap">
      ${cardsHtml}
    </div>

    <style>
      body { padding: 48px 80px; }

      .grid-wrap {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 32px;
        align-items: stretch;
        position: relative;
        z-index: 1;
      }

      .grid-card {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
        border: 1px solid rgba(196, 181, 253, 0.2);
        border-top: 4px solid ${tokens.text.highlight};
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
        padding: 40px 36px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 8px;
      }

      .grid-icon {
        font-size: 48px;
        margin-bottom: 8px;
      }

      .grid-title {
        font-size: 28px;
        font-weight: 700;
        color: ${tokens.text.primary};
        font-family: ${tokens.font.family};
        line-height: 1.3;
      }

      .grid-subtitle {
        font-size: 22px;
        color: ${tokens.text.highlight};
        font-family: 'SF Mono', 'Fira Code', monospace;
        font-weight: 600;
        margin-top: 4px;
      }

      .grid-desc {
        font-size: 20px;
        color: ${tokens.text.secondary};
        font-family: ${tokens.font.family};
        line-height: 1.5;
        margin-top: 4px;
      }

      .grid-badge {
        display: inline-block;
        background: ${tokens.badge.bg};
        color: ${tokens.badge.text};
        font-size: 15px;
        font-weight: 600;
        padding: 4px 14px;
        border-radius: 999px;
        margin-top: 8px;
        font-family: ${tokens.font.family};
      }
    </style>`;

  return wrapHtml(body, slide.size);
}
