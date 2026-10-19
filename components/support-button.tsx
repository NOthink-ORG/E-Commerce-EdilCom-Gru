"use client";
import { Headphones } from "lucide-react";
import { useStore } from "./store-provider";
export function SupportButton({
  subject = "",
  className = "button outline",
  label = "Richiedi assistenza",
}: {
  subject?: string;
  className?: string;
  label?: string;
}) {
  const { support } = useStore();
  return (
    <button className={className} onClick={() => support(subject)}>
      <Headphones size={18} />
      {label}

    </button>
  );
}
