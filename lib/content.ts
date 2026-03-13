import fs from "fs";
import path from "path";

export interface ContentNode {
  name: string;
  path: string;
  slug: string; // 추가: 영문 슬러그
  type: "file" | "folder";
  children?: ContentNode[];
  extension?: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");
const EXCLUDED_FILES = ["CLAUDE.md"];
const SUPPORTED_EXTENSIONS = [".md", ".pdf"];

// 폴더명 → 영문 슬러그 매핑
const FOLDER_SLUG_MAP: Record<string, string> = {
  "1-사전가이드": "guide",
  "2-시작하며": "start",
  "3-학습자료": "lesson",
  "4-설계서모음": "design",
  "5-설정가이드": "setup",
};

// 역방향 매핑 (슬러그 → 폴더명)
const SLUG_TO_FOLDER_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(FOLDER_SLUG_MAP).map(([k, v]) => [v, k])
);

function shouldExcludeFile(fileName: string): boolean {
  return EXCLUDED_FILES.includes(fileName);
}

function isSupportedFile(fileName: string): boolean {
  return SUPPORTED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
}

function sortFoldersFirstThenIndexFirst(a: ContentNode, b: ContentNode): number {
  if (a.type !== b.type) {
    return a.type === "folder" ? -1 : 1;
  }

  if (a.type === "file") {
    const aIsIndex = a.name.toLowerCase() === "index.md";
    const bIsIndex = b.name.toLowerCase() === "index.md";
    if (aIsIndex && !bIsIndex) return -1;
    if (!aIsIndex && bIsIndex) return 1;
  }

  return a.name.localeCompare(b.name, "ko");
}

/**
 * 파일/폴더명에서 슬러그 생성
 * - 최상위 폴더: FOLDER_SLUG_MAP 사용
 * - 하위 폴더: 숫자 prefix 추출 (예: "1-스킬개념-실습" → "1")
 * - 파일: 숫자 prefix 추출 (예: "1-워크숍-사전-가이드.md" → "1")
 * - 설계서/설정가이드: 파일명에서 "-설계서.md" / "-설정가이드.md" 제거
 */
function generateSlug(name: string, parentPath: string, type: "file" | "folder"): string {
  const nameWithoutExt = name.replace(/\.(md|pdf)$/, "");
  
  // 최상위 폴더면 매핑 사용
  if (parentPath === "" && type === "folder" && FOLDER_SLUG_MAP[name]) {
    return FOLDER_SLUG_MAP[name];
  }

  // 설계서/설정가이드 파일
  if (type === "file") {
    if (nameWithoutExt.endsWith("-설계서")) {
      return nameWithoutExt.replace(/-설계서$/, "");
    }
    if (nameWithoutExt.endsWith("-설정가이드")) {
      return nameWithoutExt.replace(/-설정가이드$/, "");
    }
  }

  // 숫자 prefix 추출 (예: "1-워크숍-사전-가이드" → "1")
  const match = nameWithoutExt.match(/^(\d+)-/);
  if (match) {
    return match[1];
  }

  // 그 외는 그대로
  return nameWithoutExt;
}

export function getContentTree(dir: string = CONTENT_DIR, parentPath: string = ""): ContentNode[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const nodes: ContentNode[] = [];

  for (const entry of entries) {
    if (shouldExcludeFile(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(CONTENT_DIR, fullPath);

    if (entry.isDirectory()) {
      const slug = generateSlug(entry.name, parentPath, "folder");
      const children = getContentTree(fullPath, relativePath);
      nodes.push({
        name: entry.name,
        path: relativePath,
        slug,
        type: "folder",
        children,
      });
    } else if (entry.isFile() && isSupportedFile(entry.name)) {
      const extension = path.extname(entry.name);
      const slug = generateSlug(entry.name, parentPath, "file");
      nodes.push({
        name: entry.name,
        path: relativePath,
        slug,
        type: "file",
        extension,
      });
    }
  }

  return nodes.sort(sortFoldersFirstThenIndexFirst);
}

/**
 * 슬러그 배열을 실제 파일 경로로 변환
 * 예: ["guide", "1"] → "1-사전가이드/1-워크숍-사전-가이드.md"
 * 예: ["lesson", "1", "1"] → "3-학습자료/1-스킬개념-실습/1-1-스킬이란.md"
 * 예: ["design", "booking-notifier"] → "4-설계서모음/booking-notifier-설계서.md"
 */
function tryFindFile(basePath: string, fileName: string): string | null {
  const fullPath = path.join(basePath, fileName);
  return fs.existsSync(fullPath) ? fullPath : null;
}

export function getDocBySlug(slug: string[]): { filePath: string; exists: boolean; isPdf: boolean } {
  const decodedSlug = slug.map((s) => decodeURIComponent(s));
  
  // 슬러그를 실제 경로로 매핑
  const realPathParts: string[] = [];

  for (let i = 0; i < decodedSlug.length; i++) {
    const part = decodedSlug[i];
    const isFirst = i === 0;
    const isLast = i === decodedSlug.length - 1;

    if (isFirst && SLUG_TO_FOLDER_MAP[part]) {
      // 최상위 폴더 매핑
      realPathParts.push(SLUG_TO_FOLDER_MAP[part]);
    } else {
      // 숫자 슬러그면 해당 위치의 폴더/파일 찾기
      const currentBase = path.join(CONTENT_DIR, ...realPathParts);
      
      if (fs.existsSync(currentBase)) {
        const entries = fs.readdirSync(currentBase, { withFileTypes: true });
        
        // 파일인 경우 (마지막 부분)
        if (isLast) {
          // 숫자 슬러그로 시작하는 파일 찾기
          const fileMatch = entries.find(e => 
            e.isFile() && 
            (e.name.startsWith(`${part}-`) || e.name === `${part}.md` || e.name === `${part}.pdf`)
          );
          
          // 설계서/설정가이드는 정확한 파일명으로 찾기
          const exactMatch = entries.find(e => 
            e.isFile() && 
            (e.name === `${part}-설계서.md` || e.name === `${part}-설정가이드.md` || e.name === `${part}.md`)
          );

          if (exactMatch) {
            realPathParts.push(exactMatch.name);
          } else if (fileMatch) {
            realPathParts.push(fileMatch.name);
          } else {
            // 파일 못 찾음 → 폴더로 시도
            const folderMatch = entries.find(e => 
              e.isDirectory() && e.name.startsWith(`${part}-`)
            );
            if (folderMatch) {
              realPathParts.push(folderMatch.name);
            } else {
              // 못 찾음
              return { filePath: "", exists: false, isPdf: false };
            }
          }
        } else {
          // 폴더인 경우
          const folderMatch = entries.find(e => 
            e.isDirectory() && e.name.startsWith(`${part}-`)
          );
          if (folderMatch) {
            realPathParts.push(folderMatch.name);
          } else {
            return { filePath: "", exists: false, isPdf: false };
          }
        }
      } else {
        return { filePath: "", exists: false, isPdf: false };
      }
    }
  }

  const relativePath = realPathParts.join("/");
  const basePath = path.join(CONTENT_DIR, relativePath);

  // 파일 찾기
  const mdPath = tryFindFile(CONTENT_DIR, `${relativePath}.md`);
  if (mdPath) return { filePath: mdPath, exists: true, isPdf: false };

  const pdfPath = tryFindFile(CONTENT_DIR, `${relativePath}.pdf`);
  if (pdfPath) return { filePath: pdfPath, exists: true, isPdf: true };

  // 폴더면 README.md / index.md 찾기
  if (fs.existsSync(basePath) && fs.statSync(basePath).isDirectory()) {
    const readmePath = tryFindFile(basePath, "README.md");
    if (readmePath) return { filePath: readmePath, exists: true, isPdf: false };

    const indexPath = tryFindFile(basePath, "index.md");
    if (indexPath) return { filePath: indexPath, exists: true, isPdf: false };
  }

  // 직접 파일 경로로 시도
  if (fs.existsSync(basePath)) {
    if (basePath.endsWith(".md")) return { filePath: basePath, exists: true, isPdf: false };
    if (basePath.endsWith(".pdf")) return { filePath: basePath, exists: true, isPdf: true };
  }

  return { filePath: "", exists: false, isPdf: false };
}

export function getDocContent(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

export interface FlatDoc {
  name: string;
  slug: string;
}

/**
 * 트리를 평탄화하면서 슬러그 기반 경로 생성
 */
function flattenTree(nodes: ContentNode[], parentSlug: string = ""): FlatDoc[] {
  const docs: FlatDoc[] = [];

  for (const node of nodes) {
    if (node.type === "file") {
      if (node.name.toLowerCase() === "index.md") continue;
      const nameWithoutExt = node.name.replace(/\.(md|pdf)$/, "");
      const slug = parentSlug ? `${parentSlug}/${node.slug}` : node.slug;
      docs.push({ name: nameWithoutExt, slug });
    } else if (node.type === "folder" && node.children) {
      const folderSlug = parentSlug ? `${parentSlug}/${node.slug}` : node.slug;
      docs.push(...flattenTree(node.children, folderSlug));
    }
  }

  return docs;
}

export function getPrevNextDocs(currentSlug: string[]): { prev: FlatDoc | null; next: FlatDoc | null } {
  const tree = getContentTree();
  const allDocs = flattenTree(tree);
  const currentPath = currentSlug.map(s => decodeURIComponent(s)).join("/");

  const currentIndex = allDocs.findIndex(doc => doc.slug === currentPath);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? allDocs[currentIndex - 1] : null,
    next: currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null,
  };
}
