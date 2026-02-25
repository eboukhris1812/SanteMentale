"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/troubles", label: "Troubles" },
  { href: "/a-propos", label: "À propos" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-sky-200/70 bg-sky-50/85 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="group flex items-center gap-2 text-slate-900">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-700 text-sm font-bold text-white transition-transform duration-300 group-hover:scale-105">
            SM
          </span>
          <span className="text-base font-semibold tracking-tight md:text-lg">Santé Mentale</span>
        </Link>

        <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "rounded-full border border-sky-300 bg-sky-100 px-3 py-1.5 text-sm font-semibold text-sky-900"
                    : "rounded-full border border-transparent px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:border-sky-200 hover:bg-white/80 hover:text-slate-900"
                }
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/bilan-global"
            className="ml-1 rounded-full bg-sky-800 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-700"
          >
            Commencer
          </Link>
        </div>
      </nav>
    </header>
  );
}
