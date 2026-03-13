"use client";

import { useEffect, useState, useMemo } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
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

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  const headings = useMemo(() => {
    const lines = content.split("\n");
    const result: Heading[] = [];

    for (const line of lines) {
      const h2Match = line.match(/^## (.+)$/);
      const h3Match = line.match(/^### (.+)$/);

      if (h2Match) {
        const text = h2Match[1].trim();
        result.push({ id: slugify(text), text, level: 2 });
      } else if (h3Match) {
        const text = h3Match[1].trim();
        result.push({ id: slugify(text), text, level: 3 });
      }
    }

    return result;
  }, [content]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const headingElements = document.querySelectorAll("article h2[id], article h3[id]");

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        {
          rootMargin: "-80px 0px -80% 0px",
          threshold: 0,
        }
      );

      headingElements.forEach((heading) => observer.observe(heading));

      return () => {
        headingElements.forEach((heading) => observer.unobserve(heading));
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [content]);

  if (headings.length === 0) {
    return null;
  }

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      data-testid="toc"
      className="hidden xl:block fixed right-8 top-28 w-56 max-h-[calc(100vh-10rem)] overflow-y-auto"
    >
      <h3 className="text-[11px] font-semibold tracking-wider uppercase text-stone-400 dark:text-gray-500 mb-2 px-2">
        목차
      </h3>
      <ul className="space-y-0.5 border-l border-stone-200 dark:border-gray-800">
        {headings.map((heading) => (
          <li key={heading.id}>
            <button
              onClick={() => handleClick(heading.id)}
              className={`
                text-left w-full px-3 py-1 text-[13px] transition-colors
                ${heading.level === 3 ? "pl-5" : ""}
                ${
                  activeId === heading.id
                    ? "-ml-px border-l-2 border-violet-500 bg-violet-50/60 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 font-medium"
                    : "text-stone-500 dark:text-gray-500 hover:text-stone-800 dark:hover:text-gray-300"
                }
              `}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
