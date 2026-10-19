"use client";
import { useEffect, useRef, type ReactNode } from "react";
/** A native modal keeps keyboard focus inside the mobile filter drawer. */
export function FilterDrawer({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="filter-dialog"
      aria-label="Filtri catalogo"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <aside className="filters filter-drawer">{children}</aside>
    </dialog>
  );
}
