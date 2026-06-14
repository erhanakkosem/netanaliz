import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="mb-4 text-8xl font-extrabold text-primary/20">404</div>
        <h1 className="text-3xl font-bold text-foreground">
          Sayfa Bulunamadı
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-muted">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir. Lütfen adresi
          kontrol edin.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
