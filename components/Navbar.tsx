'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-500 text-white p-4 flex justify-between items-center">
      <h1 className="font-bold text-lg">Santé Mentale</h1>
      <div className="space-x-4">
        <Link href="/">Accueil</Link>
        <Link href="/bilan-global">Bilan</Link>
        <Link href="/troubles">Troubles</Link>
        <Link href="/aide">Besoin d'aide ?</Link>
      </div>
    </nav>
  );
}
