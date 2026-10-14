"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

export function ResponsiveFilters({
  children,
  count,
}: {
  children: ReactNode;
  count: number;
}) {
  const details = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 761px)");
    const update = () => {
      if (details.current) details.current.open = desktop.matches;
    };
    update();
    desktop.addEventListener("change", update);
    return () => desktop.removeEventListener("change", update);
  }, []);
  return (
    <details className="filter-disclosure" ref={details} open>
      <summary>
        <SlidersHorizontal size={17} aria-hidden /> Filtrar cursos{" "}
        {count > 0 && <span className="filter-count">{count}</span>}
        <ChevronDown size={16} aria-hidden />
      </summary>
      {children}
    </details>
  );
}
