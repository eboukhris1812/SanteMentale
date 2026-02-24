"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
        <p className="text-sm">© 2026 Santé Mentale Adolescents - Projet éducatif IB</p>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Link href="/a-propos" className="hover:text-white">
            À propos
          </Link>
          <Link href="/bilan-global" className="hover:text-white">
            Bilan global
          </Link>
          <Link href="/profil-resultat" className="hover:text-white">
            Résultats
          </Link>
        </div>
      </div>
    </footer>
  );
}
