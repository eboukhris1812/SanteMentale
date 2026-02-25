"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [hasResult, setHasResult] = useState(false);

  useEffect(() => {
    try {
      setHasResult(Boolean(window.sessionStorage.getItem("bilanApiResult")));
    } catch {
      setHasResult(false);
    }
  }, []);

  return (
    <footer className="mt-16 border-t border-sky-200 bg-gradient-to-br from-sky-50 via-cyan-50 to-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-800">© 2026 Santé Mentale Adolescents</p>
          <p className="text-xs text-slate-600">Projet éducatif IB - ressources et auto-évaluation responsable.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Link
            href="/a-propos"
            className="rounded-full px-3 py-1.5 text-slate-700 transition-colors hover:bg-white hover:text-sky-900"
          >
            À propos
          </Link>
          <Link
            href="/bilan-global"
            className="rounded-full px-3 py-1.5 text-slate-700 transition-colors hover:bg-white hover:text-sky-900"
          >
            Bilan global
          </Link>
          {hasResult && (
            <Link
              href="/profil-resultat"
              className="rounded-full border border-sky-200 bg-white px-3 py-1.5 font-medium text-sky-800 transition-colors hover:bg-sky-50"
            >
              Résultats
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
