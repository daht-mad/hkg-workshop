import type { ComparisonSlide } from "../types";
import { wrapHtml, applyHighlights, renderHeader, renderFooter, tokens } from "./base";

function renderCard(
  card: ComparisonSlide["left"] | ComparisonSlide["right"]
): string {
  const isPositive = card.variant === "positive";
  const borderColor = isPositive
    ? "rgba(139, 92, 246, 0.3)"
    : "rgba(0, 0, 0, 0.08)";
  const headerBg = isPositive
    ? "rgba(139, 92, 246, 0.06)"
    : "rgba(0, 0, 0, 0.02)";

  const itemsHtml = card.items
    .map(
      (item) => `
      <div class="card-item">
        ${item.icon ? `<span class="item-icon">${item.icon}</span>` : ""}
        <span class="item-text">${item.text}</span>
      </div>`
    )
    .join("\n");

  return `
    <div class="compare-card" style="border-color: ${borderColor}">
      <div class="card-header" style="background: ${headerBg}">
        <span class="card-icon">${card.icon}</span>
        <span class="card-title">${card.title}</span>
      </div>
      <div class="card-body">
        ${itemsHtml}
      </div>
    </div>`;
}

export function renderComparison(slide: ComparisonSlide): string {
  let bottomBadgeHtml = "";
  if (slide.bottomBadge) {
    bottomBadgeHtml = `
      <div class="bottom-badge-container">
        <span class="bottom-badge-label">${slide.bottomBadge.label}</span>
        <span class="bottom-badge-desc">${slide.bottomBadge.description}</span>
      </div>`;
  }

  const body = `
    ${renderHeader(slide)}
    <div class="content">
      <div class="cards-row">
        ${renderCard(slide.left)}
        ${renderCard(slide.right)}
      </div>
      ${bottomBadgeHtml}
    </div>
    ${renderFooter(slide.footer)}
    <style>
      .slide-title {
        text-align: center;
      }
      .cards-row {
        display: flex;
        gap: 32px;
        width: 100%;
        margin-top: 24px;
      }
      .compare-card {
        flex: 1;
        background: ${tokens.card.bg};
        border: 1.5px solid ${tokens.card.border};
        border-radius: 20px;
        overflow: hidden;
        backdrop-filter: blur(8px);
      }
      .card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 24px 32px;
        font-size: 26px;
        font-weight: 700;
      }
      .card-icon {
        font-size: 28px;
      }
      .card-body {
        padding: 16px 32px 32px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .card-item {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 24px;
        line-height: 1.5;
        padding: 16px 20px;
        background: rgba(0, 0, 0, 0.02);
        border-radius: 12px;
      }
      .item-icon {
        font-size: 24px;
        flex-shrink: 0;
      }
      .bottom-badge-container {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-top: 40px;
      }
      .bottom-badge-label {
        background: ${tokens.badge.bg};
        color: ${tokens.badge.text};
        font-size: 18px;
        font-weight: 700;
        padding: 8px 20px;
        border-radius: 8px;
      }
      .bottom-badge-desc {
        font-size: 22px;
        color: ${tokens.text.secondary};
      }
    </style>`;

  return wrapHtml(body, slide.size);
}
