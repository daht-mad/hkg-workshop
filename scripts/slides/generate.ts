import path from "path";
import fs from "fs";
import { generateSlides } from "./renderer";
import { slides } from "./data/slides";

const OUTPUT_DIR = path.join(process.cwd(), "public/images/slides");

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log(`\n슬라이드 ${slides.length}장 생성 시작...\n`);
  await generateSlides(slides, OUTPUT_DIR);
  console.log(`\n완료! → ${OUTPUT_DIR}\n`);
}

main().catch((err) => {
  console.error("생성 실패:", err);
  process.exit(1);
});
