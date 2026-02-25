'use client';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="text-slate-800 antialiased">
        <Navbar />
        <main className="min-h-screen">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
