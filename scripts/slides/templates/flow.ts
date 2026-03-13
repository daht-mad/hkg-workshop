import type { FlowSlide } from "../types";
import { wrapHtml, tokens } from "./base";

export function renderFlow(slide: FlowSlide): string {
  const stepsHtml = slide.steps
    .map((step, i) => {
      const stepCard = `<div class="flow-step">
        <div class="step-number">${i + 1}</div>
        ${step.icon ? `<div class="step-icon">${step.icon}</div>` : ""}
        <div class="step-label">${step.label}</div>
        ${step.description ? `<div class="step-desc">${step.description}</div>` : ""}
      </div>`;

      // 마지막 스텝 뒤에는 화살표 없음
      if (i < slide.steps.length - 1) {
        return `${stepCard}<div class="flow-arrow">\u2192</div>`;
      }
      return stepCard;
    })
    .join("\n");

  const body = `
    <div class="flow-wrap">
      ${stepsHtml}
    </div>

    <style>
      body { padding: 60px 80px; }

      .flow-wrap {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 24px;
        position: relative;
        z-index: 1;
      }

      .flow-step {
        position: relative;
        background: #fff;
        border: 2px solid rgba(139, 92, 246, 0.15);
        border-radius: 16px;
        min-width: 200px;
        padding: 28px 24px;
        padding-top: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      }

      .step-number {
        position: absolute;
        top: -14px;
        left: -14px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: ${tokens.text.highlight};
        color: #fff;
        font-size: 16px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: ${tokens.font.family};
      }

      .step-icon {
        font-size: 40px;
        margin-bottom: 12px;
      }

      .step-label {
        font-size: 24px;
        font-weight: 700;
        color: ${tokens.text.primary};
        font-family: ${tokens.font.family};
        margin-bottom: 8px;
      }

      .step-desc {
        font-size: 18px;
        color: ${tokens.text.secondary};
        font-family: ${tokens.font.family};
        line-height: 1.5;
      }

      .flow-arrow {
        font-size: 36px;
        color: ${tokens.text.highlight};
        font-weight: 700;
        flex-shrink: 0;
        display: flex;
        align-items: center;
      }
    </style>`;

  return wrapHtml(body, slide.size);
}
