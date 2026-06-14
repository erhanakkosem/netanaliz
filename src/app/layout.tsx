import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/layout/AuthProvider";
import { ToastProvider } from "@/components/layout/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OranAnaliz - Profesyonel Maç Analiz Platformu",
  description:
    "13 kaynaktan canlı oranları tek ekranda takip edin. Akıllı analiz araçları, yapay zeka destekli tahminler ve profesyonel maç analiz platformu.",
  openGraph: {
    title: "OranAnaliz - Profesyonel Maç Analiz Platformu",
    description:
      "13 kaynaktan canlı oranları tek ekranda takip edin. Akıllı analiz araçları, yapay zeka destekli tahminler.",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
