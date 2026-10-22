import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  breadcrumbJsonLd,
  serializeJsonLd,
  type BreadcrumbItem,
} from "@/lib/seo";
export function Breadcrumbs({
  items,
  currentPath,
}: {
  items: BreadcrumbItem[];
  currentPath?: string;
}) {
  const data = breadcrumbJsonLd(items, currentPath);
  return (
    <>
      <nav aria-label="Percorso" className="breadcrumbs">
        <Link href="/">Home</Link>
        {items.map((item, index) => (
          <span key={index}>
            <ChevronRight size={12} />
            {item.href ? (
              <Link
                href={item.href}
                aria-current={index === items.length - 1 ? "page" : undefined}
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={index === items.length - 1 ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>
      {data && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
        />
      )}
    </>
  );
}
