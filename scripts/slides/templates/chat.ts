import type { ChatSlide } from "../types";
import { wrapHtml, applyHighlights, nl2br, renderHeader, renderFooter, tokens } from "./base";

export function renderChat(slide: ChatSlide): string {
  const messagesHtml = slide.messages
    .map((msg) => {
      const isRight = msg.align === "right";
      return `
      <div class="msg-row ${isRight ? "right" : "left"}">
        ${!isRight ? `<div class="avatar">${msg.emoji}</div>` : ""}
        <div class="bubble ${isRight ? "bubble-right" : "bubble-left"}">
          ${nl2br(applyHighlights(msg.text, msg.highlight))}
        </div>
        ${isRight ? `<div class="avatar">${msg.emoji}</div>` : ""}
      </div>`;
    })
    .join("\n");

  let afterSection = "";
  if (slide.divider) {
    afterSection += `<div class="divider">${slide.divider}</div>`;
  }
  if (slide.afterMessages) {
    afterSection += slide.afterMessages
      .map(
        (msg) => `
      <div class="after-msg">
        <span class="after-emoji">${msg.emoji}</span>
        <span class="after-text">${applyHighlights(msg.text, msg.highlight)}</span>
      </div>`
      )
      .join("\n");
  }

  const body = `
    ${renderHeader(slide)}
    <div class="content">
      <div class="chat-container">
        ${messagesHtml}
      </div>
      ${afterSection}
    </div>
    ${renderFooter(slide.footer)}
    <style>
      .chat-container {
        display: flex;
        flex-direction: column;
        gap: 24px;
        width: 100%;
        max-width: 1000px;
      }
      .msg-row {
        display: flex;
        align-items: flex-start;
        gap: 16px;
      }
      .msg-row.right {
        justify-content: flex-end;
      }
      .avatar {
        font-size: 40px;
        width: 56px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .bubble {
        background: ${tokens.card.bg};
        border: 1px solid ${tokens.card.border};
        border-radius: ${tokens.card.radius};
        padding: 24px 32px;
        font-size: 26px;
        line-height: 1.7;
        max-width: 700px;
        backdrop-filter: blur(8px);
      }
      .bubble-right {
        background: rgba(139, 92, 246, 0.08);
        border-color: rgba(139, 92, 246, 0.2);
      }
      .divider {
        text-align: center;
        font-size: 22px;
        color: ${tokens.text.secondary};
        margin: 40px 0;
      }
      .after-msg {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 24px;
        margin-bottom: 12px;
      }
      .after-emoji {
        font-size: 28px;
      }
    </style>`;

  return wrapHtml(body, slide.size);
}
