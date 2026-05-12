import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-[#0f2744] mb-4">404 - Seite nicht gefunden</h1>
      <p className="text-lg text-gray-600 mb-8">Die gesuchte Seite existiert nicht.</p>
      <Link 
        href="/"
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2 transition-colors"
      >
        Zurück zur Startseite
      </Link>
    </div>
  );
}
