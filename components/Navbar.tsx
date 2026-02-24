"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/bilan-global", label: "Bilan" },
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
    <header className="sticky top-0 z-50 border-b border-blue-950/40 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 shadow-md">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="text-white font-extrabold tracking-tight text-lg">
          Santé Mentale
        </Link>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-blue-900"
                    : "rounded-full px-3 py-1.5 text-sm font-medium text-blue-100 hover:bg-white/15 hover:text-white"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
