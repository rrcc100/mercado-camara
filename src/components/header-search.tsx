"use client";

import { useSearchParams } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";

export function SearchForm({ value = "" }: { value?: string }) {
  return (
    <form className="search-form" action="/cursos" role="search">
      <Search size={21} aria-hidden />
      <input
        key={value}
        type="search"
        name="q"
        aria-label="¿Qué querés aprender?"
        placeholder="¿Qué querés aprender?"
        defaultValue={value}
        maxLength={160}
      />
      <button type="submit" className="button">
        Buscar <ArrowRight size={17} aria-hidden />
      </button>
    </form>
  );
}

export function HeaderSearch() {
  const params = useSearchParams();
  return <SearchForm value={(params.get("q") ?? "").slice(0, 160)} />;
}
