import { getContentTree } from "@/lib/content";
import { DocsLayoutClient } from "./DocsLayoutClient";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tree = getContentTree();

  return <DocsLayoutClient tree={tree}>{children}</DocsLayoutClient>;
}
