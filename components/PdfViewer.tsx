'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  fileUrl: string;
  className?: string;
}

export default function PdfViewer({ fileUrl, className = '' }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    setLoading(false);
    setError(error.message);
    console.error('PDF 로딩 오류:', error);
  }

  function goToPrevPage() {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  }

  function goToNextPage() {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  }

  return (
    <div className={`pdf-viewer ${className}`}>
      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-600">PDF 로딩 중...</div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center p-8">
          <div className="text-red-600">PDF 로딩 실패: {error}</div>
        </div>
      )}

      <div className="pdf-document-container">
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading=""
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="pdf-page"
          />
        </Document>
      </div>

      {!loading && !error && numPages > 0 && (
        <div className="pdf-controls flex items-center justify-center gap-4 mt-4 p-4 bg-gray-100 rounded">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            data-testid="prev-page"
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600"
          >
            이전
          </button>

          <span className="text-sm text-gray-700">
            {pageNumber} / {numPages}
          </span>

          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            data-testid="next-page"
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600"
          >
            다음
          </button>
        </div>
      )}

      <style jsx>{`
        .pdf-viewer {
          width: 100%;
          max-width: 100%;
        }

        .pdf-document-container {
          display: flex;
          justify-content: center;
          background-color: #f5f5f5;
          padding: 1rem;
          border-radius: 0.5rem;
        }

        :global(.pdf-page canvas) {
          max-width: 100%;
          height: auto !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
