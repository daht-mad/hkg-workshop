import { notFound } from "next/navigation";
import Link from "next/link";
import { getDocBySlug, getDocContent, getPrevNextDocs } from "@/lib/content";
import PdfViewer from "@/components/PdfViewer";
import MarkdownRenderer from "@/components/MdxContent";
import { TableOfContents } from "@/components/TableOfContents";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const { filePath, exists, isPdf } = getDocBySlug(slug);

  if (!exists) {
    notFound();
  }

  const { prev, next } = getPrevNextDocs(slug);

  if (isPdf) {
    const pdfUrl = `/api/pdf?path=${encodeURIComponent(filePath)}`;
    return (
      <article className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <PdfViewer fileUrl={pdfUrl} />
        <DocNavigation prev={prev} next={next} />
      </article>
    );
  }

  const content = getDocContent(filePath);

  return (
    <div className="relative w-full max-w-6xl xl:pr-64">
      <article className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <MarkdownRenderer content={content} />
        <DocNavigation prev={prev} next={next} />
      </article>
      <TableOfContents content={content} />
    </div>
  );
}

function DocNavigation({ prev, next }: { prev: { name: string; slug: string } | null; next: { name: string; slug: string } | null }) {
  if (!prev && !next) return null;

  return (
    <nav className="mt-16 pt-8 border-t border-stone-200 dark:border-gray-700 flex justify-between items-stretch gap-4">
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="group flex-1 flex items-center gap-3 px-5 py-4 rounded-xl border border-stone-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-colors"
        >
          <svg className="w-5 h-5 text-stone-400 dark:text-gray-500 group-hover:text-violet-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <div>
            <div className="text-xs text-stone-400 dark:text-gray-500">이전</div>
            <div className="font-medium text-stone-700 dark:text-gray-300 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">{prev.name}</div>
          </div>
        </Link>
      ) : <div className="flex-1" />}

      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="group flex-1 flex items-center justify-end gap-3 px-5 py-4 rounded-xl border border-stone-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-colors"
        >
          <div className="text-right">
            <div className="text-xs text-stone-400 dark:text-gray-500">다음</div>
            <div className="font-medium text-stone-700 dark:text-gray-300 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">{next.name}</div>
          </div>
          <svg className="w-5 h-5 text-stone-400 dark:text-gray-500 group-hover:text-violet-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : <div className="flex-1" />}
    </nav>
  );
}
