"use client";

import { useId, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import type { SearchSuggestion } from "@/domain/catalog";
import { normalize } from "@/domain/search";

const kindNames = {
  COURSE: "Curso",
  CATEGORY: "Área",
  INSTITUTION: "Institución",
};

export function SearchForm({
  value = "",
  suggestions = [],
}: {
  value?: string;
  suggestions?: SearchSuggestion[];
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const router = useRouter();
  const matches = suggestions
    .filter((item) => normalize(item.label).includes(normalize(query)))
    .slice(0, 6);
  const expanded = open && query.trim().length > 0 && matches.length > 0;
  function choose(label: string) {
    setQuery(label);
    setOpen(false);
    setActive(-1);
    router.push(`/cursos?${new URLSearchParams({ q: label })}`);
  }
  return (
    <form
      className="search-form"
      action="/cursos"
      role="search"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <Search size={21} aria-hidden />
      <input
        type="search"
        name="q"
        role="combobox"
        aria-label="¿Qué querés aprender?"
        placeholder="Curso, tema o institución"
        value={query}
        maxLength={160}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls={expanded ? listId : undefined}
        aria-activedescendant={
          expanded && active >= 0 ? `${listId}-${active}` : undefined
        }
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
            setActive(-1);
          }
          if (
            (event.key === "ArrowDown" || event.key === "ArrowUp") &&
            query.trim() &&
            matches.length
          ) {
            event.preventDefault();
            setOpen(true);
            setActive((index) =>
              event.key === "ArrowDown"
                ? (index + 1) % matches.length
                : index <= 0
                  ? matches.length - 1
                  : index - 1,
            );
          }
          if (event.key === "Enter" && expanded && active >= 0) {
            event.preventDefault();
            choose(matches[active].label);
          }
        }}
      />
      <button type="submit" className="button">
        Buscar <ArrowRight size={17} aria-hidden />
      </button>
      {expanded && (
        <ul
          className="search-suggestions"
          id={listId}
          role="listbox"
          aria-label="Sugerencias de búsqueda"
        >
          {matches.map((item, index) => (
            <li
              key={`${item.kind}-${item.label}`}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={active === index}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(item.label)}
            >
              <Search size={16} aria-hidden />
              <span>
                {item.label}
                <small>{kindNames[item.kind]}</small>
              </span>
              <ArrowRight size={14} aria-hidden />
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

export function HeaderSearch({
  suggestions,
}: {
  suggestions: SearchSuggestion[];
}) {
  const params = useSearchParams();
  const pathname = usePathname();
  // Institutional search is local to that profile, not the global query.
  const value =
    pathname === "/cursos" || pathname.startsWith("/categorias/")
      ? (params.get("q") ?? "").slice(0, 160)
      : "";
  return (
    <SearchForm
      key={`${pathname}-${value}`}
      value={value}
      suggestions={suggestions}
    />
  );
}
