"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ContentNode } from "@/lib/content";

interface SidebarProps {
  tree: ContentNode[];
  isOpen?: boolean;
  onClose?: () => void;
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
      />
    </svg>
  );
}

/**
 * 이름에서 번호 prefix 제거
 * 예: "1-워크숍-사전-가이드.md" → "워크숍 사전 가이드"
 */
function cleanDisplayName(name: string): string {
  let cleaned = name.replace(/\.(md|pdf)$/, ""); // 확장자 제거
  cleaned = cleaned.replace(/^(\d+)-/, ""); // 숫자 prefix 제거
  cleaned = cleaned.replace(/-설계서$/, ""); // "-설계서" 제거
  cleaned = cleaned.replace(/-설정가이드$/, ""); // "-설정가이드" 제거
  cleaned = cleaned.replace(/-/g, " "); // 하이픈을 공백으로
  return cleaned;
}

function buildSlugPath(node: ContentNode, parentSlug: string = ""): string {
  if (parentSlug) {
    return `${parentSlug}/${node.slug}`;
  }
  return node.slug;
}

function TreeNode({ node, depth = 0, parentSlug = "" }: { node: ContentNode; depth?: number; parentSlug?: string }) {
  const pathname = usePathname();
  const currentSlug = buildSlugPath(node, parentSlug);
  const href = `/docs/${currentSlug}`;
  
  const isCurrentPathInFolder = pathname.startsWith(href);
  const [isOpen, setIsOpen] = useState(isCurrentPathInFolder);

  const isFolder = node.type === "folder";
  const isActive = pathname === href;

  const paddingLeft = depth === 0 ? undefined : `${depth * 1.25 + 0.75}rem`;

  if (isFolder) {
    const visibleChildren = node.children;
    const displayName = cleanDisplayName(node.name);

    // 최상위 폴더(depth === 0)는 섹션 라벨 스타일
    if (depth === 0) {
      return (
        <div className="first:mt-0 mt-5">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 w-full px-3 mb-1.5 text-[11px] font-semibold tracking-wider uppercase text-stone-400 dark:text-gray-500 hover:text-stone-600 dark:hover:text-gray-400 transition-colors"
          >
            <ChevronIcon isOpen={isOpen} />
            <span>{displayName}</span>
          </button>
          {isOpen && visibleChildren && (
            <div className="space-y-0.5">
              {visibleChildren.map((child) => (
                <TreeNode key={child.path} node={child} depth={depth + 1} parentSlug={currentSlug} />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div>
        <div
          className="flex items-center gap-0 rounded-md transition-colors"
          style={{ paddingLeft }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="flex-shrink-0 p-1.5 text-stone-400 dark:text-gray-500 hover:bg-stone-200 dark:hover:bg-gray-700 rounded transition-colors"
            aria-label={isOpen ? "폴더 닫기" : "폴더 열기"}
          >
            <ChevronIcon isOpen={isOpen} />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            data-folder={node.name}
            className="flex-1 px-2 py-1.5 text-sm text-left font-medium text-stone-700 dark:text-gray-300 hover:bg-stone-100 dark:hover:bg-gray-800/50 rounded-md transition-colors"
          >
            {displayName}
          </button>
        </div>
        {isOpen && visibleChildren && (
          <div className="mt-0.5">
            {visibleChildren.map((child) => (
              <TreeNode key={child.path} node={child} depth={depth + 1} parentSlug={currentSlug} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const displayName = cleanDisplayName(node.name);
  const isPdf = node.extension === ".pdf";

  return (
    <Link
      href={href}
      className={`
        block py-1.5 text-sm rounded-md transition-colors duration-150
        ${
          isActive
            ? "bg-violet-50/80 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 font-medium"
            : "text-stone-600 dark:text-gray-400 hover:bg-stone-100 dark:hover:bg-gray-800/50"
        }
      `}
      style={{
        paddingLeft: paddingLeft || "0.75rem",
        paddingRight: "0.75rem",
      }}
    >
      <span className="flex items-center gap-2">
        {isPdf && <span className="text-xs text-stone-400">📄</span>}
        {displayName}
      </span>
    </Link>
  );
}

export function Sidebar({ tree, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (onClose && isOpen) {
      onClose();
    }
  }, [pathname]);

  return (
    <>
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        data-testid="sidebar"
        className={`
          fixed top-0 left-0 h-full w-64 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:relative md:transform-none
          md:h-screen md:sticky md:top-0
          border-r border-stone-200 dark:border-gray-800
          bg-stone-100 dark:bg-gray-900 overflow-y-auto
        `}
      >
        <div className="md:hidden flex justify-end p-2 border-b border-stone-200 dark:border-gray-800">
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-stone-100 dark:hover:bg-gray-800 text-stone-700 dark:text-gray-300"
            aria-label="메뉴 닫기"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <Link href="/docs" className="block border-b border-stone-200 dark:border-gray-800 pb-4 mb-4">
            <h1 className="text-lg font-bold text-stone-800 dark:text-gray-100">
              🚢 HKG 워크숍
            </h1>
            <p className="text-xs text-stone-400 dark:text-gray-500 mt-0.5">
              Claude Code Workshop
            </p>
          </Link>

          <nav className="space-y-0.5">
            {tree.map((node) => (
              <TreeNode key={node.path} node={node} />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
