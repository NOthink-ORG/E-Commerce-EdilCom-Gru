import Link from "next/link";
import { Headphones } from "lucide-react";
export function SupportButton({
  productSlug,
  className = "button outline",
  label = "Richiedi assistenza",
}: {
  productSlug?: string;
  className?: string;
  label?: string;
}) {
  return (
    <Link
      className={className}
      href={
        productSlug
          ? `/assistenza?prodotto=${encodeURIComponent(productSlug)}`
          : "/assistenza"
      }
    >
      <Headphones size={18} />
      {label}
    </Link>
  );
}
