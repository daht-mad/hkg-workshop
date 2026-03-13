import { chromium } from "playwright";
import type { Slide } from "./types";
import { tokens } from "./templates/base";
import { renderChat } from "./templates/chat";
import { renderComparison } from "./templates/comparison";
import { renderTerminal } from "./templates/terminal";
import { renderBundling } from "./templates/bundling";
import { renderDualTerminal } from "./templates/dualTerminal";
import { renderHub } from "./templates/hub";
import { renderGrid } from "./templates/grid";
import { renderFlow } from "./templates/flow";

function renderSlideHtml(slide: Slide): string {
  switch (slide.type) {
    case "chat":
      return renderChat(slide);
    case "comparison":
      return renderComparison(slide);
    case "terminal":
      return renderTerminal(slide);
    case "bundling":
      return renderBundling(slide);
    case "dualTerminal":
      return renderDualTerminal(slide);
    case "hub":
      return renderHub(slide);
    case "grid":
      return renderGrid(slide);
    case "flow":
      return renderFlow(slide);
  }
}

export async function generateSlides(slides: Slide[], outputDir: string) {
  const browser = await chromium.launch();

  for (const slide of slides) {
    const size = slide.size ?? tokens.size;
    const context = await browser.newContext({
      viewport: { width: size.width, height: size.height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    const html = renderSlideHtml(slide);
    await page.setContent(html, { waitUntil: "networkidle" });

    await page.waitForTimeout(300);

    const outputPath = `${outputDir}/${slide.id}.png`;
    await page.screenshot({ path: outputPath, type: "png" });
    await page.close();
    await context.close();

    console.log(`  ${slide.id}.png`);
  }

  await browser.close();
}
