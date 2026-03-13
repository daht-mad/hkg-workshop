"use client";

import { useState, useEffect, useRef, useId } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
});

// rehype-highlight가 코드를 <span> 태그로 감싸므로, 재귀적으로 텍스트 추출
function extractText(node: any): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node?.props?.children) return extractText(node.props.children);
  return "";
}

let mermaidCounter = 0;

function MermaidDiagram({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(`mermaid-${++mermaidCounter}-${Date.now()}`);
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      try {
        const { svg } = await mermaid.render(idRef.current, chart);
        if (!cancelled) setSvgContent(svg);
      } catch {
        if (!cancelled) setSvgContent(`<pre>${chart}</pre>`);
      }
    };
    render();
    return () => { cancelled = true; };
  }, [chart]);

  return (
    <div
      ref={containerRef}
      className="my-4 flex justify-center overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\uAC00-\uD7A3-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// 옵시디언 이미지 경로를 Next.js public 경로로 정규화
function normalizeImageSrc(src: string | undefined): string {
  if (!src) return "";
  // 이미 절대 URL이면 그대로
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  // 이미 /images/로 시작하면 그대로
  if (src.startsWith("/images/")) return src;
  // public/images/ 경로 정규화 (옵시디언에서 상대경로로 붙여넣기한 경우)
  if (src.startsWith("images/")) return `/${src}`;
  // ../public/images/ 같은 상대경로 처리
  const match = src.match(/(?:\.\.\/)*(?:public\/)?images\/(.+)/);
  if (match) return `/images/${match[1]}`;
  return src;
}

export default function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className={`markdown-body ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mt-10 mb-6 pb-3 border-b border-stone-200 dark:border-gray-700 text-stone-900 dark:text-gray-50">
              {children}
            </h1>
          ),
          h2: ({ children }) => {
            const text = String(children);
            const id = slugify(text);
            return (
              <h2 id={id} className="text-2xl font-semibold mt-10 mb-4 text-stone-800 dark:text-gray-100 scroll-mt-20">
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const text = String(children);
            const id = slugify(text);
            return (
              <h3 id={id} className="text-xl font-semibold mt-8 mb-3 text-stone-700 dark:text-gray-200 scroll-mt-20">
                {children}
              </h3>
            );
          },
          p: ({ children }) => (
            <p className="my-4 leading-relaxed text-stone-700 dark:text-gray-300">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-4 ml-6 list-disc space-y-2 text-stone-700 dark:text-gray-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 ml-6 list-decimal space-y-2 text-stone-700 dark:text-gray-300">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-violet-600 dark:text-violet-400 underline underline-offset-2 decoration-violet-300 dark:decoration-violet-700 hover:decoration-violet-500 dark:hover:decoration-violet-400 transition-colors"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-6 px-5 py-4 border-l-4 border-violet-400 dark:border-violet-500 bg-violet-50/50 dark:bg-violet-900/10 rounded-r-lg text-stone-600 dark:text-gray-400">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }: any) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className={`${className} text-sm`} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }: any) => {
            const codeClassName = children?.props?.className || "";
            const codeContent = extractText(children?.props?.children);

            if (codeClassName.includes("language-mermaid")) {
              return <MermaidDiagram chart={codeContent.trim()} />;
            }

            return (
              <div className="relative group my-4">
                <pre className="bg-stone-100 dark:bg-gray-900 text-stone-800 dark:text-gray-100 rounded-xl p-5 overflow-x-auto text-sm border border-stone-200 dark:border-gray-700 leading-relaxed">
                  {children}
                </pre>
                <button
                  onClick={() => handleCopy(codeContent)}
                  data-testid="copy-button"
                  className="absolute top-3 right-3 px-2.5 py-1 text-xs bg-stone-200 dark:bg-gray-700 hover:bg-stone-300 dark:hover:bg-gray-600 text-stone-600 dark:text-gray-300 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedCode === codeContent ? "복사됨" : "복사"}
                </button>
              </div>
            );
          },
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto">
              <table className="min-w-full border-collapse border border-stone-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-stone-50 dark:bg-gray-800/50">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-stone-200 dark:border-gray-700 px-4 py-2.5 text-left font-semibold text-stone-800 dark:text-gray-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-stone-200 dark:border-gray-700 px-4 py-2.5 text-stone-700 dark:text-gray-300">
              {children}
            </td>
          ),
          img: ({ src, alt }) => (
            <img
              src={normalizeImageSrc(typeof src === "string" ? src : undefined)}
              alt={alt || ""}
              className="max-w-full h-auto rounded-xl my-6 shadow-sm border border-stone-100 dark:border-gray-800"
            />
          ),
          hr: () => <hr className="my-8 border-stone-200 dark:border-gray-700" />,
          strong: ({ children }) => (
            <strong className="font-semibold text-stone-900 dark:text-gray-50">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-700 dark:text-gray-300">
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
