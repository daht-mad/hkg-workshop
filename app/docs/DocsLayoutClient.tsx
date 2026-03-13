"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileHeader } from "@/components/MobileHeader";
import { ContentNode } from "@/lib/content";

interface DocsLayoutClientProps {
  tree: ContentNode[];
  children: React.ReactNode;
}

export function DocsLayoutClient({ tree, children }: DocsLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />

      <Sidebar
        tree={tree}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 overflow-x-hidden flex justify-center pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
