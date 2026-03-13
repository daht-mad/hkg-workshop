"use client";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-stone-100 dark:bg-gray-900 border-b border-stone-200 dark:border-gray-800 z-40 flex items-center px-4">
      <button
        onClick={onMenuClick}
        className="p-2 -ml-2 rounded-md hover:bg-stone-100 dark:hover:bg-gray-800 text-stone-600 dark:text-gray-400"
        aria-label="메뉴 열기"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <span className="ml-3 font-semibold text-stone-800 dark:text-gray-100">
        🚢 HKG 워크숍
      </span>
    </header>
  );
}
